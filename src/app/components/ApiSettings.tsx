"use client";

import React, { useState, useEffect } from 'react';
import { SecureApiKeyManager } from '../lib/secureApiKey';

export type ApiProvider = 'openai' | 'grok' | 'ollama' | 'deepseek' | 'cherry' | 'custom';

// API 提供商帮助信息
const API_HELP: Record<ApiProvider, string> = {
  openai: '使用 OpenAI API，例如 GPT-4',
  grok: '使用 Grok API (X.AI)',
  ollama: '使用本地运行的 Ollama 服务',
  deepseek: '使用 DeepSeek API，例如 DeepSeek-V2',
  cherry: '使用 Cherry Studio Server（OpenAI 兼容）',
  custom: '配置自定义 API 端点'
};

// 默认 API URLs
const API_URLS: Record<ApiProvider, string> = {
  openai: 'https://api.openai.com/v1/chat/completions',
  grok: 'https://api.x.ai/v1/chat/completions',
  ollama: 'http://localhost:11434/api/generate',
  deepseek: 'https://api.deepseek.com/v1/chat/completions',
  cherry: 'http://localhost:23333/v1/chat/completions',
  custom: ''
};

export interface ApiSettingsProps {
  showSettings: boolean;
  toggleSettings: () => void;
  apiProvider: ApiProvider;
  setApiProvider: (provider: ApiProvider) => void;
  apiUrl: string;
  setApiUrl: (url: string) => void;
  apiKey: string;
  setApiKey: (key: string) => void;
  model: string;
  setModel: (model: string) => void;
  availableModels?: string[];
  fetchModels?: () => Promise<string[] | void>;
}

export default function ApiSettings({
  showSettings,
  toggleSettings,
  apiProvider,
  setApiProvider,
  apiUrl,
  setApiUrl,
  apiKey,
  setApiKey,
  model,
  setModel,
  availableModels = [],
  fetchModels
}: ApiSettingsProps) {
  const [rememberMe, setRememberMe] = useState(false);
  const [showSecurityTip, setShowSecurityTip] = useState(false);

  // 组件加载时尝试恢复保存的 API Key
  useEffect(() => {
    const savedKey = SecureApiKeyManager.retrieve(apiProvider);
    if (savedKey && !apiKey) {
      setApiKey(savedKey);
      setRememberMe(true);
    }
  }, [apiProvider, apiKey, setApiKey]);

  // API Key 变化时自动保存
  useEffect(() => {
    if (apiKey && apiProvider !== 'ollama' && rememberMe) {
      SecureApiKeyManager.store(apiProvider, apiKey, rememberMe);
    }
  }, [apiKey, apiProvider, rememberMe]);

  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newKey = e.target.value;
    setApiKey(newKey);

    if (newKey && rememberMe && apiProvider !== 'ollama') {
      SecureApiKeyManager.store(apiProvider, newKey, rememberMe);
    }
  };

  const handleRememberMeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const remember = e.target.checked;
    setRememberMe(remember);

    if (apiKey && apiProvider !== 'ollama') {
      if (remember) {
        SecureApiKeyManager.store(apiProvider, apiKey, true);
      } else {
        SecureApiKeyManager.clear(apiProvider);
      }
    }
  };

  const clearStoredKey = () => {
    SecureApiKeyManager.clear(apiProvider);
    setApiKey('');
    setRememberMe(false);
  };

  const handleApiProviderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const provider = e.target.value as ApiProvider;
    setApiProvider(provider);
  };

  return (
    <div className="space-y-4">
      {showSettings && (
        <div className="space-y-4">
          {/* API 提供商 */}
          <div>
            <label htmlFor="apiProvider" className="block text-xs text-gray-500 mb-2">
              API 提供商
            </label>
            <select
              id="apiProvider"
              value={apiProvider}
              onChange={handleApiProviderChange}
              className="w-full px-3 py-2 text-sm text-gray-700 border border-gray-200 rounded focus:outline-none focus:border-gray-400 transition-colors bg-white"
            >
              <option value="openai">OpenAI</option>
              <option value="grok">Grok (xAI)</option>
              <option value="ollama">Ollama (本地)</option>
              <option value="deepseek">DeepSeek</option>
              <option value="cherry">Cherry Studio</option>
              <option value="custom">自定义</option>
            </select>
            <p className="mt-1.5 text-xs text-gray-400">
              {API_HELP[apiProvider]}
            </p>
          </div>

          {/* API 地址 */}
          <div>
            <label htmlFor="apiUrl" className="block text-xs text-gray-500 mb-2">
              API 地址
            </label>
            <input
              type="url"
              id="apiUrl"
              value={apiUrl}
              onChange={(e) => setApiUrl(e.target.value)}
              className="w-full px-3 py-2 text-sm text-gray-700 border border-gray-200 rounded focus:outline-none focus:border-gray-400 transition-colors bg-white"
              placeholder="API 端点 URL"
              autoComplete="url"
            />
          </div>

          {/* API 密钥 */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="apiKey" className="block text-xs text-gray-500">
                API 密钥
              </label>
              {apiProvider !== 'ollama' && (
                <button
                  type="button"
                  onClick={() => setShowSecurityTip(!showSecurityTip)}
                  className="text-xs text-gray-400 hover:text-gray-600"
                >
                  安全提示
                </button>
              )}
            </div>

            {showSecurityTip && (
              <div className="mb-3 p-3 bg-gray-50 border border-gray-200 rounded text-xs text-gray-600">
                <div className="font-medium mb-1.5">安全提醒</div>
                <ul className="space-y-1 text-gray-500">
                  <li>• 仅在本地浏览器中临时存储</li>
                  <li>• 使用简单加密保护</li>
                  <li>• 会话结束后自动清除</li>
                  <li>• 请勿在公共设备上选择"记住我"</li>
                </ul>
              </div>
            )}

            {apiProvider === 'ollama' ? (
              <div className="px-3 py-2 border border-gray-200 bg-gray-50 rounded text-gray-500 text-sm">
                本地服务无需密钥
              </div>
            ) : (
              <div className="space-y-2">
                <div className="relative">
                  <input
                    type="password"
                    id="apiKey"
                    value={apiKey}
                    onChange={handleApiKeyChange}
                    className="w-full px-3 py-2 pr-10 text-sm text-gray-700 border border-gray-200 rounded focus:outline-none focus:border-gray-400 transition-colors bg-white"
                    placeholder="输入 API 密钥"
                    autoComplete="off"
                  />
                  {apiKey && (
                    <button
                      type="button"
                      onClick={clearStoredKey}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-300 hover:text-gray-500"
                      aria-label="清除"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center text-xs text-gray-500">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={handleRememberMeChange}
                      className="mr-2 h-3 w-3 text-gray-600 border-gray-300 rounded"
                    />
                    记住我 (7天)
                  </label>

                  {SecureApiKeyManager.hasValidKey(apiProvider) && (
                    <span className="text-xs text-gray-400">已保存</span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* 模型名称 */}
          <div>
            <label htmlFor="model" className="block text-xs text-gray-500 mb-2">
              模型名称
            </label>
            {(apiProvider === 'ollama' || apiProvider === 'cherry') && availableModels && availableModels.length > 0 ? (
              <div className="space-y-2">
                <select
                  id="model"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full px-3 py-2 text-sm text-gray-700 border border-gray-200 rounded focus:outline-none focus:border-gray-400 transition-colors bg-white"
                >
                  {availableModels.map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
                <div className="text-xs text-gray-400">
                  已找到 {availableModels.length} 个模型
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <input
                  type="text"
                  id="model"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full px-3 py-2 text-sm text-gray-700 border border-gray-200 rounded focus:outline-none focus:border-gray-400 transition-colors bg-white"
                  placeholder={(apiProvider === 'ollama' || apiProvider === 'cherry') ? '手动输入模型名称' : '例如：gpt-4'}
                />
                {apiProvider === 'cherry' && (
                  <div className="text-xs text-gray-400">
                    格式：provider:model (例如 openai:gpt-4o-mini)
                  </div>
                )}
              </div>
            )}
            {(apiProvider === 'ollama' || apiProvider === 'cherry') && fetchModels && (
              <button
                type="button"
                onClick={() => fetchModels()}
                className="mt-2 px-3 py-1.5 text-xs text-gray-600 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded transition-colors"
              >
                刷新模型列表
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
