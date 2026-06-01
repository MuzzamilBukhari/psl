'use client';
import { useTranslatorStore } from '@/store/translatorStore';
import { useTranslation } from '@/hooks/useTranslation';

export function DictGrid() {
  const { signs, status, setInputText, avatarReady } = useTranslatorStore();
  const { translate } = useTranslation();

  const handleClick = (key: string) => {
    if (status === 'signing' || !avatarReady) return;
    const word = key.replace(/_/g, ' ');
    setInputText(word);
    translate(word);
  };

  return (
    <div className="panel-section">
      <div className="panel-label">Supported Signs</div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 6,
          maxHeight: 200,
          overflowY: 'auto',
        }}
      >
        {signs.map((sign) => (
          <div
            key={sign.key}
            title={sign.description ?? sign.label}
            onClick={() => handleClick(sign.key)}
            style={{
              padding: '6px 10px',
              background: 'var(--card)',
              borderRadius: 8,
              fontSize: 11,
              fontFamily: "'JetBrains Mono', monospace",
              color: 'var(--text2)',
              cursor: avatarReady ? 'pointer' : 'default',
              transition: 'all .2s',
              border: '1px solid transparent',
            }}
            onMouseEnter={(e) => {
              if (avatarReady) {
                (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--accent)';
                (e.currentTarget as HTMLDivElement).style.color = 'var(--text)';
              }
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLDivElement).style.borderColor = 'transparent';
              (e.currentTarget as HTMLDivElement).style.color = 'var(--text2)';
            }}
          >
            {sign.key.replace(/_/g, ' ')}
          </div>
        ))}
      </div>
    </div>
  );
}
