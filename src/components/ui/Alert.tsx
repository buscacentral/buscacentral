import React from 'react';

type AlertVariant = 'info' | 'success' | 'warning' | 'error';

interface AlertProps {
  variant?: AlertVariant;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function Alert({
  variant = 'info',
  title,
  children,
  className = ''
}: AlertProps) {
  const variants = {
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-800',
      icon: '💡'
    },
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-800',
      icon: '✨'
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      text: 'text-yellow-800',
      icon: '⚠️'
    },
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-800',
      icon: '❌'
    }
  };

  const style = variants[variant];

  return (
    <div className={`p-4 ${style.bg} border ${style.border} rounded-lg ${style.text} animate-in fade-in duration-300 flex items-start gap-3 ${className}`}>
      <span className="text-xl shrink-0 mt-0.5">{style.icon}</span>
      <div className="flex-1">
        {title && <h4 className="font-semibold mb-1">{title}</h4>}
        <div className="text-sm font-medium">{children}</div>
      </div>
    </div>
  );
}
