import { Menu, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function UserMobileHeader() {
  return (
    <header className="flex items-center justify-between p-4 bg-background">
      <Button variant="ghost" size="icon" aria-label="Menu">
        <Menu className="h-6 w-6 text-primary" />
      </Button>
      <h1 className="text-xl font-bold text-primary">SIAGA 112</h1>
      <Button variant="ghost" size="icon" aria-label="Notifications">
        <Bell className="h-6 w-6 text-primary" />
      </Button>
    </header>
  );
}
