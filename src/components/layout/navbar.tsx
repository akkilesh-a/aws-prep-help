"use client";

import Link from "next/link";
import React, { useState } from "react";
import { ModeToggle } from "../theme";
import { H4, P } from "../typography";
import { Book, User, Menu, X, Heart } from "lucide-react";
import { Button } from "../ui";
import Image from "next/image";

const navItems = [
  {
    label: "Developer",
    icon: <User />,
    href: "https://www.linkedin.com/in/akkilesh-a-620561275/",
  },
  {
    label: "Certifications",
    icon: <Book />,
    href: "/certifications",
  },
  {
    label: "Credits",
    icon: <Heart />,
    href: "/credits",
  },
];

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="border-b sticky top-0 bg-background/50 z-10 backdrop-blur-sm">
      <div className="flex justify-between items-center px-4 sm:px-8 py-2 mx-auto max-w-7xl">
        <Link
          href="/"
          className="flex items-center gap-2 hover:text-primary transition-colors"
        >
          <Image src="/logo.png" alt="Logo" height={50} width={50} />
          <H4 className="hidden sm:block">AWS Prep Help</H4>
        </Link>
        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-2">
          {navItems.map((item) => (
            <Button
              key={item.href}
              variant="link"
              className="dark:text-white text-black hover:text-primary transition-colors"
            >
              <Link className="flex items-center gap-1" href={item.href}>
                <span className="w-4 h-4">{item.icon}</span>
                <P>{item.label}</P>
              </Link>
            </Button>
          ))}
          <ModeToggle />
        </div>
        {/* Mobile Hamburger */}
        <div className="md:hidden flex items-center">
          <ModeToggle />
          <button
            className="ml-2 p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            {menuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>
      {/* Mobile Drawer */}
      {menuOpen && (
        <div className="md:hidden bg-background border-b px-4 pb-2">
          {navItems.map((item) => (
            <Button
              key={item.href}
              variant="link"
              className="w-full flex justify-start dark:text-white text-black hover:text-primary transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              <Link className="flex items-center gap-2 w-full" href={item.href}>
                <span className="w-5 h-5">{item.icon}</span>
                <P>{item.label}</P>
              </Link>
            </Button>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
