'use client';

import { useState } from 'react';
import CopyButton from '@/components/CopyButton';
import { ResultCard } from '@/components/ui/ResultCard';

export default function SeletorCoresClient() {
  const [color, setColor] = useState('#3B82F6');

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : { r: 0, g: 0, b: 0 };
  };

  const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
          break;
        case g:
          h = ((b - r) / d + 2) / 6;
          break;
        case b:
          h = ((r - g) / d + 4) / 6;
          break;
      }
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100),
    };
  };

  const rgb = hexToRgb(color);
  const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

  const formats = [
    { label: 'HEX', value: color.toUpperCase() },
    { label: 'RGB', value: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` },
    { label: 'HSL', value: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` },
  ];

  const complementary = `#${((1 << 24) ^ (parseInt(color.slice(1), 16))).toString(16).slice(1).padStart(6, '0')}`;

  const palettes = [
    { name: 'Complementar', colors: [color, complementary] },
    {
      name: 'Análoga',
      colors: [
        `hsl(${(hsl.h - 30 + 360) % 360}, ${hsl.s}%, ${hsl.l}%)`,
        color,
        `hsl(${(hsl.h + 30) % 360}, ${hsl.s}%, ${hsl.l}%)`,
      ],
    },
    {
      name: 'Triádica',
      colors: [
        color,
        `hsl(${(hsl.h + 120) % 360}, ${hsl.s}%, ${hsl.l}%)`,
        `hsl(${(hsl.h + 240) % 360}, ${hsl.s}%, ${hsl.l}%)`,
      ],
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-6 space-y-6">
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row items-center gap-6 mb-8">
            <div
              className="w-32 h-32 rounded-xl shadow-inner border border-slate-200 transition-colors"
              style={{ backgroundColor: color }}
            />
            <div className="flex-1 w-full">
              <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wider">Escolha uma cor</label>
              <div className="relative">
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-full h-14 cursor-pointer rounded-lg bg-transparent border-0 p-0"
                />
                <div className="absolute inset-0 pointer-events-none rounded-lg border-2 border-slate-200/50 shadow-sm mix-blend-overlay"></div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {formats.map((fmt) => (
              <div key={fmt.label} className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-lg p-3 shadow-sm hover:border-sky-200 transition-colors group">
                <span className="text-xs font-black text-slate-400 w-12 uppercase tracking-wider">{fmt.label}</span>
                <code className="flex-1 font-mono text-sm text-slate-800">{fmt.value}</code>
                <CopyButton text={fmt.value} label="Copiar" className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="lg:col-span-6">
        <ResultCard title="Paletas de Cores" className="h-full">
          <div className="space-y-8">
            {palettes.map((palette) => (
              <div key={palette.name}>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">{palette.name}</p>
                <div className="flex gap-2 h-20 rounded-xl overflow-hidden border border-slate-200 shadow-sm bg-white">
                  {palette.colors.map((c, i) => (
                    <div
                      key={i}
                      className="flex-1 relative group cursor-pointer hover:flex-[1.5] transition-all duration-300"
                      style={{ backgroundColor: c }}
                      onClick={() => {
                        if (c.startsWith('#')) setColor(c);
                        else {
                          // Very basic HSL to HEX conversion could be added here if needed to make click work for all.
                          // Currently only works for Complementar (which is hex).
                        }
                      }}
                      title={c}
                    >
                       <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/20 transition-opacity backdrop-blur-[2px]">
                         <span className="text-white text-xs font-mono font-bold bg-black/40 px-2 py-1 rounded">{c}</span>
                       </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ResultCard>
      </div>
    </div>
  );
}
