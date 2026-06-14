'use client';

import { useState, useEffect, useCallback } from 'react';

interface CurrencyRate {
  code: string;
  name: string;
  symbol: string;
  bid: string;
  ask: string;
  variation: string;
  flag: string;
}

const defaultCurrencies: CurrencyRate[] = [
  { code: 'USD-BRL', name: 'Dólar Americano', symbol: 'US$', bid: '0.00', ask: '0.00', variation: '0', flag: '🇺🇸' },
  { code: 'EUR-BRL', name: 'Euro', symbol: '€', bid: '0.00', ask: '0.00', variation: '0', flag: '🇪🇺' },
  { code: 'GBP-BRL', name: 'Libra Esterlina', symbol: '£', bid: '0.00', ask: '0.00', variation: '0', flag: '🇬🇧' },
  { code: 'ARS-BRL', name: 'Peso Argentino', symbol: 'AR$', bid: '0.00', ask: '0.00', variation: '0', flag: '🇦🇷' },
  { code: 'BTC-BRL', name: 'Bitcoin', symbol: '₿', bid: '0.00', ask: '0.00', variation: '0', flag: '₿' },
];

const QUICK_AMOUNTS = [1, 5, 10, 50, 100, 500, 1000];

const CONVERTIBLE_CODES = ['USD-BRL', 'EUR-BRL', 'GBP-BRL'];

export default function CotacaoClient() {
  const [currencies, setCurrencies] = useState<CurrencyRate[]>(defaultCurrencies);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastUpdate, setLastUpdate] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState('USD-BRL');
  const [convertForeign, setConvertForeign] = useState('');
  const [convertBrl, setConvertBrl] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const fetchRates = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const codes = ['USD-BRL', 'EUR-BRL', 'GBP-BRL', 'ARS-BRL', 'BTC-BRL'];
      const response = await fetch(`https://economia.awesomeapi.com.br/last/${codes.join(',')}`);
      const data = await response.json();

      setCurrencies(prev => prev.map(curr => {
        const key = curr.code.replace('-', '');
        if (data[key]) {
          return {
            ...curr,
            bid: parseFloat(data[key].bid).toFixed(curr.code === 'BTC-BRL' ? 2 : 4),
            ask: parseFloat(data[key].ask).toFixed(curr.code === 'BTC-BRL' ? 2 : 4),
            variation: parseFloat(data[key].pctChange).toFixed(2),
          };
        }
        return curr;
      }));
      setLastUpdate(new Date().toLocaleString('pt-BR'));
    } catch {
      setError('Erro ao buscar cotações. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const initFetch = async () => {
      await Promise.resolve();
      fetchRates();
    };
    initFetch();
    const interval = setInterval(fetchRates, 60000);
    return () => clearInterval(interval);
  }, [fetchRates]);

  // Obtém a cotação bid da moeda selecionada
  const getRate = (): number => {
    const curr = currencies.find(c => c.code === selectedCurrency);
    if (!curr) return 0;
    return parseFloat(curr.bid) || 0;
  };

  // Conversor bidirecional
  const handleConvertForeign = (val: string) => {
    setConvertForeign(val);
    const num = parseFloat(val.replace(',', '.'));
    const rate = getRate();
    if (!isNaN(num) && num > 0 && rate > 0) {
      setConvertBrl((num * rate).toFixed(2));
    } else {
      setConvertBrl('');
    }
  };

  const handleConvertBrl = (val: string) => {
    setConvertBrl(val);
    const num = parseFloat(val.replace(',', '.'));
    const rate = getRate();
    if (!isNaN(num) && num > 0 && rate > 0) {
      setConvertForeign((num / rate).toFixed(2));
    } else {
      setConvertForeign('');
    }
  };

  // Limpa o conversor ao trocar de moeda
  const handleCurrencyChange = (code: string) => {
    setSelectedCurrency(code);
    setConvertForeign('');
    setConvertBrl('');
  };

  const selectedCurr = currencies.find(c => c.code === selectedCurrency);
  const isConvertible = CONVERTIBLE_CODES.includes(selectedCurrency);

  // Sanitiza strings para JSON-LD (evita aspas e caracteres especiais)
  const sanitize = (s: string) => s.replace(/"/g, '\\"').replace(/\n/g, ' ').trim();

  // FAQ Schema JSON-LD
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: sanitize('Como é calculada a cotação do Dólar Comercial em tempo real?'),
        acceptedAnswer: {
          '@type': 'Answer',
          text: sanitize('A cotação do Dólar Comercial exibida no BuscaCentral é obtida em tempo real através da AwesomeAPI, que agrega dados dos principais mercados financeiros brasileiros. O valor representa a cotação de compra (bid) em Reais (BRL), atualizada a cada minuto para garantir precisão.'),
        },
      },
      {
        '@type': 'Question',
        name: sanitize('Qual a diferença entre o Dólar Turismo e o Dólar Comercial exibido no BuscaCentral?'),
        acceptedAnswer: {
          '@type': 'Answer',
          text: sanitize('O Dólar Comercial é a cotação usada em transações financeiras entre bancos e empresas, sem IOF ou spread de casas de câmbio. O Dólar Turismo inclui IOF (até 1,1%), spread da casa de câmbio e custos operacionais, sendo sempre mais caro. O BuscaCentral exibe o Dólar Comercial, que é a referência oficial do mercado.'),
        },
      },
      {
        '@type': 'Question',
        name: sanitize('Como converter Euro ou Libra para Real usando a calculadora?'),
        acceptedAnswer: {
          '@type': 'Answer',
          text: sanitize('Na página de Cotação do BuscaCentral, selecione a moeda desejada (Euro ou Libra Esterlina) clicando no cartão da moeda. Em seguida, use o conversor bidirecional: digite o valor na moeda estrangeira para ver o equivalente em Reais, ou digite em Reais para converter para Euro ou Libra. A tabela de conversões rápidas exibe valores pré-calculados para referências comuns como 1, 5, 10, 50, 100, 500 e 1000 unidades.'),
        },
      },
    ],
  };

  const formatPrice = (n: number) =>
    n.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-gray-500">
          {lastUpdate ? `Última atualização: ${lastUpdate}` : 'Carregando...'}
        </p>
        <button
          onClick={fetchRates}
          disabled={loading}
          className="text-blue-600 hover:text-blue-800 font-medium text-sm disabled:opacity-50"
        >
          {loading ? 'Atualizando...' : 'Atualizar agora'}
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 mb-6">
          ❌ {error}
        </div>
      )}

      {/* Cards de moedas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {currencies.map((curr) => (
          <div
            key={curr.code}
            className={`bg-white border rounded-xl p-5 shadow-sm cursor-pointer transition-all ${
              selectedCurrency === curr.code ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => handleCurrencyChange(curr.code)}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{curr.flag}</span>
                <div>
                  <p className="font-semibold text-gray-900">{curr.code.replace('-BRL', '')}</p>
                  <p className="text-xs text-gray-500">{curr.name}</p>
                </div>
              </div>
              <span className={`text-sm font-medium ${
                parseFloat(curr.variation) >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {parseFloat(curr.variation) >= 0 ? '↑' : '↓'} {Math.abs(parseFloat(curr.variation))}%
              </span>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                R$ {curr.bid}
              </p>
              <p className="text-xs text-gray-500 mt-1">Compra / Venda: R$ {curr.ask}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Conversor Bidirecional */}
      {isConvertible && selectedCurr && (
        <section className="bg-white border border-slate-200 rounded-xl p-4 sm:p-6 shadow-sm mb-6">
          <h2 className="text-base md:text-lg font-semibold text-slate-900 mb-4">
            Conversor {selectedCurr.code.replace('-BRL', '')} ⇄ BRL
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] gap-4 items-end">
            <div>
              <label className="block text-base md:text-lg text-slate-600 mb-2 font-medium">
                {selectedCurr.flag} {selectedCurr.name}
              </label>
              <input
                type="text"
                value={convertForeign}
                onChange={(e) => handleConvertForeign(e.target.value)}
                placeholder="100"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base md:text-lg font-mono"
              />
            </div>
            <div className="text-center pb-3">
              <span className="text-2xl text-slate-400 font-light">⇄</span>
            </div>
            <div>
              <label className="block text-base md:text-lg text-slate-600 mb-2 font-medium">
                🇧🇷 Real (BRL)
              </label>
              <input
                type="text"
                value={convertBrl}
                onChange={(e) => handleConvertBrl(e.target.value)}
                placeholder="500"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base md:text-lg font-mono"
              />
            </div>
          </div>
          <p className="text-sm text-slate-400 mt-3 text-center">
            Cotação: 1 {selectedCurr.code.replace('-BRL', '')} = R$ {selectedCurr.bid}
          </p>
        </section>
      )}

      {/* Tabela de Conversões Rápidas */}
      {isConvertible && selectedCurr && (
        <section className="bg-white border border-slate-200 rounded-xl p-4 sm:p-6 shadow-sm mb-6">
          <h2 className="text-base md:text-lg font-semibold text-slate-900 mb-4">
            Conversões Rápidas — {selectedCurr.name}
          </h2>
          <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="w-full text-base md:text-lg">
              <thead>
                <tr className="bg-slate-100">
                  <th className="text-left py-3 px-3 sm:px-5 text-slate-600 font-semibold">Quantidade</th>
                  <th className="text-right py-3 px-3 sm:px-5 text-slate-600 font-semibold">Valor Estimado (BRL)</th>
                </tr>
              </thead>
              <tbody>
                {QUICK_AMOUNTS.map((amt) => (
                  <tr key={amt} className="odd:bg-slate-50 even:bg-white border-t border-slate-100">
                    <td className="py-3 px-3 sm:px-5 font-mono font-semibold text-slate-800">
                      {amt.toLocaleString('pt-BR')} {selectedCurr.code.replace('-BRL', '')}
                    </td>
                    <td className="py-3 px-3 sm:px-5 text-right font-mono font-semibold text-green-700">
                      R$ {formatPrice(amt * parseFloat(selectedCurr.bid))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-sm text-slate-400 mt-3">
            Valores calculados com base na cotação de compra (bid) de R$ {selectedCurr.bid}.
          </p>
        </section>
      )}

      {/* Conversor genérico para moedas não-convertíveis (ARS, BTC) */}
      {!isConvertible && (
        <section className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 shadow-sm mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Conversor R$ → Moeda</h2>
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm text-gray-600 mb-1">Valor em Reais</label>
              <input
                type="text"
                value={convertBrl}
                onChange={(e) => {
                  setConvertBrl(e.target.value);
                  const num = parseFloat(e.target.value.replace(',', '.'));
                  const rate = getRate();
                  if (!isNaN(num) && num > 0 && rate > 0) {
                    setConvertForeign((num / rate).toFixed(selectedCurrency === 'BTC-BRL' ? 8 : 2));
                  } else {
                    setConvertForeign('');
                  }
                }}
                placeholder="100.00"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
              />
            </div>
            <div className="text-center px-4">
              <p className="text-2xl">→</p>
            </div>
            <div className="flex-1">
              <label className="block text-sm text-gray-600 mb-1">{selectedCurrency.replace('-BRL', '')}</label>
              <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-lg font-bold text-gray-900">
                {convertForeign || '0.00'}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* FAQ Accordion com Schema JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <section className="bg-white border border-slate-200 rounded-xl p-4 sm:p-6 shadow-sm">
        <h2 className="text-base md:text-lg font-semibold text-slate-900 mb-4">
          Perguntas Frequentes — Cotação de Moedas
        </h2>
        <div className="divide-y divide-slate-200">
          {faqSchema.mainEntity.map((item, idx) => (
            <div key={idx}>
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full flex items-center justify-between py-4 text-left gap-4"
                aria-expanded={openFaq === idx}
              >
                <h3 className="text-base md:text-lg font-medium text-slate-800">
                  {item.name}
                </h3>
                <span className={`text-slate-400 text-xl transition-transform duration-200 flex-shrink-0 ${openFaq === idx ? 'rotate-45' : ''}`}>
                  +
                </span>
              </button>
              <div className={`overflow-hidden transition-all duration-200 ${openFaq === idx ? 'max-h-96 pb-4' : 'max-h-0'}`}>
                <p className="text-sm md:text-base text-slate-600 leading-relaxed">
                  {item.acceptedAnswer.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
