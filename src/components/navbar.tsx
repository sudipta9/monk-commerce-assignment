"use client";
import React from "react";
import Image from "next/image";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type NavbarProps = {
  links?: {
    link: string;
    label: string;
  }[];
  logo: string;
};

const Navbar: React.FC<NavbarProps> = ({ logo, links }) => {
  const { setTheme, theme } = useTheme();
  return (
    <header className="sticky top-0 z-50 w-full border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        {/* logo area */}
        <div className="mr-4 flex items-center gap-4">
          <div className="relative">
            <a
              href="/"
              className="flex flex-row gap-4 items-center justify-start text-lg font-bold"
            >
              <Image
                src={logo}
                alt="logo"
                className="relative"
                width={48}
                height={48}
                // fill
              />
              <p>Monk Upsell & Cross-sell</p>
            </a>
          </div>
          <nav>
            <ul className="flex flex-row gap-4">
              {links?.map((link, index) => (
                <li
                  className="text-base font-semibold p-2 hover:underline"
                  key={`${index}-${link.label}`}
                >
                  <a href={link.link}>{link.label}</a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        {/* theme switch button */}
        <div className="flex flex-1 items-center space-x-2 justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme("light")}>
                Light
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                Dark
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>
                System
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
