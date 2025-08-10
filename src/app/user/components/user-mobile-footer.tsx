"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, History, MessageSquare, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/user', icon: Home, label: 'Home' },
  { href: '#', icon: History, label: 'History' },
  { href: '#', icon: MessageSquare, label: 'Message' },
  { href: '/profile', icon: User, label: 'Profile' },
];

export default function UserMobileFooter() {
  const pathname = usePathname();

  return (
    <footer className="fixed bottom-0 left-0 right-0 w-full max-w-md mx-auto bg-white rounded-t-3xl shadow-[0_-5px_20px_-5px_rgba(0,0,0,0.1)]">
      <nav className="flex justify-around items-center h-20">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link href={item.href} key={item.label}>
              <div className={cn(
                "flex flex-col items-center gap-1 text-gray-400 transition-colors duration-300",
                isActive && "text-primary"
              )}>
                <item.icon className="h-6 w-6" />
                <span className="text-xs font-medium">{item.label}</span>
              </div>
            </Link>
          )
        })}
      </nav>
    </footer>
  );
}
