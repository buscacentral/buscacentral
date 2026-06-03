import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Termos de Uso',
  description: 'Termos de Uso do BuscaCentral.com.br — Condições para utilização do site.',
};

export default function Termos() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Termos de Uso</h1>
      
      <div className="prose prose-gray max-w-none">
        <p><strong>Última atualização:</strong> Junho de 2026</p>
        
        <h2>1. Aceitação dos Termos</h2>
        <p>
          Ao acessar e utilizar o BuscaCentral.com.br, você concorda com estes Termos de Uso. 
          Se não concordar com algum termo, por favor, não utilize o site.
        </p>
        
        <h2>2. Descrição do Serviço</h2>
        <p>
          O BuscaCentral é uma plataforma gratuita que disponibiliza ferramentas online para consultas 
          diversas, incluindo geração e validação de documentos, busca de endereços, cotações financeiras 
          e utilidades diversas.
        </p>
        
        <h2>3. Uso das Ferramentas</h2>
        <p>
          As ferramentas de geração de documentos (CPF, CNPJ) produzem <strong>dados fictícios</strong> 
          destinados exclusivamente para fins de teste e desenvolvimento de software.
        </p>
        <p>
          <strong>É expressamente proibido:</strong>
        </p>
        <ul>
          <li>Utilizar dados gerados para cadastros reais ou fraudulentos</li>
          <li>Empregar os dados para atividades ilícitas</li>
          <li>Utilizar as ferramentas para enganar terceiros</li>
        </ul>
        
        <h2>4. Limitação de Responsabilidade</h2>
        <p>
          O BuscaCentral não se responsabiliza pelo uso indevido das ferramentas disponíveis no site. 
          O usuário é o único responsável pelo uso que faz dos dados gerados.
        </p>
        
        <h2>5. Propriedade Intelectual</h2>
        <p>
          Todo o conteúdo do BuscaCentral, incluindo textos, gráficos, logotipos e código-fonte, 
          é protegido por leis de direitos autorais.
        </p>
        
        <h2>6. Alterações nos Termos</h2>
        <p>
          Reservamo-nos o direito de alterar estes termos a qualquer momento. As alterações entram 
          em vigor imediatamente após a publicação no site.
        </p>
        
        <h2>7. Contato</h2>
        <p>
          Em caso de dúvidas sobre estes termos, entre em contato pelo e-mail: contato@buscacentral.com.br
        </p>
      </div>
    </div>
  );
}
