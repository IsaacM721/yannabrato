"use client";

import "./globals.css";
import localFont from "next/font/local";
import { Inter, Reenie_Beanie } from "next/font/google";
import SmoothScroll from "@/components/SmoothScroll";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CursorProvider } from "@/context/CursorContext";
import Cursor from "@/components/Cursor";
import InitialLoader from "@/components/InitialLoader";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

// Configure fonts
const datatype = localFont({
  src: "../../public/fonts/Datatype.woff2",
  variable: "--font-datatype",
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const reenieBeanie = Reenie_Beanie({
  variable: "--font-reenie-beanie",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

function RootLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  useEffect(() => {
    // Categories are no longer needed for the header as it only has a Contact link now.
  }, []);

  // For admin routes, skip the public header/footer
  if (isAdminRoute) {
    return (
      <>
        {children}
      </>
    );
  }

  // For public routes, include header/footer
  return (
    <CursorProvider>
      <Cursor />
      <SmoothScroll>
        <Header />
        {children}
        <Footer />
      </SmoothScroll>
    </CursorProvider>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${datatype.variable} ${inter.variable} ${reenieBeanie.variable} antialiased bg-background text-foreground overflow-x-hidden`}
        suppressHydrationWarning
      >
        <InitialLoader />
        <RootLayoutContent>{children}</RootLayoutContent>
      </body>
    </html>
  );
}
