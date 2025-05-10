import type { Metadata } from "next";
import Head from "next/head";
import { Toaster } from "../components/ui/sonner";
import { GoogleAnalytics } from "@next/third-parties/google";
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
    "webhook spammer",
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
    siteName: "Uncover it",
    images: [
      {
        url: "https://i.postimg.cc/fRh7n7XZ/image.png",
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
    images: ["https://i.postimg.cc/fRh7n7XZ/image.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <Head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </Head>
      <body>
        {children} <Toaster position="top-right" />
      </body>
      <GoogleAnalytics gaId="G-T1PPWT7NT4" />
    </html>
  );
}
