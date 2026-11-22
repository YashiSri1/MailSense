import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Mail, Clock, MessageSquareWarning } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

const FollowUps = () => {
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFollowUps = async () => {
      try {
        const token = localStorage.getItem('token');
        const { data } = await axios.get('http://localhost:5000/api/emails', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        // Filter for emails requiring response
        const responsesNeeded = data.emails.filter(e => e.requiresResponse);
        setEmails(responsesNeeded);
      } catch (error) {
        console.error('Failed to fetch follow-ups', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFollowUps();
  }, []);

  if (loading) return <div className="p-8 text-center text-slate-500">Loading follow-ups...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between border-b pb-4">
        <h1 className="text-3xl font-bold text-slate-800">Follow-ups</h1>
        <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-bold text-sm">
          {emails.length} Action{emails.length !== 1 ? 's' : ''} Needed
        </div>
      </div>

      {emails.length === 0 ? (
        <div className="bg-slate-50 p-8 rounded-xl text-center border border-dashed border-slate-200">
          <MessageSquareWarning className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 text-lg">No pending responses</p>
          <p className="text-slate-400 text-sm mt-1">You have replied to everyone.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {emails.map(email => (
            <div key={email._id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1 h-full bg-blue-500" />
              
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-bold text-slate-800 truncate pr-4">{email.sender}</h3>
                <span className="text-xs text-slate-400 whitespace-nowrap flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  {formatDistanceToNow(new Date(email.receivedAt))} ago
                </span>
              </div>
              
              <p className="text-sm font-semibold text-slate-700 mb-1 truncate">{email.subject}</p>
              <p className="text-sm text-slate-500 line-clamp-2 mb-4">{email.summary || email.snippet}</p>
              
              <div className="flex items-center justify-between mt-auto">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-1 rounded">
                  Response Needed
                </span>
                
                <Link to={`/inbox/${email._id}`} className="text-sm font-medium text-slate-600 hover:text-blue-600 flex items-center">
                  <Mail className="w-4 h-4 mr-1" /> View Thread
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FollowUps;
