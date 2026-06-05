import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'BuscaCentral Financeiro — Ferramentas Financeiras Gratuitas';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #064e3b 0%, #065f46 50%, #064e3b 100%)',
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
            background: 'radial-gradient(circle at 30% 30%, #10b98120 0%, transparent 50%), radial-gradient(circle at 70% 70%, #05966920 0%, transparent 50%)',
          }}
        />

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', position: 'relative' }}>
          <span style={{ fontSize: '48px' }}>💱</span>
          <span style={{ fontSize: '42px', fontWeight: 800, color: 'white' }}>Central Financeira</span>
        </div>

        <div style={{ fontSize: '28px', fontWeight: 600, color: '#a7f3d0', textAlign: 'center', maxWidth: '800px', lineHeight: 1.4, position: 'relative', marginBottom: '24px' }}>
          Cotações • Criptomoedas • Financiamento • ROI Imobiliário
        </div>

        <div style={{ display: 'flex', gap: '16px', position: 'relative' }}>
          {['Dólar', 'Bitcoin', 'FIPE', 'SAC'].map((item) => (
            <div key={item} style={{ padding: '8px 20px', background: '#ffffff15', borderRadius: '8px', fontSize: '18px', color: '#d1fae5', fontWeight: 600 }}>
              {item}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size },
  );
}
