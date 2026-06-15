import React from 'react';
import { Metadata } from 'next';
import CalculadoraAmorClient from './CalculadoraAmorClient';
import AdPlaceholder from '@/components/AdPlaceholder';

export const metadata: Metadata = {
  title: 'Calculadora do Amor: Teste de Casal com Nomes | BuscaCentral',
  description: 'Descubra a porcentagem de compatibilidade entre você e seu crush! Teste o amor pelos nomes e veja se as estrelas abençoam essa união.',
  keywords: 'calculadora do amor, teste de casal, teste de amor nomes, combinar nomes namorados, compatibilidade nomes, crush',
};

export default function CalculadoraAmorPage() {
  return (
    <div className="min-h-screen bg-rose-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-rose-900 tracking-tight mb-4">
            Calculadora do Amor 💕
          </h1>
          <p className="text-lg text-rose-700/80 max-w-2xl mx-auto">
            Será que vai dar namoro? Digite o seu nome e o do seu crush para descobrir a porcentagem de química entre vocês!
          </p>
        </div>

        <CalculadoraAmorClient />

        <div className="mt-12">
          <AdPlaceholder position="middle" />
        </div>

        <div className="mt-16 bg-white rounded-3xl p-8 shadow-sm border border-rose-100">
          <h2 className="text-2xl font-bold text-rose-900 mb-6 text-center">É brincadeira, mas será que é verdade? 😉</h2>
          
          <div className="space-y-6 text-slate-600 leading-relaxed max-w-2xl mx-auto text-center">
            <p>
              A nossa <strong>Calculadora do Amor</strong> é uma ferramenta divertida projetada para testar a "compatibilidade cósmica" entre duas pessoas utilizando apenas os nomes.
            </p>

            <p>
              Nos bastidores, ela usa um algoritmo de <em>hash</em> que transforma as letras dos nomes em um número único. Isso significa que, não importa quantas vezes você tente, se digitar exatamente os mesmos dois nomes, o resultado sempre será o mesmo! É o destino falando! ✨
            </p>

            <p className="text-sm bg-rose-50 p-4 rounded-xl text-rose-800 border border-rose-100">
              <strong>Atenção:</strong> Lembre-se que o verdadeiro amor não é medido por algoritmos! Se o resultado der baixo, não desista do crush. O que importa é a química da vida real! Divirta-se mandando print do resultado para seus amigos (ou pro próprio crush para puxar assunto!).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
