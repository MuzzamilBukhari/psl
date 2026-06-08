"use client";
import { useTranslatorStore } from "@/store/translatorStore";

export function GlossStrip() {
  const { tokens, activeTokenIndex } = useTranslatorStore();

  if (tokens.length === 0) {
    return (
      <section className="flex flex-col gap-6 px-6 py-6 border-b border-[var(--border)]">
        <label className="text-xs md:text-sm font-bold uppercase tracking-widest text-[var(--text-secondary)]">
          PSL Gloss Output
        </label>
        <div className="flex flex-wrap gap-3 min-h-[44px] items-center">
          <span className="text-sm text-[var(--text-muted)]">
            Gloss tokens appear here...
          </span>
        </div>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-6 px-6 py-6 border-b border-[var(--border)]">
      <label className="text-xs md:text-sm font-bold uppercase tracking-widest text-[var(--text-secondary)]">
        PSL Gloss Output
      </label>
      <div className="flex flex-wrap gap-3 min-h-[44px]">
        {tokens.map((token, i) => {
          const isActive = i === activeTokenIndex;
          const isDone = i < activeTokenIndex;

          return (
            <div
              key={`${token}-${i}`}
              id={`gt-${i}`}
              className={`rounded-[var(--radius-md)] border px-3 py-2 text-xs font-mono font-semibold transition-all duration-300 ${
                isActive
                  ? "border-[var(--accent)] bg-gradient-to-r from-[var(--accent)] to-[var(--accent-light)] text-white shadow-[var(--shadow-lg)] scale-105"
                  : isDone
                    ? "border-[var(--accent)] bg-[rgba(6,182,212,0.15)] text-[var(--accent-light)]"
                    : "border-[var(--border-light)] bg-[var(--card)] text-[var(--text-muted)]"
              }`}
            >
              {token.replace(/_/g, " ").toUpperCase()}
            </div>
          );
        })}
      </div>
    </section>
  );
}
