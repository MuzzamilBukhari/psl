import Link from "next/link";

export default function HomePage() {
  return (
    <main className="main-layout px-6 py-16 md:py-20 items-center justify-center">
      <section className="flex flex-col gap-12 items-center w-full max-w-4xl">
        {/* Logo & Branding */}
        <div className="flex flex-col gap-6 items-center">
          <div className="flex gap-4 items-center">
            <div className="w-20 h-20 rounded-[var(--radius-lg)] flex items-center justify-center text-4xl bg-gradient-to-br from-[var(--primary)] to-[var(--accent)] shadow-[var(--shadow-lg)] transform hover:scale-105 transition-transform duration-300">
              🤟
            </div>

            <h1 className="text-[65px]! md:text-5xl font-bold bg-gradient-to-r from-[var(--primary-light)] to-[var(--accent-light)] bg-clip-text text-transparent">
              V2PSL
            </h1>
          </div>
          <p className="text-2xl! md:text-xl font-semibold bg-gradient-to-r from-[var(--accent)] to-[var(--accent-light)] bg-clip-text text-transparent">
            Voice to Pakistani Sign Language
          </p>
        </div>

        {/* Main Heading & Description */}
        <div className="flex flex-col gap-4 items-center text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-[var(--text)]">
            Breaking the
            <span className="bg-gradient-to-r from-[var(--primary-light)] to-[var(--accent-light)] bg-clip-text text-transparent">
              {" "}
              Communication Barrier{" "}
            </span>
            in Pakistan
          </h2>
          <p className="text-base md:text-lg leading-relaxed text-[var(--text-secondary)] max-w-2xl">
            Speak or type in English and watch a real-time 3D avatar translate
            your words into Pakistani Sign Language using advanced inverse
            kinematics.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center w-full ">
          <Link href="/translate" className="btn-primary w-full sm:w-auto">
            🤟 Open Translator
          </Link>
          <Link href="/dictionary" className="btn-secondary w-full sm:w-auto">
            📚 Browse Signs
          </Link>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3  w-full max-w-2xl">
          {[
            { icon: "🎙️", label: "Voice Input" },
            { icon: "🧠", label: "NLP Pipeline" },
            { icon: "🦾", label: "IK Animation" },
            { icon: "🧍", label: "3D Avatar" },
            { icon: "🐍", label: "FastAPI" },
            { icon: "🗄️", label: "PostgreSQL" },
          ].map(({ icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-2   rounded-[var(--radius-lg)] border border-[var(--border)] bg-[var(--card)] hover:bg-[var(--card-hover)] transition-colors duration-300  h-[40px]! px-4!"
            >
              <span className="text-xl">{icon}</span>
              <span className="text-sm font-medium text-[var(--text-secondary)]">
                {label}
              </span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
