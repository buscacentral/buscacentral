'use client';

import { useState, useRef } from 'react';
import NextImage from 'next/image';
import { Button } from '@/components/ui/Button';
import { ResultCard } from '@/components/ui/ResultCard';

export default function ConversorImagensClient() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [convertedImage, setConvertedImage] = useState<string | null>(null);
  const [format, setFormat] = useState<'image/webp' | 'image/png' | 'image/jpeg'>('image/webp');
  const [quality, setQuality] = useState(80);
  const [originalSize, setOriginalSize] = useState(0);
  const [convertedSize, setConvertedSize] = useState(0);
  const [fileName, setFileName] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setOriginalSize(file.size);
    setConvertedImage(null);
    setConvertedSize(0);

    const reader = new FileReader();
    reader.onload = (event) => {
      setOriginalImage(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setFileName(file.name);
      setOriginalSize(file.size);
      setConvertedImage(null);
      setConvertedSize(0);

      const reader = new FileReader();
      reader.onload = (event) => {
        setOriginalImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const convertImage = () => {
    if (!originalImage || !canvasRef.current) return;

    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current!;
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0);

      const dataUrl = canvas.toDataURL(format, quality / 100);
      setConvertedImage(dataUrl);
      
      const base64Length = dataUrl.split(',')[1].length;
      const sizeInBytes = Math.round((base64Length * 3) / 4);
      setConvertedSize(sizeInBytes);
    };
    img.src = originalImage;
  };

  const handleDownload = () => {
    if (!convertedImage) return;
    const ext = format.split('/')[1];
    const link = document.createElement('a');
    link.download = `${fileName.split('.')[0]}.${ext}`;
    link.href = convertedImage;
    link.click();
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const reduction = originalSize > 0 && convertedSize > 0
    ? Math.round(((originalSize - convertedSize) / originalSize) * 100)
    : 0;

  return (
    <>
      <canvas ref={canvasRef} className="hidden" />

    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-12">
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          {originalImage ? (
            <div>
              <NextImage src={originalImage} alt="Original" width={300} height={200} unoptimized className="max-h-48 w-auto mx-auto mb-4 rounded-lg shadow-sm" />
              <p className="text-sm font-medium text-slate-700">{fileName} ({formatSize(originalSize)})</p>
              <p className="text-xs text-sky-600 mt-2 font-medium">Clique para trocar a imagem</p>
            </div>
          ) : (
            <div className="py-8">
              <p className="text-5xl mb-4">🖼️</p>
              <p className="text-lg font-medium text-slate-800">Arraste uma imagem ou clique para selecionar</p>
              <p className="text-sm text-slate-500 mt-2 font-medium">Formatos suportados: PNG, JPG, WebP, GIF</p>
            </div>
          )}
        </div>
      </div>

      {originalImage && (
        <div className="lg:col-span-12">
          <ResultCard title="Opções de Conversão">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Formato de saída</label>
                <div className="flex gap-2">
                  {(['image/webp', 'image/png', 'image/jpeg'] as const).map((fmt) => (
                    <button
                      key={fmt}
                      onClick={() => setFormat(fmt)}
                      className={`flex-1 py-2.5 px-3 rounded-lg font-medium text-sm transition-colors ${
                        format === fmt ? 'bg-sky-600 text-white shadow-sm' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {fmt.split('/')[1].toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Qualidade: <span className="text-sky-700 font-bold">{quality}%</span>
                </label>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={quality}
                  onChange={(e) => setQuality(parseInt(e.target.value))}
                  className="w-full accent-sky-600"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <Button onClick={convertImage} className="flex-1">
                Converter Imagem
              </Button>
              {convertedImage && (
                <Button
                  onClick={handleDownload}
                  variant="success"
                  className="flex-1"
                >
                  Fazer Download
                </Button>
              )}
            </div>

            {convertedImage && (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 shadow-sm">
                <div className="flex items-center justify-between mb-3 border-b border-slate-200 pb-2">
                  <span className="text-sm font-medium text-slate-600">Tamanho Original:</span>
                  <span className="font-bold text-slate-800">{formatSize(originalSize)}</span>
                </div>
                <div className="flex items-center justify-between mb-3 border-b border-slate-200 pb-2">
                  <span className="text-sm font-medium text-slate-600">Tamanho Convertido:</span>
                  <span className="font-bold text-sky-700">{formatSize(convertedSize)}</span>
                </div>
                {reduction > 0 && (
                  <div className="flex items-center justify-between text-emerald-600 font-bold pt-1">
                    <span>Redução de Tamanho:</span>
                    <span>{reduction}% menor</span>
                  </div>
                )}
                {reduction <= 0 && (
                  <div className="flex items-center justify-between text-amber-600 font-bold pt-1 text-sm">
                    <span>Nota:</span>
                    <span>A imagem convertida ficou maior.</span>
                  </div>
                )}
              </div>
            )}
          </ResultCard>
        </div>
      )}
    </div>
    </>
  );
}
