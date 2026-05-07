import { useState, useRef, type ChangeEvent } from 'react';
import { Upload, X, Image, Check } from 'lucide-react';

interface DesignUploaderProps {
  onDesignUpload: (url: string | null) => void;
  previewProduct?: string;
}

export default function DesignUploader({ onDesignUpload, previewProduct }: DesignUploaderProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const url = e.target?.result as string;
      setPreview(url);
      onDesignUpload(url);
    };
    reader.readAsDataURL(file);
  };

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const clearDesign = () => {
    setPreview(null);
    onDesignUpload(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      {!preview ? (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            const file = e.dataTransfer.files[0];
            if (file) handleFile(file);
          }}
          className={`cursor-pointer rounded-2xl border-2 border-dashed p-8 text-center transition-all ${
            isDragging
              ? 'border-brand-500 bg-brand-50'
              : 'border-ink-200 bg-ink-50 hover:border-brand-300 hover:bg-brand-50/50'
          }`}
        >
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-white shadow-sm">
            <Upload className="h-6 w-6 text-brand-500" />
          </div>
          <p className="mt-4 text-sm font-medium text-ink-700">
            Arrastra tu diseño aquí o haz clic para subir
          </p>
          <p className="mt-1 text-xs text-ink-400">
            PNG, JPG o SVG hasta 10MB
          </p>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={onInputChange}
            className="hidden"
          />
        </div>
      ) : (
        <div className="relative overflow-hidden rounded-2xl border border-ink-200 bg-white">
          {/* Mockup Preview */}
          <div className="relative aspect-square bg-gradient-to-br from-ink-50 to-ink-100">
            {previewProduct ? (
              <div className="relative h-full w-full">
                <img
                  src={previewProduct}
                  alt="Producto"
                  className="h-full w-full object-cover opacity-30"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <img
                    src={preview}
                    alt="Tu diseño"
                    className="max-h-[60%] max-w-[60%] rounded-lg object-contain shadow-2xl"
                  />
                </div>
              </div>
            ) : (
              <div className="flex h-full items-center justify-center">
                <img
                  src={preview}
                  alt="Tu diseño"
                  className="max-h-[80%] max-w-[80%] rounded-lg object-contain shadow-lg"
                />
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between border-t border-ink-100 p-3">
            <div className="flex items-center gap-2 text-sm text-green-600">
              <Check className="h-4 w-4" />
              <span className="font-medium">Diseño cargado</span>
            </div>
            <button
              onClick={clearDesign}
              className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-50"
            >
              <X className="h-3.5 w-3.5" />
              Cambiar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
