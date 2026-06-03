'use client';

import { useState, useEffect } from 'react';

export default function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) setShow(true);
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setShow(false);
  };

  const handleReject = () => {
    localStorage.setItem('cookie-consent', 'rejected');
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:flex sm:items-center sm:justify-between">
        <div className="mb-4 sm:mb-0 sm:mr-6">
          <p className="text-sm text-gray-700">
            Utilizamos cookies e tecnologias semelhantes para melhorar sua experiência,
            personalizar anúncios e analisar o tráfego. Ao continuar navegando, você concorda
            com nossa{' '}
            <a href="/privacidade" className="text-blue-600 hover:underline">Política de Privacidade</a>.
          </p>
        </div>
        <div className="flex gap-3 flex-shrink-0">
          <button
            onClick={handleReject}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Rejeitar
          </button>
          <button
            onClick={handleAccept}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Aceitar
          </button>
        </div>
      </div>
    </div>
  );
}
