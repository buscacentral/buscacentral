import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'BuscaCentral Utilidades — Ferramentas Práticas Gratuitas';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #312e81 0%, #4338ca 50%, #312e81 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle at 25% 25%, #818cf820 0%, transparent 50%), radial-gradient(circle at 75% 75%, #a78bfa20 0%, transparent 50%)',
          }}
        />

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', position: 'relative' }}>
          <span style={{ fontSize: '48px' }}>🛠️</span>
          <span style={{ fontSize: '42px', fontWeight: 800, color: 'white' }}>Central de Utilidades</span>
        </div>

        <div style={{ fontSize: '28px', fontWeight: 600, color: '#c7d2fe', textAlign: 'center', maxWidth: '800px', lineHeight: 1.4, position: 'relative', marginBottom: '24px' }}>
          QR Code • Senhas • IMC • Rastreio • Texto • Imagens
        </div>

        <div style={{ display: 'flex', gap: '16px', position: 'relative' }}>
          {['18 ferramentas', 'Sem cadastro', 'Gratuito'].map((item) => (
            <div key={item} style={{ padding: '8px 20px', background: '#ffffff15', borderRadius: '8px', fontSize: '18px', color: '#e0e7ff', fontWeight: 600 }}>
              {item}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size },
  );
}
