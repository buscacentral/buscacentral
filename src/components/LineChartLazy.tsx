'use client';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  type ChartData,
  type ChartOptions,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip);

interface LineChartLazyProps {
  data: ChartData<'line'>;
  options?: ChartOptions<'line'>;
}

/**
 * Wrapper do gráfico de linha do Chart.js.
 *
 * É carregado via `next/dynamic` ({ ssr: false }) para que as bibliotecas
 * `chart.js` e `react-chartjs-2` fiquem fora do bundle inicial da rota e só
 * sejam baixadas quando o gráfico precisa ser renderizado.
 */
export default function LineChartLazy({ data, options }: LineChartLazyProps) {
  return <Line data={data} options={options} />;
}
