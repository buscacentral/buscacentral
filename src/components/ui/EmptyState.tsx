import React from 'react';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
  minHeight?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className = '',
  minHeight = 'min-h-[300px]'
}: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center p-8 bg-gray-50 border border-dashed border-gray-300 rounded-xl text-center animate-in fade-in duration-500 ${minHeight} ${className}`}>
      <div className="text-5xl mb-4 opacity-50 transition-transform hover:scale-110 duration-300">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      {description && (
        <div className="text-gray-500 max-w-md text-sm md:text-base mb-6">
          {description}
        </div>
      )}
      {action && <div>{action}</div>}
    </div>
  );
}
