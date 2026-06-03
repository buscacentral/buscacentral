'use client';

import { useState, useEffect } from 'react';

export default function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setShow(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setShow(false);
    setTimeout(() => window.location.reload(), 100);
  };

  const handleReject = () => {
    localStorage.setItem('cookie-consent', 'rejected');
    setShow(false);
    setTimeout(() => window.location.reload(), 100);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg safe-area-bottom">
      <div className="px-4 py-4 sm:max-w-7xl sm:mx-auto sm:px-6 lg:px-8">
        <p className="text-sm text-gray-700 mb-4 leading-relaxed">
          Utilizamos cookies e tecnologias semelhantes para melhorar sua experiência,
          personalizar anúncios e analisar o tráfego. Ao continuar navegando, você concorda
          com nossa{' '}
          <a href="/privacidade" className="text-blue-600 underline font-medium">Política de Privacidade</a>.
        </p>
        <div className="flex gap-3">
          <button
            onClick={handleReject}
            className="flex-1 sm:flex-none min-h-[48px] px-6 py-3 text-sm font-semibold text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 active:bg-gray-300 transition-colors touch-manipulation"
            style={{ touchAction: 'manipulation' }}
          >
            Rejeitar
          </button>
          <button
            onClick={handleAccept}
            className="flex-1 sm:flex-none min-h-[48px] px-6 py-3 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 active:bg-blue-800 transition-colors touch-manipulation"
            style={{ touchAction: 'manipulation' }}
          >
            Aceitar
          </button>
        </div>
      </div>
    </div>
  );
}
