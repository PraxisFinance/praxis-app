import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import fs from "fs";
import path from "path";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

function getMiniappConfig() {
  const filePath = path.join(process.cwd(), "public/.well-known/farcaster.json");
  const fileContents = fs.readFileSync(filePath, "utf8");
  return JSON.parse(fileContents).miniapp;
}

export async function generateMetadata(): Promise<Metadata> {
  const miniapp = getMiniappConfig();

  return {
    title: miniapp.name,
    description: miniapp.description,
    openGraph: {
      title: miniapp.ogTitle,
      description: miniapp.ogDescription,
      images: [miniapp.ogImageUrl],
    },
    other: {
      "fc:miniapp": JSON.stringify({
        version: miniapp.version,
        imageUrl: miniapp.heroImageUrl,
        button: {
          title: `Join the ${miniapp.name}`,
          action: {
            name: `Launch ${miniapp.name}`,
            url: miniapp.homeUrl,
          },
        },
      }),
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="base:app_id" content="69b120b69121c4bd67e5e99c" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>{children}</body>
    </html>
  );
}
