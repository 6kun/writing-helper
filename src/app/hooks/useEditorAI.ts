'use client';

import { useCallback, useRef, useState } from 'react';
import { Editor } from '@tiptap/core';
import {
  streamToEditor,
  createStreamGenerator,
  insertLoadingIndicator,
} from '../components/editor/utils/streamToEditor';
import { ApiSettings, ContentSettings } from '../lib/editor-types';
import { PromptStyle } from '../lib/types';
import { formatPromptTemplate } from '../lib/api';

interface UseEditorAIOptions {
  apiSettings: ApiSettings;
  promptStyle: PromptStyle;
  contentSettings: ContentSettings;
}

export function useEditorAI(options: UseEditorAIOptions) {
  const { apiSettings, promptStyle, contentSettings } = options;
  const [isGenerating, setIsGenerating] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  /**
   * 构建 AI 请求的 prompt
   */
  const buildPrompt = useCallback(
    (instruction: string, context?: string): string => {
      const basePrompt = formatPromptTemplate(
        promptStyle,
        contentSettings.topic || '自由主题',
        contentSettings.keywords ? contentSettings.keywords.split(/[,，、]/).filter(Boolean) : [],
        contentSettings.wordCount
      );

      if (context) {
        return `${basePrompt}\n\n---\n上下文：\n${context}\n\n---\n具体要求：${instruction}`;
      }

      return `${basePrompt}\n\n---\n具体要求：${instruction}`;
    },
    [promptStyle, contentSettings]
  );

  /**
   * 发起流式 API 请求
   */
  const fetchStream = useCallback(
    async (prompt: string, signal: AbortSignal): Promise<Response> => {
      const isOllamaApi =
        apiSettings.llmApiUrl.includes('ollama') ||
        apiSettings.llmApiUrl.includes('11434');
      const isGrokApi =
        apiSettings.llmApiUrl.includes('grok') ||
        apiSettings.llmApiUrl.includes('xai');
      const isDeepSeekApi = apiSettings.llmApiUrl.includes('deepseek');

      let requestBody: Record<string, unknown>;

      if (isOllamaApi) {
        requestBody = {
          model: apiSettings.model || 'llama2',
          prompt,
          stream: true,
        };
      } else if (isGrokApi) {
        requestBody = {
          messages: [{ role: 'user', content: prompt }],
          model: apiSettings.model || 'grok-3-latest',
          temperature: 0.7,
          stream: true,
        };
      } else if (isDeepSeekApi) {
        requestBody = {
          model: apiSettings.model || 'deepseek-chat',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.7,
          stream: true,
        };
      } else {
        requestBody = {
          model: apiSettings.model || 'gpt-4',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.7,
          stream: true,
        };
      }

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (!isOllamaApi && apiSettings.llmApiKey) {
        headers['Authorization'] = `Bearer ${apiSettings.llmApiKey}`;
      }

      const response = await fetch('/api/stream-proxy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetUrl: apiSettings.llmApiUrl,
          headers,
          body: requestBody,
          isOllama: isOllamaApi,
        }),
        signal,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          error: { message: `请求失败: ${response.status}` },
        }));
        throw new Error(errorData.error?.message || `请求失败: ${response.status}`);
      }

      return response;
    },
    [apiSettings]
  );

  /**
   * 在光标位置生成内容
   */
  const generateAtCursor = useCallback(
    async (editor: Editor, instruction: string) => {
      if (isGenerating) return;

      setIsGenerating(true);
      abortControllerRef.current = new AbortController();

      const { from } = editor.state.selection;
      const loading = insertLoadingIndicator(editor, from);

      try {
        const prompt = buildPrompt(instruction);
        const response = await fetchStream(prompt, abortControllerRef.current.signal);

        loading.remove();

        const stream = createStreamGenerator(response);
        await streamToEditor(stream, {
          editor,
          startPosition: from,
          onComplete: () => setIsGenerating(false),
          onError: (error) => {
            console.error('Stream error:', error);
            setIsGenerating(false);
          },
        });
      } catch (error) {
        loading.remove();
        if ((error as Error).name !== 'AbortError') {
          console.error('Generation error:', error);
        }
        setIsGenerating(false);
      }
    },
    [isGenerating, buildPrompt, fetchStream]
  );

  /**
   * 改写选中的文字
   */
  const rewriteSelection = useCallback(
    async (editor: Editor, instruction: string) => {
      const { from, to } = editor.state.selection;
      const selectedText = editor.state.doc.textBetween(from, to);

      if (!selectedText.trim()) return;
      if (isGenerating) return;

      setIsGenerating(true);
      abortControllerRef.current = new AbortController();

      // 先删除选中文字
      editor.chain().deleteSelection().run();

      const prompt = `请根据以下要求改写文字：\n要求：${instruction}\n原文：${selectedText}\n\n只输出改写后的文字，不要添加任何解释。`;

      try {
        const response = await fetchStream(prompt, abortControllerRef.current.signal);
        const stream = createStreamGenerator(response);

        await streamToEditor(stream, {
          editor,
          startPosition: from,
          onComplete: () => setIsGenerating(false),
          onError: (error) => {
            console.error('Rewrite error:', error);
            // 如果失败，恢复原文
            editor.chain().insertContentAt(from, selectedText).run();
            setIsGenerating(false);
          },
        });
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          console.error('Rewrite error:', error);
          // 恢复原文
          editor.chain().insertContentAt(from, selectedText).run();
        }
        setIsGenerating(false);
      }
    },
    [isGenerating, fetchStream]
  );

  /**
   * 续写内容
   */
  const continueWriting = useCallback(
    async (editor: Editor) => {
      if (isGenerating) return;

      const { from } = editor.state.selection;
      const precedingText = editor.state.doc.textBetween(0, from, '\n\n');

      // 取最后 500 字符作为上下文
      const context = precedingText.slice(-500);

      if (!context.trim()) {
        // 如果没有上下文，使用普通生成
        await generateAtCursor(editor, '开始写作');
        return;
      }

      setIsGenerating(true);
      abortControllerRef.current = new AbortController();

      const loading = insertLoadingIndicator(editor, from);

      const prompt = buildPrompt(
        `续写以下内容，保持风格一致，自然衔接，不要重复已有内容`,
        context
      );

      try {
        const response = await fetchStream(prompt, abortControllerRef.current.signal);

        loading.remove();

        const stream = createStreamGenerator(response);
        await streamToEditor(stream, {
          editor,
          startPosition: from,
          onComplete: () => setIsGenerating(false),
          onError: (error) => {
            console.error('Continue error:', error);
            setIsGenerating(false);
          },
        });
      } catch (error) {
        loading.remove();
        if ((error as Error).name !== 'AbortError') {
          console.error('Continue error:', error);
        }
        setIsGenerating(false);
      }
    },
    [isGenerating, buildPrompt, fetchStream, generateAtCursor]
  );

  /**
   * 取消当前生成
   */
  const cancel = useCallback(() => {
    abortControllerRef.current?.abort();
    setIsGenerating(false);
  }, []);

  return {
    isGenerating,
    generateAtCursor,
    rewriteSelection,
    continueWriting,
    cancel,
  };
}
