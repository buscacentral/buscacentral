'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { ResultCard } from '@/components/ui/ResultCard';

export default function ValidadorEmailClient() {
  const [email, setEmail] = useState<string>('');
  
  const [resultado, setResultado] = useState<{
    valido: boolean;
    format: boolean;
    disposable: boolean;
    suggestion: string | null;
    domain: string;
    username: string;
  } | null>(null);

  const commonTypos: Record<string, string> = {
    'gmil.com': 'gmail.com',
    'gmal.com': 'gmail.com',
    'gmail.con': 'gmail.com',
    'hotmal.com': 'hotmail.com',
    'hotmai.com': 'hotmail.com',
    'outlok.com': 'outlook.com',
    'yaho.com': 'yahoo.com',
    'yahoo.con': 'yahoo.com',
  };

  const disposableDomains = [
    'mailinator.com', '10minutemail.com', 'tempmail.com', 'guerrillamail.com', 'yopmail.com', 'trashmail.com'
  ];

  const validar = () => {
    if (!email.trim()) return;

    const trimmedEmail = email.trim().toLowerCase();
    
    // Fallback regex (simpler, better for JS)
    const simpleRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    const isFormatValid = simpleRegex.test(trimmedEmail);
    
    let username = '';
    let domain = '';
    let isDisposable = false;
    let suggestion = null;

    if (isFormatValid) {
      const parts = trimmedEmail.split('@');
      username = parts[0];
      domain = parts[1];
      
      // Check for disposable
      if (disposableDomains.some(d => domain.includes(d))) {
        isDisposable = true;
      }

      // Check for typos
      if (commonTypos[domain]) {
        suggestion = `${username}@${commonTypos[domain]}`;
      }
    }

    setResultado({
      valido: isFormatValid && !isDisposable && !suggestion, // Strict validation
      format: isFormatValid,
      disposable: isDisposable,
      suggestion,
      domain,
      username
    });
  };

  return (
    <>
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm mb-8">
        <div className="mb-6">
          <label className="block text-sm font-bold text-slate-700 mb-2">Endereço de E-mail</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && validar()}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium text-lg"
            placeholder="nome@exemplo.com"
            spellCheck="false"
          />
        </div>

        <div className="text-center">
          <Button onClick={validar} className="w-full sm:w-auto px-12 py-3 text-lg" disabled={!email.trim()}>
            Analisar E-mail
          </Button>
        </div>
      </div>

      {resultado && (
        <ResultCard title="Resultado da Análise">
          <div className={`border rounded-xl p-6 text-center mb-6 ${
            resultado.valido 
              ? 'bg-emerald-50 border-emerald-200' 
              : resultado.format && !resultado.disposable 
                ? 'bg-yellow-50 border-yellow-200'
                : 'bg-red-50 border-red-200'
          }`}>
            <div className="text-5xl mb-4">
              {resultado.valido ? '✅' : resultado.format && !resultado.disposable ? '⚠️' : '❌'}
            </div>
            <p className="text-lg font-bold text-slate-800 mb-1">
              {resultado.valido ? 'E-mail Válido' : !resultado.format ? 'Formato Inválido' : resultado.disposable ? 'E-mail Descartável' : 'Atenção ao Domínio'}
            </p>
            <p className="text-sm text-slate-600">
              {resultado.valido 
                ? 'A sintaxe do e-mail está correta e parece ser de um provedor confiável.' 
                : !resultado.format 
                  ? 'O endereço não segue a estrutura correta (deve conter @ e ponto).' 
                  : resultado.disposable 
                    ? 'Este é um e-mail temporário, evite aceitá-lo em cadastros importantes.' 
                    : 'A estrutura está correta, mas detectamos um possível erro de digitação.'}
            </p>
          </div>

          {resultado.suggestion && (
            <div className="bg-sky-50 border border-sky-100 rounded-lg p-4 mb-6 flex items-start gap-3">
              <span className="text-xl">💡</span>
              <div>
                <p className="text-sm text-sky-800 font-bold mb-1">Você quis dizer:</p>
                <p className="text-lg font-mono text-sky-700">{resultado.suggestion} ?</p>
              </div>
            </div>
          )}

          {resultado.format && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <span className="block text-xs font-bold text-slate-400 uppercase mb-1">Nome de Usuário</span>
                <span className="font-mono text-slate-800 font-medium">{resultado.username}</span>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                <span className="block text-xs font-bold text-slate-400 uppercase mb-1">Domínio</span>
                <span className="font-mono text-slate-800 font-medium">@{resultado.domain}</span>
              </div>
            </div>
          )}
        </ResultCard>
      )}
    </>
  );
}
