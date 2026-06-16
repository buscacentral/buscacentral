import React from 'react';
import { Metadata } from 'next';
import CalculadoraAmorClient from './CalculadoraAmorClient';
import AdPlaceholder from '@/components/AdPlaceholder';
import { getToolLastUpdated } from '@/lib/tools';

export const metadata: Metadata = {
  title: 'Calculadora do Amor: Teste de Casal com Nomes | BuscaCentral',
  description: 'Descubra a porcentagem de compatibilidade entre você e seu crush! Teste o amor pelos nomes e veja se as estrelas abençoam essa união.',
  keywords: 'calculadora do amor, teste de casal, teste de amor nomes, combinar nomes namorados, compatibilidade nomes, crush',
};

const faqItems = [
  {
    question: 'Como funciona a Calculadora do Amor?',
    answer: 'Ela combina os dois nomes digitados e aplica um algoritmo de hash que transforma as letras em um número de 0 a 100. Como o cálculo é determinístico, o mesmo par de nomes sempre gera a mesma porcentagem de compatibilidade.',
  },
  {
    question: 'O teste de amor pelos nomes é verdadeiro?',
    answer: 'Não. É uma brincadeira sem qualquer base científica. O resultado serve apenas para diversão e para puxar assunto com o crush ou amigos. O amor de verdade não é medido por algoritmos.',
  },
  {
    question: 'Por que o resultado é sempre o mesmo para os mesmos nomes?',
    answer: 'Porque o cálculo é baseado nas letras dos nomes, e não em sorteio aleatório. Assim, "Romeu + Julieta" terá sempre a mesma porcentagem, não importa quantas vezes você teste.',
  },
  {
    question: 'A calculadora guarda os nomes que eu digito?',
    answer: 'Não. Todo o cálculo acontece no seu navegador (client-side). Nenhum nome é enviado ou armazenado em servidores.',
  },
];

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqItems.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: { '@type': 'Answer', text: item.answer },
  })),
};

function formatUpdatedDate(iso: string): string {
  const date = new Date(`${iso}T12:00:00`);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
}

export default function CalculadoraAmorPage() {
  const lastUpdated = getToolLastUpdated('/utilidades/calculadora-amor');

  return (
    <div className="min-h-screen bg-rose-50 py-12 px-4 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-rose-900 tracking-tight mb-4">
            Calculadora do Amor 💕
          </h1>
          <p className="text-lg text-rose-700/80 max-w-2xl mx-auto">
            Será que vai dar namoro? Digite o seu nome e o do seu crush para descobrir a porcentagem de química entre vocês!
          </p>
          {lastUpdated && (
            <p className="mt-3 inline-flex items-center gap-1.5 text-sm text-rose-700/70">
              <span aria-hidden="true">🗓️</span>
              Atualizado em{' '}
              <time dateTime={lastUpdated} className="font-medium">
                {formatUpdatedDate(lastUpdated)}
              </time>
            </p>
          )}
        </div>

        <CalculadoraAmorClient />

        <div className="mt-12">
          <AdPlaceholder position="middle" />
        </div>

        <div className="mt-16 bg-white rounded-3xl p-8 shadow-sm border border-rose-100">
          <h2 className="text-2xl font-bold text-rose-900 mb-6 text-center">O que é a Calculadora do Amor?</h2>

          <div className="space-y-6 text-slate-600 leading-relaxed max-w-2xl mx-auto text-center">
            <p>
              A nossa <strong>Calculadora do Amor</strong> é uma ferramenta divertida projetada para testar a &quot;compatibilidade cósmica&quot; entre duas pessoas utilizando apenas os nomes.
            </p>

            <p>
              Nos bastidores, ela usa um algoritmo de <em>hash</em> que transforma as letras dos nomes em um número único. Isso significa que, não importa quantas vezes você tente, se digitar exatamente os mesmos dois nomes, o resultado sempre será o mesmo! É o destino falando! ✨
            </p>

            <p className="text-sm bg-rose-50 p-4 rounded-xl text-rose-800 border border-rose-100">
              <strong>Atenção:</strong> Lembre-se que o verdadeiro amor não é medido por algoritmos! Se o resultado der baixo, não desista do crush. O que importa é a química da vida real! Divirta-se mandando print do resultado para seus amigos (ou pro próprio crush para puxar assunto!).
            </p>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-3xl p-8 shadow-sm border border-rose-100">
          <h2 className="text-2xl font-bold text-rose-900 mb-6 text-center">Como usar o teste de amor</h2>
          <ol className="max-w-2xl mx-auto space-y-3 text-slate-600 leading-relaxed list-decimal list-inside">
            <li>Digite o <strong>seu nome</strong> no primeiro campo.</li>
            <li>Digite o <strong>nome do seu crush</strong> (ou do seu par) no segundo campo.</li>
            <li>Clique em <strong>&quot;Calcular Amor!&quot;</strong> e aguarde as estrelas se alinharem.</li>
            <li>Veja a porcentagem de compatibilidade e a mensagem do casal — depois é só mandar o print! 📲</li>
          </ol>
        </div>

        <div className="mt-8 bg-white rounded-3xl p-8 shadow-sm border border-rose-100">
          <h2 className="text-2xl font-bold text-rose-900 mb-6 text-center">Perguntas Frequentes</h2>
          <div className="max-w-2xl mx-auto space-y-6">
            {faqItems.map((item) => (
              <div key={item.question}>
                <h3 className="font-bold text-rose-900 mb-1">{item.question}</h3>
                <p className="text-slate-600 leading-relaxed">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
