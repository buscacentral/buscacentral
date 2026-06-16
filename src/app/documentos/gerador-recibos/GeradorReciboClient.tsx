'use client';

import React, { useState, useRef } from 'react';

export default function GeradorReciboClient() {
  const [valor, setValor] = useState('');
  const [recebedorNome, setRecebedorNome] = useState('');
  const [recebedorDoc, setRecebedorDoc] = useState('');
  const [pagadorNome, setPagadorNome] = useState('');
  const [pagadorDoc, setPagadorDoc] = useState('');
  const [referente, setReferente] = useState('');
  const [cidade, setCidade] = useState('');
  const [data, setData] = useState(new Date().toISOString().split('T')[0]);

  const extenso = (v: string) => {
    // A simple placeholder for "valor por extenso" just to make it look professional
    // Usually requires a complex function to convert numbers to Portuguese words,
    // but we will let the user type it or leave a blank space for manual writing if needed,
    // or just display the formatted currency. For this basic tool, we will just format.
    const num = parseFloat(v);
    if (isNaN(num)) return '';
    return num.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200">
      
      {/* Aviso Print Area */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body * {
            visibility: hidden;
          }
          #print-area, #print-area * {
            visibility: visible;
          }
          #print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 20px;
          }
          .no-print {
            display: none !important;
          }
        }
      `}} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 no-print">
        {/* Formulário */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <span className="text-2xl">📝</span> Preencher Dados
          </h2>

          <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Valor do Recibo (R$)</label>
              <input
                type="number"
                step="0.01"
                className="w-full p-3 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                placeholder="Ex: 1500.00"
                value={valor}
                onChange={(e) => setValor(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Nome do Pagador</label>
                <input
                  type="text"
                  className="w-full p-3 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                  placeholder="Quem está pagando"
                  value={pagadorNome}
                  onChange={(e) => setPagadorNome(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">CPF/CNPJ do Pagador</label>
                <input
                  type="text"
                  className="w-full p-3 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                  placeholder="Opcional"
                  value={pagadorDoc}
                  onChange={(e) => setPagadorDoc(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Nome do Recebedor</label>
                <input
                  type="text"
                  className="w-full p-3 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                  placeholder="Quem está recebendo"
                  value={recebedorNome}
                  onChange={(e) => setRecebedorNome(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">CPF/CNPJ do Recebedor</label>
                <input
                  type="text"
                  className="w-full p-3 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                  placeholder="Opcional"
                  value={recebedorDoc}
                  onChange={(e) => setRecebedorDoc(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Referente a</label>
              <textarea
                className="w-full p-3 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                placeholder="Ex: Pagamento de serviços prestados de consultoria..."
                rows={3}
                value={referente}
                onChange={(e) => setReferente(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Cidade de Emissão</label>
                <input
                  type="text"
                  className="w-full p-3 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                  placeholder="Sua cidade"
                  value={cidade}
                  onChange={(e) => setCidade(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Data</label>
                <input
                  type="date"
                  className="w-full p-3 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                  value={data}
                  onChange={(e) => setData(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Preview do Recibo */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <span className="text-2xl">👁️</span> Visualização
            </h2>
            <button
              onClick={handlePrint}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
            >
              <span>🖨️</span> Imprimir PDF
            </button>
          </div>

          <div id="print-area" className="bg-white border-2 border-slate-800 p-8 rounded-none shadow-md max-w-[800px] mx-auto text-black font-sans">
            <div className="flex justify-between items-center mb-8 border-b-2 border-slate-800 pb-4">
              <h1 className="text-4xl font-extrabold uppercase tracking-widest text-slate-900">RECIBO</h1>
              <div className="border-2 border-slate-800 p-3 rounded-md min-w-[200px] text-center bg-slate-50">
                <span className="text-sm font-bold text-slate-500 block uppercase mb-1">Valor</span>
                <span className="text-2xl font-bold text-slate-900">{valor ? extenso(valor) : 'R$ 0,00'}</span>
              </div>
            </div>

            <div className="space-y-6 text-lg leading-relaxed text-justify">
              <p>
                Recebi(emos) de <strong className="uppercase border-b border-dashed border-slate-400 pb-1 px-2 break-all">{pagadorNome || '_________________________________'}</strong>
                {pagadorDoc && <span> inscrito(a) no CPF/CNPJ sob o nº <strong className="border-b border-dashed border-slate-400 pb-1 px-2 break-all">{pagadorDoc}</strong>,</span>}
              </p>
              
              <p>
                a importância supra de <strong className="uppercase border-b border-dashed border-slate-400 pb-1 px-2 break-all">{valor ? extenso(valor) : '__________________________________________________'}</strong>
              </p>

              <p>
                referente a <strong className="border-b border-dashed border-slate-400 pb-1 px-2 break-all">{referente || '____________________________________________________________________'}</strong>.
              </p>
              
              <p>
                Para maior clareza, firmo o presente recibo para que produza os seus efeitos legais.
              </p>
            </div>

            <div className="mt-16 text-right">
              <p className="text-lg">
                <span className="border-b border-dashed border-slate-400 pb-1 px-2">{cidade || '__________________'}</span>,{' '}
                <span className="border-b border-dashed border-slate-400 pb-1 px-2">
                  {data ? new Date(data).toLocaleDateString('pt-BR') : '___/___/_____'}
                </span>
              </p>
            </div>

            <div className="mt-20 flex flex-col items-center justify-center">
              <div className="w-96 border-t-2 border-slate-800 mb-2"></div>
              <p className="text-xl font-bold uppercase">{recebedorNome || 'Nome do Recebedor'}</p>
              {recebedorDoc && <p className="text-md text-slate-600">CPF/CNPJ: {recebedorDoc}</p>}
              <p className="text-sm text-slate-500 mt-1">Assinatura do Recebedor</p>
            </div>
          </div>
          
          <p className="text-sm text-slate-500 text-center">Dica: Ao clicar em imprimir, o sistema ocultará os menus e botões, gerando um PDF perfeito.</p>
        </div>

      </div>
    </div>
  );
}
