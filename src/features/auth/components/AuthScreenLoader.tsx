'use client';

type AuthScreenLoaderProps = {
  title: string;
  description: string;
};

export function AuthScreenLoader({ title, description }: AuthScreenLoaderProps) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[linear-gradient(145deg,#070b16,#09101f,#050811)] px-6 text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.22),transparent_55%)]" />
        <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/4 h-60 w-60 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:90px_90px] opacity-[0.05]" />
      </div>

      <div className="relative w-full max-w-md rounded-[32px] border border-white/10 bg-white/[0.05] p-8 text-center shadow-[0_30px_80px_rgba(0,0,0,0.4)] backdrop-blur-xl">
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border border-cyan-300/20 bg-[radial-gradient(circle,rgba(103,232,249,0.18),rgba(37,99,235,0.08),transparent_70%)]">
          <div className="relative h-12 w-12">
            <div className="absolute inset-0 animate-spin rounded-full border-2 border-cyan-200/20 border-t-cyan-200" />
            <div className="absolute inset-[10px] rounded-full bg-cyan-200/90 shadow-[0_0_18px_rgba(103,232,249,0.65)]" />
          </div>
        </div>
        <p className="mt-6 text-[11px] uppercase tracking-[0.22em] text-cyan-100/70">
          Access
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight">
          {title}
        </h2>
        <p className="mt-3 text-sm leading-6 text-zinc-400">
          {description}
        </p>
      </div>
    </div>
  );
}
