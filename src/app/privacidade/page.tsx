import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Política de Privacidade',
  description: 'Política de Privacidade do BuscaCentral.com.br — Como tratamos seus dados.',
};

export default function Privacidade() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Política de Privacidade</h1>
      
      <div className="prose prose-gray max-w-none">
        <p><strong>Última atualização:</strong> Junho de 2026</p>
        
        <h2>1. Informações Gerais</h2>
        <p>
          O BuscaCentral.com.br respeita a privacidade dos seus visitantes. Esta Política de Privacidade 
          descreve como coletamos, usamos e protegemos as informações quando você utiliza nosso site.
        </p>
        
        <h2>2. Dados Coletados</h2>
        <p>
          O BuscaCentral <strong>não exige cadastro</strong> e <strong>não coleta diretamente dados pessoais</strong> 
          dos seus usuários. As ferramentas disponíveis no site funcionam 100% no navegador, sem enviar 
          dados para nossos servidores.
        </p>
        
        <h2>3. Serviços de Terceiros</h2>
        <p>
          Utilizamos os seguintes serviços de terceiros que podem coletar informações de navegação:
        </p>
        <ul>
          <li><strong>Google Analytics 4:</strong> Coleta dados de navegação (páginas visitadas, tempo de sessão, origem do tráfego) para análise de uso do site.</li>
          <li><strong>Google AdSense:</strong> Exibe anúncios e pode utilizar cookies para personalização de conteúdo publicitário.</li>
          <li><strong>Microsoft Clarity:</strong> Grava sessões de navegação e gera mapas de calor para melhoria da experiência do usuário.</li>
        </ul>
        
        <h2>4. Cookies</h2>
        <p>
          Utilizamos cookies e tecnologias similares para melhorar sua experiência. Você pode gerenciar 
          suas preferências de cookies através das configurações do seu navegador.
        </p>
        
        <h2>5. Seus Direitos</h2>
        <p>
          De acordo com a Lei Geral de Proteção de Dados (LGPD), você tem direito a:
        </p>
        <ul>
          <li>Acessar seus dados pessoais</li>
          <li>Corrigir dados incompletos ou desatualizados</li>
          <li>Solicitar a exclusão de dados</li>
          <li>Revogar o consentimento</li>
        </ul>
        
        <h2>6. Contato</h2>
        <p>
          Em caso de dúvidas sobre esta política, entre em contato pelo e-mail: contato@buscacentral.com.br
        </p>
      </div>
    </div>
  );
}
