import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { Bell, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const DashboardLayout = () => {
  const { user } = useAuth();

  return (
    <div className="flex h-screen bg-[#f5f8fb] text-[#102a43]">
      <Sidebar />
      <div className="flex-1 min-w-0 overflow-auto">
        <header className="h-[76px] border-b border-[#dce7ef] bg-white/80 px-5 md:px-10 flex items-center justify-between sticky top-0 z-10 backdrop-blur-sm">
          <div className="hidden md:flex items-center gap-2 text-sm text-[#718096]"><Search size={16} /><span>Press <kbd className="mx-1 rounded border border-[#dce7ef] bg-[#f5f8fb] px-1.5 py-0.5 text-[11px]">/</kbd> to search your inbox</span></div>
          <div className="ml-auto flex items-center gap-4"><button className="relative rounded-full p-2 text-[#718096] hover:bg-[#edf4f8] hover:text-[#102a43]" aria-label="Notifications"><Bell size={19} /><span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-[#e76f51]" /></button><div className="hidden sm:block h-7 w-px bg-[#dce7ef]" /><div className="flex items-center gap-2"><div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#d7f1ed] text-sm font-bold text-[#126e68]">{user?.name?.charAt(0) || 'D'}</div><span className="hidden sm:block text-sm font-semibold text-[#334e68]">{user?.name || 'Demo User'}</span></div></div>
        </header>
        <main className="p-5 md:p-8 lg:px-10 lg:py-9 max-w-[1440px]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
