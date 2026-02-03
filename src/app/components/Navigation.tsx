"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

// 定义导航链接类型
type NavLink = {
  href: string;
  label: string;
  icon?: React.ReactNode;
};

// 集中管理所有功能页面的导航链接
export const featureLinks: NavLink[] = [
  { href: '/', label: '写作助手' },
  { href: '/features/resume-generator', label: '简历生成' },
  { href: '/features/ai-rewrite', label: '文本优化' },
  { href: '/features/wechat-formatter', label: '公众号排版' },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="bg-pure-white border-b border-border-gray sticky top-0 z-50 backdrop-blur-sm bg-opacity-95">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="text-xl font-semibold text-text-primary tracking-tight transition-colors group-hover:text-accent">
              AI 写作助手
            </div>
          </Link>

          {/* 导航菜单 */}
          <div className="hidden md:flex items-center gap-1">
            {featureLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`
                    px-3 py-2 text-sm font-medium rounded-md transition-all duration-200
                    ${
                      isActive
                        ? 'text-accent bg-accent/5'
                        : 'text-text-secondary hover:text-text-primary hover:bg-light-gray'
                    }
                  `}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* 移动端导航菜单 */}
      <div className="md:hidden border-t border-border-gray bg-pure-white">
        <div className="px-4 py-2 space-y-1">
          {featureLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`
                  block px-3 py-2 rounded-md text-sm font-medium transition-all duration-200
                  ${
                    isActive
                      ? 'text-accent bg-accent/5'
                      : 'text-text-secondary hover:text-text-primary hover:bg-light-gray'
                  }
                `}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
