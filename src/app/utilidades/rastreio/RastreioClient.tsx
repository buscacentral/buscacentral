'use client';

import { useState, useRef } from 'react';
import { buscarRastreio, type EventoRastreio, type ResultadoRastreio } from '@/lib/rastreio-logic';

export default function RastreioClient() {
  const [codigo, setCodigo] = useState('');
  const [resultado, setResultado] = useState<ResultadoRastreio | null>(null);
  const [carregando, setCarregando] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleRastrear = async () => {
    if (!codigo.trim()) {
      setResultado({ codigo: '', sucesso: false, mensagem: 'Por favor, digite um código de rastreio.', eventos: [] });
      return;
    }

    setCarregando(true);
    setResultado(null);

    const res = await buscarRastreio(codigo);
    setResultado(res);
    setCarregando(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleRastrear();
  };

  return (
    <section className="w-full max-w-4xl mx-auto px-4 sm:px-6">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-6">
        {/* Campo de busca */}
        <div className="max-w-xl mx-auto mb-8">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              ref={inputRef}
              type="text"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value.toUpperCase())}
              onKeyDown={handleKeyDown}
              placeholder="Ex: BR123456789BR"
              aria-label="Código de rastreio"
              className="flex-1 py-3 px-4 bg-slate-50 border border-slate-300 rounded-xl text-base md:text-lg font-semibold uppercase focus:ring-2 focus:ring-sky-500 outline-none transition"
            />
            <button
              onClick={handleRastrear}
              disabled={carregando}
              className="px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white font-bold rounded-xl text-base transition shadow-sm active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {carregando ? 'Buscando...' : 'Rastrear Objeto'}
            </button>
          </div>

          {resultado && !resultado.sucesso && resultado.mensagem && (
            <p className="text-sm md:text-base text-rose-600 font-medium mt-3" role="alert">
              {resultado.mensagem}
            </p>
          )}
        </div>

        {/* Timeline */}
        {resultado && resultado.sucesso && resultado.eventos.length > 0 && (
          <div className="max-w-2xl mx-auto">
            <h2 className="text-lg md:text-xl font-bold text-slate-900 mb-4">
              Histórico de Movimentações
            </h2>
            <div className="relative border-l-2 border-slate-200 pl-6 ml-4 space-y-6 md:space-y-8">
              {resultado.eventos.map((evento: EventoRastreio, idx: number) => (
                <article key={idx} className="relative">
                  <div className="absolute -left-[31px] bg-sky-500 w-4 h-4 rounded-full border-4 border-white" />
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <time className="text-sm font-bold text-sky-600">{evento.data}</time>
                      <span className="text-sm text-slate-400">{evento.hora}</span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 mb-1">{evento.status}</h3>
                    <p className="text-sm text-slate-500">{evento.local}</p>
                    {evento.detalhe && (
                      <p className="text-sm text-slate-400 mt-1">{evento.detalhe}</p>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

        {/* Estado vazio com mensagem */}
        {resultado && resultado.sucesso && resultado.eventos.length === 0 && resultado.mensagem && (
          <div className="max-w-2xl mx-auto text-center py-8">
            <p className="text-base text-slate-500">{resultado.mensagem}</p>
          </div>
        )}

        {/* Estado inicial */}
        {!resultado && !carregando && (
          <div className="max-w-2xl mx-auto text-center py-8">
            <p className="text-base text-slate-400">
              Digite o código de rastreio e clique em &quot;Rastrear Objeto&quot; para ver o histórico de movimentações.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
