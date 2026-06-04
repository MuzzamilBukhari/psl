'use client';
import { useTranslatorStore } from '@/store/translatorStore';

export function GlossStrip() {
  const { tokens, activeTokenIndex } = useTranslatorStore();

  if (tokens.length === 0) {
    return (
      <section className="px-5 py-5 border-b border-[var(--border)]">
        <div className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text2)]">
          PSL Gloss Output
        </div>
        <div className="flex flex-wrap gap-2 min-h-[40px]">
          <span className="text-xs text-[var(--text2)]">Gloss tokens appear here...</span>
        </div>
      </section>
    );
  }

  return (
    <section className="px-5 py-5 border-b border-[var(--border)]">
      <div className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text2)]">
        PSL Gloss Output
      </div>
      <div className="flex flex-wrap gap-2 min-h-[40px]">
        {tokens.map((token, i) => {
          const isActive = i === activeTokenIndex;
          const isDone = i < activeTokenIndex;

          return (
            <div
              key={`${token}-${i}`}
              id={`gt-${i}`}
              className={
                `rounded-[8px] border px-3 py-2 text-[12px] font-mono transition-all duration-300 ${
                  isActive
                    ? 'border-[var(--accent)] bg-[var(--accent)] text-white shadow-[0_4px_16px_var(--glow)] scale-105'
                    : isDone
                    ? 'border-[var(--accent3)] bg-[rgba(0,206,201,0.15)] text-[var(--accent3)]'
                    : 'border-[var(--border)] bg-[var(--card)] text-[var(--text2)]'
                }`
              }
            >
              {token.replace(/_/g, ' ').toUpperCase()}
            </div>
          );
        })}
      </div>
    </section>
  );
}
