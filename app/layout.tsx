import "./globals.css";
import "@/app/styles/icons.css";

import { Inter, Pacifico } from "next/font/google";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { Toaster } from "sonner";
import { Toaster as ShadcnToaster } from "@/components/ui/toaster";
import { Analytics } from "@vercel/analytics/react";
import Script from 'next/script';
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { siteConfig } from "@/site.config";


const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500", "600", "700"],
});

const fontPacifico = Pacifico({
  subsets: ["latin"],
  variable: "--font-pacifico",
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: siteConfig.site_name || "Wrap&Style",
    template: `%s | ${siteConfig.site_name || "Wrap&Style"}`,
  },
  description: siteConfig.site_description || "Folientechnik und mehr.",
  metadataBase: new URL(siteConfig.site_domain || "http://localhost:3000"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
          fontPacifico.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster richColors closeButton />
          <ShadcnToaster />
        </ThemeProvider>
        <Analytics />
        <Script
          id="ccm19-cookie-banner"
          src="https://cloud.ccm19.de/app.js?apiKey=311a0210ec4af246f7683534b2dc8941ff7132244f2983ce&domain=685834f9e05833316e057da2"
          referrerPolicy="origin"
        />
      </body>
    </html>
  );
}
