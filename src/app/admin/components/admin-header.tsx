
"use client";

import Link from "next/link";
import { Bell, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const Logo = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 12C4 16.4183 7.58172 20 12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M4 12L12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M12 4V20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
)


export default function AdminHeader() {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    router.push('/profile');
  };

  const navItems = [
    { href: "/admin", label: "Dashboard" },
    { href: "/admin/incidents", label: "Incidents" },
    { href: "#", label: "Resources" },
    { href: "#", label: "Settings" },
  ]

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-white px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      <div className="flex items-center gap-2">
        <Logo />
        <span className="text-lg font-bold">SIAGA 112</span>
      </div>
      <nav className="hidden md:flex items-center gap-4 text-sm font-medium ml-10">
          {navItems.map((item) => (
             <Link 
                href={item.href} 
                key={item.href}
                className={cn(
                    "text-gray-600 hover:text-gray-900", 
                    pathname === item.href && "text-primary font-semibold"
                )}>
                {item.label}
              </Link>
          ))}
      </nav>
      <div className="ml-auto flex items-center gap-4">
        <Button variant="ghost" size="icon" className="text-gray-600 hover:text-gray-900">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notifications</span>
        </Button>
        <Avatar className="h-8 w-8 cursor-pointer" onClick={handleLogout}>
          <AvatarImage src="https://placehold.co/100x100.png" alt="@shadcn" data-ai-hint="woman face" />
          <AvatarFallback>A</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
