"use client";

import { useState } from "react";
import { FORMULAS, CATEGORY_META } from "@/data/formulas";
import { MathCategory } from "@/types/math";

export default function FormulaView() {
  const [expanded, setExpanded] = useState<string | null>(null);

  const categories: MathCategory[] = ["ohm", "power", "efficiency", "trigonometry"];

  return (
    <div className="space-y-6">
      {categories.map((cat) => {
        const meta = CATEGORY_META[cat];
        const catFormulas = FORMULAS.filter((f) => f.category === cat);

        return (
          <div key={cat} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
            <div className="flex items-center gap-2 mb-4">
              <span
                className={`text-xs font-semibold px-2.5 py-1 rounded-full ${meta.bgColor} ${meta.textColor} border ${meta.borderColor}`}
              >
                {meta.label}
              </span>
            </div>

            <div className="space-y-2">
              {catFormulas.map((formula) => (
                <div key={formula.id}>
                  <button
                    onClick={() => setExpanded(expanded === formula.id ? null : formula.id)}
                    className="w-full text-left p-3 rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-between"
                  >
                    <span className="font-mono text-sm font-semibold text-slate-800">
                      {formula.formula}
                    </span>
                    <svg
                      className={`w-4 h-4 text-slate-400 transition-transform ${
                        expanded === formula.id ? "rotate-180" : ""
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                  </button>

                  {expanded === formula.id && (
                    <div className="px-3 pb-3">
                      <div className="p-3 rounded-lg bg-slate-50 space-y-1.5">
                        {formula.variables.map((v) => (
                          <div key={v.symbol} className="flex items-center gap-2 text-sm">
                            <span className="font-mono font-bold text-emerald-600 w-8">{v.symbol}</span>
                            <span className="text-slate-600">{v.name}</span>
                            {v.unit && <span className="text-slate-400 text-xs">({v.unit})</span>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {/* Trig quick reference */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
        <h3 className="text-sm font-semibold text-slate-700 mb-3">📐 Quick Reference</h3>
        <div className="grid grid-cols-3 gap-2">
          {[
            { fn: "sin θ", eq: "opp / hyp", desc: "반대변 / 빗변" },
            { fn: "cos θ", eq: "adj / hyp", desc: "인접변 / 빗변" },
            { fn: "tan θ", eq: "opp / adj", desc: "반대변 / 인접변" },
          ].map((item) => (
            <div key={item.fn} className="p-2 rounded-lg bg-purple-50 border border-purple-100 text-center">
              <div className="font-mono text-xs font-bold text-purple-700">{item.fn}</div>
              <div className="text-xs text-slate-600 mt-0.5">{item.eq}</div>
              <div className="text-[10px] text-slate-400 mt-0.5">{item.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
