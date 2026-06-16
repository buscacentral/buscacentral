'use client';

import { useState } from 'react';

export default function ConsultaProcessosClient() {
  const [nome, setNome] = useState('');
  const [linksGerados, setLinksGerados] = useState<{ jusbrasil: string; escavador: string; google: string } | null>(null);

  const formatNameForUrl = (name: string) => {
    return name
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // remove acentos
      .replace(/[^a-z0-9\s]/g, '') // remove caracteres especiais
      .replace(/\s+/g, '-'); // substitui espaços por traços
  };

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim() || nome.trim().split(' ').length < 2) return;

    const formattedName = formatNameForUrl(nome);
    const googleQuery = encodeURIComponent(`"${nome.trim()}" processo OR jusbrasil OR tj`);

    setLinksGerados({
      jusbrasil: `https://www.jusbrasil.com.br/busca?q=${encodeURIComponent(nome.trim())}`,
      escavador: `https://www.escavador.com/busca?q=${encodeURIComponent(nome.trim())}&qo=t`,
      google: `https://www.google.com/search?q=${googleQuery}`,
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center text-2xl font-bold">
            ⚖️
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Buscador de Processos</h2>
            <p className="text-slate-500">Gere links diretos para encontrar processos públicos.</p>
          </div>
        </div>

        <form onSubmit={handleGenerate} className="space-y-6">
          <div>
            <label htmlFor="nome" className="block text-sm font-semibold text-slate-700 mb-2">
              Nome Completo ou Razão Social
            </label>
            <input
              id="nome"
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: Joao Batista da Silva"
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all outline-none text-slate-700 font-medium"
              required
              minLength={5}
            />
            <p className="text-xs text-slate-500 mt-2 font-medium">
              🔒 <strong>Compliance LGPD:</strong> Nós <strong>NÃO</strong> salvamos, armazenamos ou enviamos esse nome para nenhum banco de dados nosso. Todo o processamento ocorre no seu navegador (Client-Side) em tempo real, sem logs.
            </p>
          </div>

          <button
            type="submit"
            disabled={!nome.trim() || nome.trim().split(' ').length < 2}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-colors text-lg"
          >
            Gerar Links de Busca
          </button>
        </form>

        {linksGerados && (
          <div className="mt-8 pt-8 border-t border-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <span>🔗</span> Links de Consulta Gerados
            </h3>
            
            <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-xl mb-6">
              <p className="text-amber-800 text-sm">
                <strong>Atenção:</strong> Processos em Segredo de Justiça (como divórcios e pensões envolvendo menores) não aparecerão nessas buscas públicas.
              </p>
            </div>

            <div className="space-y-4">
              <a
                href={linksGerados.jusbrasil}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-xl transition-all group"
              >
                <div>
                  <h4 className="font-bold text-slate-800 group-hover:text-blue-700">Buscar no Jusbrasil</h4>
                  <p className="text-sm text-slate-500">A maior base de dados jurídicos do Brasil.</p>
                </div>
                <span className="text-blue-600 font-bold group-hover:translate-x-1 transition-transform">
                  Abrir ↗
                </span>
              </a>

              <a
                href={linksGerados.escavador}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-xl transition-all group"
              >
                <div>
                  <h4 className="font-bold text-slate-800 group-hover:text-blue-700">Buscar no Escavador</h4>
                  <p className="text-sm text-slate-500">Excelente para achar citações em Diários Oficiais.</p>
                </div>
                <span className="text-blue-600 font-bold group-hover:translate-x-1 transition-transform">
                  Abrir ↗
                </span>
              </a>

              <a
                href={linksGerados.google}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-xl transition-all group"
              >
                <div>
                  <h4 className="font-bold text-slate-800 group-hover:text-blue-700">Pesquisa Avançada no Google</h4>
                  <p className="text-sm text-slate-500">Busca com operadores avançados por menções do nome.</p>
                </div>
                <span className="text-blue-600 font-bold group-hover:translate-x-1 transition-transform">
                  Abrir ↗
                </span>
              </a>
            </div>
          </div>
        )}
      </div>

      <article className="prose prose-slate max-w-none bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
        <h3 className="text-2xl font-bold text-slate-800 mb-4">Como funciona essa ferramenta?</h3>
        <p className="text-slate-600 mb-4">
          A nossa ferramenta de Busca de Processos funciona como um atalho inteligente. No Brasil, os processos judiciais são públicos por determinação da Constituição Federal. Sites como o Jusbrasil e o Escavador indexam diariamente as publicações dos Diários Oficiais de todo o país.
        </p>
        <p className="text-slate-600 mb-4">
          Para evitar que você tenha que pagar por serviços de pesquisa ou navegar em sites complexos de Tribunais de Justiça, nós formatamos as URLs de busca (os links) exatamente no padrão que esses grandes portais exigem. Assim, você cai direto na página de resultados para o nome pesquisado.
        </p>
        <h4 className="text-xl font-bold text-slate-800 mt-6 mb-3">Isso é legal? E a LGPD?</h4>
        <p className="text-slate-600 mb-4">
          <strong>Sim. 100% legal e transparente.</strong> A Constituição Federal do Brasil (Art. 93, inciso IX) estabelece que <strong>processos judiciais são públicos</strong> (salvo exceções como Segredo de Justiça). Por isso, consultar processos de terceiros em portais públicos não é crime.
        </p>
        <div className="bg-emerald-50 border-l-4 border-emerald-500 p-5 rounded-r-lg mb-6">
          <h5 className="font-bold text-emerald-900 mb-2">A nossa adequação à LGPD</h5>
          <p className="text-emerald-800 text-sm">
            Para garantir total blindagem contra as diretrizes da Lei Geral de Proteção de Dados (LGPD), a nossa ferramenta opera sob a arquitetura de <em>Client-Side Processing</em>. Isso significa que:
          </p>
          <ul className="list-disc pl-5 mt-2 text-emerald-800 text-sm space-y-1">
            <li>Nós <strong>não temos banco de dados</strong> armazenando quem pesquisa o quê.</li>
            <li>Nós <strong>não registramos</strong> os nomes digitados no campo de pesquisa.</li>
            <li>Nós somos legalmente apenas um <strong>formatador de URLs</strong>. O seu navegador pega o texto e constrói o link localmente para você clicar. O fluxo de dados sequer chega aos nossos servidores.</li>
          </ul>
        </div>
        <div className="bg-blue-50 p-6 rounded-xl mt-6">
          <h4 className="font-bold text-blue-900 mb-2">Quer ler mais sobre o assunto?</h4>
          <p className="text-blue-800">
            Preparamos um artigo completo explicando passo a passo o que fazer se você descobrir que está sendo processado. Leia nosso artigo:{' '}
            <a href="/artigos/como-saber-se-estou-sendo-processado" className="font-bold underline hover:text-blue-900">
              Como saber se estou sendo processado?
            </a>
          </p>
        </div>
      </article>
    </div>
  );
}
