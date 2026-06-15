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

interface SimplesNacional {
  mei: string;
  simples: string;
  data_opcao_mei: string | null;
  data_exclusao_mei: string | null;
  data_opcao_simples: string | null;
  data_exclusao_simples: string | null;
}

interface ResultadoData {
  razao_social: string;
  nome_fantasia: string | null;
  cnpj: string;
  cnpj_raiz: string;
  situacao_cadastral: string;
  data_situacao_cadastral: string;
  data_abertura: string;
  porte: string;
  capital_social: number;
  natureza_juridica: string;
  qualificacao_responsavel: string;
  tipo: string;
  logradouro: string;
  tipo_logradouro: string;
  numero: string;
  complemento: string | null;
  bairro: string;
  municipio: string;
  uf: string;
  uf_nome: string;
  cep: string;
  telefone: string | null;
  email: string | null;
  cnae_fiscal: CNAE;
  cnaes_secundarios: CNAE[];
  socios: Socio[];
  simples: SimplesNacional | null;
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

  const formatDateISO = (date: string): string => {
    if (!date) return '—';
    if (date.includes('-')) {
      const parts = date.split('-');
      if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    if (date.length === 8) {
      return `${date.slice(6, 8)}/${date.slice(4, 6)}/${date.slice(0, 4)}`;
    }
    return date;
  };

  const calcIdade = (date: string): string => {
    if (!date) return '';
    let d: Date;
    if (date.includes('-')) {
      d = new Date(date + 'T00:00:00');
    } else if (date.length === 8) {
      d = new Date(`${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6, 8)}T00:00:00`);
    } else {
      return '';
    }
    const now = new Date();
    let anos = now.getFullYear() - d.getFullYear();
    let meses = now.getMonth() - d.getMonth();
    let dias = now.getDate() - d.getDate();
    if (dias < 0) { meses--; dias += 30; }
    if (meses < 0) { anos--; meses += 12; }
    const parts = [];
    if (anos > 0) parts.push(`${anos} ano${anos > 1 ? 's' : ''}`);
    if (meses > 0) parts.push(`${meses} ${meses > 1 ? 'meses' : 'mês'}`);
    if (dias > 0) parts.push(`${dias} dia${dias > 1 ? 's' : ''}`);
    return parts.join(', ');
  };

  const formatCEP = (cep: string): string => {
    const cleaned = cep.replace(/\D/g, '');
    if (cleaned.length !== 8) return cep;
    return `${cleaned.slice(0, 5)}-${cleaned.slice(5)}`;
  };

  const formatPhone = (ddd: string, phone: string): string | null => {
    if (!ddd || !phone) return null;
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 9) {
      return `(${ddd}) ${cleaned.slice(0, 5)}-${cleaned.slice(5)}`;
    }
    if (cleaned.length === 8) {
      return `(${ddd}) ${cleaned.slice(0, 4)}-${cleaned.slice(4)}`;
    }
    return `(${ddd}) ${cleaned}`;
  };

  const getSituacaoBadge = (situacao: string) => {
    const s = situacao?.toUpperCase() || '';
    if (s === 'ATIVA') return 'bg-green-100 text-green-800 border-green-200';
    if (s === 'BAIXADA') return 'bg-red-100 text-red-800 border-red-200';
    if (s === 'SUSPENSA') return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    if (s === 'INAPTA') return 'bg-orange-100 text-orange-800 border-orange-200';
    return 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getSimplesBadge = (value: string) => {
    if (value === 'Sim') return 'bg-green-100 text-green-700 border-green-200';
    return 'bg-slate-100 text-slate-500 border-slate-200';
  };

  const getGoogleMapsUrl = (r: ResultadoData) => {
    const q = encodeURIComponent(`${r.tipo_logradouro} ${r.logradouro} ${r.numero}, ${r.bairro}, ${r.municipio} - ${r.uf}, ${formatCEP(r.cep)}`);
    return `https://www.google.com/maps/search/?api=1&query=${q}`;
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
      const est = data.estabelecimento || {};

      setResultado({
        razao_social: data.razao_social || '',
        nome_fantasia: est.nome_fantasia || null,
        cnpj: formatCNPJ(est.cnpj || cleaned),
        cnpj_raiz: data.cnpj_raiz || '',
        situacao_cadastral: est.situacao_cadastral || '',
        data_situacao_cadastral: est.data_situacao_cadastral || '',
        data_abertura: est.data_inicio_atividade || '',
        porte: data.porte?.descricao || '',
        capital_social: Number(data.capital_social) || 0,
        natureza_juridica: data.natureza_juridica?.descricao || '',
        qualificacao_responsavel: data.qualificacao_do_responsavel?.descricao || '',
        tipo: est.tipo || '',
        tipo_logradouro: est.tipo_logradouro || '',
        logradouro: est.logradouro || '',
        numero: est.numero || '',
        complemento: est.complemento || null,
        bairro: est.bairro || '',
        municipio: est.cidade?.nome || '',
        uf: est.estado?.sigla || '',
        uf_nome: est.estado?.nome || '',
        cep: est.cep || '',
        telefone: formatPhone(est.ddd1, est.telefone1),
        email: est.email || null,
        cnae_fiscal: {
          codigo: est.atividade_principal?.subclasse || est.atividade_principal?.classe || '',
          descricao: est.atividade_principal?.descricao || '',
        },
        cnaes_secundarios: (est.atividades_secundarias || []).slice(0, 10).map((a: { subclasse?: string; classe: string; descricao: string }) => ({
          codigo: a.subclasse || a.classe,
          descricao: a.descricao,
        })),
        socios: (data.socios || []).map((s: { nome: string; qualificacao_socio?: { descricao: string } }) => ({
          nome: s.nome,
          qualificacao: s.qualificacao_socio?.descricao || '',
        })),
        simples: data.simples ? {
          mei: data.simples.mei || 'Não',
          simples: data.simples.simples || 'Não',
          data_opcao_mei: data.simples.data_opcao_mei || null,
          data_exclusao_mei: data.simples.data_exclusao_mei || null,
          data_opcao_simples: data.simples.data_opcao_simples || null,
          data_exclusao_simples: data.simples.data_exclusao_simples || null,
        } : null,
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
              <Alert variant="error" className="mt-6">{erro}</Alert>
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
                {/* Identificação */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 shadow-sm">
                  <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Identificação</h2>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xl font-black text-slate-900">{resultado.razao_social}</p>
                      {resultado.nome_fantasia && (
                        <p className="text-slate-600 font-medium mt-1">
                          <span className="text-xs text-slate-400 uppercase tracking-wider mr-2">Fantasia</span>
                          {resultado.nome_fantasia}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-slate-500 font-mono text-sm bg-white px-2 py-1 rounded border border-slate-200">{resultado.cnpj}</p>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${getSituacaoBadge(resultado.situacao_cadastral)}`}>
                        {resultado.situacao_cadastral}
                      </span>
                      {resultado.tipo && (
                        <span className="inline-block px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider bg-sky-50 text-sky-700 border-sky-200">
                          {resultado.tipo}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Informações de Registro */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 shadow-sm">
                  <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Informações de Registro</h2>
                  <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-white p-3 rounded-lg border border-slate-100 shadow-sm">
                      <dt className="text-xs font-semibold text-slate-400 mb-1">Data de Abertura</dt>
                      <dd className="text-slate-900 font-bold">{formatDateISO(resultado.data_abertura)}</dd>
                      {resultado.data_abertura && (
                        <dd className="text-xs text-sky-600 font-medium mt-0.5">{calcIdade(resultado.data_abertura)}</dd>
                      )}
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
                    <div className="bg-white p-3 rounded-lg border border-slate-100 shadow-sm">
                      <dt className="text-xs font-semibold text-slate-400 mb-1">Tipo</dt>
                      <dd className="text-slate-900 font-bold">{resultado.tipo || '—'}</dd>
                    </div>
                    {resultado.qualificacao_responsavel && (
                      <div className="bg-white p-3 rounded-lg border border-slate-100 shadow-sm">
                        <dt className="text-xs font-semibold text-slate-400 mb-1">Responsável</dt>
                        <dd className="text-slate-900 font-bold text-sm">{resultado.qualificacao_responsavel}</dd>
                      </div>
                    )}
                  </dl>
                </div>

                {/* Simples Nacional / MEI */}
                {resultado.simples && (
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 shadow-sm">
                    <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Simples Nacional / MEI</h2>
                    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="bg-white p-3 rounded-lg border border-slate-100 shadow-sm">
                        <dt className="text-xs font-semibold text-slate-400 mb-1">Opção pelo Simples</dt>
                        <dd>
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold border ${getSimplesBadge(resultado.simples.simples)}`}>
                            {resultado.simples.simples}
                          </span>
                        </dd>
                      </div>
                      <div className="bg-white p-3 rounded-lg border border-slate-100 shadow-sm">
                        <dt className="text-xs font-semibold text-slate-400 mb-1">Opção pelo MEI</dt>
                        <dd>
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold border ${getSimplesBadge(resultado.simples.mei)}`}>
                            {resultado.simples.mei}
                          </span>
                        </dd>
                      </div>
                      {resultado.simples.data_opcao_simples && (
                        <div className="bg-white p-3 rounded-lg border border-slate-100 shadow-sm sm:col-span-2">
                          <dt className="text-xs font-semibold text-slate-400 mb-1">Período Simples</dt>
                          <dd className="text-slate-900 font-bold text-sm">
                            {formatDateISO(resultado.simples.data_opcao_simples)}
                            {resultado.simples.data_exclusao_simples && ` — ${formatDateISO(resultado.simples.data_exclusao_simples)}`}
                          </dd>
                        </div>
                      )}
                    </dl>
                  </div>
                )}

                {/* Contato */}
                {(resultado.telefone || resultado.email) && (
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 shadow-sm">
                    <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Contato</h2>
                    <div className="space-y-3">
                      {resultado.telefone && (
                        <div className="bg-white p-3 rounded-lg border border-slate-100 shadow-sm flex items-center gap-3">
                          <span className="text-lg">📞</span>
                          <div>
                            <p className="text-xs font-semibold text-slate-400">Telefone</p>
                            <a href={`tel:${resultado.telefone.replace(/\D/g, '')}`} className="text-slate-900 font-bold hover:text-sky-600 transition-colors">
                              {resultado.telefone}
                            </a>
                          </div>
                        </div>
                      )}
                      {resultado.email && (
                        <div className="bg-white p-3 rounded-lg border border-slate-100 shadow-sm flex items-center gap-3">
                          <span className="text-lg">✉️</span>
                          <div>
                            <p className="text-xs font-semibold text-slate-400">E-mail</p>
                            <a href={`mailto:${resultado.email}`} className="text-slate-900 font-bold hover:text-sky-600 transition-colors break-all">
                              {resultado.email}
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Endereço */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 shadow-sm">
                  <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Endereço</h2>
                  <div className="bg-white p-4 rounded-lg border border-slate-100 shadow-sm">
                    <p className="text-slate-900 font-medium">
                      {resultado.tipo_logradouro} {resultado.logradouro}{resultado.numero ? `, ${resultado.numero}` : ''}{resultado.complemento ? ` - ${resultado.complemento}` : ''}
                    </p>
                    <p className="text-slate-600 mt-1">{resultado.bairro}</p>
                    <p className="text-slate-600 font-medium">{resultado.municipio} - {resultado.uf_nome || resultado.uf}</p>
                    <p className="text-slate-500 font-mono text-sm mt-2">CEP: {formatCEP(resultado.cep)}</p>
                    <a
                      href={getGoogleMapsUrl(resultado)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-sky-600 hover:text-sky-700 bg-sky-50 px-3 py-1.5 rounded-lg border border-sky-100 hover:border-sky-200 transition-colors"
                    >
                      📍 Ver no Google Maps
                    </a>
                  </div>
                </div>

                {/* Atividade Econômica */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 shadow-sm">
                  <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Atividade Econômica</h2>
                  {resultado.cnae_fiscal?.codigo && (
                    <div className="mb-4 bg-white p-4 rounded-lg border border-sky-100 shadow-sm">
                      <p className="text-xs font-bold text-sky-600 uppercase tracking-wider mb-2">CNAE Principal</p>
                      <p className="text-slate-900 font-medium text-sm">
                        <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-sky-700 mr-2">{resultado.cnae_fiscal.codigo}</span>
                        {resultado.cnae_fiscal.descricao}
                      </p>
                    </div>
                  )}
                  {resultado.cnaes_secundarios.length > 0 && (
                    <div className="bg-white p-4 rounded-lg border border-slate-100 shadow-sm">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">CNAEs Secundários ({resultado.cnaes_secundarios.length})</p>
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

                {/* Quadro Societário */}
                {resultado.socios.length > 0 && (
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 shadow-sm">
                    <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Quadro de Sócios ({resultado.socios.length})</h2>
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

                {/* Sobre a empresa */}
                <div className="bg-sky-50 border border-sky-100 rounded-xl p-5 shadow-sm">
                  <h2 className="text-xs font-bold text-sky-600 uppercase tracking-wider mb-3">Sobre</h2>
                  <p className="text-slate-700 text-sm leading-relaxed">
                    A empresa <strong>{resultado.razao_social}</strong> de CNPJ {resultado.cnpj}, foi fundada em {formatDateISO(resultado.data_abertura)} na cidade {resultado.municipio} no estado {resultado.uf_nome || resultado.uf}. Sua atividade principal, conforme a Receita Federal, é <strong>{resultado.cnae_fiscal?.codigo} - {resultado.cnae_fiscal?.descricao}</strong>. Sua situação cadastral até o momento é <strong>{resultado.situacao_cadastral}</strong>.
                  </p>
                </div>

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
                  Digite um CNPJ válido à esquerda para visualizar todos os dados públicos da empresa, como CNAEs, sócios, Simples Nacional e situação.
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
          porte, capital social, natureza jurídica, tipo (Matriz/Filial), opção pelo Simples Nacional e MEI,
          contatos (telefone e e-mail), endereço completo com link para o Google Maps, atividade econômica (CNAE),
          e quadro de sócios — tudo diretamente da base oficial da Receita Federal.
        </p>
      </article>
    </>
  );
}
