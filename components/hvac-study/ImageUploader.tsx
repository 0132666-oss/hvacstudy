"use client";

import { useState, useCallback, useRef } from "react";
import { UploadedImage } from "@/types/study";

interface Props {
  onImagesReady: (images: UploadedImage[]) => void;
}

export default function ImageUploader({ onImagesReady }: Props) {
  const [dragging, setDragging] = useState(false);
  const [pending, setPending] = useState<UploadedImage[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);

  const addFiles = useCallback((files: File[]) => {
    const imageFiles = files.filter((f) => f.type.startsWith("image/"));
    imageFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        const base64 = dataUrl.split(",")[1];
        const image: UploadedImage = {
          id: `img-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          file,
          preview: dataUrl,
          base64,
        };
        setPending((prev) => [...prev, image]);
      };
      reader.readAsDataURL(file);
    });
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      addFiles(Array.from(e.dataTransfer.files));
    },
    [addFiles]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      if (files.length > 0) addFiles(files);
      if (e.target) e.target.value = "";
    },
    [addFiles]
  );

  const removeImage = useCallback((id: string) => {
    setPending((prev) => prev.filter((img) => img.id !== id));
  }, []);

  const handleSubmit = useCallback(() => {
    if (pending.length === 0) return;
    onImagesReady(pending);
    setPending([]);
  }, [pending, onImagesReady]);

  return (
    <div className="flex flex-col items-center gap-3 px-2">
      {/* Main upload zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileRef.current?.click()}
        className={`w-full border-2 border-dashed rounded-2xl p-8 sm:p-10 text-center cursor-pointer transition-all active:scale-[0.98] ${
          dragging
            ? "border-orange-400 bg-orange-50"
            : "border-slate-200 bg-white hover:border-orange-300 hover:bg-orange-50/30"
        }`}
      >
        <div className="text-4xl mb-3">📷</div>
        <p className="text-slate-700 font-medium mb-1">Upload study material</p>
        <p className="text-slate-400 text-sm">Tap to select (multiple OK)</p>
      </div>

      {/* Two buttons: Camera + Gallery */}
      <div className="flex gap-3 w-full">
        <button
          onClick={() => cameraRef.current?.click()}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-orange-500 text-white font-medium text-sm active:scale-[0.97] transition-transform shadow-sm"
        >
          📸 Take Photo
        </button>
        <button
          onClick={() => fileRef.current?.click()}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-100 text-slate-700 font-medium text-sm active:scale-[0.97] transition-transform"
        >
          🖼️ Gallery
        </button>
      </div>

      {/* Preview thumbnails */}
      {pending.length > 0 && (
        <div className="w-full space-y-3">
          <div className="flex flex-wrap gap-2">
            {pending.map((img) => (
              <div key={img.id} className="relative w-20 h-20 rounded-lg overflow-hidden border border-slate-200">
                <img src={img.preview} alt="" className="w-full h-full object-cover" />
                <button
                  onClick={() => removeImage(img.id)}
                  className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center"
                >
                  x
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={handleSubmit}
            className="w-full py-3 rounded-xl bg-orange-500 text-white font-semibold hover:bg-orange-600 active:scale-[0.98] transition-all"
          >
            Analyze {pending.length} image{pending.length > 1 ? "s" : ""}
          </button>
        </div>
      )}

      {/* Hidden inputs */}
      <input
        ref={cameraRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
      />
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
