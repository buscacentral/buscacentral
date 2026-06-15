import React from 'react';
import { Metadata } from 'next';
import IdadeGestacionalClient from './IdadeGestacionalClient';
import AdPlaceholder from '@/components/AdPlaceholder';

export const metadata: Metadata = {
  title: 'Calculadora de Idade Gestacional (DUM e DPP) | BuscaCentral',
  description: 'Descubra de quantas semanas e dias você está grávida usando a Data da Última Menstruação (DUM) ou a Data Provável do Parto (DPP). Grátis e online.',
  keywords: 'idade gestacional, calculadora gravidez, calculadora dum, calculadora dpp, semanas de gravidez, quando o bebe nasce',
};

export default function IdadeGestacionalPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
            Calculadora de Idade Gestacional
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Descubra com precisão de <strong>quantas semanas e dias</strong> você está e acompanhe a evolução da sua gravidez trimestre a trimestre.
          </p>
        </div>

        <IdadeGestacionalClient />

        <div className="mt-12">
          <AdPlaceholder position="middle" />
        </div>

        <div className="mt-16 bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Como calcular o tempo de gravidez?</h2>
          
          <div className="space-y-6 text-slate-600 leading-relaxed">
            <p>
              Saber o tempo exato de gravidez (idade gestacional) é fundamental para acompanhar o desenvolvimento do bebê e agendar os exames pré-natais nas semanas corretas.
            </p>

            <h3 className="text-lg font-bold text-slate-800">O que é a DUM? (Data da Última Menstruação)</h3>
            <p>
              A DUM é o <strong>primeiro dia</strong> em que ocorreu o sangramento da sua última menstruação antes de você descobrir que estava grávida. Médicos do mundo inteiro utilizam essa data como o "dia zero" da gravidez, pois é uma data que a maioria das mulheres consegue lembrar com precisão. O cálculo médico considera que a gestação dura, em média, 280 dias (40 semanas) a partir da DUM.
            </p>

            <h3 className="text-lg font-bold text-slate-800">O que é a DPP? (Data Provável do Parto)</h3>
            <p>
              A DPP é a data estipulada para o nascimento do bebê. Geralmente, essa data é definida de forma muito precisa através do seu <strong>primeiro exame de ultrassom</strong> (ultrassom obstétrico inicial ou morfológico de primeiro trimestre). Se o médico já te passou essa data no ultrassom, utilizar a opção de cálculo por DPP costuma ser mais preciso do que a DUM (especialmente se o seu ciclo menstrual for irregular).
            </p>

            <h3 className="text-lg font-bold text-slate-800">Os Trimestres da Gestação</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>1º Trimestre:</strong> Vai da 1ª até a 13ª semana. Fase de maior desenvolvimento dos órgãos do bebê e quando os sintomas de enjoo e sono na mãe são mais fortes.</li>
              <li><strong>2º Trimestre:</strong> Vai da 14ª até a 26ª semana. Fase onde a barriga começa a aparecer e os movimentos do bebê começam a ser sentidos. É considerado o período mais "tranquilo" da gestação.</li>
              <li><strong>3º Trimestre:</strong> Vai da 27ª semana até o parto. Fase de ganho de peso e amadurecimento dos pulmões do bebê.</li>
            </ul>

            <div className="bg-pink-50 p-4 rounded-lg border border-pink-100 mt-6">
              <p className="text-sm text-pink-800">
                <strong>⚠️ Aviso Importante:</strong> Esta calculadora é uma ferramenta de apoio e não substitui o acompanhamento médico profissional. Siga sempre as orientações do seu obstetra e realize todos os exames do pré-natal.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
