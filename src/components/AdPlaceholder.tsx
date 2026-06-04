'use client';

interface AdPlaceholderProps {
  position?: 'top' | 'middle' | 'bottom';
}

/**
 * AdPlaceholder - Container para anúncios Google AdSense
 * 
 * CLS Prevention: O contêiner tem altura mínima fixa para evitar
 * que o layout pule quando o anúncio carregar.
 * 
 * Para ativar o AdSense, remova o display:none e adicione
 * o script do Google AdSense dentro deste componente.
 */
export default function AdPlaceholder({ position = 'middle' }: AdPlaceholderProps) {
  const minHeightMap = {
    top: '90px',
    middle: '250px',
    bottom: '90px',
  };

  return (
    <div
      data-ad-position={position}
      aria-label={`Espaço para anúncio ${position}`}
      role="complementary"
      style={{
        maxWidth: '1200px',
        width: '100%',
        margin: position === 'middle' ? '2rem auto' : '0 auto',
        padding: '0.5rem 1rem',
        minHeight: minHeightMap[position],
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* 
        Quando ativar o Google AdSense, substitua este comentário
        pelo script do AdSense:
        
        <ins className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client="ca-pub-XXXXXXXXXXXXXXXX"
          data-ad-slot="XXXXXXXXXX"
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      */}
    </div>
  );
}
