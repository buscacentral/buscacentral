'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import CopyButton from '@/components/CopyButton';

export default function JsonCsvClient() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [modo, setModo] = useState<'json2csv' | 'csv2json'>('json2csv');

  const jsonToCsv = (jsonStr: string) => {
    try {
      const data = JSON.parse(jsonStr);
      if (!Array.isArray(data)) throw new Error('O JSON precisa ser um array de objetos.');
      if (data.length === 0) return '';

      const header = Array.from(new Set(data.flatMap(Object.keys)));
      const rows = data.map(obj => 
        header.map(field => {
          let val = obj[field];
          if (val === null || val === undefined) val = '';
          else if (typeof val === 'object') val = JSON.stringify(val);
          else val = String(val);
          // Escape quotes and wrap in quotes if contains comma
          val = val.replace(/"/g, '""');
          if (val.includes(',') || val.includes('"') || val.includes('\n')) val = `"${val}"`;
          return val;
        }).join(',')
      );

      return [header.join(','), ...rows].join('\n');
    } catch (e: any) {
      throw new Error(`Erro ao fazer parse do JSON: ${e.message}`);
    }
  };

  const csvToJson = (csvStr: string) => {
    try {
      // Basic CSV parser (handles quotes and commas)
      const parseCsvLine = (line: string) => {
        const result = [];
        let current = '';
        let inQuotes = false;
        for (let i = 0; i < line.length; i++) {
          const c = line[i];
          if (c === '"') {
            if (inQuotes && line[i+1] === '"') { current += '"'; i++; } // escaped quote
            else inQuotes = !inQuotes;
          } else if (c === ',' && !inQuotes) {
            result.push(current);
            current = '';
          } else {
            current += c;
          }
        }
        result.push(current);
        return result;
      };

      const lines = csvStr.split('\n').map(l => l.trim()).filter(l => l);
      if (lines.length === 0) return '[]';

      const headers = parseCsvLine(lines[0]);
      const json = [];

      for (let i = 1; i < lines.length; i++) {
        const values = parseCsvLine(lines[i]);
        const obj: Record<string, any> = {};
        headers.forEach((header, index) => {
          let val = values[index];
          if (val !== undefined) {
            // try to parse numbers/booleans if it makes sense, or keep as string
            if (val === 'true') obj[header] = true;
            else if (val === 'false') obj[header] = false;
            else if (val === 'null') obj[header] = null;
            else if (!isNaN(Number(val)) && val.trim() !== '') obj[header] = Number(val);
            else obj[header] = val;
          }
        });
        json.push(obj);
      }

      return JSON.stringify(json, null, 2);
    } catch (e: any) {
      throw new Error(`Erro ao fazer parse do CSV: ${e.message}`);
    }
  };

  const converter = () => {
    setError('');
    setOutput('');
    if (!input.trim()) return;

    try {
      if (modo === 'json2csv') {
        setOutput(jsonToCsv(input));
      } else {
        setOutput(csvToJson(input));
      }
    } catch (e: any) {
      setError(e.message);
    }
  };

  const exampleJson = `[\n  {\n    "nome": "João",\n    "idade": 30,\n    "cidade": "São Paulo"\n  },\n  {\n    "nome": "Maria",\n    "idade": 25,\n    "cidade": "Rio de Janeiro"\n  }\n]`;
  const exampleCsv = `nome,idade,cidade\nJoão,30,São Paulo\nMaria,25,Rio de Janeiro`;

  const carregarExemplo = () => {
    setInput(modo === 'json2csv' ? exampleJson : exampleCsv);
    setError('');
  };

  return (
    <>
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm mb-8">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="bg-slate-100 p-1 rounded-lg inline-flex">
            <button
              onClick={() => { setModo('json2csv'); setInput(''); setOutput(''); setError(''); }}
              className={`px-4 py-2 rounded-md text-sm font-semibold transition-all ${modo === 'json2csv' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-600 hover:bg-slate-200'}`}
            >
              JSON para CSV
            </button>
            <button
              onClick={() => { setModo('csv2json'); setInput(''); setOutput(''); setError(''); }}
              className={`px-4 py-2 rounded-md text-sm font-semibold transition-all ${modo === 'csv2json' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-600 hover:bg-slate-200'}`}
            >
              CSV para JSON
            </button>
          </div>
          <button onClick={carregarExemplo} className="text-sm text-sky-600 hover:text-sky-700 font-medium px-4 py-2">
            Carregar exemplo
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-3">
            <label className="block text-sm font-bold text-slate-700">
              {modo === 'json2csv' ? 'Entrada JSON' : 'Entrada CSV'}
            </label>
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder={modo === 'json2csv' ? 'Cole seu JSON aqui (precisa ser um array)...' : 'Cole seu CSV aqui (com cabeçalho)...'}
              className="w-full h-[400px] p-4 border border-slate-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-sky-500 outline-none resize-none"
              spellCheck="false"
            />
            {error && <p className="text-red-500 text-sm font-semibold bg-red-50 p-3 rounded-lg border border-red-100">{error}</p>}
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="block text-sm font-bold text-slate-700">
                {modo === 'json2csv' ? 'Saída CSV' : 'Saída JSON'}
              </label>
              <CopyButton text={output} label="Copiar Saída" />
            </div>
            <textarea
              value={output}
              readOnly
              placeholder="O resultado aparecerá aqui..."
              className="w-full h-[400px] p-4 border border-slate-300 rounded-lg font-mono text-sm bg-slate-50 outline-none resize-none"
              spellCheck="false"
            />
          </div>
        </div>

        <div className="mt-6">
          <Button onClick={converter} className="w-full sm:w-auto px-8 h-12 text-lg">
            Converter
          </Button>
        </div>
      </div>
    </>
  );
}
