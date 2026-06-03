'use client';

interface AdPlaceholderProps {
  position?: 'top' | 'middle' | 'bottom';
}

export default function AdPlaceholder({ position = 'middle' }: AdPlaceholderProps) {
  return (
    <div
      data-ad-position={position}
      style={{
        maxWidth: '1200px',
        margin: position === 'middle' ? '2rem auto' : '1.5rem auto',
        padding: '1rem',
        display: 'none',
      }}
    />
  );
}
