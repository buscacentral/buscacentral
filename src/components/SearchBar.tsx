'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

const tools = [
  { name: 'Gerador de CPF', path: '/documentos/gerador-cpf', category: 'Documentos', keywords: ['cpf', 'gerar', 'documento'] },
  { name: 'Validador de CPF', path: '/documentos/validador-cpf', category: 'Documentos', keywords: ['cpf', 'validar', 'documento'] },
  { name: 'Gerador de CNPJ', path: '/documentos/gerador-cnpj', category: 'Documentos', keywords: ['cnpj', 'gerar', 'empresa'] },
  { name: 'Validador de CNPJ', path: '/documentos/validador-cnpj', category: 'Documentos', keywords: ['cnpj', 'validar', 'empresa'] },
  { name: 'Busca de CEP', path: '/localizacao/busca-cep', category: 'Localização', keywords: ['cep', 'endereço', 'buscar'] },
  { name: 'Distância entre Cidades', path: '/localizacao/distancia-cidades', category: 'Localização', keywords: ['distância', 'cidades', 'km'] },
  { name: 'Link WhatsApp', path: '/localizacao/whatsapp-link', category: 'Localização', keywords: ['whatsapp', 'link', 'wa.me'] },
  { name: 'Cotação de Moedas', path: '/financeiro/cotacao', category: 'Financeiro', keywords: ['dólar', 'euro', 'bitcoin', 'cotação'] },
  { name: 'Criptomoedas', path: '/financeiro/criptomoedas', category: 'Financeiro', keywords: ['bitcoin', 'ethereum', 'crypto', 'cripto'] },
  { name: 'Tabela FIPE', path: '/financeiro/tabela-fipe', category: 'Financeiro', keywords: ['fipe', 'carro', 'veículo', 'preço'] },
  { name: 'Juros Compostos', path: '/financeiro/juros-compostos', category: 'Financeiro', keywords: ['juros', 'investimento', 'simulador'] },
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
    <div style={{ position: 'relative', width: '100%', maxWidth: '600px', margin: '0 auto' }}>
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
        style={{
          width: '100%',
          padding: '1.1rem 1.5rem 1.1rem 3rem',
          border: '1px solid #e2e8f0',
          borderRadius: '50px',
          fontSize: '1.1rem',
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
          outline: 'none',
          transition: 'border 0.2s',
        }}
      />
      <span style={{
        position: 'absolute',
        left: '1.2rem',
        top: '50%',
        transform: 'translateY(-50%)',
        color: '#94a3b8',
        fontSize: '1.2rem',
      }}>
        🔍
      </span>
      
      {isOpen && filtered.length > 0 && (
        <div
          ref={resultsRef}
          style={{
            position: 'absolute',
            width: '100%',
            background: 'white',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            textAlign: 'left',
            display: 'block',
            zIndex: 100,
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
            marginTop: '0.5rem',
            maxHeight: '300px',
            overflowY: 'auto',
          }}
        >
          {filtered.map((tool) => (
            <Link
              key={tool.path}
              href={tool.path}
              onClick={() => {
                setIsOpen(false);
                setQuery('');
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '0.875rem 1.25rem',
                textDecoration: 'none',
                color: '#1e293b',
                borderBottom: '1px solid #f1f5f9',
                transition: 'background 0.15s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#f8fafc')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'white')}
            >
              <span style={{
                fontSize: '0.75rem',
                color: '#64748b',
                background: '#f1f5f9',
                padding: '0.25rem 0.5rem',
                borderRadius: '4px',
                marginRight: '0.75rem',
                fontWeight: 500,
              }}>
                {tool.category}
              </span>
              <span style={{ fontWeight: 500 }}>{tool.name}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
