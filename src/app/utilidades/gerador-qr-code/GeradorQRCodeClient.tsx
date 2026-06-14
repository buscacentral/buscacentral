'use client';

import { useState } from 'react';
import QRCode from 'qrcode';
import Image from 'next/image';

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
            placeholder="https://buscacentral.com.br ou qualquer texto"
            rows={3}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        <div className="flex gap-4 mb-6">
          <button
            onClick={handleGenerate}
            className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Gerar QR Code
          </button>
          {qrDataUrl && (
            <button
              onClick={handleDownload}
              className="bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              Download PNG
            </button>
          )}
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 mb-4">
            ❌ {error}
          </div>
        )}

        {qrDataUrl && (
          <div className="flex justify-center p-6 bg-gray-50 rounded-lg">
            <Image src={qrDataUrl} alt="QR Code gerado" width={300} height={300} unoptimized className="max-w-[300px] h-auto" />
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
