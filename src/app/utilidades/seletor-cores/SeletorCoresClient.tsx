'use client';

import { useState } from 'react';
import CopyButton from '@/components/CopyButton';

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
    <>
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm mb-6">
        <div className="flex items-center gap-6 mb-6">
          <div
            className="w-32 h-32 rounded-xl border-2 border-gray-200"
            style={{ backgroundColor: color }}
          />
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Escolha uma cor</label>
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-full h-12 cursor-pointer rounded"
            />
          </div>
        </div>

        <div className="space-y-3">
          {formats.map((fmt) => (
            <div key={fmt.label} className="flex items-center gap-3 bg-gray-50 rounded-lg p-3">
              <span className="text-sm font-bold text-gray-500 w-10">{fmt.label}</span>
              <code className="flex-1 font-mono text-sm">{fmt.value}</code>
              <CopyButton text={fmt.value} label="Copiar" />
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Paletas</h2>
        {palettes.map((palette) => (
          <div key={palette.name} className="mb-4">
            <p className="text-sm font-medium text-gray-700 mb-2">{palette.name}</p>
            <div className="flex gap-2">
              {palette.colors.map((c, i) => (
                <div
                  key={i}
                  className="flex-1 h-16 rounded-lg cursor-pointer"
                  style={{ backgroundColor: c }}
                  onClick={() => {
                    if (c.startsWith('#')) setColor(c);
                  }}
                  title={c}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
