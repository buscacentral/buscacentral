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

    return { characters, charactersNoSpaces, words, lines, paragraphs, sentences };
  }, [text]);

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <div className="mb-4">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Digite ou cole seu texto aqui..."
            rows={8}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        <ResultCard title="Estatísticas do Texto" className="border-0 shadow-none p-0 bg-transparent">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="bg-blue-50/80 border border-blue-100 rounded-xl p-5 text-center transform transition-transform hover:-translate-y-1 hover:shadow-sm">
              <p className="text-4xl font-black text-blue-600 mb-1">{stats.characters}</p>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Caracteres</p>
            </div>
            <div className="bg-green-50/80 border border-green-100 rounded-xl p-5 text-center transform transition-transform hover:-translate-y-1 hover:shadow-sm">
              <p className="text-4xl font-black text-green-600 mb-1">{stats.charactersNoSpaces}</p>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Sem espaços</p>
            </div>
            <div className="bg-purple-50/80 border border-purple-100 rounded-xl p-5 text-center transform transition-transform hover:-translate-y-1 hover:shadow-sm">
              <p className="text-4xl font-black text-purple-600 mb-1">{stats.words}</p>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Palavras</p>
            </div>
            <div className="bg-orange-50/80 border border-orange-100 rounded-xl p-5 text-center transform transition-transform hover:-translate-y-1 hover:shadow-sm">
              <p className="text-4xl font-black text-orange-600 mb-1">{stats.lines}</p>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Linhas</p>
            </div>
            <div className="bg-pink-50/80 border border-pink-100 rounded-xl p-5 text-center transform transition-transform hover:-translate-y-1 hover:shadow-sm">
              <p className="text-4xl font-black text-pink-600 mb-1">{stats.paragraphs}</p>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Parágrafos</p>
            </div>
            <div className="bg-cyan-50/80 border border-cyan-100 rounded-xl p-5 text-center transform transition-transform hover:-translate-y-1 hover:shadow-sm">
              <p className="text-4xl font-black text-cyan-600 mb-1">{stats.sentences}</p>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Frases</p>
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
