import { DemoBanner } from "@/components/demo-banner";
import "@/app/globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { BASE_URL } from "@/config";
import { routing } from "@/i18n/routing";
import type { Metadata, Viewport } from "next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages } from "next-intl/server";
import { IBM_Plex_Sans_Arabic, Inter, Newsreader, Noto_Naskh_Arabic } from "next/font/google";
import { notFound } from "next/navigation";
import { Providers } from "./providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

/* Latin display: an editorial serif with optical sizes. */
const newsreader = Newsreader({
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  variable: "--font-newsreader",
  display: "swap",
});

const plexArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-plex-arabic",
  display: "swap",
});

/* Arabic display: Naskh for headings (paired with Newsreader). */
const naskh = Noto_Naskh_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-naskh",
  display: "swap",
});

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f3ea" },
    { media: "(prefers-color-scheme: dark)", color: "#14130f" },
  ],
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const isAr = locale === "ar";

  const title = isAr
    ? "نبراس — دورات من مدربين يضيئون لك الطريق"
    : "Nibras — Courses from instructors who light the way";
  const description = isAr
    ? "منصة دورات لأي مدرّب: فيديو محمي، اختبارات، وشهادات قابلة للتحقق، بالعربية والإنجليزية."
    : "A course platform for any instructor: protected video, quizzes and verifiable certificates, in English and Arabic.";

  return {
    metadataBase: new URL(BASE_URL),
    title: { template: isAr ? "%s | نبراس" : "%s | Nibras", default: title },
    description,
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "any" },
        { url: "/favicon.svg", type: "image/svg+xml" },
        { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
        { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
        { url: "/favicon-48x48.png", sizes: "48x48", type: "image/png" },
        { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      ],
      apple: "/apple-touch-icon.png",
    },
    manifest: "/site.webmanifest",
    openGraph: {
      title,
      description,
      url: BASE_URL,
      siteName: isAr ? "نبراس" : "Nibras",
      locale: isAr ? "ar_SA" : "en_US",
      alternateLocale: isAr ? "en_US" : "ar_SA",
      type: "website",
      images: [{ url: "/og.png", width: 1200, height: 630, alt: title }],
    },
    twitter: { card: "summary_large_image", title, description, images: ["/og.png"] },
    alternates: {
      canonical: `${BASE_URL}/${locale}`,
      languages: {
        en: `${BASE_URL}/en`,
        ar: `${BASE_URL}/ar`,
      },
    },
  };
}

export default async function RootLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const messages = await getMessages({ locale });

  return (
    <html
      lang={locale}
      dir={locale === "ar" ? "rtl" : "ltr"}
      className={`${inter.variable} ${newsreader.variable} ${plexArabic.variable} ${naskh.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Marks the document as scripted before first paint, so scroll reveals
            only hide content when JS can show it again. */}
        <script
          dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }}
        />
      </head>
      <body suppressHydrationWarning className="font-sans antialiased">
        <ThemeProvider>
          <Providers>
            <NextIntlClientProvider locale={locale} messages={messages}>
              <DemoBanner />
              {children}
            </NextIntlClientProvider>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
