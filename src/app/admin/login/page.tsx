import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { loginAction } from "@/app/admin/login/actions";

export const metadata: Metadata = {
  title: "Admin Login",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  const hasError = params.error === "missing" || params.error === "invalid";

  return (
    <Container className="py-16 sm:py-20">
      <div className="mx-auto max-w-lg">
        <div className="surface-card rounded-2xl p-6 sm:p-8">
          <h1 className="font-display text-3xl text-ink">Admin Login</h1>
          <p className="mt-3 text-sm leading-7 text-ink-soft">
            Sign in to manage Writing entries.
          </p>
          {hasError ? (
            <p className="mt-4 rounded-lg border border-accent-crimson/50 bg-accent-crimson/10 px-3 py-2 text-sm text-ink">
              Invalid email or password.
            </p>
          ) : null}
          <form action={loginAction} className="mt-6 space-y-4">
            <label className="block">
              <span className="mb-2 block font-mono text-[0.65rem] uppercase tracking-[0.2em] text-ink-soft">Email</span>
              <input
                required
                type="email"
                name="email"
                className="w-full rounded-lg border border-edge bg-canvas px-4 py-3 text-sm text-ink outline-none placeholder:text-ink-soft/70 focus:border-accent-blue"
                placeholder="admin@domain.com"
              />
            </label>
            <label className="block">
              <span className="mb-2 block font-mono text-[0.65rem] uppercase tracking-[0.2em] text-ink-soft">
                Password
              </span>
              <input
                required
                type="password"
                name="password"
                className="w-full rounded-lg border border-edge bg-canvas px-4 py-3 text-sm text-ink outline-none placeholder:text-ink-soft/70 focus:border-accent-blue"
              />
            </label>
            <button
              type="submit"
              className="inline-flex rounded-full bg-accent-gold/85 px-6 py-3 font-mono text-[0.72rem] uppercase tracking-[0.2em] text-canvas transition-all hover:-translate-y-0.5 hover:bg-accent-gold/95"
            >
              Sign In
            </button>
          </form>
          <div className="mt-6">
            <Link href="/" className="text-sm text-accent-blue hover:text-ink">
              Back to site
            </Link>
          </div>
        </div>
      </div>
    </Container>
  );
}
