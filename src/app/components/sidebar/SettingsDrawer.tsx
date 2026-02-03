'use client';

import React, { useState, useEffect } from 'react';
import { X, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import ApiSettings from '../ApiSettings';
import PromptForm from '../PromptForm';
import {
  ApiSettings as ApiSettingsType,
  ContentSettings,
  ApiProvider
} from '../../lib/editor-types';
import { PromptStyle } from '../../lib/types';

interface SettingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  apiSettings: ApiSettingsType;
  onApiSettingsChange: (settings: ApiSettingsType) => void;
  promptStyle: PromptStyle;
  onPromptStyleChange: (style: PromptStyle) => void;
  contentSettings: ContentSettings;
  onContentSettingsChange: (settings: ContentSettings) => void;
  availableModels?: string[];
  fetchModels?: () => Promise<string[] | void>;
}

type Section = 'api' | 'content' | 'style' | null;

export default function SettingsDrawer({
  isOpen,
  onClose,
  apiSettings,
  onApiSettingsChange,
  promptStyle,
  onPromptStyleChange,
  contentSettings,
  onContentSettingsChange,
  availableModels = [],
  fetchModels,
}: SettingsDrawerProps) {
  const [activeSection, setActiveSection] = useState<Section>('api');
  const [isCollapsed, setIsCollapsed] = useState(false);

  // 从 localStorage 读取折叠状态
  useEffect(() => {
    const saved = localStorage.getItem('settings-drawer-collapsed');
    if (saved) {
      setIsCollapsed(saved === 'true');
    }
  }, []);

  // 保存折叠状态到 localStorage
  const toggleCollapse = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem('settings-drawer-collapsed', String(newState));
  };

  const toggleSection = (section: Section) => {
    setActiveSection(activeSection === section ? null : section);
  };

  return (
    <>
      {/* 遮罩层 - 仅在打开且未折叠时显示 */}
      {isOpen && !isCollapsed && (
        <div
          className="fixed inset-0 bg-black/5 z-40 transition-opacity duration-200"
          onClick={onClose}
        />
      )}

      {/* 抽屉面板 - Typora 风格 */}
      <div
        className={`
          fixed top-0 left-0 h-full bg-white z-50
          border-r border-gray-200
          transform transition-all duration-250 ease-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          ${isCollapsed ? 'w-12' : 'w-80'}
        `}
      >
        {/* 折叠状态 - 仅显示按钮 */}
        {isCollapsed && (
          <div className="flex flex-col items-center py-4 h-full">
            <button
              onClick={toggleCollapse}
              className="p-2 hover:bg-gray-50 rounded transition-colors mb-2"
              aria-label="展开侧边栏"
              title="展开侧边栏"
            >
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-50 rounded transition-colors"
              aria-label="关闭"
              title="关闭"
            >
              <X className="h-4 w-4 text-gray-400" />
            </button>
          </div>
        )}

        {/* 展开状态 - 完整内容 */}
        {!isCollapsed && (
          <>
            {/* 头部 - 极简 */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h2 className="text-sm font-medium text-gray-800">设置</h2>
              <div className="flex items-center gap-1">
                <button
                  onClick={toggleCollapse}
                  className="p-1 hover:bg-gray-50 rounded transition-colors"
                  aria-label="收起侧边栏"
                  title="收起侧边栏"
                >
                  <ChevronLeft className="h-4 w-4 text-gray-400" />
                </button>
                <button
                  onClick={onClose}
                  className="p-1 hover:bg-gray-50 rounded transition-colors"
                  aria-label="关闭"
                  title="关闭"
                >
                  <X className="h-4 w-4 text-gray-400" />
                </button>
              </div>
            </div>

            {/* 内容 - 清晰的层次 */}
            <div className="overflow-y-auto h-[calc(100%-53px)] py-2">
              {/* API 设置 */}
              <section className="mb-1">
                <button
                  className="flex items-center justify-between w-full px-5 py-2.5 hover:bg-gray-50 transition-colors text-left group"
                  onClick={() => toggleSection('api')}
                >
                  <span className="text-sm text-gray-700">API 设置</span>
                  <ChevronDown
                    className={`h-3.5 w-3.5 text-gray-400 transition-transform duration-200 ${
                      activeSection === 'api' ? 'rotate-0' : '-rotate-90'
                    }`}
                  />
                </button>
                {activeSection === 'api' && (
                  <div className="px-5 py-3 bg-gray-50/50">
                    <ApiSettings
                      showSettings={true}
                      toggleSettings={() => {}}
                      apiProvider={apiSettings.apiProvider}
                      setApiProvider={(provider: ApiProvider) =>
                        onApiSettingsChange({ ...apiSettings, apiProvider: provider })
                      }
                      apiUrl={apiSettings.llmApiUrl}
                      setApiUrl={(url: string) =>
                        onApiSettingsChange({ ...apiSettings, llmApiUrl: url })
                      }
                      apiKey={apiSettings.llmApiKey}
                      setApiKey={(key: string) =>
                        onApiSettingsChange({ ...apiSettings, llmApiKey: key })
                      }
                      model={apiSettings.model}
                      setModel={(model: string) =>
                        onApiSettingsChange({ ...apiSettings, model: model })
                      }
                      availableModels={availableModels}
                      fetchModels={fetchModels}
                    />
                  </div>
                )}
              </section>

              {/* 内容设置 */}
              <section className="mb-1">
                <button
                  className="flex items-center justify-between w-full px-5 py-2.5 hover:bg-gray-50 transition-colors text-left group"
                  onClick={() => toggleSection('content')}
                >
                  <span className="text-sm text-gray-700">内容设置</span>
                  <ChevronDown
                    className={`h-3.5 w-3.5 text-gray-400 transition-transform duration-200 ${
                      activeSection === 'content' ? 'rotate-0' : '-rotate-90'
                    }`}
                  />
                </button>
                {activeSection === 'content' && (
                  <div className="px-5 py-4 space-y-4 bg-gray-50/50">
                    <div>
                      <label className="block text-xs text-gray-500 mb-2">
                        主题
                      </label>
                      <input
                        type="text"
                        value={contentSettings.topic}
                        onChange={(e) =>
                          onContentSettingsChange({
                            ...contentSettings,
                            topic: e.target.value,
                          })
                        }
                        placeholder="例如：儿时赶海"
                        className="w-full px-3 py-2 text-sm text-gray-700 border border-gray-200 rounded focus:outline-none focus:border-gray-400 transition-colors bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-2">
                        关键词
                      </label>
                      <input
                        type="text"
                        value={contentSettings.keywords}
                        onChange={(e) =>
                          onContentSettingsChange({
                            ...contentSettings,
                            keywords: e.target.value,
                          })
                        }
                        placeholder="用逗号分隔"
                        className="w-full px-3 py-2 text-sm text-gray-700 border border-gray-200 rounded focus:outline-none focus:border-gray-400 transition-colors bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-2">
                        目标字数
                      </label>
                      <input
                        type="number"
                        value={contentSettings.wordCount}
                        onChange={(e) =>
                          onContentSettingsChange({
                            ...contentSettings,
                            wordCount: parseInt(e.target.value) || 800,
                          })
                        }
                        min={100}
                        max={10000}
                        step={100}
                        className="w-full px-3 py-2 text-sm text-gray-700 border border-gray-200 rounded focus:outline-none focus:border-gray-400 transition-colors bg-white"
                      />
                    </div>
                  </div>
                )}
              </section>

              {/* 风格设置 */}
              <section>
                <button
                  className="flex items-center justify-between w-full px-5 py-2.5 hover:bg-gray-50 transition-colors text-left group"
                  onClick={() => toggleSection('style')}
                >
                  <span className="text-sm text-gray-700">风格设置</span>
                  <ChevronDown
                    className={`h-3.5 w-3.5 text-gray-400 transition-transform duration-200 ${
                      activeSection === 'style' ? 'rotate-0' : '-rotate-90'
                    }`}
                  />
                </button>
                {activeSection === 'style' && (
                  <div className="px-5 py-3 bg-gray-50/50">
                    <PromptForm
                      initialStyle={promptStyle}
                      onStyleChange={onPromptStyleChange}
                    />
                  </div>
                )}
              </section>
            </div>
          </>
        )}
      </div>
    </>
  );
}
