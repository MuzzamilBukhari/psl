'use client';
import { useTranslatorStore } from '@/store/translatorStore';

export function TranslationMeta() {
  const { mode, notes, fingerspelledCount, tokens } = useTranslatorStore();

  const hasTranslation = tokens.length > 0;
  const allNotes = hasTranslation
    ? Array.from(new Set([mode, ...notes, fingerspelledCount > 0 ? `fingerspelled:${fingerspelledCount}` : 'dictionary-only']))
    : null;

  return (
    <div className="panel-section">
      <div className="panel-label">Translation Notes</div>
      <div
        style={{
          padding: 14,
          background: 'var(--card)',
          border: '1px solid var(--border)',
          borderRadius: 12,
        }}
      >
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8, color: 'var(--text)' }}>
          {hasTranslation ? mode : 'Demo-ready prototype'}
        </div>
        <div style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.5 }}>
          {hasTranslation
            ? fingerspelledCount > 0
              ? 'Unsupported words are being fingerspelled so the avatar can still complete the sentence.'
              : 'Every output token mapped to a supported prototype sign.'
            : 'Input text is converted into a compact gloss sequence. Unsupported words fall back to fingerspelling.'}
        </div>
        {allNotes && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
            {allNotes.filter(Boolean).map((note) => (
              <span
                key={note}
                style={{
                  padding: '5px 9px',
                  borderRadius: 999,
                  border: '1px solid var(--border)',
                  background: 'rgba(108, 92, 231, 0.08)',
                  color: 'var(--accent2)',
                  fontSize: 11,
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                {note}
              </span>
            ))}
          </div>
        )}
        {!hasTranslation && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
            {['text-to-gloss', 'IK avatar', 'fingerspell fallback'].map((pill) => (
              <span
                key={pill}
                style={{
                  padding: '5px 9px',
                  borderRadius: 999,
                  border: '1px solid var(--border)',
                  background: 'rgba(108, 92, 231, 0.08)',
                  color: 'var(--accent2)',
                  fontSize: 11,
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                {pill}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
