'use client';

import { useState } from 'react';
import { validateCNPJ, formatCNPJ } from '@/lib/cnpj';

interface Socio {
  nome: string;
  qualificacao: string;
}

interface CNAE {
  codigo: string;
  descricao: string;
}

interface ResultadoData {
  razao_social: string;
  nome_fantasia: string | null;
  cnpj: string;
  situacao_cadastral: string;
  data_abertura: string;
  porte: string;
  capital_social: number;
  natureza_juridica: string;
  logradouro: string;
  numero: string;
  complemento: string | null;
  bairro: string;
  municipio: string;
  uf: string;
  cep: string;
  cnae_fiscal: CNAE;
  cnaes_secundarios: CNAE[];
  socios: Socio[];
}

type StatusConsulta = 'idle' | 'loading' | 'success' | 'error';

export default function ConsultaCNPJ() {
  const [input, setInput] = useState('');
  const [status, setStatus] = useState<StatusConsulta>('idle');
  const [resultado, setResultado] = useState<ResultadoData | null>(null);
  const [erro, setErro] = useState('');
  const [copiado, setCopiado] = useState(false);

  const handleInputChange = (value: string) => {
    const cleaned = value.replace(/\D/g, '').slice(0, 14);
    if (cleaned.length <= 14) {
      const formatted = cleaned.length === 14 ? formatCNPJ(cleaned) : cleaned;
      setInput(formatted);
      setStatus('idle');
      setResultado(null);
      setErro('');
    }
  };

  const formatCurrency = (value: number): string => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const formatDate = (date: string): string => {
    if (!date || date.length !== 8) return date;
    return `${date.slice(6, 8)}/${date.slice(4, 6)}/${date.slice(0, 4)}`;
  };

  const formatCEP = (cep: string): string => {
    const cleaned = cep.replace(/\D/g, '');
    if (cleaned.length !== 8) return cep;
    return `${cleaned.slice(0, 5)}-${cleaned.slice(5)}`;
  };

  const getSituacaoBadge = (situacao: string) => {
    const s = situacao?.toUpperCase() || '';
    if (s === 'ATIVA') return 'bg-green-100 text-green-800 border-green-200';
    if (s === 'BAIXADA') return 'bg-red-100 text-red-800 border-red-200';
    if (s === 'SUSPENSA') return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const handleConsultar = async () => {
    const cleaned = input.replace(/\D/g, '');

    if (!cleaned) {
      setErro('Por favor, insira um CNPJ.');
      setStatus('error');
      return;
    }

    if (!validateCNPJ(cleaned)) {
      setErro('CNPJ inválido. Verifique os números digitados.');
      setStatus('error');
      return;
    }

    setStatus('loading');
    setErro('');
    setResultado(null);

    try {
      const res = await fetch(`https://publica.cnpj.ws/cnpj/${cleaned}`);

      if (res.status === 404) {
        setErro('CNPJ não encontrado na base da Receita Federal.');
        setStatus('error');
        return;
      }

      if (!res.ok) {
        setErro('Serviço temporariamente indisponível. Tente novamente.');
        setStatus('error');
        return;
      }

      const data = await res.json();

      setResultado({
        razao_social: data.razao_social || '',
        nome_fantasia: data.nome_fantasia || null,
        cnpj: formatCNPJ(data.estabelecimento?.cnpj || cleaned),
        situacao_cadastral: data.estabelecimento?.situacao_cadastral || '',
        data_abertura: data.estabelecimento?.data_inicio_atividade || '',
        porte: data.porte?.descricao || '',
        capital_social: Number(data.capital_social) || 0,
        natureza_juridica: data.natureza_juridica?.descricao || '',
        logradouro: data.estabelecimento?.logradouro || '',
        numero: data.estabelecimento?.numero || '',
        complemento: data.estabelecimento?.complemento || null,
        bairro: data.estabelecimento?.bairro || '',
        municipio: data.estabelecimento?.cidade?.nome || '',
        uf: data.estabelecimento?.estado?.sigla || '',
        cep: data.estabelecimento?.cep || '',
        cnae_fiscal: {
          codigo: data.estabelecimento?.atividade_principal?.classe || '',
          descricao: data.estabelecimento?.atividade_principal?.descricao || '',
        },
        cnaes_secundarios: (data.estabelecimento?.atividades_secundarias || []).slice(0, 5).map((a: { classe: string; descricao: string }) => ({
          codigo: a.classe,
          descricao: a.descricao,
        })),
        socios: (data.socios || []).map((s: { nome: string; qualificacao_socio?: { descricao: string } }) => ({
          nome: s.nome,
          qualificacao: s.qualificacao_socio?.descricao || '',
        })),
      });
      setStatus('success');
    } catch {
      setErro('Serviço temporariamente indisponível. Tente novamente.');
      setStatus('error');
    }
  };

  const handleCopiarRazao = async () => {
    if (resultado?.razao_social) {
      await navigator.clipboard.writeText(resultado.razao_social);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    }
  };

  const handleNovaConsulta = () => {
    setInput('');
    setStatus('idle');
    setResultado(null);
    setErro('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && status !== 'loading') {
      handleConsultar();
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Consulta CNPJ</h1>
      <p className="text-gray-600 mb-8">
        Consulte gratuitamente os dados cadastrais de qualquer empresa brasileira
        diretamente da base da Receita Federal. Informe o CNPJ e veja razão social,
        situação cadastral, endereço, CNAE, sócios e muito mais — sem cadastro e sem custo.
      </p>

      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <div className="mb-4">
          <label htmlFor="cnpj" className="block text-sm font-medium text-gray-700 mb-2">
            Digite o CNPJ
          </label>
          <input
            id="cnpj"
            type="text"
            value={input}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="00.000.000/0001-00"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg font-mono"
          />
        </div>

        <button
          onClick={handleConsultar}
          disabled={status === 'loading'}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {status === 'loading' ? (
            <>
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Consultando Receita Federal...
            </>
          ) : (
            'Consultar'
          )}
        </button>

        {status === 'error' && erro && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 flex items-center gap-2">
            <span>❌</span> {erro}
          </div>
        )}
      </div>

      {status === 'success' && resultado && (
        <div className="mt-6 space-y-4">
          <div className="flex gap-3">
            <button
              onClick={handleCopiarRazao}
              className="flex-1 bg-gray-100 text-gray-700 py-2.5 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors text-sm"
            >
              {copiado ? '✅ Copiado!' : '📋 Copiar Razão Social'}
            </button>
            <button
              onClick={handleNovaConsulta}
              className="flex-1 bg-gray-100 text-gray-700 py-2.5 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors text-sm"
            >
              🔄 Nova Consulta
            </button>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Identificação</h2>
            <div className="space-y-2">
              <p className="text-lg font-bold text-gray-900">{resultado.razao_social}</p>
              {resultado.nome_fantasia && (
                <p className="text-gray-600">{resultado.nome_fantasia}</p>
              )}
              <p className="text-gray-500 font-mono text-sm">{resultado.cnpj}</p>
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold border ${getSituacaoBadge(resultado.situacao_cadastral)}`}>
                {resultado.situacao_cadastral}
              </span>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Informações Gerais</h2>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <dt className="text-xs text-gray-400">Data de Abertura</dt>
                <dd className="text-gray-900 font-medium">{formatDate(resultado.data_abertura)}</dd>
              </div>
              <div>
                <dt className="text-xs text-gray-400">Porte</dt>
                <dd className="text-gray-900 font-medium">{resultado.porte || '—'}</dd>
              </div>
              <div>
                <dt className="text-xs text-gray-400">Capital Social</dt>
                <dd className="text-gray-900 font-medium">{formatCurrency(resultado.capital_social)}</dd>
              </div>
              <div>
                <dt className="text-xs text-gray-400">Natureza Jurídica</dt>
                <dd className="text-gray-900 font-medium">{resultado.natureza_juridica || '—'}</dd>
              </div>
            </dl>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Endereço</h2>
            <p className="text-gray-900">
              {resultado.logradouro}{resultado.numero ? `, ${resultado.numero}` : ''}{resultado.complemento ? ` - ${resultado.complemento}` : ''}
            </p>
            <p className="text-gray-900">{resultado.bairro}</p>
            <p className="text-gray-900">{resultado.municipio} - {resultado.uf}</p>
            <p className="text-gray-500 font-mono text-sm">{formatCEP(resultado.cep)}</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Atividade Econômica</h2>
            {resultado.cnae_fiscal?.codigo && (
              <div className="mb-3">
                <p className="text-xs text-gray-400 mb-1">CNAE Principal</p>
                <p className="text-gray-900 font-medium">
                  <span className="font-mono text-blue-600">{resultado.cnae_fiscal.codigo}</span> — {resultado.cnae_fiscal.descricao}
                </p>
              </div>
            )}
            {resultado.cnaes_secundarios.length > 0 && (
              <div>
                <p className="text-xs text-gray-400 mb-2">CNAEs Secundários</p>
                <ul className="space-y-1.5">
                  {resultado.cnaes_secundarios.map((cnae, idx) => (
                    <li key={idx} className="text-sm text-gray-700">
                      <span className="font-mono text-gray-500">{cnae.codigo}</span> — {cnae.descricao}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {resultado.socios.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Quadro de Sócios</h2>
              <ul className="divide-y divide-gray-100">
                {resultado.socios.map((socio, idx) => (
                  <li key={idx} className="py-2.5 first:pt-0 last:pb-0">
                    <p className="text-gray-900 font-medium">{socio.nome}</p>
                    {socio.qualificacao && (
                      <p className="text-sm text-gray-500">{socio.qualificacao}</p>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <p className="text-xs text-gray-400 text-center">
            Dados obtidos da base pública da Receita Federal do Brasil. As informações podem ter defasagem em relação à atualização oficial.
          </p>
        </div>
      )}

      <article className="mt-12 prose prose-gray max-w-none">
        <h2>Sobre a Consulta de CNPJ</h2>
        <p>
          O Cadastro Nacional da Pessoa Jurídica (CNPJ) é o registro mantido pela Receita Federal
          do Brasil que identifica cada empresa no país. Através desta ferramenta, você pode consultar
          gratuitamente os dados cadastrais de qualquer empresa ativa ou baixada.
        </p>
        <h2>Quais informações são exibidas?</h2>
        <p>
          A consulta retorna dados como razão social, nome fantasia, situação cadastral, data de abertura,
          porte, capital social, natureza jurídica, endereço completo, atividade econômica (CNAE) e
          quadro de sócios — tudo diretamente da base oficial da Receita Federal.
        </p>
      </article>
    </div>
  );
}
