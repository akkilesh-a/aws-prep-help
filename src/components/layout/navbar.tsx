import Link from "next/link";
import React from "react";
import { ModeToggle } from "../theme";
import { H3, P } from "../typography";
import { Book, User } from "lucide-react";
import { Button } from "../ui";

const navItems = [
  // {
  //   label: "Home",
  //   icon: <Home />,
  //   href: "/",
  // },
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
];

const Navbar = () => {
  return (
    <div className="flex justify-between items-center p-2 border-b sticky top-0 bg-background z-10">
      <Link
        href="/"
        className="flex items-center hover:text-primary transition-colors"
      >
        <H3>AWS Prep Help</H3>
      </Link>
      <div className="flex items-center gap-2">
        <div className="flex items-center">
          {navItems.map((item) => (
            <Button
              key={item.href}
              variant="link"
              className="dark:text-white text-black hover:text-primary transition-colors"
            >
              <Link className="flex items-center gap-1" href={item.href}>
                <div className="w-4 h-4">{item.icon}</div>
                <P>{item.label}</P>
              </Link>
            </Button>
          ))}
        </div>
        <ModeToggle />
      </div>
    </div>
  );
};

export default Navbar;
