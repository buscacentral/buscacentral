import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'BuscaCentral Localização — CEP, Distância e Clima';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #0c4a6e 0%, #0369a1 50%, #0c4a6e 100%)',
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
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 30% 30%, #0ea5e920 0%, transparent 50%)' }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', position: 'relative' }}>
          <span style={{ fontSize: '48px' }}>📍</span>
          <span style={{ fontSize: '42px', fontWeight: 800, color: 'white' }}>Central de Localização</span>
        </div>

        <div style={{ fontSize: '28px', fontWeight: 600, color: '#bae6fd', textAlign: 'center', maxWidth: '800px', lineHeight: 1.4, position: 'relative' }}>
          Busca de CEP • Distância entre Cidades • Previsão do Tempo
        </div>
      </div>
    ),
    { ...size },
  );
}
