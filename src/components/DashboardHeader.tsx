
import React from 'react';
import { Bell, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const DashboardHeader = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="container flex items-center justify-between h-16 px-4 mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
              <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
            </svg>
          </div>
          <span className="text-lg font-bold">EduMetrics</span>
        </div>
        
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon">
            <Bell className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Settings className="w-4 h-4" />
          </Button>
          <Avatar>
            <AvatarFallback className="bg-blue-100 text-blue-800">AD</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
