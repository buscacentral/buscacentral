import React from 'react';
import { Metadata } from 'next';
import PomodoroClient from './PomodoroClient';
import AdPlaceholder from '@/components/AdPlaceholder';

export const metadata: Metadata = {
  title: 'Cronômetro Pomodoro Online: Foco e Produtividade | BuscaCentral',
  description: 'Aumente sua produtividade usando a técnica Pomodoro. Cronômetro online grátis com ciclos de 25 minutos de foco e 5 minutos de pausa.',
  keywords: 'pomodoro, timer pomodoro, cronometro online, tecnica pomodoro, foco, produtividade, tomate, estudar melhor',
};

export default function PomodoroPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
            Cronômetro Pomodoro
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Derrote a procrastinação e mantenha o foco nos estudos ou no trabalho intercalando períodos de atenção plena com pequenas pausas.
          </p>
        </div>

        <PomodoroClient />

        <div className="mt-12">
          <AdPlaceholder position="middle" />
        </div>

        <div className="mt-16 bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">O que é a Técnica Pomodoro?</h2>
          
          <div className="space-y-6 text-slate-600 leading-relaxed">
            <p>
              A Técnica Pomodoro é um método de gerenciamento de tempo desenvolvido por Francesco Cirillo no final dos anos 1980. O nome vem da palavra italiana para "tomate", em referência a um timer de cozinha em formato de tomate que Cirillo usava como estudante universitário.
            </p>

            <h3 className="text-lg font-bold text-slate-800">Como funciona?</h3>
            <ul className="list-decimal pl-5 space-y-2">
              <li>Escolha a tarefa que deseja realizar.</li>
              <li>Inicie o cronômetro para <strong>25 minutos</strong> (um Pomodoro) e trabalhe sem nenhuma distração (sem celular, redes sociais ou conversas).</li>
              <li>Quando o tempo acabar, faça uma <strong>Pausa Curta de 5 minutos</strong> para esticar as pernas, beber água e relaxar o cérebro.</li>
              <li>Repita o ciclo. Após completar 4 "Pomodoros", tire uma <strong>Pausa Longa de 15 a 30 minutos</strong>.</li>
            </ul>

            <h3 className="text-lg font-bold text-slate-800">Por que funciona tão bem?</h3>
            <p>
              O cérebro humano não foi feito para manter atenção focada ininterruptamente por horas. Ao dividir o trabalho em pequenos blocos de 25 minutos, você cria um senso de urgência que inibe a procrastinação. As pausas frequentes previnem a exaustão mental e o burnout, mantendo sua produtividade alta durante todo o dia.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
