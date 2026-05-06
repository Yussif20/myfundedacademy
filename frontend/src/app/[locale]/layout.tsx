import "@/app/globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { BASE_URL } from "@/config";
import { routing } from "@/i18n/routing";
import type { Metadata, Viewport } from "next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages } from "next-intl/server";
import { IBM_Plex_Sans_Arabic, Inter, Sora } from "next/font/google";
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

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FAFAF9" },
    { media: "(prefers-color-scheme: dark)", color: "#0A0F14" },
  ],
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const isAr = locale === "ar";

  const title = isAr
    ? "ماي فاندد أكاديمي — أتقن تداول البروب"
    : "My Funded Academy — Master Prop Trading";
  const description = isAr
    ? "دورات تداول احترافية محمية بـ DRM، شهادات معتمدة، ومجتمع متداولين حقيقي."
    : "DRM-protected prop trading courses, verified certificates, and a real trader community.";

  return {
    metadataBase: new URL(BASE_URL),
    title: { template: "%s | My Funded Academy", default: title },
    description,
    openGraph: {
      title,
      description,
      url: BASE_URL,
      siteName: "My Funded Academy",
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
        className={`${inter.variable} ${sora.variable} ${plexArabic.variable} font-sans antialiased`}
      >
        <ThemeProvider>
          <Providers>
            <NextIntlClientProvider locale={locale} messages={messages}>
              {children}
            </NextIntlClientProvider>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
