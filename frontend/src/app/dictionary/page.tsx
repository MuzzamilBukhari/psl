import { api, Sign } from '@/lib/api';
import Link from 'next/link';

const CATEGORY_COLORS: Record<string, string> = {
  greeting: '#6c5ce7',
  social: '#00cec9',
  emotion: '#fd79a8',
  question: '#fdcb6e',
  pronoun: '#a29bfe',
  affirmation: '#55efc4',
  negation: '#e17055',
  action: '#74b9ff',
  basic_needs: '#81ecec',
  places: '#fab1a0',
  education: '#dfe6e9',
};

export const dynamic = 'force-dynamic';

export default async function DictionaryPage() {
  let signs = await api.getSigns().catch(() => []);

  const grouped = signs.reduce<Record<string, Sign[]>>((acc, sign) => {
    const cat = sign.category ?? 'other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(sign);
    return acc;
  }, {});

  return (
    <main className="min-h-screen bg-[var(--bg)] pb-16">
      <header className="sticky top-0 z-10 flex items-center justify-between px-8 py-4 border-b border-[var(--border)] bg-[rgba(18,18,26,0.8)] backdrop-blur-xl">
        <Link href="/" className="flex items-center gap-3 no-underline">
          <div className="text-2xl font-bold text-[var(--accent2)]">🤟 V2PSL</div>
        </Link>
        <Link
          href="/translate"
          className="rounded-xl bg-[linear-gradient(135deg,var(--accent),#8b5cf6)] px-5 py-2 text-sm font-semibold text-white transition hover:opacity-90"
        >
          Open Translator →
        </Link>
      </header>

      <div className="mx-auto max-w-5xl px-6 py-10">
        <h1 className="text-3xl font-extrabold text-[var(--text)] mb-2">PSL Sign Dictionary</h1>
        <p className="text-sm text-[var(--text2)] mb-10">
          {signs.length} signs available — click a sign in the translator to animate it.
        </p>

        {Object.entries(grouped).map(([category, catSigns]) => (
          <section key={category} className="mb-10">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span
                className="inline-block h-2.5 w-2.5 rounded-full"
                style={{ background: CATEGORY_COLORS[category] ?? 'var(--accent)' }}
              />
              <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text2)]">
                {category.replace(/_/g, ' ')} ({catSigns.length})
              </h2>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {catSigns.map((sign) => (
                <div
                  key={sign.key}
                  className="group rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--accent)]"
                >
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <span className="text-sm font-bold text-[var(--text)]">{sign.label}</span>
                    <span className="rounded-lg bg-[rgba(108,92,231,0.1)] px-2 py-1 text-[10px] font-mono text-[var(--accent2)]">
                      {sign.key}
                    </span>
                  </div>
                  {sign.description && (
                    <p className="text-xs leading-6 text-[var(--text2)]">{sign.description}</p>
                  )}
                  <div className="mt-2 text-[11px] text-[var(--text2)]">
                    {sign.keyframes.length} keyframe{sign.keyframes.length !== 1 ? 's' : ''}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}
