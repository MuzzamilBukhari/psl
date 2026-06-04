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
    <section className="px-5 py-5 border-b border-[var(--border)]">
      <div className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text2)]">Supported Signs</div>
      <div className="grid grid-cols-2 gap-2 max-h-[200px] overflow-y-auto">
        {signs.map((sign) => (
          <button
            key={sign.key}
            type="button"
            title={sign.description ?? sign.label}
            onClick={() => handleClick(sign.key)}
            className={`rounded-lg border border-transparent bg-[var(--card)] px-2.5 py-2 text-[11px] font-mono text-[var(--text2)] transition-all duration-200 ${
              avatarReady ? 'cursor-pointer hover:border-[var(--accent)] hover:text-[var(--text)]' : 'cursor-default'
            }`}
          >
            {sign.key.replace(/_/g, ' ')}
          </button>
        ))}
      </div>
    </section>
  );
}
