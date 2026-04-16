"use client";

import { TriangleDiagram } from "@/types/math";

interface Props {
  triangle: TriangleDiagram;
}

export default function TriangleVisual({ triangle }: Props) {
  const { sideA, sideB, sideC, angleTheta, unknownSide } = triangle;
  const unknownColor = "#f97316"; // orange-500
  const knownColor = "#334155"; // slate-700

  return (
    <div className="flex justify-center my-4">
      <svg viewBox="0 0 200 180" className="w-48 h-44">
        {/* Triangle: right angle at bottom-right */}
        <polygon
          points="20,150 180,150 180,30"
          fill="none"
          stroke="#94a3b8"
          strokeWidth="2"
        />

        {/* Right angle marker (bottom-right) */}
        <polyline
          points="165,150 165,135 180,135"
          fill="none"
          stroke="#94a3b8"
          strokeWidth="1.5"
        />

        {/* Theta arc (bottom-left) */}
        <path d="M 50,150 A 30,30 0 0,0 35,130" fill="none" stroke="#94a3b8" strokeWidth="1.5" />
        <text x="52" y="140" fontSize="12" fill="#94a3b8">
          θ
        </text>
        {angleTheta != null && (
          <text x="52" y="152" fontSize="10" fill={unknownSide === "theta" ? unknownColor : knownColor}>
            {unknownSide === "theta" ? "?" : `${angleTheta}°`}
          </text>
        )}

        {/* Side a - opposite (right side, vertical) = 반대변 */}
        <text
          x="188"
          y="95"
          fontSize="11"
          fill={unknownSide === "a" ? unknownColor : knownColor}
          fontWeight={unknownSide === "a" ? "bold" : "normal"}
        >
          {sideA != null ? (unknownSide === "a" ? "a=?" : `a=${sideA}`) : "a"}
        </text>
        <text x="188" y="108" fontSize="9" fill="#94a3b8">
          반대변
        </text>

        {/* Side b - adjacent (bottom) = 인접변 */}
        <text
          x="90"
          y="170"
          fontSize="11"
          fill={unknownSide === "b" ? unknownColor : knownColor}
          fontWeight={unknownSide === "b" ? "bold" : "normal"}
          textAnchor="middle"
        >
          {sideB != null ? (unknownSide === "b" ? "b=?" : `b=${sideB}`) : "b"}
        </text>
        <text x="90" y="180" fontSize="9" fill="#94a3b8" textAnchor="middle">
          인접변
        </text>

        {/* Side c - hypotenuse (diagonal) = 빗변 */}
        <text
          x="80"
          y="80"
          fontSize="11"
          fill={unknownSide === "c" ? unknownColor : knownColor}
          fontWeight={unknownSide === "c" ? "bold" : "normal"}
          transform="rotate(-37, 80, 80)"
        >
          {sideC != null ? (unknownSide === "c" ? "c=?" : `c=${sideC}`) : "c"}
        </text>
        <text x="80" y="93" fontSize="9" fill="#94a3b8" transform="rotate(-37, 80, 93)">
          빗변
        </text>
      </svg>
    </div>
  );
}
