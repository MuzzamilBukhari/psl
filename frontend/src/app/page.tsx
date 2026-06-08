import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[var(--bg)] flex flex-col items-center justify-center px-6 py-10 text-center">
      <section className="flex flex-col items-center gap-20">
        <div className="flex items-center gap-4 sm:gap-5">
          <div className="w-14 h-14 rounded-[16px] flex items-center justify-center text-2xl bg-[linear-gradient(135deg,var(--accent),var(--accent3))]">
            🤟
          </div>
          <div className="text-left">
            <h1 className="text-3xl sm:text-4xl font-extrabold bg-[linear-gradient(135deg,var(--accent2),var(--accent3))] bg-clip-text text-transparent">
              V2PSL
            </h1>
            <p className="text-sm text-[var(--text2)] mt-1">Voice to Pakistani Sign Language</p>
          </div>
        </div>

        <div className="max-w-3xl">
          <h2 className="text-4xl sm:text-5xl font-extrabold leading-tight max-w-3xl mx-auto text-[var(--text)]">
            Breaking the{' '}
            <span className="bg-[linear-gradient(135deg,var(--accent2),var(--accent3))] bg-clip-text text-transparent">
              communication barrier
            </span>{' '}
            in Pakistan
          </h2>
          <p className="mt-6 text-base sm:text-lg leading-8 text-[var(--text2)] max-w-2xl mx-auto">
            Speak or type in English and  bdf dwatch a real-time 3D avatar translate your words into Pakistani Sign Language using inverse kinematics.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/translate"
            className="inline-flex items-center justify-center rounded-[14px] px-9 py-4 text-base font-bold text-white bg-[linear-gradient(135deg,var(--accent),#8b5cf6)] shadow-[0_8px_32px_var(--glow)] transition-transform duration-200 hover:-translate-y-0.5"
          >
            🤟 Open Translator
          </Link>
          <Link
            href="/dictionary"
            className="inline-flex items-center justify-center rounded-[14px] px-9 py-4 text-base font-bold text-[var(--text)] bg-[var(--card)] border border-[var(--border)] transition-colors duration-200 hover:bg-[rgba(255,255,255,0.03)]"
          >
            📚 Browse Signs
          </Link>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mt-14">
          {[
            { icon: '🎙️', label: 'Voice Input' },
            { icon: '🧠', label: 'NLP Pipeline' },
            { icon: '🦾', label: 'IK Animation' },
            { icon: '🧍', label: '3D Avatar' },
            { icon: '🐍', label: 'FastAPI Backend' },
            { icon: '🗄️', label: 'PostgreSQL DB' },
          ].map(({ icon, label }) => (
            <div
              key={label}
              className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--card)] px-4 py-2 text-sm text-[var(--text2)]"
            >
              <span>{icon}</span>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
