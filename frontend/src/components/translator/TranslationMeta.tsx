"use client";
import { useTranslatorStore } from "@/store/translatorStore";

export function TranslationMeta() {
  const { mode, notes, fingerspelledCount, tokens } = useTranslatorStore();

  const hasTranslation = tokens.length > 0;
  const allNotes = hasTranslation
    ? Array.from(
        new Set([
          mode,
          ...notes,
          fingerspelledCount > 0
            ? `fingerspelled:${fingerspelledCount}`
            : "dictionary-only",
        ]),
      )
    : null;

  return (
    <section className="flex flex-col gap-6 px-6 py-6 border-b border-[var(--border)]">
      <label className="text-xs md:text-sm font-bold uppercase tracking-widest text-[var(--text-secondary)]">
        Translation Notes
      </label>
      <div className="flex flex-col gap-3 rounded-[var(--radius-lg)] border border-[var(--border-light)] bg-[var(--card-hover)] p-4">
        <div className="text-sm font-semibold text-[var(--text)]">
          {hasTranslation ? mode : "✨ Demo-ready Prototype"}
        </div>
        <p className="text-xs md:text-sm leading-relaxed text-[var(--text-secondary)]">
          {hasTranslation
            ? fingerspelledCount > 0
              ? "📝 Unsupported words are being fingerspelled so the avatar can complete the sentence."
              : "✅ Every token mapped to a supported prototype sign."
            : "🔄 Input text converts to a compact gloss sequence. Unknown words fallback to fingerspelling."}
        </p>
        <div className="flex flex-wrap gap-2 pt-2">
          {(allNotes ?? ["text-to-gloss", "IK-avatar", "fingerspell-fallback"])
            .filter(Boolean)
            .map((note) => (
              <span key={note} className="badge badge-accent text-xs">
                {note}
              </span>
            ))}
        </div>
      </div>
    </section>
  );
}
