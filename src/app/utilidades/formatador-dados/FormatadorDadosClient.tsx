'use client';

import { useState } from 'react';

type Formato = 'cpf' | 'cnpj' | 'telefone' | 'numeros' | 'limpar';

export default function FormatadorDadosClient() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [copiado, setCopiado] = useState(false);

  const formatar = (tipo: Formato) => {
    if (!inputText.trim()) return;

    const linhas = inputText.split('\n');
    
    const linhasFormatadas = linhas.map(linha => {
      // Pega apenas os números da linha
      const numeros = linha.replace(/\D/g, '');
      if (!numeros) return linha; // se não tem número, devolve a linha original

      switch (tipo) {
        case 'cpf':
          if (numeros.length === 11) {
            return numeros.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
          }
          // Tenta preencher com zeros se for menor que 11 e maior que 8
          if (numeros.length >= 9 && numeros.length < 11) {
            const pad = numeros.padStart(11, '0');
            return pad.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
          }
          return linha; // não é cpf válido, não mexe
          
        case 'cnpj':
          if (numeros.length === 14) {
            return numeros.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
          }
          if (numeros.length > 11 && numeros.length < 14) {
             const pad = numeros.padStart(14, '0');
             return pad.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
          }
          return linha;

        case 'telefone':
          if (numeros.length === 11) { // Celular
            return numeros.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
          } else if (numeros.length === 10) { // Fixo
            return numeros.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
          }
          return linha;

        case 'numeros':
          return numeros;

        default:
          return linha;
      }
    });

    setOutputText(linhasFormatadas.join('\n'));
    setCopiado(false);
  };

  const copiarResultado = async () => {
    if (!outputText) return;
    try {
      await navigator.clipboard.writeText(outputText);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch (err) {
      console.error('Falha ao copiar', err);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8 md:p-12 mb-10">
      
      <div className="flex flex-wrap gap-3 mb-8 justify-center">
        <button
          onClick={() => formatar('cpf')}
          className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium rounded-xl transition-colors border border-slate-200 flex items-center"
        >
          <span className="mr-2">📄</span> Formatar CPFs
        </button>
        <button
          onClick={() => formatar('cnpj')}
          className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium rounded-xl transition-colors border border-slate-200 flex items-center"
        >
          <span className="mr-2">🏢</span> Formatar CNPJs
        </button>
        <button
          onClick={() => formatar('telefone')}
          className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium rounded-xl transition-colors border border-slate-200 flex items-center"
        >
          <span className="mr-2">📱</span> Formatar Telefones
        </button>
        <button
          onClick={() => formatar('numeros')}
          className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium rounded-xl transition-colors border border-slate-200 flex items-center"
        >
          <span className="mr-2">🔢</span> Apenas Números
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <div className="flex justify-between items-center mb-3">
            <label className="block text-sm font-bold text-slate-700 uppercase tracking-wider">
              Dados Originais (Cole aqui)
            </label>
            <button 
              onClick={() => { setInputText(''); setOutputText(''); }}
              className="text-xs text-slate-500 hover:text-red-500 font-medium"
            >
              Limpar Tudo
            </button>
          </div>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Cole sua lista aqui. Uma informação por linha.&#10;&#10;Exemplos:&#10;11999999999&#10;12345678909&#10;00.000.000/0001-91"
            className="w-full h-96 p-5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none font-mono text-sm leading-relaxed"
          ></textarea>
        </div>

        <div>
          <div className="flex justify-between items-center mb-3">
            <label className="block text-sm font-bold text-slate-700 uppercase tracking-wider">
              Resultado Formatado
            </label>
            <button 
              onClick={copiarResultado}
              disabled={!outputText}
              className={`text-xs font-bold px-3 py-1 rounded-full flex items-center transition-all ${
                copiado 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-blue-100 text-blue-700 hover:bg-blue-200 disabled:opacity-50 disabled:bg-slate-100 disabled:text-slate-400'
              }`}
            >
              {copiado ? '✓ Copiado!' : 'Copiar Tudo'}
            </button>
          </div>
          <textarea
            value={outputText}
            readOnly
            placeholder="O resultado formatado aparecerá aqui..."
            className="w-full h-96 p-5 bg-slate-900 border border-slate-800 text-green-400 rounded-2xl outline-none resize-none font-mono text-sm leading-relaxed"
          ></textarea>
        </div>
      </div>
    </div>
  );
}
