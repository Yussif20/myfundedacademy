import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-[var(--background)] text-[var(--foreground)]">
      <div className="text-center">
        <p className="font-display text-7xl font-bold text-[var(--primary)]">404</p>
        <h1 className="mt-4 text-2xl font-semibold">Page not found</h1>
        <Link
          href="/"
          className="mt-6 inline-block rounded-md bg-[var(--primary)] px-4 py-2 text-sm font-medium text-[var(--primary-foreground)] hover:opacity-90 transition-opacity"
        >
          Go home
        </Link>
      </div>
    </main>
  );
}
