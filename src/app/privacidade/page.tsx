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
        
        <h3>3.1 Google Analytics 4</h3>
        <p>
          Coleta dados de navegação (páginas visitadas, tempo de sessão, origem do tráfego, dispositivo) 
          para análise de uso do site. Os dados são anônimos e utilizados apenas para melhorar o conteúdo.
        </p>
        <ul>
          <li><strong>Dados coletados:</strong> páginas visitadas, duração da sessão, origem do tráfego, tipo de dispositivo</li>
          <li><strong>Cookies:</strong> _ga, _ga_*</li>
          <li><strong>Política:</strong> <a href="https://policies.google.com/privacy" target="_blank" rel="noopener">Google Privacy Policy</a></li>
        </ul>
        
        <h3>3.2 Google AdSense</h3>
        <p>
          Exibe anúncios e utiliza cookies para personalização de conteúdo publicitário. 
          O Google pode usar cookies para exibir anúncios com base em visitas anteriores ao site.
        </p>
        <ul>
          <li><strong>Dados coletados:</strong> cookies de publicidade, interesses de navegação</li>
          <li><strong>Política:</strong> <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener">Google Ads Policy</a></li>
        </ul>
        
        <h3>3.3 Microsoft Clarity</h3>
        <p>
          Grava sessões de navegação e gera mapas de calor para melhoria da experiência do usuário. 
          Os dados são utilizados para entender como os usuários interagem com o site.
        </p>
        <ul>
          <li><strong>Dados coletados:</strong> gravações de sessão, cliques, scrolls, mapas de calor</li>
          <li><strong>Política:</strong> <a href="https://privacy.microsoft.com/privacystatement" target="_blank" rel="noopener">Microsoft Privacy Statement</a></li>
        </ul>
        
        <h2>4. Cookies</h2>
        <p>
          Utilizamos cookies e tecnologias similares para melhorar sua experiência. Ao acessar o site, 
          você é informado sobre o uso de cookies e pode escolher entre:
        </p>
        <ul>
          <li><strong>Aceitar:</strong> ativa Google Analytics, Google AdSense e Microsoft Clarity</li>
          <li><strong>Rejeitar:</strong> os scripts de rastreamento não são carregados</li>
        </ul>
        <p>
          Você também pode gerenciar suas preferências de cookies através das configurações do seu navegador.
        </p>
        
        <h2>5. Seus Direitos (LGPD)</h2>
        <p>
          De acordo com a Lei Geral de Proteção de Dados (LGPD), você tem direito a:
        </p>
        <ul>
          <li>Acessar seus dados pessoais</li>
          <li>Corrigir dados incompletos ou desatualizados</li>
          <li>Solicitar a exclusão de dados</li>
          <li>Revogar o consentimento a qualquer momento</li>
          <li>Saber se seus dados foram compartilhados com terceiros</li>
        </ul>
        <p>
          Para exercer seus direitos, entre em contato pelo e-mail abaixo.
        </p>
        
        <h2>6. Base Legal</h2>
        <p>
          O tratamento de dados é realizado com base no <strong>consentimento do titular</strong> 
          (Art. 7º, I da LGPD), que é solicitado através do banner de cookies exibido no primeiro acesso ao site.
        </p>
        
        <h2>7. Retenção de Dados</h2>
        <p>
          Os dados de navegação coletados pelo Google Analytics são retidos por 14 meses. 
          Os cookies de consentimento são armazenados localmente no navegador do usuário.
        </p>
        
        <h2>8. Contato</h2>
        <p>
          Em caso de dúvidas sobre esta política ou para exercer seus direitos, entre em contato pelo e-mail: 
          <strong> contato@buscacentral.com.br</strong>
        </p>
      </div>
    </div>
  );
}
