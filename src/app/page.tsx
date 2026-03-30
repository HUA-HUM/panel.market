"use client";

import Image from "next/image";
import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useAuth } from '@/src/features/auth/components/AuthProvider';
import { AuthScreenLoader } from '@/src/features/auth/components/AuthScreenLoader';

const markets = [
  { name: "Fravega", file: "fravega.png", width: 132, angle: 8 },
  { name: "OnCity", file: "oncity.png", width: 70, angle: 150 },
  { name: "Megatone", file: "Megatone.svg", width: 136, angle: 42 },
  { name: "Casa del Audio", file: "casaaudio.png", width: 112, angle: 286 },
];

const RADIUS = 170;

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, isLoading, login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace('/admin');
    }
  }, [isAuthenticated, isLoading, router]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await login({
        email,
        password,
      });
      setRedirecting(true);
      toast.success('Sesion iniciada correctamente.');
      router.push('/admin');
    } catch (submitError) {
      const message =
        submitError instanceof Error
          ? submitError.message
          : 'No se pudo iniciar sesion.';

      setError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <AuthScreenLoader
        title="Checking your session"
        description="We are validating your current credentials before loading the workspace."
      />
    );
  }

  if (redirecting) {
    return (
      <AuthScreenLoader
        title="Opening admin workspace"
        description="Your session is active. We are preparing the console and redirecting you to /admin."
      />
    );
  }

  return (
    <div className="relative h-screen overflow-hidden bg-[linear-gradient(145deg,#070b16,#09101f,#050811)] text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.22),transparent_55%)]" />
        <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/4 h-60 w-60 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:90px_90px] opacity-[0.05]" />
      </div>

      <main className="relative z-10 flex h-screen items-center justify-center px-6 py-6">
        <div className="grid h-full max-h-[860px] w-full max-w-7xl grid-cols-1 gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <section className="flex min-h-0 items-center">
            <div className="grid h-full w-full grid-rows-[auto_1fr] gap-6 rounded-[32px] border border-white/10 bg-white/[0.03] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] xl:p-8">
              <div className="space-y-5">
                <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/15 bg-cyan-300/10 px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-cyan-100">
                  Unified Commerce Platform
                </div>

                <div className="max-w-2xl space-y-3">
                  <h1 className="text-4xl font-semibold tracking-tight text-white md:text-6xl md:leading-[0.98]">
                    Unify
                    <br />
                    marketplaces
                    <br />
                    and retailers.
                  </h1>
                  <p className="max-w-md text-sm leading-6 text-zinc-300 md:text-base">
                    Catalog, commerce, shipping, and publishing in one control surface.
                  </p>
                </div>
              </div>

              <div className="relative min-h-0 overflow-hidden rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05),transparent_60%)]" />

                <div className="absolute left-6 top-6 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-zinc-400">
                  Connected network
                </div>

                <div className="relative flex h-full items-center justify-center p-6">
                  <div className="relative z-20 flex h-32 w-32 items-center justify-center rounded-full border border-white/20 bg-white shadow-[0_0_80px_rgba(255,255,255,0.24)]">
                    <Image
                      src="/LQA-logo.png"
                      alt="TLQ"
                      width={84}
                      height={84}
                      priority
                    />
                  </div>

                  <svg
                    className="absolute"
                    width={RADIUS * 2}
                    height={RADIUS * 2}
                    viewBox={`0 0 ${RADIUS * 2} ${RADIUS * 2}`}
                  >
                    {markets.map((market) => {
                      const rad = (market.angle * Math.PI) / 180;
                      const x = RADIUS + Math.cos(rad) * RADIUS;
                      const y = RADIUS + Math.sin(rad) * RADIUS;
                      const cx1 = RADIUS + Math.cos(rad - 0.42) * (RADIUS * 0.42);
                      const cy1 = RADIUS + Math.sin(rad - 0.42) * (RADIUS * 0.42);
                      const cx2 = RADIUS + Math.cos(rad + 0.28) * (RADIUS * 0.76);
                      const cy2 = RADIUS + Math.sin(rad + 0.28) * (RADIUS * 0.76);

                      return (
                        <g key={market.name}>
                          <path
                            d={`M ${RADIUS} ${RADIUS} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${x} ${y}`}
                            stroke="rgba(56,189,248,0.16)"
                            strokeWidth="10"
                            fill="none"
                          />
                          <path
                            d={`M ${RADIUS} ${RADIUS} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${x} ${y}`}
                            stroke="rgba(255,255,255,0.76)"
                            strokeWidth="2"
                            fill="none"
                          />
                        </g>
                      );
                    })}
                  </svg>

                  {markets.map((market) => {
                    const rad = (market.angle * Math.PI) / 180;
                    const x = Math.cos(rad) * RADIUS;
                    const y = Math.sin(rad) * RADIUS;

                    return (
                      <div
                        key={market.name}
                        className="absolute"
                        style={{ transform: `translate(${x}px, ${y}px)` }}
                      >
                        <div className="rounded-2xl border border-white/10 bg-white p-2.5 shadow-[0_18px_45px_rgba(255,255,255,0.08)]">
                          <Image
                            src={`/marketplace/${market.file}`}
                            alt={market.name}
                            width={market.width}
                            height={market.width}
                            className="h-auto object-contain"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

               
              </div>
            </div>
          </section>

          <section className="flex min-h-0 items-center justify-center">
            <div className="w-full max-w-md rounded-[32px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] p-7 shadow-[0_30px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl md:p-9">
              <div className="space-y-3">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-zinc-300">
                  Access
                </div>
                <h2 className="text-3xl font-semibold tracking-tight text-white">
                  Sign in
                </h2>
                <p className="text-sm text-zinc-400">
                  Admin workspace
                </p>
              </div>

              <form className="mt-8 flex flex-col gap-4" onSubmit={handleSubmit}>
                <div className="flex flex-col gap-2">
                  <label className="text-[11px] font-medium uppercase tracking-[0.18em] text-zinc-500">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="user@company.com"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    autoComplete="email"
                    required
                    className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-cyan-400/40 focus:ring-2 focus:ring-cyan-400/20"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[11px] font-medium uppercase tracking-[0.18em] text-zinc-500">
                    Password
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    autoComplete="current-password"
                    required
                    className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-cyan-400/40 focus:ring-2 focus:ring-cyan-400/20"
                  />
                </div>

                {error && (
                  <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-100">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="mt-2 inline-flex items-center justify-center rounded-2xl border border-cyan-300/20 bg-[linear-gradient(135deg,#67e8f9,#2563eb,#0f172a)] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(37,99,235,0.35)] transition duration-200 hover:scale-[1.01] hover:shadow-[0_22px_50px_rgba(37,99,235,0.4)]"
                >
                  {submitting ? 'Signing in...' : 'Enter'}
                </button>
              </form>

              <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                <p className="text-xs text-zinc-500">
                  Secure access for enabled accounts.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
