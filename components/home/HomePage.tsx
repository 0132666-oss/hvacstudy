"use client";

import Link from "next/link";

interface SectionCard {
  title: string;
  description: string;
  href: string;
  icon: string;
  gradient: string;
  enabled: boolean;
  badge?: string;
}

const sections: SectionCard[] = [
  {
    title: "Quiz",
    description: "UEE PDF & Notes based quiz",
    href: "/quiz",
    icon: "🎯",
    gradient: "from-blue-500 to-blue-600",
    enabled: true,
  },
  {
    title: "Learning",
    description: "Upload textbook photos & study with AI",
    href: "/study",
    icon: "📚",
    gradient: "from-orange-500 to-orange-600",
    enabled: true,
  },
  {
    title: "Math",
    description: "HVAC formulas & calculation practice",
    href: "/math",
    icon: "🔢",
    gradient: "from-emerald-500 to-emerald-600",
    enabled: true,
  },
  {
    title: "Wrong Notes",
    description: "Review your mistakes & master them",
    href: "/wrong-notes",
    icon: "📝",
    gradient: "from-red-500 to-red-600",
    enabled: true,
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6">
      <div className="max-w-lg w-full">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="text-5xl mb-4">❄️</div>
          <h1 className="text-3xl font-bold text-white mb-2">HVAC Study Tool</h1>
          <p className="text-slate-400 text-sm">
            TAFE Certificate III — Air Conditioning & Refrigeration
          </p>
        </div>

        {/* Cards */}
        <div className="space-y-4">
          {sections.map((section) => {
            const content = (
              <div
                className={`relative overflow-hidden rounded-2xl bg-slate-900 border border-slate-800 transition-all ${
                  section.enabled
                    ? "hover:border-slate-600 hover:shadow-lg hover:shadow-slate-900/50 cursor-pointer"
                    : "opacity-60 cursor-not-allowed"
                }`}
              >
                {/* Top gradient line */}
                <div className={`h-1 bg-gradient-to-r ${section.gradient}`} />

                <div className="p-5 flex items-center gap-4">
                  <div className="text-3xl">{section.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-semibold text-white">{section.title}</h2>
                      {section.badge && (
                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-700 text-slate-300">
                          {section.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-400 mt-0.5">{section.description}</p>
                  </div>
                  {section.enabled && (
                    <svg
                      className="w-5 h-5 text-slate-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  )}
                </div>
              </div>
            );

            if (section.enabled) {
              return (
                <Link key={section.title} href={section.href}>
                  {content}
                </Link>
              );
            }
            return <div key={section.title}>{content}</div>;
          })}
        </div>

        {/* Footer */}
        <p className="text-center text-slate-600 text-xs mt-8">Brisbane, QLD</p>
      </div>
    </div>
  );
}
