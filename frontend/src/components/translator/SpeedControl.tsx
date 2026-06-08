"use client";
import { useTranslatorStore } from "@/store/translatorStore";

export function SpeedControl() {
  const { speed, setSpeed } = useTranslatorStore();

  return (
    <section className="flex flex-col gap-6 px-6 py-6 border-b border-[var(--border)]">
      <label className="text-xs md:text-sm font-bold uppercase tracking-widest text-[var(--text-secondary)]">
        Animation Speed
      </label>
      <div className="flex items-center gap-4">
        <span className="text-xl">🐢</span>
        <input
          type="range"
          id="speedSlider"
          min={0.3}
          max={2}
          step={0.1}
          value={speed}
          onChange={(e) => setSpeed(parseFloat(e.target.value))}
          className="flex-1 accent-[var(--primary)] cursor-pointer"
        />
        <span className="min-w-[44px] text-center font-mono text-sm font-semibold text-[var(--primary-light)]">
          {speed.toFixed(1)}x
        </span>
      </div>
    </section>
  );
}
