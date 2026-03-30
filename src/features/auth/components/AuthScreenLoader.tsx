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
      </div>

      <div className="relative w-full max-w-md rounded-[32px] border border-white/10 bg-white/[0.05] p-8 text-center shadow-[0_30px_80px_rgba(0,0,0,0.4)] backdrop-blur-xl">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-cyan-300/20 bg-cyan-300/10">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-cyan-200/30 border-t-cyan-200" />
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
