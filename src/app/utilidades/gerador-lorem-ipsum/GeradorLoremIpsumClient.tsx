'use client';

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/Button';
import { ResultCard } from '@/components/ui/ResultCard';
import CopyButton from '@/components/CopyButton';

const WORDS = [
  'lorem','ipsum','dolor','sit','amet','consectetur','adipiscing','elit','sed','do','eiusmod','tempor',
  'incididunt','ut','labore','et','dolore','magna','aliqua','enim','ad','minim','veniam','quis',
  'nostrud','exercitation','ullamco','laboris','nisi','aliquip','ex','ea','commodo','consequat',
  'duis','aute','irure','in','reprehenderit','voluptate','velit','esse','cillum','fugiat','nulla',
  'pariatur','excepteur','sint','occaecat','cupidatat','non','proident','sunt','culpa','qui',
  'officia','deserunt','mollit','anim','id','est','laborum','ac','ante','bibendum','blandit',
  'condimentum','congue','cras','cursus','diam','dictum','dignissim','donec','dui','efficitur',
  'egestas','elementum','eros','eu','facilisis','faucibus','felis','fermentum','finibus','gravida',
  'habitant','hendrerit','interdum','justo','lacinia','lacus','laoreet','lectus','leo','libero',
  'ligula','lobortis','luctus','maecenas','massa','mattis','mauris','maximus','metus','mi',
  'morbi','nam','nec','neque','nibh','nunc','odio','orci','ornare','pellentesque','pharetra',
  'placerat','porta','posuere','praesent','pretium','proin','pulvinar','purus','quam',
  'rhoncus','risus','rutrum','sagittis','sapien','scelerisque','semper','sollicitudin','suscipit',
  'tellus','tincidunt','tortor','turpis','ultrices','urna','varius','vel','vestibulum','vitae','viverra',
];

const FIRST_SENTENCE = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.';

type Tipo = 'paragrafos' | 'palavras' | 'frases';

export default function GeradorLoremIpsumClient() {
  const [tipo, setTipo] = useState<Tipo>('paragrafos');
  const [quantidade, setQuantidade] = useState('3');
  const [comecarComLorem, setComecarComLorem] = useState(true);
  const [texto, setTexto] = useState('');

  const randomWord = () => WORDS[Math.floor(Math.random() * WORDS.length)];

  const generateSentence = useCallback((minWords = 6, maxWords = 14): string => {
    const len = Math.floor(Math.random() * (maxWords - minWords + 1)) + minWords;
    const words = Array.from({ length: len }, () => randomWord());
    words[0] = words[0][0].toUpperCase() + words[0].slice(1);
    return words.join(' ') + '.';
  }, []);

  const generateParagraph = useCallback((numSentences = 4): string => {
    return Array.from({ length: numSentences + Math.floor(Math.random() * 3) }, () => generateSentence()).join(' ');
  }, [generateSentence]);

  const gerar = () => {
    const qtd = Math.max(1, Math.min(100, parseInt(quantidade) || 1));
    let result = '';

    switch (tipo) {
      case 'paragrafos': {
        const paragraphs = Array.from({ length: qtd }, () => generateParagraph());
        if (comecarComLorem && paragraphs.length > 0) {
          paragraphs[0] = FIRST_SENTENCE + ' ' + paragraphs[0];
        }
        result = paragraphs.join('\n\n');
        break;
      }
      case 'palavras': {
        const words = Array.from({ length: qtd }, () => randomWord());
        if (comecarComLorem) {
          words[0] = 'Lorem';
          if (words.length > 1) words[1] = 'ipsum';
          if (words.length > 2) words[2] = 'dolor';
        }
        words[0] = words[0][0].toUpperCase() + words[0].slice(1);
        result = words.join(' ') + '.';
        break;
      }
      case 'frases': {
        const sentences = Array.from({ length: qtd }, () => generateSentence());
        if (comecarComLorem && sentences.length > 0) {
          sentences[0] = FIRST_SENTENCE;
        }
        result = sentences.join(' ');
        break;
      }
    }

    setTexto(result);
  };

  const tiposOpcoes: { id: Tipo; label: string }[] = [
    { id: 'paragrafos', label: 'Parágrafos' },
    { id: 'palavras', label: 'Palavras' },
    { id: 'frases', label: 'Frases' },
  ];

  const wordCount = texto ? texto.split(/\s+/).length : 0;
  const charCount = texto.length;

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <div className="mb-5">
              <p className="text-sm font-medium text-slate-700 mb-3">Tipo</p>
              <div className="flex gap-2">
                {tiposOpcoes.map(t => (
                  <button
                    key={t.id}
                    onClick={() => setTipo(t.id)}
                    className={`flex-1 text-sm font-semibold py-2.5 rounded-lg border transition-all ${
                      tipo === t.id
                        ? 'bg-sky-50 border-sky-300 text-sky-700'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-5">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Quantidade de {tipo}
              </label>
              <input
                type="number"
                min={1}
                max={100}
                value={quantidade}
                onChange={e => setQuantidade(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 text-lg font-mono"
              />
            </div>

            <label className="flex items-center gap-2 mb-6 cursor-pointer">
              <input
                type="checkbox"
                checked={comecarComLorem}
                onChange={e => setComecarComLorem(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
              />
              <span className="text-sm text-slate-600">Começar com &ldquo;Lorem ipsum...&rdquo;</span>
            </label>

            <Button onClick={gerar} className="w-full">Gerar Lorem Ipsum</Button>
          </div>
        </div>

        <div className="lg:col-span-7">
          {texto ? (
            <ResultCard title="Texto Gerado" className="animate-fade-in">
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex gap-3">
                    <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded">{wordCount} palavras</span>
                    <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded">{charCount} caracteres</span>
                  </div>
                  <CopyButton text={texto} label="Copiar" />
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 shadow-sm max-h-[500px] overflow-y-auto">
                  {texto.split('\n\n').map((p, i) => (
                    <p key={i} className="text-slate-700 text-sm leading-relaxed mb-4 last:mb-0">{p}</p>
                  ))}
                </div>
              </div>
            </ResultCard>
          ) : (
            <div className="h-full flex items-center justify-center min-h-[300px] border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
              <div className="text-center p-8">
                <span className="text-5xl mb-4 block opacity-80">📝</span>
                <h3 className="text-lg font-bold text-slate-700 mb-2">Gerador de Lorem Ipsum</h3>
                <p className="text-slate-500 max-w-sm mx-auto text-sm">
                  Configure a quantidade e o tipo de texto desejado e clique em gerar.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <article className="mt-12 prose prose-gray max-w-none">
        <h2>O que é Lorem Ipsum?</h2>
        <p>
          Lorem Ipsum é um texto padrão usado pela indústria gráfica e de design desde o século XVI.
          É utilizado como texto de preenchimento para demonstrar a forma visual de um documento ou layout
          antes que o conteúdo real seja inserido.
        </p>
        <h3>Para que serve?</h3>
        <p>
          Desenvolvedores, designers e redatores usam Lorem Ipsum para preencher layouts, protótipos
          e mockups sem que o conteúdo textual distraia a atenção da parte visual do projeto.
        </p>
      </article>
    </>
  );
}
