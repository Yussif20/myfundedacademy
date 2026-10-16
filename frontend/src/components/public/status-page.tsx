import { LampGlow } from "@/components/brand/lamp-glow";
import { Eyebrow } from "@/components/ui/eyebrow";

/** Full-page status screen (404, error): a large serif numeral and calm copy. */
export function StatusPage({
  code,
  eyebrow,
  title,
  body,
  footnote,
  children,
}: {
  code: string;
  eyebrow: string;
  title: string;
  body: string;
  footnote?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-background px-6 text-foreground">
      <LampGlow />
      <div className="relative flex max-w-xl flex-col items-center gap-6 text-center">
        <p
          aria-hidden
          className="font-display text-[7rem] font-light leading-none tracking-tight text-primary md:text-[9rem]"
          dir="ltr"
        >
          {code}
        </p>
        <div className="horizon w-40" />
        <Eyebrow rule={false}>{eyebrow}</Eyebrow>
        <h1 className="font-display text-3xl font-medium tracking-tight text-balance md:text-4xl">
          {title}
        </h1>
        <p className="text-pretty leading-7 text-muted-foreground">{body}</p>
        {children && (
          <div className="mt-2 flex flex-col items-center gap-3 sm:flex-row">{children}</div>
        )}
        {footnote && <p className="font-mono text-xs text-muted-foreground">{footnote}</p>}
      </div>
    </main>
  );
}
