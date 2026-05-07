import { notFound } from "next/navigation";

// Catch-all for any path under [locale] that doesn't match a real route.
// Triggers the [locale]/not-found.tsx UI rather than the default Next 404.
export default function CatchAll() {
  notFound();
}
