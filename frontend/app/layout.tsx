import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import Script from "next/script";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.youtubetldw.com/"),
  title: "tl;dw - No Login, No BS YouTube Summaries",
  description:
    "AI-powered YouTube video summaries. No login, no ads, no BS. Get to the point instantly.",
  keywords: [
    "youtube summary",
    "ai summarizer",
    "video summary",
    "tldw",
    "no login",
    "free summary",
    "youtube tldw",
  ],
  authors: [{ name: "David Zirinsky" }],
  creator: "David Zirinsky",
  publisher: "David Zirinsky",
  alternates: {
    canonical: "https://www.youtubetldw.com/",
  },
  manifest: "/site.webmanifest",
  category: "Productivity",
  openGraph: {
    title: "tl;dw - Instant, No-BS YouTube Summaries",
    description:
      "Stop wasting time. Get AI-powered summaries of YouTube videos without needing to log in. Fast, free, and to the point.",
    url: "https://www.youtubetldw.com/",
    siteName: "tl;dw",
    images: [
      {
        url: "/logo-tech.png", // Must be an absolute URL
        width: 512,
        height: 512,
        alt: "tl;dw Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "tl;dw - Instant, No-BS YouTube Summaries",
    description:
      "Stop wasting time. Get AI-powered summaries of YouTube videos without needing to log in. Fast, free, and to the point.",
    images: ["/logo-tech.png"], // Must be an absolute URL
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "tl;dw",
    url: "https://www.youtubetldw.com/",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://www.youtubetldw.com//?url={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How does tl;dw work?",
        acceptedAnswer: {
          "@type": "Answer",
          text: 'Simply paste the URL of the YouTube video you want to summarize into the input box and click "Summarize Video". Our AI will process the content and provide a concise summary.',
        },
      },
      {
        "@type": "Question",
        name: "Is tl;dw free to use?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, tl;dw is completely free to use. There are no hidden costs or premium features.",
        },
      },
      {
        "@type": "Question",
        name: "Do I need to create an account or log in?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No. We believe in simplicity and speed. You can use the service immediately without any login or sign-up process.",
        },
      },
    ],
  };

  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-FFXL6ENC3G"
        />
        <Script
          id="gtag-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-FFXL6ENC3G');
            `,
          }}
        />
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
