"use client";

import { PlayCircle, Menu, ChevronDown, Github } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import Link from "next/link";

interface NavLink {
  label: string;
  href: string;
}
const NAV_LINKS: NavLink[] = [{ label: "Home", href: "/" }];

const MORE_LINKS: NavLink[] = [
  { label: "API", href: "/api-key" },
  { label: "Contact", href: "/contact" },
  { label: "Documentation", href: "/docs" },
];

interface NavbarProps {
  totalEpisodes?: number;
  filteredCount?: number;
}

export function Navbar({ totalEpisodes, filteredCount }: NavbarProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex h-14 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-sm md:px-6">
      {/* Left: Logo */}
      <Link href="/" className="group flex items-center gap-2">
        <PlayCircle className="size-7 text-primary transition-transform duration-200 group-hover:scale-110" />
        <div className="flex flex-col">
          <span className="text-sm font-bold leading-tight">
            Mythidex
          </span>
          {totalEpisodes != null && filteredCount != null && (
            <span className="text-xs text-muted-foreground leading-tight">
              {filteredCount} of {totalEpisodes} episodes
            </span>
          )}
        </div>
      </Link>

      {/* Center: Nav links (hidden on mobile) */}
      <nav className="hidden items-center gap-1 md:flex">
        {NAV_LINKS.map((link) => (
          <Button key={link.href} variant="ghost" size="sm" asChild>
            <Link href={link.href}>{link.label}</Link>
          </Button>
        ))}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              More <ChevronDown className="ml-1 size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center">
            {MORE_LINKS.map((link) => (
              <DropdownMenuItem key={link.href} asChild>
                <Link href={link.href}>{link.label}</Link>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </nav>

      {/* Right: Theme switcher + Subscribe + Mobile menu */}
      <div className="flex items-center gap-2">
        <ThemeSwitcher />
        <Button variant="outline" size="icon" asChild>
          <Link href="https://github.com/jtljrdn/good-mythical-archive" target="_blank" rel="noopener noreferrer">
            <Github className="size-4" />
            <span className="sr-only">GitHub repository</span>
          </Link>
        </Button>

        {/* Mobile menu */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="size-5" />
              <span className="sr-only">Open menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-64">
            <SheetTitle className="sr-only">Navigation</SheetTitle>
            <nav className="mt-8 flex flex-col gap-2">
              {NAV_LINKS.map((link) => (
                <Button
                  key={link.href}
                  variant="ghost"
                  className="justify-start"
                  asChild
                >
                  <Link href={link.href}>{link.label}</Link>
                </Button>
              ))}
              {MORE_LINKS.map((link) => (
                <Button
                  key={link.href}
                  variant="ghost"
                  className="justify-start"
                  asChild
                >
                  <Link href={link.href}>{link.label}</Link>
                </Button>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
