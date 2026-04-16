"use client";

import { useState, useCallback, useRef } from "react";

interface Props {
  onTextExtracted: (text: string, fileName: string) => void;
}

export default function PDFUploader({ onTextExtracted }: Props) {
  const [dragging, setDragging] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const extractText = useCallback(
    async (file: File) => {
      setExtracting(true);
      setFileName(file.name);
      try {
        const pdfjsLib = await import("pdfjs-dist");
        pdfjsLib.GlobalWorkerOptions.workerSrc = `${window.location.origin}/pdf.worker.min.mjs`;

        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

        let fullText = "";
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          const pageText = content.items
            .map((item) => ("str" in item ? (item as { str: string }).str : ""))
            .join(" ");
          fullText += pageText + "\n\n";
        }

        if (fullText.trim().length < 50) {
          throw new Error("PDF에서 텍스트를 거의 추출하지 못했습니다. 이미지 기반 PDF일 수 있습니다.");
        }

        onTextExtracted(fullText.trim(), file.name);
      } catch (err) {
        alert(err instanceof Error ? err.message : "PDF 처리 실패");
        setFileName(null);
      } finally {
        setExtracting(false);
      }
    },
    [onTextExtracted]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files[0];
      if (file && file.type === "application/pdf") extractText(file);
    },
    [extractText]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) extractText(file);
    },
    [extractText]
  );

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileRef.current?.click()}
        className={`w-full border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all active:scale-[0.98] ${
          dragging
            ? "border-blue-400 bg-blue-50"
            : "border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/30"
        }`}
      >
        {extracting ? (
          <>
            <div className="text-3xl animate-pulse mb-2">📄</div>
            <p className="text-slate-600 font-medium">Extracting text from PDF...</p>
            <p className="text-slate-400 text-sm mt-1">{fileName}</p>
          </>
        ) : (
          <>
            <div className="text-3xl mb-2">📄</div>
            <p className="text-slate-700 font-medium">Upload UEE PDF</p>
            <p className="text-slate-400 text-sm mt-1">Drag & drop or tap to select</p>
            <p className="text-blue-400 text-xs mt-2">e.g. UEENEEG006, UEENEEK002 ...</p>
          </>
        )}
      </div>
      <input
        ref={fileRef}
        type="file"
        accept=".pdf"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
