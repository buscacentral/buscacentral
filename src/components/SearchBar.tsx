'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

const tools = [
  { name: 'Gerador de CPF', path: '/documentos/gerador-cpf', category: 'Documentos', keywords: ['cpf', 'gerar', 'documento'] },
  { name: 'Validador de CPF', path: '/documentos/validador-cpf', category: 'Documentos', keywords: ['cpf', 'validar', 'documento'] },
  { name: 'Gerador de CNPJ', path: '/documentos/gerador-cnpj', category: 'Documentos', keywords: ['cnpj', 'gerar', 'empresa'] },
  { name: 'Validador de CNPJ', path: '/documentos/validador-cnpj', category: 'Documentos', keywords: ['cnpj', 'validar', 'empresa'] },
  { name: 'Consulta CNPJ', path: '/documentos/consulta-cnpj', category: 'Documentos', keywords: ['cnpj', 'consulta', 'receita', 'empresa', 'razão social'] },
  { name: 'Busca de CEP', path: '/localizacao/busca-cep', category: 'Localização', keywords: ['cep', 'endereço', 'buscar'] },
  { name: 'Distância entre Cidades', path: '/localizacao/distancia-cidades', category: 'Localização', keywords: ['distância', 'cidades', 'km'] },
  { name: 'Link WhatsApp', path: '/utilidades/whatsapp-link', category: 'Utilidades', keywords: ['whatsapp', 'link', 'wa.me'] },
  { name: 'Cotação de Moedas', path: '/financeiro/cotacao', category: 'Financeiro', keywords: ['dólar', 'euro', 'bitcoin', 'cotação'] },
  { name: 'Criptomoedas', path: '/financeiro/criptomoedas', category: 'Financeiro', keywords: ['bitcoin', 'ethereum', 'crypto', 'cripto'] },
  { name: 'Tabela FIPE', path: '/financeiro/tabela-fipe', category: 'Financeiro', keywords: ['fipe', 'carro', 'veículo', 'preço'] },
  { name: 'Juros Compostos', path: '/financeiro/juros-compostos', category: 'Financeiro', keywords: ['juros', 'investimento', 'simulador'] },
  { name: 'Conversor CLT PJ', path: '/financeiro/conversor-clt-pj', category: 'Financeiro', keywords: ['clt', 'pj', 'salário', 'faturamento', 'impostos'] },
  { name: 'Financiamento de Carro', path: '/financeiro/financiamento-carro', category: 'Financeiro', keywords: ['financiamento', 'carro', 'veículo', 'parcelas', 'price', 'sac'] },
  { name: 'Rescisão Trabalhista', path: '/financeiro/rescisao-trabalhista', category: 'Financeiro', keywords: ['rescisão', 'demissão', 'fgts', 'aviso', 'trabalhista', 'verbas'] },
  { name: 'Simulador de Investimentos', path: '/financeiro/simulador-investimentos', category: 'Financeiro', keywords: ['investimento', 'cdb', 'tesouro', 'selic', 'poupança', 'rendimento'] },
  { name: 'Gerador de QR Code', path: '/utilidades/gerador-qr-code', category: 'Utilidades', keywords: ['qr', 'code', 'qrcode'] },
  { name: 'Gerador de Senha', path: '/utilidades/gerador-senha', category: 'Utilidades', keywords: ['senha', 'password', 'aleatória'] },
  { name: 'Gerador de UUID', path: '/utilidades/gerador-uuid', category: 'Utilidades', keywords: ['uuid', 'id', 'identificador'] },
  { name: 'Codificador Base64', path: '/utilidades/base64', category: 'Utilidades', keywords: ['base64', 'codificar', 'decodificar'] },
  { name: 'Contador de Caracteres', path: '/utilidades/contador-caracteres', category: 'Utilidades', keywords: ['caracteres', 'palavras', 'contador'] },
  { name: 'PIX Copia e Cola', path: '/utilidades/pix-copia-cola', category: 'Utilidades', keywords: ['pix', 'pagamento', 'copia'] },
  { name: 'Conversor de Timestamp', path: '/utilidades/timestamp', category: 'Utilidades', keywords: ['timestamp', 'data', 'hora', 'unix'] },
  { name: 'Comparador de Textos', path: '/utilidades/comparador-textos', category: 'Utilidades', keywords: ['diff', 'comparar', 'texto'] },
  { name: 'Removedor de Duplicatas', path: '/utilidades/removedor-duplicatas', category: 'Utilidades', keywords: ['duplicata', 'lista', 'ordenar'] },
  { name: 'Conversor de Caixa', path: '/utilidades/conversor-caixa', category: 'Utilidades', keywords: ['maiúsculo', 'minúsculo', 'caixa'] },
  { name: 'Conversor de Imagens', path: '/utilidades/conversor-imagens', category: 'Utilidades', keywords: ['imagem', 'webp', 'png', 'jpg'] },
  { name: 'Seletor de Cores', path: '/utilidades/seletor-cores', category: 'Utilidades', keywords: ['cor', 'hex', 'rgb', 'paleta'] },
  { name: 'Extrator de Emails', path: '/utilidades/extrator-emails', category: 'Utilidades', keywords: ['email', 'extrair', 'contato'] },
  { name: 'Dias Úteis', path: '/utilidades/dias-uteis', category: 'Utilidades', keywords: ['dias', 'úteis', 'data', 'feriado', 'prazo', 'calendário'] },
  { name: 'Formatador JSON XML', path: '/utilidades/formatador-codigo', category: 'Utilidades', keywords: ['json', 'xml', 'formatar', 'minificar', 'validar', 'código'] },
  { name: 'Calculadora de IMC', path: '/utilidades/calculadora-imc', category: 'Utilidades', keywords: ['imc', 'peso', 'altura', 'massa corporal', 'obesidade', 'saúde'] },
  { name: 'Tabela de Calorias', path: '/utilidades/tabela-calorias', category: 'Utilidades', keywords: ['calorias', 'taco', 'alimentos', 'nutrição', 'proteínas', 'carboidratos'] },
];

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const filtered = query.length > 0
    ? tools.filter(tool =>
        tool.name.toLowerCase().includes(query.toLowerCase()) ||
        tool.category.toLowerCase().includes(query.toLowerCase()) ||
        tool.keywords.some(kw => kw.includes(query.toLowerCase()))
      )
    : [];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (resultsRef.current && !resultsRef.current.contains(event.target as Node) &&
          inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative w-full max-w-2xl mx-auto group">
      <input
        ref={inputRef}
        type="text"
        id="global-search"
        placeholder="Ex: cpf, cep, cnpj, dólar, fipe, bitcoin..."
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        className="w-full py-3.5 pl-12 pr-4 border-2 border-slate-200 rounded-full text-base md:text-lg shadow-sm outline-none transition-all duration-300 focus:border-blue-500 focus:shadow-md focus:ring-4 focus:ring-blue-50"
      />
      <span className="absolute left-4.5 top-1/2 -translate-y-1/2 text-slate-400 text-xl transition-colors duration-300 group-focus-within:text-blue-500">
        🔍
      </span>
      
      {isOpen && filtered.length > 0 && (
        <div
          ref={resultsRef}
          className="absolute w-full bg-white border border-slate-200 rounded-2xl text-left block z-50 shadow-xl mt-3 max-h-[400px] overflow-y-auto divide-y divide-slate-100"
        >
          {filtered.map((tool) => (
            <Link
              key={tool.path}
              href={tool.path}
              onClick={() => {
                setIsOpen(false);
                setQuery('');
              }}
              className="flex items-center px-6 py-4 hover:bg-slate-50 transition-colors text-slate-800"
            >
              <span className="text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full mr-4 tracking-wide uppercase">
                {tool.category}
              </span>
              <span className="font-semibold text-base">{tool.name}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
