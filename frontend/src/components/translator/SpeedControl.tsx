'use client';
import { useTranslatorStore } from '@/store/translatorStore';

export function SpeedControl() {
  const { speed, setSpeed } = useTranslatorStore();

  return (
    <section className="px-5 py-5 border-b border-[var(--border)]">
      <div className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text2)]">Speed</div>
      <div className="flex items-center gap-3">
        <span className="font-mono text-[12px] text-[var(--text2)]">🐢</span>
        <input
          type="range"
          id="speedSlider"
          min={0.3}
          max={2}
          step={0.1}
          value={speed}
          onChange={(e) => setSpeed(parseFloat(e.target.value))}
          className="flex-1 accent-[var(--accent)]"
        />
        <span className="min-w-[36px] font-mono text-[12px] text-[var(--accent2)]">{speed.toFixed(1)}x</span>
      </div>
    </section>
  );
}
