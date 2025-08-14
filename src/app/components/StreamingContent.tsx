"use client";

import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface StreamingContentProps {
  content: string;
  isStreaming: boolean;
  isComplete: boolean;
  error?: string;
  className?: string;
}

export default function StreamingContent({ 
  content, 
  isStreaming, 
  isComplete, 
  error,
  className = "" 
}: StreamingContentProps) {
  const [displayedContent, setDisplayedContent] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const contentRef = useRef<HTMLDivElement>(null);
  const typewriterTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // 打字机效果
  useEffect(() => {
    if (isStreaming && content && content !== displayedContent) {
      // 清除之前的定时器
      if (typewriterTimeoutRef.current) {
        clearTimeout(typewriterTimeoutRef.current);
      }
      
      // 如果是新的内容块，直接添加到现有内容
      if (content.startsWith(displayedContent)) {
        const newPart = content.slice(displayedContent.length);
        let index = 0;
        
        const typeWriter = () => {
          if (index < newPart.length) {
            setDisplayedContent(prev => prev + newPart[index]);
            index++;
            typewriterTimeoutRef.current = setTimeout(typeWriter, 20); // 调整打字速度
          }
        };
        
        typeWriter();
      } else {
        // 如果是完全新的内容，重新开始
        setDisplayedContent(content);
      }
    } else if (!isStreaming) {
      setDisplayedContent(content);
    }
    
    return () => {
      if (typewriterTimeoutRef.current) {
        clearTimeout(typewriterTimeoutRef.current);
      }
    };
  }, [content, isStreaming, displayedContent]);

  // 光标闪烁效果
  useEffect(() => {
    if (isStreaming || !isComplete) {
      const interval = setInterval(() => {
        setShowCursor(prev => !prev);
      }, 500);
      
      return () => clearInterval(interval);
    } else {
      setShowCursor(false);
    }
  }, [isStreaming, isComplete]);

  // 自动滚动到底部
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  }, [displayedContent]);

  if (error) {
    return (
      <div className={`bg-red-50 border border-red-200 rounded-lg p-6 ${className}`}>
        <div className="flex items-center text-red-800 mb-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="font-medium">生成失败</span>
        </div>
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  if (!content && !displayedContent && !isStreaming) {
    return (
      <div className={`bg-gray-50 border border-gray-200 rounded-lg p-6 text-center ${className}`}>
        <div className="text-gray-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p>点击&ldquo;生成内容&rdquo;开始创作</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative flex flex-col h-full ${className}`}>
      {/* 标题栏 */}
      <div className="bg-gray-50 border-b border-gray-200 px-4 py-2 rounded-t-lg flex items-center justify-between">
        <div className="flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span className="font-medium text-gray-700">生成结果</span>
        </div>
        
        {/* 状态指示器 */}
        <div className="flex items-center text-sm">
          {isStreaming && (
            <div className="flex items-center text-blue-600">
              <div className="animate-spin rounded-full h-3 w-3 border border-blue-600 border-t-transparent mr-2"></div>
              <span>正在生成...</span>
            </div>
          )}
          {isComplete && !isStreaming && (
            <div className="flex items-center text-green-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>生成完成</span>
            </div>
          )}
        </div>
      </div>

      {/* 内容区域 */}
      <div 
        ref={contentRef}
        className="bg-white border border-gray-200 border-t-0 rounded-b-lg p-6 flex-1 overflow-y-auto"
        style={{ minHeight: '400px' }}
      >
        {displayedContent || isStreaming ? (
          <div className="prose prose-gray max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {displayedContent}
            </ReactMarkdown>
            
            {/* 打字机光标 */}
            {(isStreaming || !isComplete) && (
              <span 
                className={`inline-block w-2 h-5 ml-1 bg-blue-600 transition-opacity duration-100 ${
                  showCursor ? 'opacity-100' : 'opacity-0'
                }`}
                style={{ animation: showCursor ? 'none' : 'blink 1s infinite' }}
              />
            )}
          </div>
        ) : (
          <div className="text-center text-gray-500 py-12">
            <div className="animate-pulse">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <p className="text-lg font-medium">正在生成内容，请稍候...</p>
              <p className="text-sm mt-1">这可能需要几秒到几分钟的时间，取决于 API 响应速度和内容长度</p>
            </div>
          </div>
        )}
      </div>

      {/* 添加打字机光标动画的CSS */}
      <style jsx>{`
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        
        .prose p:last-child {
          margin-bottom: 0;
        }
        
        /* 滚动条样式 */
        div::-webkit-scrollbar {
          width: 6px;
        }
        
        div::-webkit-scrollbar-track {
          background: #f1f5f9;
        }
        
        div::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 3px;
        }
        
        div::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </div>
  );
}