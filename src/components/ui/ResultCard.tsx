import React from 'react';

interface ResultCardProps {
  title?: React.ReactNode;
  icon?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  animateIn?: boolean;
}

export function ResultCard({
  title,
  icon,
  children,
  footer,
  className = '',
  animateIn = true
}: ResultCardProps) {
  const animationStyle = animateIn ? 'animate-in fade-in slide-in-from-bottom-2 duration-500' : '';
  
  return (
    <div className={`bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 ${animationStyle} ${className}`}>
      {(title || icon) && (
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          {icon && <span className="text-xl">{icon}</span>}
          {title}
        </h2>
      )}
      <div>{children}</div>
      {footer && (
        <div className="mt-4 pt-4 border-t border-gray-100 text-sm text-gray-500">
          {footer}
        </div>
      )}
    </div>
  );
}
