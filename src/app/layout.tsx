import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { Red_Hat_Mono } from "next/font/google";
import { Navbar } from "@/components/layout";

export const metadata: Metadata = {
  title: "AWS Prep Help",
  description: "AWS Prep Help, Free practice quizzes for AWS certifications",
  icons:"/logo.png"
};

const redHatMono = Red_Hat_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-red-hat-mono",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={`${redHatMono.className}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          <main>
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
