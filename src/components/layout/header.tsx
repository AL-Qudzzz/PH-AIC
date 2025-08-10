import Link from "next/link";
import { Siren } from "lucide-react";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Link href="/" className="flex items-center gap-2 mr-6">
          <Siren className="h-6 w-6 text-foreground" />
          <span className="font-bold text-foreground">SIAGA 112 AI</span>
        </Link>
        <nav className="flex items-center gap-4 text-sm lg:gap-6">
          <Link href="/user" className="transition-colors hover:text-foreground/80 text-foreground/90">
            User
          </Link>
          <Link href="/admin" className="transition-colors hover:text-foreground/80 text-foreground/90">
            Admin
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
