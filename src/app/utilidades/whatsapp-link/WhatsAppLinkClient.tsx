'use client';

import { useState } from 'react';
import CopyButton from '@/components/CopyButton';
import QRCode from 'qrcode';

export default function WhatsAppLinkClient() {
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [link, setLink] = useState('');
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [error, setError] = useState('');

  const formatPhone = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length <= 2) return cleaned;
    if (cleaned.length <= 7) return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`;
    if (cleaned.length <= 11) return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7, 11)}`;
  };

  const handleGenerate = async () => {
    setError('');
    const cleaned = phone.replace(/\D/g, '');
    
    if (cleaned.length < 10 || cleaned.length > 11) {
      setError('Número de telefone inválido. Use DDD + número.');
      return;
    }

    const fullNumber = `55${cleaned}`;
    const encodedMessage = encodeURIComponent(message);
    const waLink = `https://wa.me/${fullNumber}${message ? `?text=${encodedMessage}` : ''}`;
    
    setLink(waLink);

    try {
      const qr = await QRCode.toDataURL(waLink, { width: 300, margin: 2 });
      setQrDataUrl(qr);
    } catch {
      setError('Erro ao gerar QR Code');
    }
  };

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm mb-6">
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Número do WhatsApp</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(formatPhone(e.target.value))}
              placeholder="(11) 99999-9999"
              maxLength={16}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
            />
            <p className="text-xs text-gray-500 mt-1">DDD + número (ex: 11 99999-9999)</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Mensagem (opcional)</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Olá! Gostaria de mais informações..."
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>
        </div>

        <button
          onClick={handleGenerate}
          className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors"
        >
          Gerar Link
        </button>

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
            ❌ {error}
          </div>
        )}

        {link && (
          <div className="mt-6 space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Link gerado:</span>
                <CopyButton text={link} label="Copiar link" />
              </div>
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-green-50 border border-green-200 rounded-lg p-4 text-green-700 font-mono text-sm break-all hover:bg-green-100 transition-colors"
              >
                {link}
              </a>
            </div>

            {qrDataUrl && (
              <div className="text-center">
                <p className="text-sm font-medium text-gray-700 mb-2">QR Code:</p>
                <img src={qrDataUrl} alt="QR Code WhatsApp" className="inline-block" />
                <p className="text-xs text-gray-500 mt-2">Escaneie para abrir o WhatsApp</p>
              </div>
            )}
          </div>
        )}
      </div>

      <article className="mt-12 prose prose-gray max-w-none">
        <h2>Como usar o link do WhatsApp?</h2>
        <p>
          O link gerado pode ser usado em cartões de visita, panfletos, bio do Instagram, 
          site da empresa ou qualquer lugar. Quando alguém clicar, o WhatsApp abre automaticamente 
          com a mensagem pré-preenchida.
        </p>
        <h2>Dicas para comerciantes</h2>
        <p>
          Use mensagens como &quot;Olá! Vi seu anúncio e gostaria de saber mais&quot; para facilitar 
          o primeiro contato. O QR Code é perfeito para materiais impressos.
        </p>
      </article>
    </>
  );
}
