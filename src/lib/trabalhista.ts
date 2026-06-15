// Tabelas de INSS e IRPF vigentes (base 2024/2025)

export function calcularINSS(salarioBruto: number): number {
  if (salarioBruto <= 0) return 0;
  
  let inss = 0;
  
  // Teto INSS 2024: 7.786,02
  const faixas = [
    { limite: 1412.00, aliquota: 0.075 },
    { limite: 2666.68, aliquota: 0.09 },
    { limite: 4000.03, aliquota: 0.12 },
    { limite: 7786.02, aliquota: 0.14 }
  ];

  const valorRestante = Math.min(salarioBruto, faixas[faixas.length - 1].limite);
  let valorAnterior = 0;

  for (const faixa of faixas) {
    if (valorRestante > valorAnterior) {
      const base = Math.min(valorRestante, faixa.limite) - valorAnterior;
      inss += base * faixa.aliquota;
      valorAnterior = faixa.limite;
    } else {
      break;
    }
  }

  return inss;
}

export function calcularIRPF(salarioBase: number, dependentes: number = 0, pensaoAlimenticia: number = 0, outrasDeducoes: number = 0): number {
  const deducaoDependente = 189.59;
  const descontoSimplificado = 564.80; // Opção de desconto simplificado (25% da primeira faixa)
  
  // Base de cálculo = Salário Bruto - INSS - Dependentes - Pensão - Outras deduções
  const baseCalculoReal = salarioBase - (dependentes * deducaoDependente) - pensaoAlimenticia - outrasDeducoes;
  
  // A nova regra do IR permite escolher o que for mais vantajoso: as deduções legais ou o desconto simplificado
  const baseCalculoSimplificada = salarioBase - descontoSimplificado;
  
  const baseCalculo = Math.min(baseCalculoReal, baseCalculoSimplificada);
  
  if (baseCalculo <= 2259.20) return 0;

  const faixas = [
    { limite: 2826.65, aliquota: 0.075, deducao: 169.44 },
    { limite: 3751.05, aliquota: 0.15, deducao: 381.44 },
    { limite: 4664.68, aliquota: 0.225, deducao: 662.77 },
    { limite: Infinity, aliquota: 0.275, deducao: 896.00 }
  ];

  for (const faixa of faixas) {
    if (baseCalculo <= faixa.limite) {
      return (baseCalculo * faixa.aliquota) - faixa.deducao;
    }
  }
  
  return 0;
}

export const formatarMoeda = (valor: number) => {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};
