/**
 * 印章装饰组件 - 东方美学元素
 */

import React from 'react';

interface SealProps {
  text?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function Seal({ text = '墨韵', size = 'md', className = '' }: SealProps) {
  const sizeMap = {
    sm: 'w-12 h-12 text-xs',
    md: 'w-16 h-16 text-sm',
    lg: 'w-20 h-20 text-base',
  };

  return (
    <div
      className={`${sizeMap[size]} ${className} relative flex items-center justify-center`}
      style={{
        animation: 'inkSpread 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      {/* 印章外框 */}
      <svg
        viewBox="0 0 100 100"
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* 外方框 - 粗糙的边缘模拟石刻效果 */}
        <rect
          x="5"
          y="5"
          width="90"
          height="90"
          fill="none"
          stroke="#C83E3E"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            filter: 'url(#rough-edge)',
          }}
        />

        {/* SVG 滤镜 - 创建粗糙边缘效果 */}
        <defs>
          <filter id="rough-edge">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.8"
              numOctaves="4"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="2"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      {/* 印章文字 */}
      <div className="relative z-10 font-handwriting font-bold text-vermillion opacity-90 rotate-[-2deg]">
        {text}
      </div>
    </div>
  );
}
