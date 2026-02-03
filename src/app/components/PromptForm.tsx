"use client";

import React, { useState } from 'react';
import { PromptStyle } from '../lib/types';

interface PromptFormProps {
  initialStyle: PromptStyle;
  onStyleChange: (style: PromptStyle) => void;
}

export default function PromptForm({ initialStyle, onStyleChange }: PromptFormProps) {
  const [style, setStyle] = useState<PromptStyle>(initialStyle);
  const [expandedSection, setExpandedSection] = useState<string | null>('basic');

  const handleChange = (section: keyof PromptStyle | '', field: string, value: string | number) => {
    const updatedStyle = { ...style };
    
    // Handle nested fields
    if (field.includes('.')) {
      const [parentField, childField] = field.split('.') as [keyof PromptStyle, string];
      if (section === '') {
        // Handle root level fields
        (updatedStyle[parentField] as Record<string, unknown>)[childField] = value;
      } else {
        // Handle nested fields
        const sectionObj = updatedStyle[section] as unknown as Record<string, Record<string, unknown>>;
        sectionObj[parentField][childField] = value;
      }
    } else if (section === '') {
      // Handle root level fields
      (updatedStyle as Record<string, unknown>)[field] = value;
    } else {
      // Handle section level fields
      (updatedStyle[section] as Record<string, unknown>)[field] = value;
    }
    
    setStyle(updatedStyle);
    onStyleChange(updatedStyle);
  };

  // 处理键盘按下事件，阻止Enter键导致的表单提交
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // 阻止Enter键引发的表单提交
    }
  };

  const handleArrayChange = (section: keyof PromptStyle, field: string, index: number, value: string) => {
    const updatedStyle = { ...style };
    let targetArray: string[];
    
    // Handle nested fields
    if (field.includes('.')) {
      const [parentField, childField] = field.split('.') as [keyof PromptStyle, string];
      const sectionObj = updatedStyle[section] as unknown as Record<string, Record<string, string[]>>;
      targetArray = [...sectionObj[parentField][childField]];
      targetArray[index] = value;
      sectionObj[parentField][childField] = targetArray;
    } else {
      const sectionObj = updatedStyle[section] as unknown as Record<string, string[]>;
      targetArray = [...sectionObj[field]];
      targetArray[index] = value;
      sectionObj[field] = targetArray;
    }
    
    setStyle(updatedStyle);
    onStyleChange(updatedStyle);
  };

  const addArrayItem = (section: keyof PromptStyle, field: string) => {
    const updatedStyle = { ...style };
    
    // Handle nested fields
    if (field.includes('.')) {
      const [parentField, childField] = field.split('.') as [keyof PromptStyle, string];
      const sectionObj = updatedStyle[section] as unknown as Record<string, Record<string, string[]>>;
      const targetArray = [...sectionObj[parentField][childField]];
      targetArray.push('');
      sectionObj[parentField][childField] = targetArray;
    } else {
      const sectionObj = updatedStyle[section] as unknown as Record<string, string[]>;
      const targetArray = [...sectionObj[field]];
      targetArray.push('');
      sectionObj[field] = targetArray;
    }
    
    setStyle(updatedStyle);
    onStyleChange(updatedStyle);
  };

  const removeArrayItem = (section: keyof PromptStyle, field: string, index: number) => {
    const updatedStyle = { ...style };
    
    // Handle nested fields
    if (field.includes('.')) {
      const [parentField, childField] = field.split('.') as [keyof PromptStyle, string];
      const sectionObj = updatedStyle[section] as unknown as Record<string, Record<string, string[]>>;
      const targetArray = [...sectionObj[parentField][childField]];
      targetArray.splice(index, 1);
      sectionObj[parentField][childField] = targetArray;
    } else {
      const sectionObj = updatedStyle[section] as unknown as Record<string, string[]>;
      const targetArray = [...sectionObj[field]];
      targetArray.splice(index, 1);
      sectionObj[field] = targetArray;
    }
    
    setStyle(updatedStyle);
    onStyleChange(updatedStyle);
  };

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="space-y-3">
      {/* Basic Information */}
      <div className="border border-gray-200 rounded overflow-hidden">
        <button
          type="button"
          className="w-full flex justify-between items-center px-4 py-2.5 hover:bg-gray-50 focus:outline-none transition-colors text-left"
          onClick={(e) => {
            e.preventDefault();
            toggleSection('basic');
          }}
          aria-expanded={expandedSection === 'basic'}
          aria-controls="basic-section"
        >
          <h3 className="text-sm text-gray-700 font-medium">基本信息</h3>
          <span className="text-xs text-gray-400" aria-hidden="true">{expandedSection === 'basic' ? '▼' : '▶'}</span>
        </button>
        
        {expandedSection === 'basic' && (
          <div className="px-4 py-3 bg-gray-50/50 border-t border-gray-200">
            <div>
              <label className="block text-xs text-gray-500 mb-2">
                风格概述
              </label>
              <textarea
                className="w-full px-3 py-2 text-sm text-gray-700 border border-gray-200 rounded focus:outline-none focus:border-gray-400 transition-colors bg-white"
                value={style.style_summary}
                onChange={(e) => handleChange('', 'style_summary', e.target.value)}
                onKeyDown={handleKeyDown}
                rows={2}
              />
            </div>
          </div>
        )}
      </div>
      
      {/* Language Section */}
      <div className="border border-gray-200 rounded overflow-hidden">
        <button
          type="button"
          className="w-full flex justify-between items-center px-4 py-2.5 hover:bg-gray-50 focus:outline-none transition-colors text-left"
          onClick={(e) => {
            e.preventDefault();
            toggleSection('language');
          }}
          aria-expanded={expandedSection === 'language'}
          aria-controls="language-section"
        >
          <h3 className="text-sm text-gray-700 font-medium">语言风格</h3>
          <span className="text-xs text-gray-400" aria-hidden="true">{expandedSection === 'language' ? '▼' : '▶'}</span>
        </button>
        
        {expandedSection === 'language' && (
          <div className="px-4 py-3 bg-gray-50/50 border-t border-gray-200 space-y-4">
            {/* Sentence Pattern */}
            <div>
              <label className="block text-xs text-gray-500 mb-2">
                句型模式
              </label>
              <div className="space-y-2">
                {style.language.sentence_pattern.map((pattern, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="text"
                      className="flex-1 px-3 py-2 text-sm text-gray-700 border border-gray-200 rounded focus:outline-none focus:border-gray-400 transition-colors bg-white"
                      value={pattern}
                      onChange={(e) => handleArrayChange('language', 'sentence_pattern', index, e.target.value)}
                      onKeyDown={handleKeyDown}
                    />
                    <button
                      type="button"
                      className="p-1 text-gray-400 hover:text-gray-600"
                      onClick={() => removeArrayItem('language', 'sentence_pattern', index)}
                      aria-label={`删除句型模式: ${pattern || '空'}`}
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className="text-accent hover:text-accent-dark text-sm"
                  onClick={() => addArrayItem('language', 'sentence_pattern')}
                >
                  + 添加句型模式
                </button>
              </div>
            </div>

            {/* Word Choice */}
            <div>
              <label className="block text-xs text-gray-500 mb-2">
                用词选择
              </label>
              
              <div className="ml-4 space-y-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-2">
                    正式程度 (1-5)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    className="w-full px-3 py-2 text-sm text-gray-700 border border-gray-200 rounded focus:outline-none focus:border-gray-400 transition-colors bg-white"
                    value={style.language.word_choice.formality_level}
                    onChange={(e) => handleChange('language', 'word_choice.formality_level', Number(e.target.value))}
                    onKeyDown={handleKeyDown}
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-500 mb-2">
                    偏好词汇
                  </label>
                  <div className="space-y-2">
                    {style.language.word_choice.preferred_words.map((word, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <input
                          type="text"
                          className="flex-1 px-3 py-2 text-sm text-gray-700 border border-gray-200 rounded focus:outline-none focus:border-gray-400 transition-colors bg-white"
                          value={word}
                          onChange={(e) => handleArrayChange('language', 'word_choice.preferred_words', index, e.target.value)}
                          onKeyDown={handleKeyDown}
                        />
                        <button
                          type="button"
                          className="p-1 text-gray-400 hover:text-gray-600"
                          onClick={() => removeArrayItem('language', 'word_choice.preferred_words', index)}
                          aria-label={`删除偏好词汇: ${word || '空'}`}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      className="text-accent hover:text-accent-dark text-sm"
                      onClick={() => addArrayItem('language', 'word_choice.preferred_words')}
                    >
                      + 添加偏好词汇
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-gray-500 mb-2">
                    避免使用的词汇
                  </label>
                  <div className="space-y-2">
                    {style.language.word_choice.avoided_words.map((word, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <input
                          type="text"
                          className="flex-1 px-3 py-2 text-sm text-gray-700 border border-gray-200 rounded focus:outline-none focus:border-gray-400 transition-colors bg-white"
                          value={word}
                          onChange={(e) => handleArrayChange('language', 'word_choice.avoided_words', index, e.target.value)}
                          onKeyDown={handleKeyDown}
                        />
                        <button
                          type="button"
                          className="p-1 text-gray-400 hover:text-gray-600"
                          onClick={() => removeArrayItem('language', 'word_choice.avoided_words', index)}
                          aria-label={`删除避免词汇: ${word || '空'}`}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      className="text-accent hover:text-accent-dark text-sm"
                      onClick={() => addArrayItem('language', 'word_choice.avoided_words')}
                    >
                      + 添加避免词汇
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Rhetoric */}
            <div>
              <label className="block text-xs text-gray-500 mb-2">
                修辞手法
              </label>
              <div className="space-y-2">
                {style.language.rhetoric.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="text"
                      className="flex-1 px-3 py-2 text-sm text-gray-700 border border-gray-200 rounded focus:outline-none focus:border-gray-400 transition-colors bg-white"
                      value={item}
                      onChange={(e) => handleArrayChange('language', 'rhetoric', index, e.target.value)}
                      onKeyDown={handleKeyDown}
                    />
                    <button
                      type="button"
                      className="p-1 text-gray-400 hover:text-gray-600"
                      onClick={() => removeArrayItem('language', 'rhetoric', index)}
                      aria-label={`删除修辞手法: ${item || '空'}`}
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className="text-accent hover:text-accent-dark text-sm"
                  onClick={() => addArrayItem('language', 'rhetoric')}
                >
                  + 添加修辞手法
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Structure Section */}
      <div className="border border-gray-200 rounded overflow-hidden">
        <button
          type="button"
          className="w-full flex justify-between items-center px-4 py-2.5 hover:bg-gray-50 focus:outline-none transition-colors text-left"
          onClick={(e) => {
            e.preventDefault();
            toggleSection('structure');
          }}
          aria-expanded={expandedSection === 'structure'}
          aria-controls="structure-section"
        >
          <h3 className="text-sm text-gray-700 font-medium">结构</h3>
          <span className="text-xs text-gray-400" aria-hidden="true">{expandedSection === 'structure' ? '▼' : '▶'}</span>
        </button>
        
        {expandedSection === 'structure' && (
          <div className="px-4 py-3 bg-gray-50/50 border-t border-gray-200 space-y-4">
            <div>
              <label className="block text-xs text-gray-500 mb-2">
                段落长度
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 text-sm text-gray-700 border border-gray-200 rounded focus:outline-none focus:border-gray-400 transition-colors bg-white"
                value={style.structure.paragraph_length}
                onChange={(e) => handleChange('structure', 'paragraph_length', e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
            
            <div>
              <label className="block text-xs text-gray-500 mb-2">
                过渡风格
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 text-sm text-gray-700 border border-gray-200 rounded focus:outline-none focus:border-gray-400 transition-colors bg-white"
                value={style.structure.transition_style}
                onChange={(e) => handleChange('structure', 'transition_style', e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
            
            <div>
              <label className="block text-xs text-gray-500 mb-2">
                层次模式
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 text-sm text-gray-700 border border-gray-200 rounded focus:outline-none focus:border-gray-400 transition-colors bg-white"
                value={style.structure.hierarchy_pattern}
                onChange={(e) => handleChange('structure', 'hierarchy_pattern', e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
          </div>
        )}
      </div>

      {/* Narrative Section */}
      <div className="border border-gray-200 rounded overflow-hidden">
        <button
          type="button"
          className="w-full flex justify-between items-center px-4 py-2.5 hover:bg-gray-50 focus:outline-none transition-colors text-left"
          onClick={(e) => {
            e.preventDefault();
            toggleSection('narrative');
          }}
          aria-expanded={expandedSection === 'narrative'}
          aria-controls="narrative-section"
        >
          <h3 className="text-sm text-gray-700 font-medium">叙述</h3>
          <span className="text-xs text-gray-400" aria-hidden="true">{expandedSection === 'narrative' ? '▼' : '▶'}</span>
        </button>
        
        {expandedSection === 'narrative' && (
          <div className="px-4 py-3 bg-gray-50/50 border-t border-gray-200 space-y-4">
            <div>
              <label className="block text-xs text-gray-500 mb-2">
                视角
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 text-sm text-gray-700 border border-gray-200 rounded focus:outline-none focus:border-gray-400 transition-colors bg-white"
                value={style.narrative.perspective}
                onChange={(e) => handleChange('narrative', 'perspective', e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
            
            <div>
              <label className="block text-xs text-gray-500 mb-2">
                时间顺序
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 text-sm text-gray-700 border border-gray-200 rounded focus:outline-none focus:border-gray-400 transition-colors bg-white"
                value={style.narrative.time_sequence}
                onChange={(e) => handleChange('narrative', 'time_sequence', e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
            
            <div>
              <label className="block text-xs text-gray-500 mb-2">
                叙述态度
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 text-sm text-gray-700 border border-gray-200 rounded focus:outline-none focus:border-gray-400 transition-colors bg-white"
                value={style.narrative.narrator_attitude}
                onChange={(e) => handleChange('narrative', 'narrator_attitude', e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
          </div>
        )}
      </div>

      {/* Emotion Section */}
      <div className="border border-gray-200 rounded overflow-hidden">
        <button
          type="button"
          className="w-full flex justify-between items-center px-4 py-2.5 hover:bg-gray-50 focus:outline-none transition-colors text-left"
          onClick={(e) => {
            e.preventDefault();
            toggleSection('emotion');
          }}
          aria-expanded={expandedSection === 'emotion'}
          aria-controls="emotion-section"
        >
          <h3 className="text-sm text-gray-700 font-medium">情感</h3>
          <span className="text-xs text-gray-400" aria-hidden="true">{expandedSection === 'emotion' ? '▼' : '▶'}</span>
        </button>
        
        {expandedSection === 'emotion' && (
          <div className="px-4 py-3 bg-gray-50/50 border-t border-gray-200 space-y-4">
            <div>
              <label className="block text-xs text-gray-500 mb-2">
                情感强度 (1-10)
              </label>
              <input
                type="number"
                min="1"
                max="10"
                className="w-full px-3 py-2 text-sm text-gray-700 border border-gray-200 rounded focus:outline-none focus:border-gray-400 transition-colors bg-white"
                value={style.emotion.intensity}
                onChange={(e) => handleChange('emotion', 'intensity', Number(e.target.value))}
                onKeyDown={handleKeyDown}
              />
            </div>
            
            <div>
              <label className="block text-xs text-gray-500 mb-2">
                表达方式
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 text-sm text-gray-700 border border-gray-200 rounded focus:outline-none focus:border-gray-400 transition-colors bg-white"
                value={style.emotion.expression_style}
                onChange={(e) => handleChange('emotion', 'expression_style', e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
            
            <div>
              <label className="block text-xs text-gray-500 mb-2">
                情感基调
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 text-sm text-gray-700 border border-gray-200 rounded focus:outline-none focus:border-gray-400 transition-colors bg-white"
                value={style.emotion.tone}
                onChange={(e) => handleChange('emotion', 'tone', e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
          </div>
        )}
      </div>

      {/* Thinking Section */}
      <div className="border border-gray-200 rounded overflow-hidden">
        <button
          type="button"
          className="w-full flex justify-between items-center px-4 py-2.5 hover:bg-gray-50 focus:outline-none transition-colors text-left"
          onClick={(e) => {
            e.preventDefault();
            toggleSection('thinking');
          }}
          aria-expanded={expandedSection === 'thinking'}
          aria-controls="thinking-section"
        >
          <h3 className="text-sm text-gray-700 font-medium">思维</h3>
          <span className="text-xs text-gray-400" aria-hidden="true">{expandedSection === 'thinking' ? '▼' : '▶'}</span>
        </button>
        
        {expandedSection === 'thinking' && (
          <div className="px-4 py-3 bg-gray-50/50 border-t border-gray-200 space-y-4">
            <div>
              <label className="block text-xs text-gray-500 mb-2">
                逻辑模式
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 text-sm text-gray-700 border border-gray-200 rounded focus:outline-none focus:border-gray-400 transition-colors bg-white"
                value={style.thinking.logic_pattern}
                onChange={(e) => handleChange('thinking', 'logic_pattern', e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
            
            <div>
              <label className="block text-xs text-gray-500 mb-2">
                思考深度 (1-10)
              </label>
              <input
                type="number"
                min="1"
                max="10"
                className="w-full px-3 py-2 text-sm text-gray-700 border border-gray-200 rounded focus:outline-none focus:border-gray-400 transition-colors bg-white"
                value={style.thinking.depth}
                onChange={(e) => handleChange('thinking', 'depth', Number(e.target.value))}
                onKeyDown={handleKeyDown}
              />
            </div>
            
            <div>
              <label className="block text-xs text-gray-500 mb-2">
                思考节奏
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 text-sm text-gray-700 border border-gray-200 rounded focus:outline-none focus:border-gray-400 transition-colors bg-white"
                value={style.thinking.rhythm}
                onChange={(e) => handleChange('thinking', 'rhythm', e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
          </div>
        )}
      </div>

      {/* Uniqueness Section */}
      <div className="border border-gray-200 rounded overflow-hidden">
        <button
          type="button"
          className="w-full flex justify-between items-center px-4 py-2.5 hover:bg-gray-50 focus:outline-none transition-colors text-left"
          onClick={(e) => {
            e.preventDefault();
            toggleSection('uniqueness');
          }}
          aria-expanded={expandedSection === 'uniqueness'}
          aria-controls="uniqueness-section"
        >
          <h3 className="text-sm text-gray-700 font-medium">独特性</h3>
          <span className="text-xs text-gray-400" aria-hidden="true">{expandedSection === 'uniqueness' ? '▼' : '▶'}</span>
        </button>
        
        {expandedSection === 'uniqueness' && (
          <div className="px-4 py-3 bg-gray-50/50 border-t border-gray-200 space-y-4">
            <div>
              <label className="block text-xs text-gray-500 mb-2">
                标志性短语
              </label>
              <div className="space-y-2">
                {style.uniqueness.signature_phrases.map((phrase, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="text"
                      className="flex-1 px-3 py-2 text-sm text-gray-700 border border-gray-200 rounded focus:outline-none focus:border-gray-400 transition-colors bg-white"
                      value={phrase}
                      onChange={(e) => handleArrayChange('uniqueness', 'signature_phrases', index, e.target.value)}
                      onKeyDown={handleKeyDown}
                    />
                    <button
                      type="button"
                      className="p-1 text-gray-400 hover:text-gray-600"
                      onClick={() => removeArrayItem('uniqueness', 'signature_phrases', index)}
                      aria-label={`删除标志性短语: ${phrase || '空'}`}
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className="text-accent hover:text-accent-dark text-sm"
                  onClick={() => addArrayItem('uniqueness', 'signature_phrases')}
                >
                  + 添加标志性短语
                </button>
              </div>
            </div>
            
            <div>
              <label className="block text-xs text-gray-500 mb-2">
                意象系统
              </label>
              <div className="space-y-2">
                {style.uniqueness.imagery_system.map((image, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="text"
                      className="flex-1 px-3 py-2 text-sm text-gray-700 border border-gray-200 rounded focus:outline-none focus:border-gray-400 transition-colors bg-white"
                      value={image}
                      onChange={(e) => handleArrayChange('uniqueness', 'imagery_system', index, e.target.value)}
                      onKeyDown={handleKeyDown}
                    />
                    <button
                      type="button"
                      className="p-1 text-gray-400 hover:text-gray-600"
                      onClick={() => removeArrayItem('uniqueness', 'imagery_system', index)}
                      aria-label={`删除意象: ${image || '空'}`}
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className="text-accent hover:text-accent-dark text-sm"
                  onClick={() => addArrayItem('uniqueness', 'imagery_system')}
                >
                  + 添加意象
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Cultural Section */}
      <div className="border border-gray-200 rounded overflow-hidden">
        <button
          type="button"
          className="w-full flex justify-between items-center px-4 py-2.5 hover:bg-gray-50 focus:outline-none transition-colors text-left"
          onClick={(e) => {
            e.preventDefault();
            toggleSection('cultural');
          }}
          aria-expanded={expandedSection === 'cultural'}
          aria-controls="cultural-section"
        >
          <h3 className="text-sm text-gray-700 font-medium">文化</h3>
          <span className="text-xs text-gray-400" aria-hidden="true">{expandedSection === 'cultural' ? '▼' : '▶'}</span>
        </button>
        
        {expandedSection === 'cultural' && (
          <div className="px-4 py-3 bg-gray-50/50 border-t border-gray-200 space-y-4">
            <div>
              <label className="block text-xs text-gray-500 mb-2">
                典故
              </label>
              <div className="space-y-2">
                {style.cultural.allusions.map((allusion, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="text"
                      className="flex-1 px-3 py-2 text-sm text-gray-700 border border-gray-200 rounded focus:outline-none focus:border-gray-400 transition-colors bg-white"
                      value={allusion}
                      onChange={(e) => handleArrayChange('cultural', 'allusions', index, e.target.value)}
                      onKeyDown={handleKeyDown}
                    />
                    <button
                      type="button"
                      className="p-1 text-gray-400 hover:text-gray-600"
                      onClick={() => removeArrayItem('cultural', 'allusions', index)}
                      aria-label={`删除典故: ${allusion || '空'}`}
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className="text-accent hover:text-accent-dark text-sm"
                  onClick={() => addArrayItem('cultural', 'allusions')}
                >
                  + 添加典故
                </button>
              </div>
            </div>
            
            <div>
              <label className="block text-xs text-gray-500 mb-2">
                知识领域
              </label>
              <div className="space-y-2">
                {style.cultural.knowledge_domains.map((domain, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="text"
                      className="flex-1 px-3 py-2 text-sm text-gray-700 border border-gray-200 rounded focus:outline-none focus:border-gray-400 transition-colors bg-white"
                      value={domain}
                      onChange={(e) => handleArrayChange('cultural', 'knowledge_domains', index, e.target.value)}
                      onKeyDown={handleKeyDown}
                    />
                    <button
                      type="button"
                      className="p-1 text-gray-400 hover:text-gray-600"
                      onClick={() => removeArrayItem('cultural', 'knowledge_domains', index)}
                      aria-label={`删除知识领域: ${domain || '空'}`}
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className="text-accent hover:text-accent-dark text-sm"
                  onClick={() => addArrayItem('cultural', 'knowledge_domains')}
                >
                  + 添加知识领域
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Rhythm Section */}
      <div className="border border-gray-200 rounded overflow-hidden">
        <button
          type="button"
          className="w-full flex justify-between items-center px-4 py-2.5 hover:bg-gray-50 focus:outline-none transition-colors text-left"
          onClick={(e) => {
            e.preventDefault();
            toggleSection('rhythm');
          }}
          aria-expanded={expandedSection === 'rhythm'}
          aria-controls="rhythm-section"
        >
          <h3 className="text-sm text-gray-700 font-medium">节奏</h3>
          <span className="text-xs text-gray-400" aria-hidden="true">{expandedSection === 'rhythm' ? '▼' : '▶'}</span>
        </button>
        
        {expandedSection === 'rhythm' && (
          <div className="px-4 py-3 bg-gray-50/50 border-t border-gray-200 space-y-4">
            <div>
              <label className="block text-xs text-gray-500 mb-2">
                音节模式
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 text-sm text-gray-700 border border-gray-200 rounded focus:outline-none focus:border-gray-400 transition-colors bg-white"
                value={style.rhythm.syllable_pattern}
                onChange={(e) => handleChange('rhythm', 'syllable_pattern', e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
            
            <div>
              <label className="block text-xs text-gray-500 mb-2">
                停顿模式
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 text-sm text-gray-700 border border-gray-200 rounded focus:outline-none focus:border-gray-400 transition-colors bg-white"
                value={style.rhythm.pause_pattern}
                onChange={(e) => handleChange('rhythm', 'pause_pattern', e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
            
            <div>
              <label className="block text-xs text-gray-500 mb-2">
                节奏
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 text-sm text-gray-700 border border-gray-200 rounded focus:outline-none focus:border-gray-400 transition-colors bg-white"
                value={style.rhythm.tempo}
                onChange={(e) => handleChange('rhythm', 'tempo', e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 