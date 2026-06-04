import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto" role="contentinfo">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <nav aria-label="Rodapé - Navegação principal">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h2 className="text-white font-bold text-lg mb-4">BuscaCentral</h2>
              <p className="text-sm text-gray-400">
                Central de ferramentas online gratuitas do Brasil. Consultas rápidas sem cadastro.
              </p>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Documentos</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/documentos/gerador-cpf" className="hover:text-white transition-colors">Gerador de CPF</Link></li>
                <li><Link href="/documentos/validador-cpf" className="hover:text-white transition-colors">Validador de CPF</Link></li>
                <li><Link href="/documentos/gerador-cnpj" className="hover:text-white transition-colors">Gerador de CNPJ</Link></li>
                <li><Link href="/documentos/consulta-cnpj" className="hover:text-white transition-colors">Consulta CNPJ</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Ferramentas</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/localizacao/busca-cep" className="hover:text-white transition-colors">Busca de CEP</Link></li>
                <li><Link href="/financeiro/cotacao" className="hover:text-white transition-colors">Cotação de Moedas</Link></li>
                <li><Link href="/financeiro/tabela-fipe" className="hover:text-white transition-colors">Tabela FIPE</Link></li>
                <li><Link href="/utilidades/gerador-qr-code" className="hover:text-white transition-colors">Gerador de QR Code</Link></li>
                <li><Link href="/utilidades/calculadora-imc" className="hover:text-white transition-colors">Calculadora de IMC</Link></li>
                <li><Link href="/utilidades/tabela-calorias" className="hover:text-white transition-colors">Tabela de Calorias</Link></li>
                <li><Link href="/produtos" className="hover:text-white transition-colors">Busca de Produtos</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4">Institucional</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/sobre" className="hover:text-white transition-colors">Sobre Nós</Link></li>
                <li><Link href="/privacidade" className="hover:text-white transition-colors">Política de Privacidade</Link></li>
                <li><Link href="/termos" className="hover:text-white transition-colors">Termos de Uso</Link></li>
              </ul>
            </div>
          </div>
        </nav>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; {currentYear} BuscaCentral.com.br — Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
