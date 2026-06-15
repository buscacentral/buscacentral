'use client';

import { useState, useMemo } from 'react';
import { ResultCard } from '@/components/ui/ResultCard';

export default function ContadorCaracteresClient() {
  const [text, setText] = useState('');

  const stats = useMemo(() => {
    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s/g, '').length;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const lines = text ? text.split('\n').length : 0;
    const paragraphs = text.trim() ? text.trim().split(/\n\s*\n/).length : 0;
    const sentences = text.trim() ? text.split(/[.!?]+/).filter(s => s.trim()).length : 0;
    
    // Average reading speed: 250 words per minute
    // Average speaking speed: 130 words per minute
    const readingTimeMin = Math.max(1, Math.ceil(words / 250));
    const speakingTimeMin = Math.max(1, Math.ceil(words / 130));

    return { characters, charactersNoSpaces, words, lines, paragraphs, sentences, readingTimeMin, speakingTimeMin };
  }, [text]);

  return (
    <>
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <div className="mb-4">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Digite ou cole seu texto aqui..."
            rows={8}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-mono text-sm"
          />
        </div>

        <ResultCard title="Estatísticas do Texto" className="border-0 shadow-none p-0 bg-transparent">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 text-center shadow-sm">
              <p className="text-4xl font-black text-blue-600 mb-1">{stats.characters}</p>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Caracteres</p>
            </div>
            <div className="bg-purple-50 border border-purple-100 rounded-xl p-5 text-center shadow-sm">
              <p className="text-4xl font-black text-purple-600 mb-1">{stats.words}</p>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Palavras</p>
            </div>
            <div className="bg-pink-50 border border-pink-100 rounded-xl p-5 text-center shadow-sm">
              <p className="text-4xl font-black text-pink-600 mb-1">{stats.paragraphs}</p>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Parágrafos</p>
            </div>
            <div className="bg-orange-50 border border-orange-100 rounded-xl p-5 text-center shadow-sm">
              <p className="text-4xl font-black text-orange-600 mb-1">{stats.sentences}</p>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Frases</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-600">Tempo de Leitura (~250 ppm)</span>
              <span className="font-bold text-emerald-700">{stats.readingTimeMin} min</span>
            </div>
            <div className="bg-sky-50 border border-sky-100 rounded-xl p-4 flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-600">Tempo de Fala (~130 ppm)</span>
              <span className="font-bold text-sky-700">{stats.speakingTimeMin} min</span>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-600">Caracteres sem espaços</span>
              <span className="font-bold text-slate-700">{stats.charactersNoSpaces}</span>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-600">Linhas</span>
              <span className="font-bold text-slate-700">{stats.lines}</span>
            </div>
          </div>
        </ResultCard>
      </div>

      <article className="mt-12 prose prose-gray max-w-none">
        <h2>Para que serve?</h2>
        <p>
          O contador de caracteres é útil para redatores, estudantes e profissionais que precisam 
          controlar o tamanho de textos para posts em redes sociais, artigos, descrições de produtos 
          ou qualquer conteúdo com limite de caracteres.
        </p>
      </article>
    </>
  );
}
