'use client';

import { useState } from 'react';
import CopyButton from '@/components/CopyButton';

interface CEPData {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
}

export default function BuscaCEP() {
  const [cep, setCep] = useState('');
  const [rua, setRua] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('');
  const [result, setResult] = useState<CEPData | null>(null);
  const [results, setResults] = useState<CEPData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mode, setMode] = useState<'cep' | 'endereco'>('cep');

  const formatCEP = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length <= 5) return cleaned;
    return `${cleaned.slice(0, 5)}-${cleaned.slice(5, 8)}`;
  };

  const handleSearchByCEP = async () => {
    const cleaned = cep.replace(/\D/g, '');
    if (cleaned.length !== 8) {
      setError('CEP deve ter 8 dígitos');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);
    setResults([]);

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cleaned}/json/`);
      const data = await response.json();

      if (data.erro) {
        setError('CEP não encontrado');
      } else {
        setResult(data);
      }
    } catch {
      setError('Erro ao consultar CEP. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchByAddress = async () => {
    if (!rua.trim() || !cidade.trim() || !estado.trim()) {
      setError('Preencha todos os campos');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);
    setResults([]);

    try {
      const response = await fetch(
        `https://viacep.com.br/ws/${encodeURIComponent(estado)}/${encodeURIComponent(cidade)}/${encodeURIComponent(rua)}/json/`
      );
      const data = await response.json();

      if (data.erro || (Array.isArray(data) && data.length === 0)) {
        setError('Nenhum CEP encontrado para este endereço');
      } else {
        setResults(Array.isArray(data) ? data : [data]);
      }
    } catch {
      setError('Erro ao consultar endereço. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const formatAddress = (data: CEPData) => {
    const parts = [data.logradouro, data.bairro, data.localidade, data.uf].filter(Boolean);
    return parts.join(', ');
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Busca de CEP</h1>
      <p className="text-gray-600 mb-8">
        Consulte endereços por CEP ou busque CEPs por endereço usando a API ViaCEP.
      </p>

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => { setMode('cep'); setError(''); setResult(null); setResults([]); }}
          className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
            mode === 'cep' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Buscar por CEP
        </button>
        <button
          onClick={() => { setMode('endereco'); setError(''); setResult(null); setResults([]); }}
          className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
            mode === 'endereco' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Buscar por Endereço
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        {mode === 'cep' ? (
          <div>
            <label htmlFor="cep" className="block text-sm font-medium text-gray-700 mb-2">
              Digite o CEP
            </label>
            <div className="flex gap-4">
              <input
                id="cep"
                type="text"
                value={cep}
                onChange={(e) => setCep(formatCEP(e.target.value))}
                placeholder="00000-000"
                maxLength={9}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg font-mono"
              />
              <button
                onClick={handleSearchByCEP}
                disabled={loading}
                className="bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Buscando...' : 'Buscar'}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label htmlFor="rua" className="block text-sm font-medium text-gray-700 mb-2">
                Logradouro (Rua, Avenida, etc.)
              </label>
              <input
                id="rua"
                type="text"
                value={rua}
                onChange={(e) => setRua(e.target.value)}
                placeholder="Ex: Rua das Flores"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="cidade" className="block text-sm font-medium text-gray-700 mb-2">
                  Cidade
                </label>
                <input
                  id="cidade"
                  type="text"
                  value={cidade}
                  onChange={(e) => setCidade(e.target.value)}
                  placeholder="Ex: São Paulo"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="estado" className="block text-sm font-medium text-gray-700 mb-2">
                  Estado (UF)
                </label>
                <input
                  id="estado"
                  type="text"
                  value={estado}
                  onChange={(e) => setEstado(e.target.value.toUpperCase().slice(0, 2))}
                  placeholder="SP"
                  maxLength={2}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase"
                />
              </div>
            </div>
            <button
              onClick={handleSearchByAddress}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Buscando...' : 'Buscar CEP'}
            </button>
          </div>
        )}

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
            ❌ {error}
          </div>
        )}

        {result && (
          <div className="mt-6 bg-gray-50 rounded-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-gray-900">{result.cep}</h3>
              <CopyButton text={formatAddress(result)} label="Copiar endereço" />
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Logradouro:</span>
                <p className="font-medium">{result.logradouro || '-'}</p>
              </div>
              <div>
                <span className="text-gray-500">Complemento:</span>
                <p className="font-medium">{result.complemento || '-'}</p>
              </div>
              <div>
                <span className="text-gray-500">Bairro:</span>
                <p className="font-medium">{result.bairro || '-'}</p>
              </div>
              <div>
                <span className="text-gray-500">Cidade:</span>
                <p className="font-medium">{result.localidade}/{result.uf}</p>
              </div>
              <div>
                <span className="text-gray-500">DDD:</span>
                <p className="font-medium">{result.ddd || '-'}</p>
              </div>
              <div>
                <span className="text-gray-500">IBGE:</span>
                <p className="font-medium">{result.ibge || '-'}</p>
              </div>
            </div>
          </div>
        )}

        {results.length > 0 && (
          <div className="mt-6 space-y-4">
            <h3 className="font-semibold text-gray-900">{results.length} resultado(s) encontrado(s)</h3>
            {results.map((item, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold text-lg">{item.cep}</p>
                    <p className="text-gray-600">{formatAddress(item)}</p>
                  </div>
                  <CopyButton text={`${item.cep} - ${formatAddress(item)}`} label="Copiar" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <article className="mt-12 prose prose-gray max-w-none">
        <h2>Como funciona a Busca de CEP?</h2>
        <p>
          A busca de CEP utiliza a API ViaCEP, um serviço gratuito que disponibiliza informações 
          de endereçamento do Brasil. Basta digitar o CEP e o sistema retorna todos os dados 
          do endereço correspondente.
        </p>
        <h2>Busca reversa de CEP</h2>
        <p>
          A busca reversa permite encontrar o CEP a partir do nome da rua, cidade e estado. 
          Útil quando você sabe o endereço mas não o código postal.
        </p>
      </article>
    </div>
  );
}
