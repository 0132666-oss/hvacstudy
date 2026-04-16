"use client";

import { ValidationResult } from "@/hooks/useValidation";

interface Props {
  validating: boolean;
  result: ValidationResult | null;
}

export default function ValidationBadge({ validating, result }: Props) {
  if (validating) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-sm">
        <span className="animate-pulse">⏳</span>
        <span className="text-amber-700">Validating questions...</span>
      </div>
    );
  }

  if (!result) return null;

  if (result.status === "passed") {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-50 border border-green-200 text-sm">
        <span>✅</span>
        <span className="text-green-700">All questions verified</span>
      </div>
    );
  }

  if (result.status === "corrected") {
    const correctedCount = result.corrections.filter((c) => !c.isCorrect).length;
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-sm">
        <span>⚠️</span>
        <span className="text-amber-700">
          {correctedCount} question{correctedCount > 1 ? "s" : ""} auto-corrected
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-sm">
      <span>ℹ️</span>
      <span className="text-slate-600">Using original questions</span>
    </div>
  );
}
