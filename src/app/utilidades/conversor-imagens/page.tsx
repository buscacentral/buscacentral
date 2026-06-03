'use client';

import { useState, useRef } from 'react';

export default function ConversorImagens() {
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
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Conversor de Imagens</h1>
      <p className="text-gray-600 mb-8">
        Converta imagens entre WebP, PNG e JPG. Tudo acontece no seu navegador, sem upload para servidores.
      </p>

      <canvas ref={canvasRef} className="hidden" />

      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center mb-6 hover:border-blue-400 transition-colors cursor-pointer"
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
            <img src={originalImage} alt="Original" className="max-h-48 mx-auto mb-4 rounded" />
            <p className="text-sm text-gray-500">{fileName} ({formatSize(originalSize)})</p>
          </div>
        ) : (
          <div>
            <p className="text-4xl mb-2">🖼️</p>
            <p className="text-gray-600">Arraste uma imagem ou clique para selecionar</p>
            <p className="text-sm text-gray-400 mt-1">PNG, JPG, WebP, GIF</p>
          </div>
        )}
      </div>

      {originalImage && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm mb-6">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Formato de saída</label>
              <div className="flex gap-2">
                {(['image/webp', 'image/png', 'image/jpeg'] as const).map((fmt) => (
                  <button
                    key={fmt}
                    onClick={() => setFormat(fmt)}
                    className={`flex-1 py-2 px-3 rounded-lg font-medium text-sm transition-colors ${
                      format === fmt ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {fmt.split('/')[1].toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Qualidade: {quality}%
              </label>
              <input
                type="range"
                min="10"
                max="100"
                value={quality}
                onChange={(e) => setQuality(parseInt(e.target.value))}
                className="w-full"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={convertImage}
              className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Converter Imagem
            </button>
            {convertedImage && (
              <button
                onClick={handleDownload}
                className="bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                Download
              </button>
            )}
          </div>

          {convertedImage && (
            <div className="mt-4 bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-500">Original:</span>
                <span className="font-medium">{formatSize(originalSize)}</span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-500">Convertido:</span>
                <span className="font-medium">{formatSize(convertedSize)}</span>
              </div>
              {reduction > 0 && (
                <div className="flex items-center justify-between text-green-600 font-bold">
                  <span>Redução:</span>
                  <span>{reduction}%</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
