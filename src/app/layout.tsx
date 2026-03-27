import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import { SiteChrome } from "@/components/layout/SiteChrome/SiteChrome";
import { siteFooter, siteNavigation } from "@/data/siteLayout";
import { AppProviders } from "./providers";
import "./globals.css";

const roboto = Roboto({
  weight: ["300", "400", "500", "600", "700", "800"],
  subsets: ["latin"],
  variable: "--font-roboto",
  display: "swap",
});

export const metadata: Metadata = {
  title: "About Us | WanderOn",
  description:
    "Meet the team and values behind WanderOn — a travel community built for Indian travellers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${roboto.variable} h-full`}>
      <body className="min-h-full antialiased m-0">
        <AppProviders>
          <SiteChrome navigation={siteNavigation} footer={siteFooter}>
            {children}
          </SiteChrome>
        </AppProviders>
      </body>
    </html>
  );
}
