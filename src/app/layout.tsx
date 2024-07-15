import "@/app/globals.css";
import { Inter as FontSans } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import Navbar from "@/components/navbar";
import "react-checkbox-tree/lib/react-checkbox-tree.css";

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
          "min-h-screen bg-background font-sans antialiased m-auto",
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
              <div className="border-b container min-h-[80vh]">{children}</div>
            </main>

            <footer className="w-full my-4">
              <p className="text-center">
                Developed with 💙 by{" "}
                <a
                  href="https://www.linkedin.com/in/sudipta-pradhan/"
                  className="hover:underline"
                >
                  Sudipta Pradhan
                </a>
              </p>
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
