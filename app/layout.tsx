//
import type { Metadata } from "next";
import { Inter, Barlow } from "next/font/google";

// css
import "./globals.css";
import { ThemeProvider } from "next-themes";

// clerk
import { ClerkProvider } from "@clerk/nextjs";

// toast
import { Toaster } from "@/components/ui/sonner";

const interFont = Inter({
  subsets: ["latin"],
});

const barlowFont = Barlow({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-barlow",
});

export const metadata: Metadata = {
  title: "Deekrub",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${interFont.className} ${barlowFont.className} antialiased`}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster position="top-center" />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
