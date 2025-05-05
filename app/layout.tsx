import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  alternates: { canonical: "https://webhook.uncoverit.org" },
  title: {
    default: "Discord Webhook Multi-Tool",
    template: "Discord Webhook Multi-Tool",
  },
  description:
    "Take control of Discord webhooks online. Text-to-speech, spam messages, view webhook details, and delete unwanted webhooks easily with our multitool.",
  keywords: [
    "discord",
    "webhook",
    "multitool",
    "delete",
    "send",
    "spam",
    "info",
    "webhook spam",
    "webhook deleter",
    "discord webhooks",
    "discord webhook spammer",
    "discord webhook deleter",
    "discord multitool",
    "uncover it webhook",
    "uncover it webhook spammer",
    "uncover it spammer",
    "webhook uncover it",
    "webhook uncoverit",
    "uncoverit webhook",
    "uncoverit",
    "uncover it",
    "disco with me",
    "disco w me",
    "discord spam",
    "uncover it webhook spammer",
    "discord webhook",
    "online",
    "customize",
    "webhook spammer online",
    "disco with me discord",
    "disco with me webhook",
    "disco with me uncover it",
  ],
  openGraph: {
    title: "Discord Webhook Multi-Tool",
    description:
      "Take control of Discord webhooks online. Text-to-speech, spam messages, view webhook details, and delete unwanted webhooks easily with our multitool.",
    url: "https://webhook.uncoverit.org",
    siteName: "Discord Webhook Multi-Tool",
    images: [
      {
        url: "https://i.postimg.cc/j5wxtvLV/output-onlinepngtools-2.png",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large" as const,
      "max-snippet": -1,
    },
  },
  twitter: {
    title: "Discord Webhook Multi-Tool",
    card: "summary_large_image",
    description:
      "Take control of Discord webhooks online. Text-to-speech, spam messages, view webhook details, and delete unwanted webhooks easily with our multitool.",
    images: ["https://i.postimg.cc/j5wxtvLV/output-onlinepngtools-2.png"],
  },
  icons: { shortcut: "/favicon.ico" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <head>
        {/* Google tag (gtag.js) */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-T1PPWT7NT4"
        ></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag() {
              window.dataLayer.push(arguments);
            }
            gtag("js", new Date());
            gtag("config", "G-T1PPWT7NT4");
          `,
          }}
        ></script>
      </head>
      <html lang="en">
        <body>{children}</body>
      </html>
    </>
  );
}
