import { useState, useRef, type ChangeEvent, type MouseEvent, type TouchEvent, type WheelEvent } from 'react';
import { Upload, X, Check, Move, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

interface DesignUploaderProps {
  onDesignUpload: (url: string | null, position?: { x: number; y: number; scale: number }) => void;
  previewProduct?: string;
}

export default function DesignUploader({ onDesignUpload, previewProduct }: DesignUploaderProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const [isDraggingImage, setIsDraggingImage] = useState(false);
  const [position, setPosition] = useState({ x: 50, y: 50, scale: 1 });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imgStart, setImgStart] = useState({ x: 0, y: 0 });
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const url = e.target?.result as string;
      setPreview(url);
      setPosition({ x: 50, y: 50, scale: 1 });
      onDesignUpload(url, { x: 50, y: 50, scale: 1 });
    };
    reader.readAsDataURL(file);
  };

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const clearDesign = () => {
    setPreview(null);
    setPosition({ x: 50, y: 50, scale: 1 });
    onDesignUpload(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  // Mouse handlers for dragging
  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    e.preventDefault();
    setIsDraggingImage(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    setImgStart({ x: position.x, y: position.y });
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!isDraggingImage || !containerRef.current) return;
    e.preventDefault();
    
    const rect = containerRef.current.getBoundingClientRect();
    const deltaX = ((e.clientX - dragStart.x) / rect.width) * 100;
    const deltaY = ((e.clientY - dragStart.y) / rect.height) * 100;
    
    const newX = Math.max(0, Math.min(100, imgStart.x + deltaX));
    const newY = Math.max(0, Math.min(100, imgStart.y + deltaY));
    
    const newPos = { ...position, x: newX, y: newY };
    setPosition(newPos);
    onDesignUpload(preview, newPos);
  };

  const handleMouseUp = () => {
    setIsDraggingImage(false);
  };

  // Touch handlers for mobile
  const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    if (!containerRef.current || e.touches.length !== 1) return;
    const touch = e.touches[0];
    setIsDraggingImage(true);
    setDragStart({ x: touch.clientX, y: touch.clientY });
    setImgStart({ x: position.x, y: position.y });
  };

  const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    if (!isDraggingImage || !containerRef.current || e.touches.length !== 1) return;
    e.preventDefault();
    
    const touch = e.touches[0];
    const rect = containerRef.current.getBoundingClientRect();
    const deltaX = ((touch.clientX - dragStart.x) / rect.width) * 100;
    const deltaY = ((touch.clientY - dragStart.y) / rect.height) * 100;
    
    const newX = Math.max(0, Math.min(100, imgStart.x + deltaX));
    const newY = Math.max(0, Math.min(100, imgStart.y + deltaY));
    
    const newPos = { ...position, x: newX, y: newY };
    setPosition(newPos);
    onDesignUpload(preview, newPos);
  };

  const handleTouchEnd = () => {
    setIsDraggingImage(false);
  };

  // Zoom with wheel (Ctrl/Cmd + scroll)
  const handleWheel = (e: WheelEvent<HTMLDivElement>) => {
    if (!e.ctrlKey && !e.metaKey) return; // Only zoom with Ctrl/Cmd held
    e.preventDefault();
    
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    const newScale = Math.max(0.2, Math.min(5, position.scale + delta));
    const newPos = { ...position, scale: Number(newScale.toFixed(2)) };
    setPosition(newPos);
    onDesignUpload(preview, newPos);
  };

  // Zoom handlers
  const handleZoomIn = () => {
    const newScale = Math.min(5, position.scale + 0.2);
    const newPos = { ...position, scale: Number(newScale.toFixed(2)) };
    setPosition(newPos);
    onDesignUpload(preview, newPos);
  };

  const handleZoomOut = () => {
    const newScale = Math.max(0.2, position.scale - 0.2);
    const newPos = { ...position, scale: Number(newScale.toFixed(2)) };
    setPosition(newPos);
    onDesignUpload(preview, newPos);
  };

  const handleReset = () => {
    const newPos = { x: 50, y: 50, scale: 1 };
    setPosition(newPos);
    onDesignUpload(preview, newPos);
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      {!preview ? (
        <div
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setIsDraggingFile(true); }}
          onDragLeave={() => setIsDraggingFile(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDraggingFile(false);
            const file = e.dataTransfer.files[0];
            if (file) handleFile(file);
          }}
          className={`cursor-pointer rounded-2xl border-2 border-dashed p-8 text-center transition-all ${
            isDraggingFile
              ? 'border-[#0F4CFF] bg-[#0F4CFF]/10'
              : 'border-gray-200 bg-gray-50 hover:border-[#0F4CFF]/50 hover:bg-[#0F4CFF]/5'
          }`}
        >
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-white shadow-sm">
            <Upload className="h-6 w-6 text-[#0F4CFF]" />
          </div>
          <p className="mt-4 text-sm font-medium text-gray-700">
            Arrastra tu diseño aquí o haz clic para subir
          </p>
          <p className="mt-1 text-xs text-gray-400">
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
        <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white">
          {/* Mockup Preview with Draggable Image */}
          <div 
            ref={containerRef}
            className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden select-none"
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onWheel={handleWheel}
          >
            {previewProduct ? (
              <div className="relative h-full w-full">
                <img
                  src={previewProduct}
                  alt="Producto"
                  className="h-full w-full object-cover"
                />
                {/* Design overlay - draggable */}
                <div
                  className={`absolute ${isDraggingImage ? 'cursor-grabbing' : 'cursor-grab'}`}
                  style={{
                    left: `${position.x}%`,
                    top: `${position.y}%`,
                    transform: `translate(-50%, -50%) scale(${position.scale})`,
                    transition: isDraggingImage ? 'none' : 'transform 0.1s ease-out',
                  }}
                  onMouseDown={handleMouseDown}
                  onTouchStart={handleTouchStart}
                >
                  <img
                    src={preview}
                    alt="Tu diseño"
                    className="h-[150px] w-[150px] rounded-lg object-contain shadow-2xl pointer-events-none"
                    draggable={false}
                    style={{
                      imageRendering: 'auto',
                    }}
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

          {/* Controls */}
          {previewProduct && (
            <div className="flex items-center justify-between border-t border-gray-100 p-3">
              <div className="flex items-center gap-1">
                <button
                  onClick={handleZoomOut}
                  className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-[#111827] transition-colors"
                  title="Alejar"
                >
                  <ZoomOut className="h-4 w-4" />
                </button>
                <span className="px-2 text-xs font-medium text-gray-600 min-w-[3.5rem] text-center">
                  {Math.round(position.scale * 100)}%
                </span>
                <button
                  onClick={handleZoomIn}
                  className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-[#111827] transition-colors"
                  title="Acercar"
                >
                  <ZoomIn className="h-4 w-4" />
                </button>
                <button
                  onClick={handleReset}
                  className="ml-2 rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-[#111827] transition-colors"
                  title="Centrar y resetear"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-[#00D084]">
                <Move className="h-4 w-4" />
                <span className="text-xs font-medium hidden sm:inline">Arrastra para posicionar</span>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between border-t border-gray-100 p-3">
            <div className="flex items-center gap-2 text-sm text-[#00D084]">
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