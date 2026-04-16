"use client";

import { useState, useCallback, useRef } from "react";

interface NoteImage {
  id: string;
  preview: string;
  base64: string;
  mimeType: string;
}

interface Props {
  onSubmit: (text: string, images: Array<{ base64: string; mimeType: string }>) => void;
  loading: boolean;
}

export default function NotesInput({ onSubmit, loading }: Props) {
  const [text, setText] = useState("");
  const [images, setImages] = useState<NoteImage[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);

  const addImage = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const base64 = dataUrl.split(",")[1];
      setImages((prev) => [
        ...prev,
        { id: `ni-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, preview: dataUrl, base64, mimeType: file.type },
      ]);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files) Array.from(files).forEach(addImage);
      if (e.target) e.target.value = "";
    },
    [addImage]
  );

  const removeImage = useCallback((id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
  }, []);

  const canSubmit = (text.trim().length > 0 || images.length > 0) && !loading;

  return (
    <div className="space-y-4">
      {/* Image section */}
      <div>
        <label className="text-sm font-medium text-slate-600 mb-2 block">📷 Notes Images (optional)</label>

        {/* Camera + Gallery buttons */}
        <div className="flex gap-2 mb-3">
          <button
            onClick={() => cameraRef.current?.click()}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-500 text-white font-medium text-sm active:scale-[0.97] transition-transform shadow-sm"
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
        <input ref={cameraRef} type="file" accept="image/*" capture="environment" onChange={handleFileChange} className="hidden" />
        <input ref={fileRef} type="file" accept="image/*" multiple onChange={handleFileChange} className="hidden" />

        {/* Image previews */}
        {images.length > 0 && (
          <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
            {images.map((img) => (
              <div key={img.id} className="relative flex-shrink-0">
                <img src={img.preview} alt="note" className="w-20 h-20 object-cover rounded-lg border border-slate-200" />
                <button
                  onClick={() => removeImage(img.id)}
                  className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white text-xs flex items-center justify-center shadow-sm active:scale-90"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
        {images.length > 0 && (
          <p className="text-xs text-slate-400 mt-1">{images.length} image{images.length > 1 ? "s" : ""} added</p>
        )}
      </div>

      {/* Text input */}
      <div>
        <label className="text-sm font-medium text-slate-600 mb-2 block">📝 Notes Text (optional)</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type or paste your study notes here..."
          className="w-full p-4 rounded-xl border border-slate-200 bg-white text-slate-800 placeholder:text-slate-300 focus:outline-none focus:border-blue-300 resize-none h-32"
        />
      </div>

      {/* Submit */}
      <button
        onClick={() =>
          onSubmit(text, images.map((img) => ({ base64: img.base64, mimeType: img.mimeType })))
        }
        disabled={!canSubmit}
        className="w-full py-4 rounded-xl bg-blue-500 text-white font-semibold hover:bg-blue-600 disabled:bg-slate-200 disabled:text-slate-400 transition-all active:scale-[0.98] text-base"
      >
        {loading ? "Generating Quiz..." : "Generate Quiz 🎯"}
      </button>
    </div>
  );
}
