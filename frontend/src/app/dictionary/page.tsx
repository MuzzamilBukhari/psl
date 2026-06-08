import { api, Sign } from "@/lib/api";
import Link from "next/link";

const CATEGORY_COLORS: Record<string, string> = {
  greeting: "from-[var(--primary)] to-[var(--primary-light)]",
  social: "from-[var(--accent)] to-[var(--accent-light)]",
  emotion: "from-pink-500 to-pink-400",
  question: "from-yellow-500 to-yellow-400",
  pronoun: "from-purple-500 to-purple-400",
  affirmation: "from-green-500 to-green-400",
  negation: "from-red-500 to-red-400",
  action: "from-blue-500 to-blue-400",
  basic_needs: "from-cyan-500 to-cyan-400",
  places: "from-orange-500 to-orange-400",
  education: "from-slate-400 to-slate-300",
};

export const dynamic = "force-dynamic";

export default async function DictionaryPage() {
  let signs = await api.getSigns().catch(() => []);

  const grouped = signs.reduce<Record<string, Sign[]>>((acc, sign) => {
    const cat = sign.category ?? "other";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(sign);
    return acc;
  }, {});

  return (
    <div className="main-layout">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-[var(--border)] bg-[rgba(10,14,39,0.85)] backdrop-blur-xl">
        <div className="flex items-center justify-between px-6 md:px-8 py-4 max-w-7xl mx-auto">
          <Link
            href="/"
            className="flex items-center gap-3 no-underline hover:opacity-80 transition-opacity duration-300"
          >
            <div className="w-10 h-10 rounded-[var(--radius-md)] flex items-center justify-center text-xl bg-gradient-to-br from-[var(--primary)] to-[var(--accent)]">
              🤟
            </div>
            <div className="flex flex-col">
              <div className="text-lg font-bold text-[var(--text)]">V2PSL</div>
              <div className="text-xs text-[var(--text-muted)]">Dictionary</div>
            </div>
          </Link>
          <Link href="/translate" className="btn-primary text-sm">
            Open Translator →
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-col gap-6 px-6 md:px-8 py-8 max-w-7xl mx-auto w-full pb-16">
        {/* Page Heading */}
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl md:text-4xl font-bold text-[var(--text)]">
            PSL Sign Dictionary
          </h1>
          <p className="text-[var(--text-secondary)]">
            {signs.length} signs available — click a sign in the translator to
            animate it.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="flex flex-col gap-6">
          {Object.entries(grouped).map(([category, catSigns]) => (
            <section key={category} className="flex flex-col gap-3">
              {/* Category Header */}
              <div className="flex items-center gap-3">
                <div
                  className={`h-3 w-3 rounded-full bg-gradient-to-r ${CATEGORY_COLORS[category] ?? "from-[var(--primary)] to-[var(--primary-light)]"}`}
                />
                <h2 className="text-sm md:text-base font-bold uppercase tracking-widest text-[var(--text-secondary)]">
                  {category.replace(/_/g, " ")}
                  <span className="ml-2 text-[var(--text-muted)] font-normal">
                    ({catSigns.length})
                  </span>
                </h2>
              </div>

              {/* Signs Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {catSigns.map((sign) => (
                  <div
                    key={sign.key}
                    className="card group hover:shadow-[var(--shadow-lg)] hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <h3 className="text-base font-semibold text-[var(--text)] flex-1">
                        {sign.label}
                      </h3>
                      <span className="badge badge-accent text-xs font-mono whitespace-nowrap">
                        {sign.key}
                      </span>
                    </div>

                    {sign.description && (
                      <p className="text-sm leading-relaxed text-[var(--text-secondary)] mb-3">
                        {sign.description}
                      </p>
                    )}

                    <div className="text-xs text-[var(--text-muted)] font-medium">
                      {sign.keyframes.length} keyframe
                      {sign.keyframes.length !== 1 ? "s" : ""}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>
    </div>
  );
}
