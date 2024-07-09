import "@/app/globals.css";
import { Inter as FontSans } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import Navbar from "@/components/navbar";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

type RootLayoutProps = { children: ReactNode };

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased m-auto overflow-hidden",
          fontSans.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="relative flex min-h-screen flex-col bg-background">
            {/* navigation bar */}
            <Navbar
              logo="/monk-logo.svg"
              // links={[
              //   {
              //     label: "Home",
              //     link: "/",
              //   },
              // ]}
            />

            <main className="flex-1">
              <div className="border-b container">{children}</div>
            </main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
