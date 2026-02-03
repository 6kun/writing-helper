import React from 'react';
import Navigation from './Navigation';

type FeatureLayoutProps = {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
};

export default function FeatureLayout({
  children,
  title,
  subtitle,
}: FeatureLayoutProps) {
  return (
    <div className="bg-bg-gray flex flex-col min-h-screen">
      <Navigation />

      <main className="flex-1">
        {(title || subtitle) && (
          <div className="bg-pure-white border-b border-border-gray">
            <div className="mx-auto max-w-6xl px-6 py-12">
              {title && (
                <h1 className="text-4xl font-semibold text-text-primary tracking-tight fade-in">
                  {title}
                </h1>
              )}
              {subtitle && (
                <p className="mt-3 text-lg text-text-secondary max-w-3xl slide-in">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
        )}

        <div className="mx-auto max-w-6xl py-8 px-6">
          {children}
        </div>
      </main>
    </div>
  );
}
