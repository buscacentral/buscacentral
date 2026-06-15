'use client';

import { useState } from 'react';
import { validateCNPJ, formatCNPJ } from '@/lib/cnpj';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { ResultCard } from '@/components/ui/ResultCard';

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

export default function ConsultaCNPJClient() {
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
    <>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <div className="mb-6">
              <label htmlFor="cnpj" className="block text-sm font-medium text-slate-700 mb-2">
                Digite o CNPJ
              </label>
              <input
                id="cnpj"
                type="text"
                value={input}
                onChange={(e) => handleInputChange(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="00.000.000/0001-00"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 text-lg font-mono transition-colors"
              />
            </div>

            <Button
              onClick={handleConsultar}
              isLoading={status === 'loading'}
              className="w-full"
            >
              {status === 'loading' ? 'Consultando Receita Federal...' : 'Consultar CNPJ'}
            </Button>

            {status === 'error' && erro && (
              <Alert type="error" message={erro} className="mt-6" />
            )}
          </div>
        </div>

        <div className="lg:col-span-7">
          {status === 'success' && resultado && (
            <ResultCard title="Dados do CNPJ" className="animate-fade-in">
              <div className="flex gap-3 mb-6">
                <button
                  onClick={handleCopiarRazao}
                  className="flex-1 bg-slate-100 text-slate-700 py-2.5 px-4 rounded-lg font-medium hover:bg-slate-200 transition-colors text-sm flex items-center justify-center gap-2"
                >
                  {copiado ? '✅ Copiado!' : '📋 Copiar Razão Social'}
                </button>
                <button
                  onClick={handleNovaConsulta}
                  className="flex-1 bg-slate-100 text-slate-700 py-2.5 px-4 rounded-lg font-medium hover:bg-slate-200 transition-colors text-sm flex items-center justify-center gap-2"
                >
                  🔄 Nova Consulta
                </button>
              </div>

              <div className="space-y-6">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 shadow-sm">
                  <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Identificação</h2>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xl font-black text-slate-900">{resultado.razao_social}</p>
                      {resultado.nome_fantasia && (
                        <p className="text-slate-600 font-medium mt-1">{resultado.nome_fantasia}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="text-slate-500 font-mono text-sm bg-white px-2 py-1 rounded border border-slate-200">{resultado.cnpj}</p>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${getSituacaoBadge(resultado.situacao_cadastral)}`}>
                        {resultado.situacao_cadastral}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 shadow-sm">
                  <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Informações Gerais</h2>
                  <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-white p-3 rounded-lg border border-slate-100 shadow-sm">
                      <dt className="text-xs font-semibold text-slate-400 mb-1">Data de Abertura</dt>
                      <dd className="text-slate-900 font-bold">{formatDate(resultado.data_abertura)}</dd>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-slate-100 shadow-sm">
                      <dt className="text-xs font-semibold text-slate-400 mb-1">Porte</dt>
                      <dd className="text-slate-900 font-bold">{resultado.porte || '—'}</dd>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-slate-100 shadow-sm">
                      <dt className="text-xs font-semibold text-slate-400 mb-1">Capital Social</dt>
                      <dd className="text-slate-900 font-bold">{formatCurrency(resultado.capital_social)}</dd>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-slate-100 shadow-sm">
                      <dt className="text-xs font-semibold text-slate-400 mb-1">Natureza Jurídica</dt>
                      <dd className="text-slate-900 font-bold text-sm">{resultado.natureza_juridica || '—'}</dd>
                    </div>
                  </dl>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 shadow-sm">
                  <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Endereço</h2>
                  <div className="bg-white p-4 rounded-lg border border-slate-100 shadow-sm">
                    <p className="text-slate-900 font-medium">
                      {resultado.logradouro}{resultado.numero ? `, ${resultado.numero}` : ''}{resultado.complemento ? ` - ${resultado.complemento}` : ''}
                    </p>
                    <p className="text-slate-600 mt-1">{resultado.bairro}</p>
                    <p className="text-slate-600 font-medium">{resultado.municipio} - {resultado.uf}</p>
                    <p className="text-slate-500 font-mono text-sm mt-2">{formatCEP(resultado.cep)}</p>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 shadow-sm">
                  <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Atividade Econômica</h2>
                  {resultado.cnae_fiscal?.codigo && (
                    <div className="mb-4 bg-white p-4 rounded-lg border border-sky-100 shadow-sm">
                      <p className="text-xs font-bold text-sky-600 uppercase tracking-wider mb-2">CNAE Principal</p>
                      <p className="text-slate-900 font-medium text-sm">
                        <span className="font-mono bg-slate-100 px-1 py-0.5 rounded text-sky-700 mr-2">{resultado.cnae_fiscal.codigo}</span> 
                        {resultado.cnae_fiscal.descricao}
                      </p>
                    </div>
                  )}
                  {resultado.cnaes_secundarios.length > 0 && (
                    <div className="bg-white p-4 rounded-lg border border-slate-100 shadow-sm">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">CNAEs Secundários</p>
                      <ul className="space-y-2">
                        {resultado.cnaes_secundarios.map((cnae, idx) => (
                          <li key={idx} className="text-sm text-slate-700 flex items-start">
                            <span className="font-mono bg-slate-50 px-1 py-0.5 rounded border border-slate-100 text-slate-500 mr-2 shrink-0">{cnae.codigo}</span> 
                            <span className="mt-0.5">{cnae.descricao}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {resultado.socios.length > 0 && (
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 shadow-sm">
                    <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Quadro de Sócios</h2>
                    <div className="bg-white border border-slate-100 rounded-lg shadow-sm overflow-hidden">
                      <ul className="divide-y divide-slate-100">
                        {resultado.socios.map((socio, idx) => (
                          <li key={idx} className="p-3 hover:bg-slate-50 transition-colors">
                            <p className="text-slate-900 font-bold">{socio.nome}</p>
                            {socio.qualificacao && (
                              <p className="text-sm text-slate-500 mt-1 font-medium bg-slate-100 inline-block px-2 py-0.5 rounded">{socio.qualificacao}</p>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                <p className="text-xs font-medium text-slate-400 text-center bg-slate-50 p-3 rounded-lg border border-slate-200">
                  Dados obtidos da base pública da Receita Federal do Brasil. As informações podem ter defasagem em relação à atualização oficial.
                </p>
              </div>
            </ResultCard>
          )}

          {status === 'idle' && (
            <div className="h-full flex items-center justify-center min-h-[300px] border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
              <div className="text-center p-8">
                <span className="text-5xl mb-4 block opacity-80">🏢</span>
                <h3 className="text-lg font-bold text-slate-700 mb-2">Consulta de CNPJ</h3>
                <p className="text-slate-500 max-w-sm mx-auto text-sm">
                  Digite um CNPJ válido à esquerda para visualizar todos os dados públicos da empresa, como CNAEs, sócios e situação.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

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
    </>
  );
}
