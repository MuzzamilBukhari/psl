'use client';
import { useTranslatorStore } from '@/store/translatorStore';

export function SpeedControl() {
  const { speed, setSpeed } = useTranslatorStore();

  return (
    <div className="panel-section">
      <div className="panel-label">Speed</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: 'var(--text2)' }}>🐢</span>
        <input
          type="range"
          id="speedSlider"
          min={0.3}
          max={2}
          step={0.1}
          value={speed}
          onChange={(e) => setSpeed(parseFloat(e.target.value))}
          style={{ flex: 1, accentColor: 'var(--accent)' }}
        />
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 12,
            color: 'var(--accent2)',
            minWidth: 36,
          }}
        >
          {speed.toFixed(1)}x
        </span>
      </div>
    </div>
  );
}
