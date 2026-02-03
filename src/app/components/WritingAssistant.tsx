"use client";

import React, { useState, useRef, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { Settings, Download, Loader2 } from 'lucide-react';
import { PromptStyle } from '../lib/types';
import { exportToMarkdown } from '../lib/api';
import {
  ApiSettings,
  ContentSettings,
  DEFAULT_API_URLS,
  DEFAULT_CONTENT_SETTINGS,
  ApiProvider
} from '../lib/editor-types';
import SettingsDrawer from './sidebar/SettingsDrawer';
import type { NovelEditorRef } from './editor/NovelEditor';

// 动态导入 NovelEditor 以避免 SSR 问题
const NovelEditor = dynamic(() => import('./editor/NovelEditor'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-[500px] text-gray-500">
      <Loader2 className="h-8 w-8 animate-spin mr-2" />
      加载编辑器中...
    </div>
  ),
});

// Default prompt style template
const defaultPromptStyle: PromptStyle = {
  "style_summary": "质朴平实的散文笔触，以赶海为线索串联起乡愁记忆与人文关怀",
  "language": {
    "sentence_pattern": ["散文化的笔触，文字自然不造作", "营造场景叙事引人入胜"],
    "word_choice": {
      "formality_level": 3,
      "preferred_words": ["家乡", "小时候"],
      "avoided_words": ["华丽辞藻", "生僻字"]
    },
    "rhetoric": ["回忆式叙述", "细节描写", "对比手法"]
  },
  "structure": {
    "paragraph_length": "中等偏长，200-300字",
    "transition_style": "以赶海的记忆和时光流逝进行过渡，今夕对比",
    "hierarchy_pattern": "以时空为经,以物为纬"
  },
  "narrative": {
    "perspective": "第一人称回忆视角",
    "time_sequence": "现在与过去交错",
    "narrator_attitude": "怀旧而理性"
  },
  "emotion": {
    "intensity": 3,
    "expression_style": "含蓄内敛",
    "tone": "温情怀旧"
  },
  "thinking": {
    "logic_pattern": "由物及事及情",
    "depth": 4,
    "rhythm": "舒缓平和"
  },
  "uniqueness": {
    "signature_phrases": ["我们那里", "小时候"],
    "imagery_system": ["赶海", "渔村", "童年"]
  },
  "cultural": {
    "allusions": ["典故适度", "穿插回忆"],
    "knowledge_domains": ["饮食文化", "赶海经历", "乡愁文学"]
  },
  "rhythm": {
    "syllable_pattern": "自然流畅",
    "pause_pattern": "长短句结合",
    "tempo": "从容不迫"
  }
};

export default function WritingAssistant() {
  // 侧边栏状态
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // API 设置
  const [apiSettings, setApiSettings] = useState<ApiSettings>({
    apiProvider: 'openai',
    llmApiUrl: DEFAULT_API_URLS.openai,
    llmApiKey: '',
    model: 'gpt-4',
  });

  // 内容设置
  const [contentSettings, setContentSettings] = useState<ContentSettings>({
    ...DEFAULT_CONTENT_SETTINGS,
    topic: '儿时赶海',
    keywords: '浙江海边、小时候、渔村、温暖、质朴',
  });

  // 风格设置
  const [promptStyle, setPromptStyle] = useState<PromptStyle>(defaultPromptStyle);

  // 生成状态
  const [isGenerating, setIsGenerating] = useState(false);

  // 可用模型
  const [availableModels, setAvailableModels] = useState<string[]>([]);

  // 编辑器引用
  const editorRef = useRef<NovelEditorRef>(null);

  // 处理 API 设置变更
  const handleApiSettingsChange = useCallback((newSettings: ApiSettings) => {
    const prevProvider = apiSettings.apiProvider;
    const newProvider = newSettings.apiProvider;

    // 如果提供商改变，更新默认 URL 和模型
    if (prevProvider !== newProvider) {
      const defaultUrls: Record<ApiProvider, string> = {
        openai: 'https://api.openai.com/v1/chat/completions',
        grok: 'https://api.x.ai/v1/chat/completions',
        ollama: 'http://localhost:11434/api/generate',
        deepseek: 'https://api.deepseek.com/v1/chat/completions',
        cherry: 'http://localhost:23333/v1/chat/completions',
        custom: '',
      };

      const defaultModels: Record<ApiProvider, string> = {
        openai: 'gpt-4',
        grok: 'grok-3-latest',
        ollama: 'llama2',
        deepseek: 'deepseek-chat',
        cherry: 'openai:gpt-4o-mini',
        custom: '',
      };

      newSettings = {
        ...newSettings,
        llmApiUrl: defaultUrls[newProvider],
        model: defaultModels[newProvider],
        // Ollama 不需要 API Key
        llmApiKey: newProvider === 'ollama' ? '' : newSettings.llmApiKey,
      };

      // 清空模型列表
      setAvailableModels([]);
    }

    setApiSettings(newSettings);
  }, [apiSettings.apiProvider]);

  // 获取可用模型
  const fetchAvailableModels = useCallback(async () => {
    if (apiSettings.apiProvider === 'ollama') {
      return fetchOllamaModels();
    }
    if (apiSettings.apiProvider === 'cherry') {
      return fetchCherryModels();
    }
    return [];
  }, [apiSettings.apiProvider, apiSettings.llmApiKey]);

  // 获取 Ollama 模型
  const fetchOllamaModels = async () => {
    try {
      const response = await fetch('/api/proxy/ollama-models', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ollamaUrl: 'http://localhost:11434/api/tags' }),
        signal: AbortSignal.timeout(5000),
      });

      if (!response.ok) throw new Error('获取模型列表失败');

      const data = await response.json();
      let modelsList: string[] = [];

      if (data.models && Array.isArray(data.models)) {
        modelsList = data.models.filter((m: unknown) => typeof m === 'string');
      } else if (data.names && Array.isArray(data.names)) {
        modelsList = data.names.filter((m: unknown) => typeof m === 'string');
      }

      if (modelsList.length > 0) {
        setAvailableModels(modelsList);
        if (!modelsList.includes(apiSettings.model)) {
          setApiSettings((prev) => ({ ...prev, model: modelsList[0] }));
        }
      }

      return modelsList;
    } catch (error) {
      console.error('获取 Ollama 模型失败:', error);
      return [];
    }
  };

  // 获取 Cherry 模型
  const fetchCherryModels = async () => {
    if (!apiSettings.llmApiKey) return [];

    try {
      const response = await fetch('/api/proxy/cherry-models', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serverUrl: 'http://localhost:23333/v1/models',
          apiKey: apiSettings.llmApiKey,
        }),
        signal: AbortSignal.timeout(5000),
      });

      if (!response.ok) throw new Error('获取模型列表失败');

      const data = await response.json();
      let modelsList: string[] = [];

      if (data.models && Array.isArray(data.models)) {
        modelsList = data.models.filter((m: unknown) => typeof m === 'string');
      } else if (data.data && Array.isArray(data.data)) {
        modelsList = data.data
          .map((item: { id?: string }) => item.id)
          .filter(Boolean);
      }

      if (modelsList.length > 0) {
        setAvailableModels(modelsList);
        if (!modelsList.includes(apiSettings.model)) {
          setApiSettings((prev) => ({ ...prev, model: modelsList[0] }));
        }
      }

      return modelsList;
    } catch (error) {
      console.error('获取 Cherry 模型失败:', error);
      return [];
    }
  };

  // 导出 Markdown
  const handleExport = useCallback(() => {
    const text = editorRef.current?.getText();
    if (text) {
      exportToMarkdown(text);
    }
  }, []);

  return (
    <div className="min-h-screen bg-bg-gray">
      {/* 设置侧边抽屉 */}
      <SettingsDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        apiSettings={apiSettings}
        onApiSettingsChange={handleApiSettingsChange}
        promptStyle={promptStyle}
        onPromptStyleChange={setPromptStyle}
        contentSettings={contentSettings}
        onContentSettingsChange={setContentSettings}
        availableModels={availableModels}
        fetchModels={fetchAvailableModels}
      />

      {/* 主内容区 */}
      <div className="flex flex-col h-screen">
        {/* 顶部工具栏 - 极简风格 */}
        <header className="bg-pure-white border-b border-border-gray px-6 py-3 fade-in">
          <div className="flex items-center justify-between max-w-5xl mx-auto">
            {/* 左侧：操作按钮 */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsDrawerOpen(true)}
                className="secondary-button flex items-center gap-2"
              >
                <Settings className="h-4 w-4" />
                <span>设置</span>
              </button>

              {/* 状态指示器 */}
              {isGenerating && (
                <div className="flex items-center gap-2 text-text-secondary text-sm">
                  <Loader2 className="h-4 w-4 animate-spin text-accent" />
                  <span>生成中...</span>
                </div>
              )}
            </div>

            {/* 右侧：功能按钮 */}
            <div className="flex items-center gap-2">
              {/* 导出按钮 */}
              <button
                onClick={handleExport}
                className="secondary-button flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                <span>导出</span>
              </button>

              {/* API 状态指示 */}
              <div className="flex items-center gap-2 px-3 py-1.5 bg-light-gray rounded-md">
                <div
                  className={`h-1.5 w-1.5 rounded-full ${
                    apiSettings.apiProvider === 'ollama' || apiSettings.llmApiKey
                      ? 'bg-accent'
                      : 'bg-text-muted'
                  }`}
                />
                <span className="text-xs text-text-secondary font-medium">
                  {apiSettings.apiProvider.toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* 编辑器主体 - 极简风格 */}
        <main className="flex-1 overflow-hidden px-6 py-6">
          <div className="h-full max-w-4xl mx-auto minimal-card overflow-hidden">
            <NovelEditor
              ref={editorRef}
              apiSettings={apiSettings}
              promptStyle={promptStyle}
              contentSettings={contentSettings}
              onGeneratingChange={setIsGenerating}
            />
          </div>
        </main>

        {/* 底部提示 - 简洁风格 */}
        <footer className="bg-pure-white border-t border-border-gray px-6 py-2.5">
          <div className="max-w-4xl mx-auto flex items-center justify-between text-xs text-text-secondary">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                输入{' '}
                <kbd className="px-1.5 py-0.5 bg-light-gray rounded text-text-primary font-mono">
                  /
                </kbd>{' '}
                唤出命令菜单
              </span>
              <span className="hidden md:inline">选中文字可使用 AI 改写</span>
            </div>
            <div className="flex items-center gap-3 text-text-muted">
              <span>主题: {contentSettings.topic || '未设置'}</span>
              <span>·</span>
              <span>字数: {contentSettings.wordCount}</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
