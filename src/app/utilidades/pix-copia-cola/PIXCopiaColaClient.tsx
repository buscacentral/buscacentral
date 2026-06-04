'use client';

import { useState } from 'react';
import CopyButton from '@/components/CopyButton';

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
    <>
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <div className="space-y-4 mb-6">
          <div>
            <label htmlFor="chave" className="block text-sm font-medium text-gray-700 mb-2">
              Chave PIX *
            </label>
            <input
              id="chave"
              type="text"
              value={chave}
              onChange={(e) => setChave(e.target.value)}
              placeholder="CPF, CNPJ, email ou telefone"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="valor" className="block text-sm font-medium text-gray-700 mb-2">
              Valor (opcional)
            </label>
            <input
              id="valor"
              type="text"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              placeholder="0.00"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="nome" className="block text-sm font-medium text-gray-700 mb-2">
                Nome do recebedor *
              </label>
              <input
                id="nome"
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Nome Completo"
                maxLength={25}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="cidade" className="block text-sm font-medium text-gray-700 mb-2">
                Cidade *
              </label>
              <input
                id="cidade"
                type="text"
                value={cidade}
                onChange={(e) => setCidade(e.target.value)}
                placeholder="Sao Paulo"
                maxLength={15}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <label htmlFor="txid" className="block text-sm font-medium text-gray-700 mb-2">
              ID da transação (opcional)
            </label>
            <input
              id="txid"
              type="text"
              value={txid}
              onChange={(e) => setTxid(e.target.value)}
              placeholder="Deixe vazio para usar ***"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <button
          onClick={generatePIX}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors mb-6"
        >
          Gerar PIX Copia e Cola
        </button>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 mb-4">
            ❌ {error}
          </div>
        )}

        {pixCode && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Código PIX:</span>
              <CopyButton text={pixCode} />
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="font-mono text-xs text-gray-900 break-all">{pixCode}</p>
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-sm text-yellow-800">
          <strong>Aviso:</strong> Esta ferramenta gera códigos PIX para fins educacionais e de teste. 
          Use com responsabilidade. O código gerado segue o padrão EMV QR Code do Banco Central.
        </p>
      </div>
    </>
  );
}
