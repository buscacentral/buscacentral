'use client';

import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const tools = [
  { name: 'Gerador de CPF', path: '/documentos/gerador-cpf', category: 'Documentos', keywords: ['cpf', 'gerar', 'documento'] },
  { name: 'Validador de CPF', path: '/documentos/validador-cpf', category: 'Documentos', keywords: ['cpf', 'validar', 'documento'] },
  { name: 'Gerador de CNPJ', path: '/documentos/gerador-cnpj', category: 'Documentos', keywords: ['cnpj', 'gerar', 'empresa'] },
  { name: 'Validador de CNPJ', path: '/documentos/validador-cnpj', category: 'Documentos', keywords: ['cnpj', 'validar', 'empresa'] },
  { name: 'Consulta CNPJ', path: '/documentos/consulta-cnpj', category: 'Documentos', keywords: ['cnpj', 'consulta', 'receita', 'empresa', 'razão social'] },
  { name: 'Busca de CEP', path: '/localizacao/busca-cep', category: 'Localização', keywords: ['cep', 'endereço', 'buscar'] },
  { name: 'Distância entre Cidades', path: '/localizacao/distancia-cidades', category: 'Localização', keywords: ['distância', 'cidades', 'km'] },
  { name: 'Clima e Previsão do Tempo', path: '/localizacao/clima', category: 'Localização', keywords: ['clima', 'tempo', 'temperatura', 'previsão', 'chuva', 'sol'] },
  { name: 'Link WhatsApp', path: '/utilidades/whatsapp-link', category: 'Utilidades', keywords: ['whatsapp', 'link', 'wa.me'] },
  { name: 'Cotação de Moedas', path: '/financeiro/cotacao', category: 'Financeiro', keywords: ['dólar', 'euro', 'bitcoin', 'cotação'] },
  { name: 'Criptomoedas', path: '/financeiro/criptomoedas', category: 'Financeiro', keywords: ['bitcoin', 'ethereum', 'crypto', 'cripto'] },
  { name: 'Tabela FIPE', path: '/financeiro/tabela-fipe', category: 'Financeiro', keywords: ['fipe', 'carro', 'veículo', 'preço'] },
  { name: 'Juros Compostos', path: '/financeiro/juros-compostos', category: 'Financeiro', keywords: ['juros', 'investimento', 'simulador'] },
  { name: 'Conversor CLT PJ', path: '/financeiro/conversor-clt-pj', category: 'Financeiro', keywords: ['clt', 'pj', 'salário', 'faturamento', 'impostos'] },
  { name: 'Financiamento de Carro', path: '/financeiro/financiamento-carro', category: 'Financeiro', keywords: ['financiamento', 'carro', 'veículo', 'parcelas', 'price', 'sac'] },
  { name: 'ROI Imobiliário', path: '/financeiro/roi-imobiliario', category: 'Financeiro', keywords: ['roi', 'imóvel', 'aluguel', 'cap rate', 'investimento', 'imobiliário'] },
  { name: 'Salário Líquido', path: '/financeiro/salario-liquido', category: 'Financeiro', keywords: ['salário líquido', 'inss', 'irpf', 'descontos', 'trabalhista', 'calculadora salário'] },
  { name: 'Cálculo de Férias', path: '/financeiro/ferias', category: 'Financeiro', keywords: ['férias', 'cálculo', 'abono', 'vender férias', 'trabalhista'] },
  { name: '13º Salário', path: '/financeiro/decimo-terceiro', category: 'Financeiro', keywords: ['13', 'décimo terceiro', 'salário', 'parcela', 'trabalhista'] },
  { name: 'Horas Extras e DSR', path: '/financeiro/horas-extras', category: 'Financeiro', keywords: ['horas extras', 'dsr', 'trabalhista', '50%', '100%'] },
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
  { name: 'Rastreador de Encomendas', path: '/utilidades/rastreio', category: 'Utilidades', keywords: ['rastreio', 'encomenda', 'correios', 'pacote', 'rastrear', 'entrega'] },
  { name: 'Planejador de Férias', path: '/utilidades/planejador-viagem', category: 'Utilidades', keywords: ['viagem', 'férias', 'orçamento', 'planejamento', 'custo', 'passagem'] },
  { name: 'Formatador JSON XML', path: '/utilidades/formatador-codigo', category: 'Utilidades', keywords: ['json', 'xml', 'formatar', 'minificar', 'validar', 'código'] },
  { name: 'Calculadora de IMC', path: '/utilidades/calculadora-imc', category: 'Utilidades', keywords: ['imc', 'peso', 'altura', 'massa corporal', 'obesidade', 'saúde'] },
  { name: 'Tabela de Calorias', path: '/utilidades/tabela-calorias', category: 'Utilidades', keywords: ['calorias', 'taco', 'alimentos', 'nutrição', 'proteínas', 'carboidratos'] },
  { name: 'Calculadora de Porcentagem', path: '/utilidades/calculadora-porcentagem', category: 'Utilidades', keywords: ['porcentagem', 'cálculo', 'matemática', 'percentual'] },
  { name: 'Calculadora de Desconto', path: '/utilidades/calculadora-desconto', category: 'Utilidades', keywords: ['desconto', 'preço', 'economia', 'oferta', 'promoção'] },
  { name: 'Conversor de Unidades', path: '/utilidades/conversor-unidades', category: 'Utilidades', keywords: ['conversor', 'unidades', 'medidas', 'peso', 'comprimento', 'temperatura'] },
  { name: 'Gerador de Lorem Ipsum', path: '/utilidades/gerador-lorem-ipsum', category: 'Utilidades', keywords: ['lorem', 'ipsum', 'texto', 'placeholder', 'gerador', 'design'] },
  { name: 'Sorteador Online', path: '/utilidades/sorteador', category: 'Utilidades', keywords: ['sorteador', 'sortear', 'aleatório', 'nomes', 'números'] },
  { name: 'Cronômetro e Timer', path: '/utilidades/cronometro', category: 'Utilidades', keywords: ['cronômetro', 'timer', 'temporizador', 'alarme', 'tempo'] },
  { name: 'Conversor JSON CSV', path: '/utilidades/json-csv', category: 'Utilidades', keywords: ['json', 'csv', 'converter', 'dados'] },
  { name: 'Gerador de Cartão de Crédito', path: '/documentos/gerador-cartao-credito', category: 'Documentos', keywords: ['cartão', 'crédito', 'gerador', 'teste', 'cc'] },
  { name: 'Calculadora de Combustível', path: '/utilidades/calculadora-combustivel', category: 'Utilidades', keywords: ['combustível', 'gasolina', 'viagem', 'consumo', 'litros'] },
  { name: 'Validador de E-mail', path: '/utilidades/validador-email', category: 'Utilidades', keywords: ['email', 'validador', 'verificador', 'temporário', 'descartável'] },
  { name: 'Calculadora de Churrasco', path: '/utilidades/calculadora-churrasco', category: 'Utilidades', keywords: ['churrasco', 'carne', 'bebida', 'festa', 'quantidade'] },
  { name: 'Formatador de Dados', path: '/utilidades/formatador-dados', category: 'Utilidades', keywords: ['formatar', 'limpar', 'cpf', 'cnpj', 'telefone', 'celular', 'lote'] },
  { name: 'Regra de Três', path: '/utilidades/regra-de-tres', category: 'Utilidades', keywords: ['regra de três', 'matemática', 'proporção', 'cálculo', 'simples'] },
  { name: 'Consumo de Água', path: '/utilidades/consumo-agua', category: 'Utilidades', keywords: ['água', 'beber', 'hidratação', 'litros', 'saúde'] },
  { name: 'Consulta de Processos', path: '/documentos/consulta-processos', category: 'Documentos', keywords: ['processo', 'jusbrasil', 'judicial', 'nome', 'justiça', 'tribunal'] },
  { name: 'Precificação de Receitas', path: '/financeiro/precificacao-receitas', category: 'Financeiro', keywords: ['preço', 'receita', 'custo', 'venda', 'lucro', 'markup', 'doces', 'salgados'] },
  { name: 'Gerador de Recibos', path: '/documentos/gerador-recibos', category: 'Documentos', keywords: ['recibo', 'pagamento', 'pdf', 'comprovante', 'gerador', 'imprimir'] },
  { name: 'Idade Gestacional', path: '/utilidades/idade-gestacional', category: 'Utilidades', keywords: ['idade gestacional', 'gravidez', 'semanas', 'dum', 'dpp', 'parto'] },
  { name: 'Cronômetro Pomodoro', path: '/utilidades/pomodoro', category: 'Utilidades', keywords: ['pomodoro', 'foco', 'estudo', 'produtividade', 'timer', 'temporizador'] },
  { name: 'Sorteador de Nomes', path: '/utilidades/sorteador-nomes', category: 'Utilidades', keywords: ['sorteio', 'nomes', 'rifa', 'instagram', 'aleatório'] },
  { name: 'Calculadora do Amor', path: '/utilidades/calculadora-amor', category: 'Utilidades', keywords: ['amor', 'calculadora', 'casal', 'compatibilidade', 'nomes', 'crush', 'brincadeira'] },
];

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const filtered = query.length > 0
    ? tools.filter(tool =>
        tool.name.toLowerCase().includes(query.toLowerCase()) ||
        tool.category.toLowerCase().includes(query.toLowerCase()) ||
        tool.keywords.some(kw => kw.includes(query.toLowerCase()))
      )
    : [];

  useEffect(() => {
    setActiveIndex(-1);
  }, [query]);

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

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || filtered.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) => (prev < filtered.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIndex >= 0 && activeIndex < filtered.length) {
        setIsOpen(false);
        setQuery('');
        router.push(filtered[activeIndex].path);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (activeIndex >= 0 && resultsRef.current) {
      const activeElement = resultsRef.current.children[activeIndex] as HTMLElement;
      if (activeElement) {
        activeElement.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [activeIndex]);

  return (
    <div className="relative w-full max-w-2xl mx-auto group">
      <label htmlFor="global-search" className="sr-only">
        Busca global de ferramentas
      </label>
      <input
        ref={inputRef}
        type="text"
        id="global-search"
        placeholder="Ex: cpf, cep, cnpj, dólar, fipe, bitcoin…"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        onKeyDown={handleKeyDown}
        className="w-full py-3 pl-11 pr-4 border-2 border-slate-200 rounded-full text-base shadow-sm outline-none transition-all duration-300 focus:border-blue-500 focus:shadow-md focus:ring-4 focus:ring-blue-50"
      />
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg transition-colors duration-300 group-focus-within:text-blue-500">
        🔍
      </span>
      
      {isOpen && filtered.length > 0 && (
        <div
          ref={resultsRef}
          className="absolute w-full bg-white border border-slate-200 rounded-2xl text-left block z-50 shadow-xl mt-3 max-h-[400px] overflow-y-auto divide-y divide-slate-100"
          role="listbox"
        >
          {filtered.map((tool, index) => (
            <Link
              key={tool.path}
              href={tool.path}
              onClick={() => {
                setIsOpen(false);
                setQuery('');
              }}
              className={`flex items-center px-6 py-4 transition-colors text-slate-800 ${activeIndex === index ? 'bg-blue-50' : 'hover:bg-slate-50'}`}
              role="option"
              aria-selected={activeIndex === index}
            >
              <span className="text-xs font-bold text-blue-700 bg-white border border-blue-100 px-3 py-1 rounded-full mr-4 tracking-wide uppercase">
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
