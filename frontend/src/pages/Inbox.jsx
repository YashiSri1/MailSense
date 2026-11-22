import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import EmailRow from '../components/EmailRow';
import { Search, Filter, Loader2, Sparkles, SlidersHorizontal } from 'lucide-react';

const Inbox = () => {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [nlQuery, setNlQuery] = useState('');
  const [isNlMode, setIsNlMode] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('');
  const fetchEmails = useCallback(async () => {
    if (isNlMode) return; // handled by handleNlSearch
    
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (categoryFilter) params.append('category', categoryFilter);

      const { data } = await axios.get(`http://localhost:5000/api/emails?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEmails(data.emails);
    } catch (error) {
      console.error('Error fetching emails', error);
    } finally {
      setLoading(false);
    }
  }, [isNlMode, search, categoryFilter]);

  const handleNlSearch = async (e) => {
    e.preventDefault();
    if (!nlQuery.trim()) return;
    
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.post('http://localhost:5000/api/analytics/search', { query: nlQuery }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEmails(data.emails);
    } catch (error) {
      console.error('Error with NL search', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isNlMode) {
      const timer = setTimeout(() => {
        fetchEmails();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [search, categoryFilter, isNlMode, fetchEmails]);

  const categories = ['', 'CAREER', 'EDUCATION', 'FINANCE', 'PROMOTION', 'OTHER'];

  return (
    <div className="rise-in flex min-h-[calc(100vh-150px)] flex-col overflow-hidden rounded-2xl border border-[#dce7ef] bg-white shadow-[0_10px_30px_rgba(16,42,67,.04)]">
      {/* Top Toolbar */}
      <div className="border-b border-[#edf2f6] p-5 md:p-6">
        <div className="mb-5 flex items-start justify-between"><div><p className="mono-label text-[10px] text-[#2cb1bc]">YOUR COMMAND CENTER</p><h1 className="display-font mt-1 text-2xl font-bold text-[#102a43]">Inbox</h1><p className="mt-1 text-sm text-[#829ab1]">Find the signal in the noise.</p></div><div className="hidden items-center gap-2 rounded-lg bg-[#f5f8fb] px-3 py-2 text-xs text-[#627d98] sm:flex"><SlidersHorizontal size={14} /> Smart filters</div></div>
        
        <div className="flex w-full items-center justify-between gap-1 rounded-xl border border-[#dce7ef] bg-[#f5f8fb] p-1 md:w-fit">
          <button 
            onClick={() => { setIsNlMode(false); setNlQuery(''); }}
            className={`flex-1 rounded-lg px-4 py-2 text-sm font-semibold transition-colors md:flex-none ${!isNlMode ? 'bg-white text-[#102a43] shadow-sm' : 'text-[#829ab1] hover:text-[#334e68]'}`}
          >
            Standard Search
          </button>
          <button 
            onClick={() => { setIsNlMode(true); setSearch(''); setCategoryFilter(''); }}
            className={`flex-1 rounded-lg px-4 py-2 text-sm font-semibold transition-colors md:flex-none ${isNlMode ? 'bg-white text-[#126e68] shadow-sm' : 'text-[#829ab1] hover:text-[#334e68]'}`}
          >
            ✨ Ask MailSense
          </button>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between w-full space-y-4 sm:space-y-0">
          {isNlMode ? (
            <form onSubmit={handleNlSearch} className="relative w-full">
              <input
                type="text"
                placeholder="Ask anything, e.g. “Show emails from recruiters this week”"
                value={nlQuery}
                onChange={(e) => setNlQuery(e.target.value)}
                className="w-full rounded-xl border border-[#a8d8d2] bg-[#f1fbf9] px-4 py-3 pr-20 font-medium text-[#126e68] outline-none placeholder:text-[#72aaa4] focus:border-[#2cb1bc] focus:ring-4 focus:ring-[#d7f1ed]"
              />
              <button type="submit" className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1.5 rounded-lg bg-[#126e68] px-3 py-2 text-xs font-bold text-white hover:bg-[#102a43]"><Sparkles size={13} /> Ask
              </button>
            </form>
          ) : (
            <>
              <div className="relative w-full sm:w-96">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search emails..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-xl border border-[#dce7ef] bg-[#f8fafc] py-3 pl-10 pr-4 outline-none focus:border-[#2cb1bc] focus:ring-4 focus:ring-[#d7f1ed]"
                />
              </div>
              
              <div className="flex items-center space-x-2 w-full sm:w-auto">
                <Filter className="text-slate-400 w-5 h-5" />
                <select 
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full rounded-xl border border-[#dce7ef] bg-[#f8fafc] px-3 py-3 text-sm outline-none focus:border-[#2cb1bc] focus:ring-4 focus:ring-[#d7f1ed] sm:w-auto"
                >
                  <option value="">All Categories</option>
                  {categories.filter(c => c !== '').map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Email List */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        ) : emails.length > 0 ? (
          emails.map(email => <EmailRow key={email._id} email={email} />)
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-slate-500">
            <p className="text-lg font-medium">No emails found</p>
            <p className="text-sm">Try adjusting your filters or search query.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Inbox;
