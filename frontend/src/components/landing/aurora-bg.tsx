export function AuroraBg() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="absolute -top-1/4 left-1/2 size-[900px] -translate-x-1/2 rounded-full opacity-40 blur-[120px] animate-aurora"
        style={{
          background:
            "radial-gradient(circle, color-mix(in oklch, var(--primary) 65%, transparent) 0%, transparent 60%)",
        }}
      />
      <div
        className="absolute top-0 right-0 size-[600px] rounded-full opacity-25 blur-[100px] animate-aurora"
        style={{
          background:
            "radial-gradient(circle, color-mix(in oklch, var(--accent) 50%, transparent) 0%, transparent 60%)",
          animationDelay: "-4s",
        }}
      />
      <div
        className="absolute bottom-0 left-0 size-[500px] rounded-full opacity-25 blur-[90px] animate-aurora"
        style={{
          background:
            "radial-gradient(circle, color-mix(in oklch, var(--primary) 55%, transparent) 0%, transparent 60%)",
          animationDelay: "-8s",
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")",
        }}
      />
    </div>
  );
}
