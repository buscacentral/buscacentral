'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { EmptyState } from '@/components/ui/EmptyState';

export default function GeradorQRCodeClient() {
  const [text, setText] = useState('');
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!text.trim()) {
      setError('Digite um texto ou URL para gerar o QR Code');
      return;
    }

    setError('');
    try {
      const QRCode = (await import('qrcode')).default;
      const url = await QRCode.toDataURL(text, {
        width: 400,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#ffffff',
        },
      });
      setQrDataUrl(url);
    } catch {
      setError('Erro ao gerar QR Code');
    }
  };

  const handleDownload = () => {
    if (!qrDataUrl) return;
    const link = document.createElement('a');
    link.download = 'qrcode.png';
    link.href = qrDataUrl;
    link.click();
  };

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <div className="mb-4">
          <label htmlFor="text" className="block text-sm font-medium text-gray-700 mb-2">
            Texto ou URL
          </label>
          <textarea
            id="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Cole aqui o link do seu site, seu perfil do Instagram ou um texto qualquer..."
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none transition-all focus:shadow-md"
          />
        </div>

        <div className="flex gap-4 mb-6">
          <Button
            onClick={handleGenerate}
            leftIcon="✨"
            className="flex-1"
          >
            Gerar QR Code
          </Button>
          {qrDataUrl && (
            <Button
              onClick={handleDownload}
              variant="success"
              leftIcon="📥"
            >
              Download PNG
            </Button>
          )}
        </div>

        {error && (
          <Alert variant="error" className="mb-4">
            {error}
          </Alert>
        )}

        {!qrDataUrl && !error && (
          <EmptyState
            icon="📱"
            title="Aguardando dados"
            description="Seu QR Code aparecerá aqui. Digite um texto ou URL acima e clique em gerar."
            minHeight="min-h-[250px]"
          />
        )}

        {qrDataUrl && (
          <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg animate-in zoom-in-95 fade-in duration-500">
            <div className="bg-white p-4 rounded-xl shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 cursor-pointer" onClick={handleDownload} title="Clique para baixar">
              <Image src={qrDataUrl} alt="QR Code gerado" width={300} height={300} unoptimized className="max-w-[300px] h-auto rounded-lg" />
            </div>
            <p className="text-sm text-green-600 font-medium mt-6 flex items-center gap-2">
              <span className="text-lg">✨</span> QR Code gerado com sucesso!
            </p>
          </div>
        )}
      </div>

      <article className="mt-12 prose prose-gray max-w-none">
        <h2>Como funciona o Gerador de QR Code?</h2>
        <p>
          O gerador converte qualquer texto ou URL em um código QR (Quick Response Code). 
          O QR Code é gerado 100% no seu navegador, sem enviar dados para servidores externos.
        </p>
        <h2>Como usar o QR Code?</h2>
        <p>
          Após gerar, você pode baixar a imagem em PNG e usá-la em cartões de visita, materiais 
          impressos, sites ou compartilhar digitalmente. Qualquer câmera de celular pode ler o código.
        </p>
      </article>
    </>
  );
}
