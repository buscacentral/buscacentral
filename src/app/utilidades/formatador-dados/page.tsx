import type { Metadata } from 'next';
import FormatadorDadosClient from './FormatadorDadosClient';

export const metadata: Metadata = {
  title: 'Formatador de CPF, CNPJ e Telefone em Lote',
  description: 'Cole uma lista suja de números e formate todos de uma vez como CPF, CNPJ ou Telefone. Adicione pontuação ou remova tudo (apenas números).',
  openGraph: {
    title: 'Formatador de Dados em Massa (CPF/CNPJ/Tel)',
    description: 'Limpe e padronize grandes listas de CPFs, CNPJs ou Telefones com um único clique. Gratuito e roda direto no navegador.',
    url: 'https://buscacentral.com.br/utilidades/formatador-dados',
  }
};

export default function FormatadorDadosPage() {
  return (
    <main className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-10 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
            Formatador de Dados em Lote
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Esqueça o Excel! Cole sua lista desconfigurada de CPFs, CNPJs ou Telefones abaixo e padronize milhares de linhas instantaneamente, com total privacidade (tudo é processado no seu computador).
          </p>
        </header>

        <FormatadorDadosClient />

        <div className="prose prose-slate max-w-none bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
          <h2>Como usar o Formatador de CPF/CNPJ e Telefone?</h2>
          <p>
            Trabalhar com banco de dados quase sempre significa lidar com informações sujas. É comum exportar relatórios de clientes onde alguns CPFs têm pontuação, outros não, ou números de telefone misturados com texto.
          </p>
          
          <p>Nossa ferramenta limpa tudo isso para você:</p>
          <ul>
            <li><strong>Colar a lista:</strong> Basta copiar os dados (do Excel, Bloco de notas, sistema da empresa) e colar no campo da esquerda. (1 informação por linha).</li>
            <li><strong>Escolher o formato:</strong> Clique no botão correspondente ao que os dados deveriam ser (CPF, CNPJ, Celular).</li>
            <li><strong>Mágica acontece:</strong> A ferramenta ignora letras e caracteres especiais, pega apenas os números e aplica a máscara correta.</li>
            <li><strong>Extrair Apenas Números:</strong> Se você precisa limpar CPFs e CNPJs para importar em um sistema que exige apenas dígitos numéricos, clique no botão "Apenas Números".</li>
          </ul>

          <h3>Isso é seguro? Onde meus dados vão parar?</h3>
          <p>
            <strong>É 100% seguro!</strong> Nós levamos a LGPD (Lei Geral de Proteção de Dados) muito a sério. 
            Nenhuma lista que você cola aqui é enviada para nossos servidores. Todo o processamento de limpeza e formatação 
            é feito localmente no seu próprio navegador usando JavaScript.
          </p>
        </div>
      </div>
    </main>
  );
}
