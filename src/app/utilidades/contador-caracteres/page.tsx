'use client';

import { useState, useMemo } from 'react';

export default function ContadorCaracteres() {
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
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Contador de Caracteres</h1>
      <p className="text-gray-600 mb-8">
        Conte caracteres, palavras, linhas e parágrafos em tempo real.
      </p>

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

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <p className="text-3xl font-bold text-blue-600">{stats.characters}</p>
            <p className="text-sm text-gray-600">Caracteres</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4 text-center">
            <p className="text-3xl font-bold text-green-600">{stats.charactersNoSpaces}</p>
            <p className="text-sm text-gray-600">Sem espaços</p>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 text-center">
            <p className="text-3xl font-bold text-purple-600">{stats.words}</p>
            <p className="text-sm text-gray-600">Palavras</p>
          </div>
          <div className="bg-orange-50 rounded-lg p-4 text-center">
            <p className="text-3xl font-bold text-orange-600">{stats.lines}</p>
            <p className="text-sm text-gray-600">Linhas</p>
          </div>
          <div className="bg-pink-50 rounded-lg p-4 text-center">
            <p className="text-3xl font-bold text-pink-600">{stats.paragraphs}</p>
            <p className="text-sm text-gray-600">Parágrafos</p>
          </div>
          <div className="bg-cyan-50 rounded-lg p-4 text-center">
            <p className="text-3xl font-bold text-cyan-600">{stats.sentences}</p>
            <p className="text-sm text-gray-600">Frases</p>
          </div>
        </div>
      </div>

      <article className="mt-12 prose prose-gray max-w-none">
        <h2>Para que serve?</h2>
        <p>
          O contador de caracteres é útil para redatores, estudantes e profissionais que precisam 
          controlar o tamanho de textos para posts em redes sociais, artigos, descrições de produtos 
          ou qualquer conteúdo com limite de caracteres.
        </p>
      </article>
    </div>
  );
}
