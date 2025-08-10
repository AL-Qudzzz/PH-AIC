"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, History, MessageSquare, User, Mic } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import React from 'react';


const navItems = [
  { href: '/user', icon: Home, label: 'Home' },
  { href: '#', icon: History, label: 'History' },
  { href: 'spacer', icon: Mic, label: 'Spacer' }, 
  { href: '#', icon: MessageSquare, label: 'Message' },
  { href: '/profile', icon: User, label: 'Profile' },
];

export default function UserMobileFooter() {
  const pathname = usePathname();

  // The actual report button is in ReportClient, this is a placeholder for layout
  const handleReportClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // Logic is handled in ReportClient, find the button and click it
    const reportButton = document.getElementById('report-button');
    if (reportButton) {
      reportButton.click();
    }
  };

  return (
    <footer className="fixed bottom-0 left-0 right-0 w-full max-w-md mx-auto bg-transparent" style={{ height: '100px' }}>
      <div className="relative w-full h-full">
        {/* The microphone button positioned in the middle, slightly overlapping */}
        <div className="absolute left-1/2 -translate-x-1/2 bottom-5 z-10">
           {/* This is a simplified, non-functional visual placeholder to avoid duplicating state logic. The real button is in ReportClient */}
           <Button
              size="lg"
              className="h-24 w-24 rounded-full"
              onClick={(e) => {
                 const realButton = document.querySelector<HTMLButtonElement>('[aria-label="Report Emergency"]');
                 realButton?.click();
              }}
              aria-label="Report Emergency"
            >
              <Mic className="h-12 w-12" />
          </Button>
        </div>
        
        {/* The navigation bar background */}
        <div className="absolute bottom-0 w-full h-20 bg-white rounded-t-3xl shadow-[0_-5px_20px_-5px_rgba(0,0,0,0.1)]">
           <nav className="flex justify-around items-center h-full">
                <div className="flex justify-between items-center w-full px-4">
                    {/* Left side icons */}
                    <div className="flex justify-around w-2/5">
                        <NavItem item={navItems[0]} pathname={pathname} />
                        <NavItem item={navItems[1]} pathname={pathname} />
                    </div>

                    {/* Spacer for the central button */}
                    <div className="w-1/5"></div>

                    {/* Right side icons */}
                    <div className="flex justify-around w-2/5">
                        <NavItem item={navItems[3]} pathname={pathname} />
                        <NavItem item={navItems[4]} pathname={pathname} />
                    </div>
                </div>
            </nav>
        </div>
      </div>
    </footer>
  );
}


const NavItem = ({ item, pathname }: { item: typeof navItems[0], pathname: string }) => {
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
}
