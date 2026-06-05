'use client';

import { useState, useEffect } from 'react';

const CONSENT_KEY = 'buscacentral_privacy_consent';

export default function CookieBanner() {
  const [show, setShow] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(CONSENT_KEY);
    if (!consent) {
      setShow(true);
    }
  }, []);

  const handleAccept = () => {
    setFadeOut(true);
    setTimeout(() => {
      localStorage.setItem(CONSENT_KEY, JSON.stringify({
        accepted: true,
        timestamp: new Date().toISOString(),
        version: '1.0',
      }));
      setShow(false);
    }, 300);
  };

  if (!show) return null;

  return (
    <div
      role="dialog"
      aria-label="Consentimento de cookies"
      aria-live="polite"
      className={`fixed bottom-0 left-0 right-0 z-50 transition-opacity duration-300 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}
    >
      <div className="bg-slate-950 border-t border-slate-800 shadow-2xl safe-area-bottom">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <p className="text-sm md:text-base text-slate-200 leading-relaxed max-w-3xl">
              O BuscaCentral utiliza cookies e tecnologias semelhantes para melhorar sua experiência,
              analisar o tráfego do site e personalizar anúncios de acordo com a nossa{' '}
              <a
                href="/privacidade"
                className="text-sky-400 hover:text-sky-300 underline font-medium transition-colors"
              >
                Política de Privacidade
              </a>.
            </p>
            <div className="flex gap-3 flex-shrink-0">
              <a
                href="/privacidade"
                className="px-4 py-2.5 text-sm md:text-base text-slate-400 hover:text-white font-medium rounded-xl transition-colors text-center"
              >
                Saiba mais
              </a>
              <button
                onClick={handleAccept}
                className="px-6 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl text-sm md:text-base transition-colors active:scale-95 whitespace-nowrap"
                style={{ touchAction: 'manipulation' }}
              >
                Aceitar Todos
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
