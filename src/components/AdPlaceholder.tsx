'use client';

interface AdPlaceholderProps {
  position?: 'top' | 'middle' | 'bottom';
}

export default function AdPlaceholder({ position = 'middle' }: AdPlaceholderProps) {
  const labels = {
    top: 'Anúncio Superior - Google AdSense',
    middle: 'Anúncio - Google AdSense',
    bottom: 'Anúncio Inferior - Google AdSense',
  };

  return (
    <div
      style={{
        maxWidth: '1200px',
        margin: position === 'middle' ? '2rem auto' : '1.5rem auto',
        padding: '1rem',
        background: '#f8fafc',
        border: '1px dashed #e2e8f0',
        borderRadius: '8px',
        textAlign: 'center',
        color: '#94a3b8',
        fontSize: '0.875rem',
        minHeight: position === 'middle' ? '100px' : '90px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {labels[position]}
    </div>
  );
}
