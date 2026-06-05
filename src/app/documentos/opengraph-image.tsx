import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'BuscaCentral Documentos — Gerador e Validador de CPF e CNPJ';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #1e3a5f 0%, #1e40af 50%, #1e3a5f 100%)',
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
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 30% 30%, #3b82f620 0%, transparent 50%)' }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', position: 'relative' }}>
          <span style={{ fontSize: '48px' }}>📄</span>
          <span style={{ fontSize: '42px', fontWeight: 800, color: 'white' }}>Central de Documentos</span>
        </div>

        <div style={{ fontSize: '28px', fontWeight: 600, color: '#bfdbfe', textAlign: 'center', maxWidth: '800px', lineHeight: 1.4, position: 'relative' }}>
          Gerador • Validador • Consulta CNPJ
        </div>
      </div>
    ),
    { ...size },
  );
}
