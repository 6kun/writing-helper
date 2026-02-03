/**
 * 毛笔笔触装饰组件
 */

import React from 'react';

interface BrushStrokeProps {
  variant?: 'horizontal' | 'vertical' | 'diagonal';
  className?: string;
}

export function BrushStroke({ variant = 'horizontal', className = '' }: BrushStrokeProps) {
  const variants = {
    horizontal: (
      <svg
        viewBox="0 0 200 20"
        className={`w-full h-2 ${className}`}
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <path
          d="M0,10 Q50,5 100,12 T200,10"
          stroke="#4A7C59"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          opacity="0.4"
          className="brush-stroke"
        />
      </svg>
    ),
    vertical: (
      <svg
        viewBox="0 0 20 200"
        className={`w-2 h-full ${className}`}
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <path
          d="M10,0 Q8,50 12,100 T10,200"
          stroke="#4A7C59"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          opacity="0.4"
          className="brush-stroke"
        />
      </svg>
    ),
    diagonal: (
      <svg
        viewBox="0 0 100 100"
        className={`w-full h-full ${className}`}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M10,90 Q30,70 50,55 T90,10"
          stroke="#4A7C59"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          opacity="0.3"
          className="brush-stroke"
        />
      </svg>
    ),
  };

  return variants[variant];
}

/**
 * 书法风格的分隔线
 */
export function CalligraphyDivider({ className = '' }: { className?: string }) {
  return (
    <div className={`relative w-full h-8 flex items-center justify-center ${className}`}>
      {/* 中心装饰 */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-3 h-3 rounded-full bg-bamboo opacity-30" />
      </div>

      {/* 左侧笔触 */}
      <div className="absolute left-0 right-1/2 h-0.5 mr-6">
        <svg
          viewBox="0 0 200 4"
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <path
            d="M0,2 Q50,1 100,2.5 T200,2"
            stroke="#4A7C59"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            opacity="0.3"
          />
        </svg>
      </div>

      {/* 右侧笔触 */}
      <div className="absolute right-0 left-1/2 h-0.5 ml-6">
        <svg
          viewBox="0 0 200 4"
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <path
            d="M0,2 Q50,2.5 100,1 T200,2"
            stroke="#4A7C59"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            opacity="0.3"
          />
        </svg>
      </div>
    </div>
  );
}

/**
 * 纸张边缘装饰
 */
export function PaperEdge({ className = '' }: { className?: string }) {
  return (
    <div className={`w-full h-1 relative ${className}`}>
      <svg
        viewBox="0 0 1000 10"
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <path
          d="M0,5 Q250,3 500,6 T1000,5"
          stroke="#E8E5DD"
          strokeWidth="1"
          fill="none"
          opacity="0.5"
        />
      </svg>
    </div>
  );
}
