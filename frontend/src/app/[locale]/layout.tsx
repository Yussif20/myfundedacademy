import { DemoBanner } from "@/components/demo-banner";
import "@/app/globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { BASE_URL } from "@/config";
import { routing } from "@/i18n/routing";
import type { Metadata, Viewport } from "next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages } from "next-intl/server";
import {
  Archivo,
  Archivo_Black,
  Big_Shoulders,
  Fraunces,
  IBM_Plex_Mono,
  IBM_Plex_Sans,
  IBM_Plex_Sans_Arabic,
  Inter,
  Newsreader,
  Sora,
  Space_Grotesk,
} from "next/font/google";
import { notFound } from "next/navigation";
import { Providers } from "./providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const sora = Sora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sora",
  display: "swap",
});

const plexArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-plex-arabic",
  display: "swap",
});

/* Design-direction fonts (theme lab). preload:false — each face only downloads
   when the active direction's tokens reference it. */
const archivo = Archivo({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-archivo",
  display: "swap",
  preload: false,
});

const archivoBlack = Archivo_Black({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-archivo-black",
  display: "swap",
  preload: false,
});

const bigShoulders = Big_Shoulders({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-big-shoulders",
  display: "swap",
  preload: false,
});

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-fraunces",
  display: "swap",
  preload: false,
});

const newsreader = Newsreader({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-newsreader",
  display: "swap",
  preload: false,
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
  preload: false,
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-mono",
  display: "swap",
  preload: false,
});

const plexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-sans",
  display: "swap",
  preload: false,
});

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#0B7768" },
    { media: "(prefers-color-scheme: dark)", color: "#0A0F14" },
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
    },
    twitter: { card: "summary_large_image", title, description },
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
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body
        suppressHydrationWarning
        className={`${inter.variable} ${sora.variable} ${plexArabic.variable} ${archivo.variable} ${archivoBlack.variable} ${bigShoulders.variable} ${fraunces.variable} ${newsreader.variable} ${spaceGrotesk.variable} ${plexMono.variable} ${plexSans.variable} font-sans antialiased`}
      >
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
