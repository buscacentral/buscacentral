import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white font-bold text-lg mb-4">BuscaCentral</h3>
            <p className="text-sm text-gray-400">
              Central de ferramentas online gratuitas do Brasil. Consultas rápidas sem cadastro.
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Ferramentas</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/documentos/gerador-cpf" className="hover:text-white transition-colors">Gerador de CPF</Link></li>
              <li><Link href="/documentos/validador-cpf" className="hover:text-white transition-colors">Validador de CPF</Link></li>
              <li><Link href="/localizacao/busca-cep" className="hover:text-white transition-colors">Busca de CEP</Link></li>
              <li><Link href="/financeiro/cotacao" className="hover:text-white transition-colors">Cotação de Moedas</Link></li>
              <li><Link href="/financeiro/criptomoedas" className="hover:text-white transition-colors">Criptomoedas</Link></li>
              <li><Link href="/financeiro/tabela-fipe" className="hover:text-white transition-colors">Tabela FIPE</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Utilidades</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/utilidades/gerador-qr-code" className="hover:text-white transition-colors">Gerador de QR Code</Link></li>
              <li><Link href="/utilidades/gerador-senha" className="hover:text-white transition-colors">Gerador de Senha</Link></li>
              <li><Link href="/utilidades/comparador-textos" className="hover:text-white transition-colors">Comparador de Textos</Link></li>
              <li><Link href="/utilidades/conversor-imagens" className="hover:text-white transition-colors">Conversor de Imagens</Link></li>
              <li><Link href="/utilidades/seletor-cores" className="hover:text-white transition-colors">Seletor de Cores</Link></li>
              <li><Link href="/utilidades/extrator-emails" className="hover:text-white transition-colors">Extrator de Emails</Link></li>
              <li><Link href="/localizacao/whatsapp-link" className="hover:text-white transition-colors">Link WhatsApp</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Institucional</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/sobre" className="hover:text-white transition-colors">Sobre nós</Link></li>
              <li><Link href="/privacidade" className="hover:text-white transition-colors">Política de Privacidade</Link></li>
              <li><Link href="/termos" className="hover:text-white transition-colors">Termos de Uso</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; {new Date().getFullYear()} BuscaCentral.com.br — Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
