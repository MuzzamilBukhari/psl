'use client';
import { useTranslatorStore } from '@/store/translatorStore';

export function GlossStrip() {
  const { tokens, activeTokenIndex } = useTranslatorStore();

  if (tokens.length === 0) {
    return (
      <div className="panel-section">
        <div className="panel-label">PSL Gloss Output</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, minHeight: 40 }}>
          <span style={{ fontSize: 12, color: 'var(--text2)' }}>Gloss tokens appear here...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="panel-section">
      <div className="panel-label">PSL Gloss Output</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, minHeight: 40 }}>
        {tokens.map((token, i) => {
          const isActive = i === activeTokenIndex;
          const isDone = i < activeTokenIndex;

          return (
            <div
              key={`${token}-${i}`}
              id={`gt-${i}`}
              style={{
                padding: '6px 12px',
                background: isActive
                  ? 'var(--accent)'
                  : isDone
                  ? 'rgba(0, 206, 201, 0.15)'
                  : 'var(--card)',
                border: '1px solid',
                borderColor: isActive
                  ? 'var(--accent)'
                  : isDone
                  ? 'var(--accent3)'
                  : 'var(--border)',
                borderRadius: 8,
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 12,
                color: isActive ? '#fff' : isDone ? 'var(--accent3)' : 'var(--text2)',
                transform: isActive ? 'scale(1.08)' : 'scale(1)',
                boxShadow: isActive ? '0 4px 16px var(--glow)' : 'none',
                transition: 'all .3s',
              }}
            >
              {token.replace(/_/g, ' ').toUpperCase()}
            </div>
          );
        })}
      </div>
    </div>
  );
}
