"use client";
import { useTranslatorStore } from "@/store/translatorStore";
import { useTranslation } from "@/hooks/useTranslation";

export function DictGrid() {
  const { signs, status, setInputText, avatarReady } = useTranslatorStore();
  const { translate } = useTranslation();

  const handleClick = (key: string) => {
    if (status === "signing" || !avatarReady) return;
    const word = key.replace(/_/g, " ");
    setInputText(word);
    translate(word);
  };

  return (
    <section className="flex flex-col gap-6 px-6 py-6 border-b border-[var(--border)]">
      <label className="text-xs md:text-sm font-bold uppercase tracking-widest text-[var(--text-secondary)]">
        Supported Signs
      </label>
      <div className="grid grid-cols-2 gap-2 max-h-[220px] overflow-y-auto">
        {signs.map((sign) => (
          <button
            key={sign.key}
            type="button"
            title={sign.description ?? sign.label}
            onClick={() => handleClick(sign.key)}
            className={`rounded-[var(--radius-md)] border px-3 py-2 text-xs font-semibold transition-all duration-300 ${
              avatarReady
                ? "border-[var(--border-light)] bg-[var(--card)] text-[var(--text-secondary)] hover:border-[var(--primary)] hover:bg-[var(--card-hover)] hover:text-[var(--primary-light)] cursor-pointer"
                : "border-[var(--border)] bg-[var(--card)] text-[var(--text-muted)] cursor-default"
            }`}
          >
            {sign.key.replace(/_/g, " ")}
          </button>
        ))}
      </div>
    </section>
  );
}
