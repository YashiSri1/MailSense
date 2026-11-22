import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Inbox, CheckSquare, Calendar, BarChart2, Settings, LogOut, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { logout } = useAuth();

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: Inbox, label: 'Inbox', path: '/inbox' },
    { icon: CheckSquare, label: 'Tasks', path: '/tasks' },
    { icon: Calendar, label: 'Follow-ups', path: '/follow-ups' },
    { icon: BarChart2, label: 'Analytics', path: '/analytics' },
  ];

  return (
    <div className="hidden md:flex w-[248px] bg-[#102a43] text-white flex-col shrink-0">
      <div className="px-7 pt-7 pb-8">
        <div className="flex items-center gap-2.5"><div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#2cb1bc] text-[#102a43]"><Sparkles size={18} strokeWidth={2.5} /></div><h1 className="display-font text-xl font-bold tracking-tight">MailSense</h1></div>
        <p className="mt-3 pl-11 text-[10px] uppercase tracking-[.18em] text-[#9fb3c8]">Your calm inbox</p>
      </div>
      
      <nav className="flex-1 px-3">
        {navItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            className={({ isActive }) => 
              `flex items-center gap-3 rounded-xl px-4 py-3 mb-1 transition-colors ${isActive ? 'bg-[#193b58] text-[#74e0d5]' : 'text-[#9fb3c8] hover:bg-[#193b58] hover:text-white'}`
            }
          >
            <item.icon className="w-[18px] h-[18px]" />
            <span className="text-sm font-semibold">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-5 border-t border-[#25445c]">
        <NavLink to="/settings" className="flex items-center gap-3 rounded-xl px-3 py-3 text-[#9fb3c8] hover:bg-[#193b58] hover:text-white mb-1">
          <Settings className="w-[18px] h-[18px]" />
          <span className="text-sm font-semibold">Settings</span>
        </NavLink>
        <button onClick={logout} className="flex items-center gap-3 rounded-xl px-3 py-3 text-[#9fb3c8] hover:bg-[#193b58] hover:text-[#ffb4a2] w-full">
          <LogOut className="w-[18px] h-[18px]" />
          <span className="text-sm font-semibold">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
