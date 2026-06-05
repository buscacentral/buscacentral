import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'BuscaCentral — Ferramentas Online Gratuitas';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
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
        {/* Background pattern */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle at 25% 25%, #3b82f620 0%, transparent 50%), radial-gradient(circle at 75% 75%, #06b6d420 0%, transparent 50%)',
          }}
        />

        {/* Logo area */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '32px',
            position: 'relative',
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #3b82f6, #06b6d4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '32px',
            }}
          >
            🔍
          </div>
          <span
            style={{
              fontSize: '48px',
              fontWeight: 800,
              color: 'white',
              letterSpacing: '-1px',
            }}
          >
            BuscaCentral
          </span>
        </div>

        {/* Main title */}
        <div
          style={{
            fontSize: '36px',
            fontWeight: 700,
            color: '#e2e8f0',
            textAlign: 'center',
            maxWidth: '900px',
            lineHeight: 1.3,
            position: 'relative',
            marginBottom: '24px',
          }}
        >
          35+ Ferramentas Online Gratuitas
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: '22px',
            fontWeight: 400,
            color: '#94a3b8',
            textAlign: 'center',
            maxWidth: '800px',
            lineHeight: 1.4,
            position: 'relative',
          }}
        >
          CPF • CNPJ • CEP • Cotações • Criptomoedas • IMC • QR Code
        </div>

        {/* Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginTop: '32px',
            padding: '12px 24px',
            background: '#3b82f6',
            borderRadius: '999px',
            position: 'relative',
          }}
        >
          <span style={{ fontSize: '18px', fontWeight: 700, color: 'white' }}>
            Sem cadastro • Sem custo • Sem limite
          </span>
        </div>
      </div>
    ),
    { ...size },
  );
}
