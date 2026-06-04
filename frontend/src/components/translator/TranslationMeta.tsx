'use client';
import { useTranslatorStore } from '@/store/translatorStore';

export function TranslationMeta() {
  const { mode, notes, fingerspelledCount, tokens } = useTranslatorStore();

  const hasTranslation = tokens.length > 0;
  const allNotes = hasTranslation
    ? Array.from(new Set([mode, ...notes, fingerspelledCount > 0 ? `fingerspelled:${fingerspelledCount}` : 'dictionary-only']))
    : null;

  return (
    <section className="px-5 py-5 border-b border-[var(--border)]">
      <div className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text2)]">
        Translation Notes
      </div>
      <div className="rounded-[12px] border border-[var(--border)] bg-[var(--card)] p-4">
        <div className="mb-2 text-sm font-semibold text-[var(--text)]">{hasTranslation ? mode : 'Demo-ready prototype'}</div>
        <div className="text-xs leading-6 text-[var(--text2)]">
          {hasTranslation
            ? fingerspelledCount > 0
              ? 'Unsupported words are being fingerspelled so the avatar can still complete the sentence.'
              : 'Every output token mapped to a supported prototype sign.'
            : 'Input text is converted into a compact gloss sequence. Unsupported words fall back to fingerspelling.'}
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {(allNotes ?? ['text-to-gloss', 'IK avatar', 'fingerspell fallback']).filter(Boolean).map((note) => (
            <span
              key={note}
              className="rounded-full border border-[var(--border)] bg-[rgba(108,92,231,0.08)] px-2.5 py-1 text-[11px] font-mono text-[var(--accent2)]"
            >
              {note}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
