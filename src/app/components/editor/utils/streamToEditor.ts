import { Editor } from '@tiptap/core';

export interface StreamToEditorOptions {
  editor: Editor;
  startPosition: number;
  onChunk?: (chunk: string, totalContent: string) => void;
  onComplete?: (finalContent: string) => void;
  onError?: (error: Error) => void;
}

/**
 * 将流式内容写入编辑器指定位置
 * 策略：维护累积 buffer，每次收到新 chunk 时更新整个已插入范围
 */
export async function streamToEditor(
  stream: AsyncIterable<string>,
  options: StreamToEditorOptions
): Promise<void> {
  const { editor, startPosition, onChunk, onComplete, onError } = options;

  let buffer = '';
  let currentEndPosition = startPosition;

  try {
    for await (const chunk of stream) {
      buffer += chunk;

      // 计算需要替换的范围
      const from = startPosition;
      const to = currentEndPosition;

      // 删除旧内容，插入新累积内容
      editor
        .chain()
        .focus()
        .deleteRange({ from, to })
        .insertContentAt(from, buffer, {
          parseOptions: { preserveWhitespace: 'full' },
          updateSelection: false,
        })
        .run();

      // 更新结束位置
      currentEndPosition = from + buffer.length;

      onChunk?.(chunk, buffer);
    }

    onComplete?.(buffer);
  } catch (error) {
    onError?.(error as Error);
  }
}

/**
 * 从 SSE 响应创建异步生成器
 */
export async function* createStreamGenerator(
  response: Response
): AsyncGenerator<string> {
  const reader = response.body?.getReader();
  if (!reader) return;

  const decoder = new TextDecoder();
  let buffer = '';

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmedLine = line.trim();
        if (!trimmedLine || !trimmedLine.startsWith('data: ')) continue;

        const dataStr = trimmedLine.slice(6);
        if (dataStr === '[DONE]') return;

        try {
          const data = JSON.parse(dataStr);

          if (data.error) {
            throw new Error(data.error.message || 'Stream error');
          }

          const content = data.choices?.[0]?.delta?.content;
          if (content) yield content;

          if (data.choices?.[0]?.finish_reason === 'stop') return;
        } catch (parseError) {
          // 忽略解析错误，继续处理
          console.warn('Parse error:', parseError);
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
}

/**
 * 在编辑器中插入加载指示器
 */
export function insertLoadingIndicator(
  editor: Editor,
  position: number
): { remove: () => void; position: number } {
  const loadingText = '...';

  editor
    .chain()
    .focus()
    .insertContentAt(position, loadingText)
    .run();

  return {
    position,
    remove: () => {
      editor
        .chain()
        .deleteRange({ from: position, to: position + loadingText.length })
        .run();
    },
  };
}
