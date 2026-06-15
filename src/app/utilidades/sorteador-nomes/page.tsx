import React from 'react';
import { Metadata } from 'next';
import SorteadorNomesClient from './SorteadorNomesClient';
import AdPlaceholder from '@/components/AdPlaceholder';

export const metadata: Metadata = {
  title: 'Sorteador de Nomes e Rifas Online Grátis | BuscaCentral',
  description: 'Faça sorteios aleatórios de nomes, rifas ou listas. Sorteie múltiplos ganhadores ao mesmo tempo. Ideal para Instagram, sala de aula e brincadeiras.',
  keywords: 'sorteador de nomes, sortear nomes, sorteio instagram, sorteador de rifa, roleta de nomes, sorteio aleatorio',
};

export default function SorteadorNomesPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
            Sorteador de Nomes e Rifas
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Cole sua lista de nomes ou números e nós escolheremos um (ou vários) <strong>vencedores aleatoriamente</strong> de forma justa e transparente.
          </p>
        </div>

        <SorteadorNomesClient />

        <div className="mt-12">
          <AdPlaceholder position="middle" />
        </div>

        <div className="mt-16 bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Como fazer um sorteio justo na internet?</h2>
          
          <div className="space-y-6 text-slate-600 leading-relaxed">
            <p>
              Fazer sorteios no Instagram, Whatsapp ou em sala de aula pode gerar desconfiança se não for feito com uma ferramenta confiável. Nosso sorteador utiliza o motor matemático criptográfico do seu próprio navegador (<code>Math.random()</code> combinado com algoritmos de embaralhamento) para garantir 100% de aleatoriedade.
            </p>

            <h3 className="text-lg font-bold text-slate-800">1. Como usar no Instagram?</h3>
            <p>
              Se você fez um post de sorteio e exportou os comentários (existem extensões gratuitas no Chrome que copiam comentários do Instagram), basta colar a lista gigante de nomes de usuários (@) na caixa de texto. Se a regra for "apenas um ganhador", deixe configurado para sortear 1.
            </p>

            <h3 className="text-lg font-bold text-slate-800">2. Posso usar para Rifas?</h3>
            <p>
              Sim! Em vez de digitar nomes, digite os números da sua rifa (ex: 1, 2, 3... 100) um em cada linha. Você pode, inclusive, apagar os números que não foram vendidos antes de fazer o sorteio, garantindo que o número sorteado sempre terá um dono.
            </p>

            <h3 className="text-lg font-bold text-slate-800">Dica de Transparência</h3>
            <p>
              Para que seus seguidores não tenham dúvidas, <strong>grave a tela do seu celular ou computador</strong> no momento em que for clicar no botão "Sortear Agora". O sistema fará uma pequena animação de suspense e revelará o ganhador na tela!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
