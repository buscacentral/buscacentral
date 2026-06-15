'use client';

import { useState } from 'react';
import CopyButton from '@/components/CopyButton';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { ResultCard } from '@/components/ui/ResultCard';

export default function PIXCopiaColaClient() {
  const [chave, setChave] = useState('');
  const [valor, setValor] = useState('');
  const [nome, setNome] = useState('');
  const [cidade, setCidade] = useState('');
  const [txid, setTxid] = useState('');
  const [pixCode, setPixCode] = useState('');
  const [error, setError] = useState('');

  const generatePIX = () => {
    setError('');

    if (!chave.trim() || !nome.trim() || !cidade.trim()) {
      setError('Preencha pelo menos: chave PIX, nome e cidade');
      return;
    }

    const formatField = (id: string, value: string) => {
      const len = value.length.toString().padStart(2, '0');
      return `${id}${len}${value}`;
    };

    const gui = formatField('00', 'BR.GOV.BCB.PIX');
    const key = formatField('01', chave);
    const mai = formatField('26', gui + key);

    const valorNum = valor ? parseFloat(valor.replace(',', '.')).toFixed(2) : '';
    const tx = txid || '***';

    let payload = '';
    payload += formatField('00', '01');
    payload += mai;
    if (valorNum) {
      payload += formatField('54', valorNum);
    }
    payload += formatField('53', '986');
    payload += formatField('58', 'BR');
    payload += formatField('59', nome.substring(0, 25));
    payload += formatField('60', cidade.substring(0, 15));
    payload += formatField('62', formatField('05', tx));

    const crc = calculateCRC16(payload + '6304');
    payload += `6304${crc}`;

    setPixCode(payload);
  };

  const calculateCRC16 = (data: string): string => {
    let crc = 0xFFFF;
    for (let i = 0; i < data.length; i++) {
      crc ^= data.charCodeAt(i) << 8;
      for (let j = 0; j < 8; j++) {
        if (crc & 0x8000) {
          crc = (crc << 1) ^ 0x1021;
        } else {
          crc <<= 1;
        }
        crc &= 0xFFFF;
      }
    }
    return crc.toString(16).toUpperCase().padStart(4, '0');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-6 space-y-6">
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          {error && <Alert variant="error" className="mb-6">{error}</Alert>}
          
          <div className="space-y-4 mb-6">
            <div>
              <label htmlFor="chave" className="block text-sm font-medium text-slate-700 mb-2">
                Chave PIX <span className="text-rose-500">*</span>
              </label>
              <input
                id="chave"
                type="text"
                value={chave}
                onChange={(e) => setChave(e.target.value)}
                placeholder="CPF, CNPJ, email ou telefone"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition-colors"
              />
            </div>
            <div>
              <label htmlFor="valor" className="block text-sm font-medium text-slate-700 mb-2">
                Valor <span className="text-slate-400 font-normal">(opcional)</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium">R$</span>
                <input
                  id="valor"
                  type="text"
                  value={valor}
                  onChange={(e) => setValor(e.target.value)}
                  placeholder="0,00"
                  className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition-colors"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="nome" className="block text-sm font-medium text-slate-700 mb-2">
                  Recebedor <span className="text-rose-500">*</span>
                </label>
                <input
                  id="nome"
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Nome Completo"
                  maxLength={25}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition-colors"
                />
              </div>
              <div>
                <label htmlFor="cidade" className="block text-sm font-medium text-slate-700 mb-2">
                  Cidade <span className="text-rose-500">*</span>
                </label>
                <input
                  id="cidade"
                  type="text"
                  value={cidade}
                  onChange={(e) => setCidade(e.target.value)}
                  placeholder="São Paulo"
                  maxLength={15}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition-colors"
                />
              </div>
            </div>
            <div>
              <label htmlFor="txid" className="block text-sm font-medium text-slate-700 mb-2">
                ID da Transação <span className="text-slate-400 font-normal">(opcional)</span>
              </label>
              <input
                id="txid"
                type="text"
                value={txid}
                onChange={(e) => setTxid(e.target.value)}
                placeholder="Deixe vazio para usar ***"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 transition-colors"
              />
            </div>
          </div>

          <Button onClick={generatePIX} className="w-full" size="lg">
            Gerar PIX Copia e Cola
          </Button>
        </div>
        
        <Alert 
          type="warning" 
          message="Esta ferramenta gera códigos PIX para fins educacionais e de teste. Use com responsabilidade. O código gerado segue o padrão EMV QR Code do Banco Central." 
        />
      </div>

      <div className="lg:col-span-6">
        {pixCode && (
          <ResultCard title="Código PIX Gerado">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-700 uppercase tracking-wider">PIX Copia e Cola</span>
                <CopyButton text={pixCode} />
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1 h-full bg-sky-500 rounded-l-xl"></div>
                <p className="font-mono text-sm text-slate-800 break-all leading-relaxed relative z-10 selection:bg-sky-200 selection:text-sky-900">
                  {pixCode}
                </p>
                <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent pointer-events-none z-0"></div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-slate-100 flex justify-center">
                 <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                   {/* In a real app we could render a QR code here using a library like qrcode.react */}
                   <div className="w-32 h-32 bg-slate-100 rounded-lg flex items-center justify-center border-2 border-dashed border-slate-300">
                     <span className="text-4xl opacity-50">📱</span>
                   </div>
                   <p className="text-xs text-center text-slate-500 mt-3 font-medium">QR Code Simulado</p>
                 </div>
              </div>
            </div>
          </ResultCard>
        )}
      </div>
    </div>
  );
}
