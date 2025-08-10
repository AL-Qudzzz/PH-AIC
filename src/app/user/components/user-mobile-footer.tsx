import Link from 'next/link';
import { Home, History, MessageSquare, User } from 'lucide-react';

const navItems = [
  { href: '/user', icon: Home, label: 'Home' },
  { href: '#', icon: History, label: 'History' },
  { href: '#', icon: MessageSquare, label: 'Message' },
  { href: '#', icon: User, label: 'Profile' },
];

export default function UserMobileFooter() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 w-full max-w-md mx-auto bg-white rounded-t-3xl shadow-[0_-5px_20px_-5px_rgba(0,0,0,0.1)]">
      <nav className="flex justify-around items-center h-20">
        {navItems.map((item) => (
          <Link href={item.href} key={item.label}>
            <div className={`flex flex-col items-center gap-1 ${item.label === 'Home' ? 'text-primary' : 'text-gray-400'}`}>
              <item.icon className="h-6 w-6" />
              <span className="text-xs font-medium">{item.label}</span>
            </div>
          </Link>
        ))}
      </nav>
    </footer>
  );
}
