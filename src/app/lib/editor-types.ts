import { PromptStyle } from './types';

export type ApiProvider = 'openai' | 'grok' | 'ollama' | 'deepseek' | 'cherry' | 'custom';

export interface ApiSettings {
  apiProvider: ApiProvider;
  llmApiUrl: string;
  llmApiKey: string;
  model: string;
}

export interface ContentSettings {
  topic: string;
  keywords: string;
  wordCount: number;
}

export interface EditorState {
  isGenerating: boolean;
  streamingPosition: number | null;
  error: string | null;
}

export interface AICommand {
  title: string;
  description: string;
  icon: React.ReactNode;
  command: () => void | Promise<void>;
}

export interface RewriteOption {
  label: string;
  instruction: string;
}

export const DEFAULT_API_URLS: Record<ApiProvider, string> = {
  openai: 'https://api.openai.com/v1/chat/completions',
  grok: 'https://api.grok.ai/v1/chat/completions',
  ollama: 'http://localhost:11434/api/generate',
  deepseek: 'https://api.deepseek.com/v1/chat/completions',
  cherry: 'http://localhost:23333/v1/chat/completions',
  custom: ''
};

export const DEFAULT_CONTENT_SETTINGS: ContentSettings = {
  topic: '',
  keywords: '',
  wordCount: 800
};

export const REWRITE_OPTIONS: RewriteOption[] = [
  { label: '润色', instruction: '润色文字，使其更加流畅优美，保持原意不变' },
  { label: '简化', instruction: '简化表达，使其更加简洁明了，去除冗余' },
  { label: '扩展', instruction: '扩展内容，增加细节和深度，丰富表达' },
  { label: '正式化', instruction: '使用更加正式和专业的语言风格' },
  { label: '口语化', instruction: '使用更加口语化和亲切的表达方式' }
];

export type { PromptStyle };
