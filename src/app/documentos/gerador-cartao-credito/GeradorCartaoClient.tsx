'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { ResultCard } from '@/components/ui/ResultCard';
import CopyButton from '@/components/CopyButton';

type Bandeira = 'Visa' | 'Mastercard' | 'American Express' | 'Discover';

export default function GeradorCartaoClient() {
  const [bandeira, setBandeira] = useState<Bandeira>('Mastercard');
  const [quantidade, setQuantidade] = useState<number>(1);
  const [gerados, setGerados] = useState<{ numero: string; validade: string; cvv: string; bandeira: Bandeira }[]>([]);

  // Implementação do Algoritmo de Luhn para gerar um cartão válido
  const gerarNumeroValido = (prefixo: string, tamanho: number) => {
    let numero = prefixo;
    while (numero.length < tamanho - 1) {
      numero += Math.floor(Math.random() * 10).toString();
    }

    // Calcula o dígito verificador
    let soma = 0;
    for (let i = 0; i < numero.length; i++) {
      let digito = parseInt(numero.charAt(numero.length - 1 - i));
      if (i % 2 === 0) {
        digito *= 2;
        if (digito > 9) digito -= 9;
      }
      soma += digito;
    }

    const digitoVerificador = (soma * 9) % 10;
    return numero + digitoVerificador.toString();
  };

  const gerarCartao = (bandeira: Bandeira) => {
    let numero = '';
    let cvv = '';
    
    if (bandeira === 'Visa') {
      // Visa começa com 4 e tem 16 dígitos
      numero = gerarNumeroValido('4', 16);
      cvv = Math.floor(100 + Math.random() * 900).toString();
    } else if (bandeira === 'Mastercard') {
      // Mastercard começa com 51 a 55 e tem 16 dígitos
      const prefixos = ['51', '52', '53', '54', '55'];
      const prefixo = prefixos[Math.floor(Math.random() * prefixos.length)];
      numero = gerarNumeroValido(prefixo, 16);
      cvv = Math.floor(100 + Math.random() * 900).toString();
    } else if (bandeira === 'American Express') {
      // Amex começa com 34 ou 37 e tem 15 dígitos
      const prefixos = ['34', '37'];
      const prefixo = prefixos[Math.floor(Math.random() * prefixos.length)];
      numero = gerarNumeroValido(prefixo, 15);
      cvv = Math.floor(1000 + Math.random() * 9000).toString(); // Amex tem 4 dígitos no CVV
    } else if (bandeira === 'Discover') {
      // Discover começa com 6011 e tem 16 dígitos
      numero = gerarNumeroValido('6011', 16);
      cvv = Math.floor(100 + Math.random() * 900).toString();
    }

    // Validade: de 1 a 5 anos no futuro
    const agora = new Date();
    const ano = agora.getFullYear() + 1 + Math.floor(Math.random() * 5);
    const mes = String(Math.floor(1 + Math.random() * 12)).padStart(2, '0');
    const validade = `${mes}/${ano.toString().slice(-2)}`;

    // Formatar número
    let formatado = '';
    if (bandeira === 'American Express') {
      formatado = `${numero.slice(0, 4)} ${numero.slice(4, 10)} ${numero.slice(10, 15)}`;
    } else {
      formatado = `${numero.slice(0, 4)} ${numero.slice(4, 8)} ${numero.slice(8, 12)} ${numero.slice(12, 16)}`;
    }

    return { numero: formatado, validade, cvv, bandeira };
  };

  const gerar = () => {
    const novos = [];
    for (let i = 0; i < quantidade; i++) {
      novos.push(gerarCartao(bandeira));
    }
    setGerados(novos);
  };

  return (
    <>
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm mb-8">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 flex items-start gap-3">
          <span className="text-xl">⚠️</span>
          <p className="text-sm text-yellow-800">
            <strong>Aviso Legal:</strong> Estes cartões são gerados com base na regra de validação Mod10 (Luhn) para propósitos de <strong>testes de software e desenvolvimento</strong>. Eles não têm validade comercial, não possuem limite de crédito e não podem ser usados para compras reais.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Bandeira do Cartão</label>
            <select
              value={bandeira}
              onChange={(e) => setBandeira(e.target.value as Bandeira)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium"
            >
              <option value="Visa">Visa</option>
              <option value="Mastercard">Mastercard</option>
              <option value="American Express">American Express</option>
              <option value="Discover">Discover</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Quantidade (Máx 10)</label>
            <input
              type="number"
              min="1"
              max="10"
              value={quantidade}
              onChange={(e) => setQuantidade(Math.min(10, Math.max(1, Number(e.target.value))))}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium"
            />
          </div>
        </div>

        <div className="mt-8 text-center">
          <Button onClick={gerar} className="w-full sm:w-auto px-12 py-3 text-lg">
            Gerar Cartões (Teste)
          </Button>
        </div>
      </div>

      {gerados.length > 0 && (
        <ResultCard title="Cartões Gerados (Apenas para Teste)">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {gerados.map((cartao, idx) => (
              <div key={idx} className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 shadow-lg text-white relative overflow-hidden">
                {/* Elementos visuais do cartão */}
                <div className="absolute top-0 right-0 p-4 opacity-50 text-2xl font-black italic">
                  {cartao.bandeira}
                </div>
                <div className="w-12 h-8 bg-amber-200/80 rounded mb-6 mt-2"></div>
                
                <div className="font-mono text-xl sm:text-2xl tracking-widest mb-4 flex justify-between items-center group">
                  <span>{cartao.numero}</span>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <CopyButton text={cartao.numero.replace(/\s/g, '')} label="Copiar" />
                  </div>
                </div>
                
                <div className="flex gap-8 font-mono text-sm">
                  <div>
                    <span className="block text-slate-400 text-xs mb-1">VALIDADE</span>
                    <span>{cartao.validade}</span>
                  </div>
                  <div>
                    <span className="block text-slate-400 text-xs mb-1">CVV</span>
                    <div className="flex items-center gap-2">
                      <span>{cartao.cvv}</span>
                      <CopyButton text={cartao.cvv} label="" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ResultCard>
      )}
    </>
  );
}
