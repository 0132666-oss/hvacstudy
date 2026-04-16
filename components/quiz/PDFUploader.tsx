"use client";

import { useState, useCallback, useRef } from "react";

interface Props {
  onTextExtracted: (text: string, fileName: string) => void;
}

export default function PDFUploader({ onTextExtracted }: Props) {
  const [dragging, setDragging] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [progress, setProgress] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const extractFromFile = useCallback(async (file: File): Promise<string> => {
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
    return fullText;
  }, []);

  const processFiles = useCallback(
    async (files: File[]) => {
      const pdfFiles = files.filter((f) => f.type === "application/pdf");
      if (pdfFiles.length === 0) return;

      setExtracting(true);
      try {
        let combinedText = "";
        const names: string[] = [];

        for (let i = 0; i < pdfFiles.length; i++) {
          const file = pdfFiles[i];
          setProgress(`Extracting ${i + 1}/${pdfFiles.length}: ${file.name}`);
          names.push(file.name);
          const text = await extractFromFile(file);
          combinedText += `--- ${file.name} ---\n${text}\n\n`;
        }

        if (combinedText.trim().length < 50) {
          throw new Error("PDF에서 텍스트를 거의 추출하지 못했습니다.");
        }

        const displayName = pdfFiles.length === 1
          ? names[0]
          : `${names[0]} + ${pdfFiles.length - 1} more`;

        onTextExtracted(combinedText.trim(), displayName);
      } catch (err) {
        alert(err instanceof Error ? err.message : "PDF 처리 실패");
      } finally {
        setExtracting(false);
        setProgress("");
      }
    },
    [extractFromFile, onTextExtracted]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const files = Array.from(e.dataTransfer.files);
      processFiles(files);
    },
    [processFiles]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      if (files.length > 0) processFiles(files);
      if (fileRef.current) fileRef.current.value = "";
    },
    [processFiles]
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
            <p className="text-slate-600 font-medium">Extracting text from PDFs...</p>
            <p className="text-slate-400 text-sm mt-1">{progress}</p>
          </>
        ) : (
          <>
            <div className="text-3xl mb-2">📄</div>
            <p className="text-slate-700 font-medium">Upload UEE PDF</p>
            <p className="text-slate-400 text-sm mt-1">Drag & drop or tap to select (multiple OK)</p>
            <p className="text-blue-400 text-xs mt-2">e.g. UEENEEG006, UEENEEK002 ...</p>
          </>
        )}
      </div>
      <input
        ref={fileRef}
        type="file"
        accept=".pdf"
        multiple
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
