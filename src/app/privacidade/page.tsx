import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Política de Privacidade e LGPD | BuscaCentral',
  description: 'Política de Privacidade do BuscaCentral.com.br. Saiba como protegemos seus dados, utilizamos cookies e cumprimos a Lei Geral de Proteção de Dados (LGPD).',
  alternates: { canonical: 'https://buscacentral.com.br/privacidade' },
};

export default function Privacidade() {
  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-slate-900 mb-3">Política de Privacidade</h1>
        <p className="text-base text-slate-500">Última atualização: Junho de 2026</p>
      </header>

      <div className="prose prose-gray max-w-none">
        <section>
          <h2>1. Compromisso com a Privacidade</h2>
          <p>
            O BuscaCentral.com.br respeita a privacidade dos seus visitantes. Esta política descreve
            de forma transparente como tratamos dados e informações quando você utiliza nosso site.
          </p>
        </section>

        <section>
          <h2>2. Processamento Local dos Dados (Privacy by Design)</h2>
          <p>
            <strong>Todas as ferramentas do BuscaCentral funcionam 100% no navegador do usuário.</strong> Os
            dados digitados nos simuladores, calculadoras e conversores são processados exclusivamente
            no seu dispositivo e <strong>nunca são enviados, coletados, vendidos ou armazenados</strong> em
            nossos servidores.
          </p>
          <p>Isso inclui, mas não se limita a:</p>
          <ul>
            <li>Valores digitados na Calculadora de Financiamento (SAC/Price)</li>
            <li>Dados do Simulador de ROI Imobiliário</li>
            <li>Conversões de moedas e criptomoedas</li>
            <li>CEPs consultados na Busca de CEP</li>
            <li>Textos processados em ferramentas como Base64, Contador de Caracteres e Comparador</li>
            <li>Senhas geradas pelo Gerador de Senha</li>
            <li>IMC, calorias e dados pessoais inseridos nas calculadoras</li>
          </ul>
          <p>
            <strong>Seus dados permanecem no seu navegador e são descartados ao fechar a aba.</strong>
          </p>
        </section>

        <section>
          <h2>3. Serviços de Terceiros</h2>
          <p>
            Utilizamos os seguintes serviços que podem coletar informações de navegação através de cookies:
          </p>

          <h3>3.1 Google Analytics 4</h3>
          <p>
            Coleta dados anônimos de navegação (páginas visitadas, tempo de sessão, origem do tráfego,
            dispositivo) para análise de uso do site. Os dados são utilizados apenas para melhorar o conteúdo.
          </p>
          <ul>
            <li><strong>Cookies:</strong> _ga, _ga_*</li>
            <li><strong>Política:</strong> <a href="https://policies.google.com/privacy" target="_blank" rel="noopener">Google Privacy Policy</a></li>
          </ul>

          <h3>3.2 Google AdSense</h3>
          <p>
            Exibe anúncios e utiliza cookies para personalização de conteúdo publicitário. O Google
            pode usar cookies para exibir anúncios com base em visitas anteriores ao site.
          </p>
          <ul>
            <li><strong>Cookies:</strong> cookies de publicidade e interesses de navegação</li>
            <li><strong>Política:</strong> <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener">Google Ads Policy</a></li>
          </ul>

          <h3>3.3 Microsoft Clarity</h3>
          <p>
            Grava sessões de navegação e gera mapas de calor para melhoria da experiência do usuário.
          </p>
          <ul>
            <li><strong>Dados coletados:</strong> gravações de sessão, cliques, scrolls</li>
            <li><strong>Política:</strong> <a href="https://privacy.microsoft.com/privacystatement" target="_blank" rel="noopener">Microsoft Privacy Statement</a></li>
          </ul>
        </section>

        <section>
          <h2>4. Cookies</h2>
          <p>
            Utilizamos cookies e tecnologias similares para melhorar sua experiência. Ao acessar o site,
            você é informado sobre o uso de cookies através de um banner de consentimento.
          </p>
          <ul>
            <li><strong>Aceitar:</strong> ativa Google Analytics, Google AdSense e Microsoft Clarity</li>
            <li><strong>Rejeitar:</strong> os scripts de rastreamento não são carregados</li>
          </ul>
          <p>
            Você pode gerenciar suas preferências de cookies a qualquer momento através das configurações
            do seu navegador.
          </p>
        </section>

        <section>
          <h2>5. Seus Direitos (LGPD)</h2>
          <p>
            De acordo com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018), você tem direito a:
          </p>
          <ul>
            <li>Acessar seus dados pessoais</li>
            <li>Corrigir dados incompletos ou desatualizados</li>
            <li>Solicitar a exclusão de dados</li>
            <li>Revogar o consentimento a qualquer momento</li>
            <li>Saber se seus dados foram compartilhados com terceiros</li>
          </ul>
        </section>

        <section>
          <h2>6. Base Legal</h2>
          <p>
            O tratamento de dados é realizado com base no <strong>consentimento do titular</strong>
            (Art. 7º, I da LGPD), solicitado através do banner de cookies exibido no primeiro acesso ao site.
          </p>
        </section>

        <section>
          <h2>7. Retenção de Dados</h2>
          <p>
            Os dados de navegação coletados pelo Google Analytics são retidos por 14 meses. Os cookies
            de consentimento são armazenados localmente no navegador do usuário. Nenhum dado digitado
            nas ferramentas é retido em nossos servidores.
          </p>
        </section>

        <section>
          <h2>8. Segurança</h2>
          <p>
            O BuscaCentral utiliza HTTPS (certificado SSL/TLS) em todas as páginas, garantindo que a
            comunicação entre o navegador do usuário e nossos servidores seja criptografada.
          </p>
        </section>

        <section>
          <h2>9. Contato</h2>
          <p>
            Em caso de dúvidas sobre esta política ou para exercer seus direitos, entre em contato
            pelo e-mail: <strong>contato@buscacentral.com.br</strong>
          </p>
        </section>
      </div>
    </main>
  );
}
