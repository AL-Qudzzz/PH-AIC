
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, History, MessageSquare, User, Mic, Square } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import React, { useState, useEffect } from 'react';


const navItems = [
  { href: '/user', icon: Home, label: 'Home' },
  { href: '/user/history', icon: History, label: 'History' },
  { href: 'spacer', icon: Mic, label: 'Spacer' }, 
  { href: '#', icon: MessageSquare, label: 'Message' },
  { href: '/profile', icon: User, label: 'Profile' },
];

export default function UserMobileFooter() {
  const pathname = usePathname();
  // We need a way to know if recording is active to change the icon
  const [isRecording, setIsRecording] = useState(false);

  const handleReportClick = () => {
    // Logic is handled in ReportClient, find the button and click it
    const reportButton = document.getElementById('report-button');
    if (reportButton) {
      reportButton.click();
      // This is a bit of a hack to sync state. A better way would be using a global state manager (like Zustand or Context).
      // For this prototype, we'll toggle it based on the click.
      setIsRecording(prev => !prev);
    }
  };
  
  // A more robust way to sync state would be to use a MutationObserver or a shared state.
  // This effect will reset the button if the user navigates away or if results are shown.
  useEffect(() => {
    const reportClientNode = document.querySelector('.relative.w-full.h-full');
    if (!reportClientNode) return;

    const observer = new MutationObserver((mutationsList) => {
        for(const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                const isRecordingDiv = document.querySelector('.relative.flex.items-center.justify-center');
                const isResultDiv = document.querySelector('.w-full.space-y-4.text-left');
                if (!isRecordingDiv || isResultDiv) {
                    setIsRecording(false);
                }
            }
        }
    });

    observer.observe(reportClientNode, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);


  return (
    <footer className="fixed bottom-0 left-0 right-0 w-full max-w-md mx-auto bg-transparent" style={{ height: '100px' }}>
      <div className="relative w-full h-full">
        <div className="absolute left-1/2 -translate-x-1/2 bottom-5 z-10">
           <Button
              size="lg"
              className={cn(
                "h-24 w-24 rounded-full transition-colors duration-300",
                isRecording ? "bg-destructive hover:bg-destructive/90" : "bg-primary hover:bg-primary/90"
              )}
              onClick={handleReportClick}
              aria-label={isRecording ? "Stop Recording" : "Report Emergency"}
            >
              {isRecording ? <Square className="h-10 w-10" /> : <Mic className="h-12 w-12" />}
          </Button>
        </div>
        
        <div className="absolute bottom-0 w-full h-20 bg-white rounded-t-3xl shadow-[0_-5px_20px_-5px_rgba(0,0,0,0.1)]">
           <nav className="flex justify-around items-center h-full">
                <div className="flex justify-between items-center w-full px-4">
                    <div className="flex justify-around w-2/5">
                        <NavItem item={navItems[0]} pathname={pathname} />
                        <NavItem item={navItems[1]} pathname={pathname} />
                    </div>

                    <div className="w-1/5"></div>

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
