"use client";

import { useState, useCallback, useRef } from "react";
import { UploadedImage } from "@/types/study";

interface Props {
  onImageReady: (image: UploadedImage) => void;
}

export default function ImageUploader({ onImageReady }: Props) {
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback(
    (file: File) => {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        const base64 = dataUrl.split(",")[1];
        const image: UploadedImage = {
          id: `img-${Date.now()}`,
          file,
          preview: dataUrl,
          base64,
        };
        onImageReady(image);
      };
      reader.readAsDataURL(file);
    },
    [onImageReady]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files[0];
      if (file && file.type.startsWith("image/")) processFile(file);
    },
    [processFile]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) processFile(file);
      if (e.target) e.target.value = "";
    },
    [processFile]
  );

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
        <p className="text-slate-400 text-sm">Tap to select from gallery</p>
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
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
