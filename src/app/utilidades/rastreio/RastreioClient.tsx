'use client';

import { useState, useRef } from 'react';
import { buscarRastreio, type EventoRastreio, type ResultadoRastreio } from '@/lib/rastreio-logic';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { ResultCard } from '@/components/ui/ResultCard';
import { EmptyState } from '@/components/ui/EmptyState';

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
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-5 space-y-6">
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <div className="mb-6">
            <label htmlFor="codigo" className="block text-sm font-medium text-slate-700 mb-2">
              Código de Rastreio
            </label>
            <input
              id="codigo"
              ref={inputRef}
              type="text"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value.toUpperCase())}
              onKeyDown={handleKeyDown}
              placeholder="Ex: BR123456789BR"
              spellCheck={false}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 text-lg font-mono uppercase transition-colors"
            />
          </div>

          <Button
            onClick={handleRastrear}
            isLoading={carregando}
            className="w-full"
            size="lg"
          >
            {carregando ? 'Buscando...' : 'Rastrear Objeto'}
          </Button>

          {resultado && !resultado.sucesso && resultado.mensagem && (
            <Alert type="error" message={resultado.mensagem} className="mt-6" />
          )}
        </div>
      </div>

      <div className="lg:col-span-7">
        {resultado && resultado.sucesso && resultado.eventos.length > 0 && (
          <ResultCard title={`Rastreio: ${codigo}`} className="animate-fade-in">
            <div className="relative border-l-2 border-slate-200 pl-6 ml-4 space-y-6 md:space-y-8">
              {resultado.eventos.map((evento: EventoRastreio, idx: number) => (
                <article key={idx} className="relative group">
                  <div className="absolute -left-[31px] bg-sky-500 w-4 h-4 rounded-full border-4 border-white group-hover:scale-125 group-hover:bg-sky-400 transition-transform" />
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 hover:border-sky-200 transition-colors shadow-sm">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <time className="text-sm font-bold text-sky-600">{evento.data}</time>
                      <span className="text-sm text-slate-400 font-medium">{evento.hora}</span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 mb-1">{evento.status}</h3>
                    <p className="text-sm text-slate-600">{evento.local}</p>
                    {evento.detalhe && (
                      <p className="text-sm text-slate-500 mt-2 bg-white p-2 rounded border border-slate-100">{evento.detalhe}</p>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </ResultCard>
        )}

        {resultado && resultado.sucesso && resultado.eventos.length === 0 && resultado.mensagem && (
          <EmptyState
            icon="ℹ️"
            title="Nenhum evento encontrado"
            description={resultado.mensagem}
          />
        )}

        {!resultado && !carregando && (
          <EmptyState
            icon="📦"
            title="Rastreamento de Encomendas"
            description="Digite o código de rastreio à esquerda e clique em 'Rastrear' para ver o histórico de movimentações da sua encomenda."
          />
        )}
      </div>
    </div>
  );
}
