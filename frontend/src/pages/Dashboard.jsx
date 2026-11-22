import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Clock3, Mail, Sparkles, Zap } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const { data } = await axios.get('http://localhost:5000/api/analytics/dashboard', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch stats', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="p-8 text-center text-slate-500">Loading your briefing...</div>;

  return (
    <div className="rise-in">
      <div className="mb-9 flex flex-col justify-between gap-4 md:flex-row md:items-end"><div><p className="mono-label mb-2 text-[11px] font-medium text-[#2cb1bc]">WEDNESDAY, SEPTEMBER 30</p><h1 className="display-font text-3xl font-bold tracking-tight text-[#102a43] md:text-4xl">Good morning, {user?.name?.split(' ')[0] || 'there'}.</h1><p className="mt-2 text-[#627d98]">Here is your calm, focused view of what needs attention.</p></div><Link to="/inbox" className="flex items-center gap-2 self-start rounded-xl bg-[#102a43] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#193b58] md:self-auto">Open inbox <ArrowUpRight size={16} /></Link></div>

      <div className="mb-8 flex items-center gap-3 rounded-2xl border border-[#cde7e3] bg-[#eaf8f5] px-5 py-4 text-[#126e68]"><div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white"><Sparkles size={18} /></div><div className="min-w-0"><p className="text-sm font-bold">Your inbox, interpreted</p><p className="truncate text-sm text-[#347c78]">MailSense has sorted the noise so you can focus on the conversations that move work forward.</p></div></div>

      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-[#f2d3cc] bg-[#fff8f6] p-5"><div className="flex items-center justify-between"><h3 className="mono-label text-[10px] font-medium text-[#c2412d]">URGENT</h3><Zap size={17} className="text-[#e76f51]" /></div><p className="mt-3 text-3xl font-bold text-[#c2412d]">{stats?.urgentCount || 0}</p><p className="mt-1 text-xs text-[#9c5d50]">Needs attention now</p>
        </div>
        <div className="rounded-2xl border border-[#f1dfb9] bg-[#fffcf4] p-5"><div className="flex items-center justify-between"><h3 className="mono-label text-[10px] font-medium text-[#a66a00]">IMPORTANT</h3><Mail size={17} className="text-[#e5a93d]" /></div><p className="mt-3 text-3xl font-bold text-[#a66a00]">{stats?.importantCount || 0}</p><p className="mt-1 text-xs text-[#92784a]">Worth a closer look</p>
        </div>
        <div className="rounded-2xl border border-[#cfe4f3] bg-[#f4faff] p-5"><div className="flex items-center justify-between"><h3 className="mono-label text-[10px] font-medium text-[#1769aa]">RESPONSES NEEDED</h3><ArrowUpRight size={17} className="text-[#3b91c9]" /></div><p className="mt-3 text-3xl font-bold text-[#1769aa]">{stats?.responsesNeeded || 0}</p><p className="mt-1 text-xs text-[#5d809d]">People are waiting</p>
        </div>
        <div className="rounded-2xl border border-[#d9d9f2] bg-[#f8f7ff] p-5"><div className="flex items-center justify-between"><h3 className="mono-label text-[10px] font-medium text-[#5752a4]">UPCOMING</h3><Clock3 size={17} className="text-[#7772c9]" /></div><p className="mt-3 text-3xl font-bold text-[#5752a4]">{stats?.upcomingTasks || 0}</p><p className="mt-1 text-xs text-[#77779c]">Deadlines to protect</p>
        </div>
      </div>
      
      <div className="rounded-2xl border border-[#dce7ef] bg-white shadow-[0_10px_30px_rgba(16,42,67,.04)]"><div className="flex items-center justify-between border-b border-[#edf2f6] px-6 py-5"><div><h2 className="display-font text-lg font-bold text-[#102a43]">Recent important emails</h2><p className="mt-1 text-sm text-[#829ab1]">The conversations most likely to need you.</p></div><Link to="/inbox" className="text-sm font-bold text-[#126e68] hover:text-[#102a43]">View all</Link></div><div className="p-4 md:p-6">
        {stats?.recentImportantEmails?.length === 0 ? (
          <p className="text-slate-500">No important emails recently.</p>
        ) : (
          <div className="space-y-4">
            {stats?.recentImportantEmails?.map(email => (
              <Link key={email._id} to={`/inbox/${email._id}`} className="group block rounded-xl border border-[#edf2f6] p-4 transition hover:border-[#b9ddd8] hover:bg-[#f8fcfb]">
                <div className="mb-2 flex items-start justify-between"><div className="flex min-w-0 items-center gap-3"><div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#d7f1ed] text-sm font-bold text-[#126e68]">{email.sender?.charAt(0)}</div><h4 className="truncate font-bold text-[#243b53]">{email.sender}</h4></div>
                  <span className="rounded-md bg-[#fff1df] px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[#a66a00]">{email.priority}</span>
                </div>
                <p className="text-sm font-semibold text-[#334e68]">{email.subject}</p><p className="mt-1 truncate text-sm text-[#829ab1]">{email.summary}</p>
              </Link>
            ))}
          </div>
        )}
      </div></div>
    </div>
  );
};

export default Dashboard;
