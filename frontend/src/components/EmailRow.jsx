import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const EmailRow = ({ email }) => {
  const navigate = useNavigate();

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'CRITICAL': return 'bg-red-500';
      case 'HIGH': return 'bg-orange-500';
      case 'MEDIUM': return 'bg-yellow-500';
      case 'LOW': return 'bg-blue-500';
      default: return 'bg-slate-300';
    }
  };

  const getCategoryColor = (category) => {
    switch(category) {
      case 'CAREER': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'FINANCE': return 'bg-green-100 text-green-700 border-green-200';
      case 'EDUCATION': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'PROMOTION': return 'bg-slate-100 text-slate-600 border-slate-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div 
      onClick={() => navigate(`/inbox/${email._id}`)}
      className={`group flex cursor-pointer items-center border-b border-[#edf2f6] px-4 py-4 transition-colors hover:bg-[#f8fcfb] md:px-6 ${!email.isRead ? 'bg-white font-semibold' : 'bg-[#fbfcfd] text-slate-600'}`}
    >
      {/* Priority Indicator */}
      <div className="flex w-12 shrink-0 justify-center">
        <div className={`h-2.5 w-2.5 rounded-full ring-4 ring-white ${getPriorityColor(email.priority)}`} title={`Priority: ${email.priority}`} />
      </div>

      {/* Main Content */}
      <div className="flex-1 min-w-0 pr-4">
        <div className="flex items-center justify-between mb-1">
          <span className="w-1/4 truncate text-sm font-bold text-[#243b53]">{email.sender}</span>
          <div className="flex items-center space-x-2 w-3/4">
            <span className="truncate text-sm text-[#334e68]">{email.subject}</span>
            <span className="hidden truncate text-sm text-[#9fb3c8] md:inline-block">- {email.snippet}</span>
          </div>
        </div>
      </div>

      {/* Badges and Metadata */}
      <div className="flex shrink-0 items-center space-x-4">
        {email.requiresAction && (
          <div className="flex items-center text-orange-600 text-xs font-medium" title="Action Required">
            <AlertCircle className="w-4 h-4 mr-1" />
            <span className="hidden lg:inline">Action</span>
          </div>
        )}
        
        {email.deadline && (
          <div className="flex items-center text-red-600 text-xs font-medium" title="Deadline Approaching">
            <Clock className="w-4 h-4 mr-1" />
            <span className="hidden lg:inline">{new Date(email.deadline).toLocaleDateString()}</span>
          </div>
        )}

        <span className={`px-2 py-1 rounded-md text-[10px] uppercase font-bold tracking-wider border ${getCategoryColor(email.category)} hidden sm:block`}>
          {email.category}
        </span>
        
        <span className="text-xs text-slate-400 whitespace-nowrap w-20 text-right">
          {formatDistanceToNow(new Date(email.receivedAt), { addSuffix: true }).replace('about ', '')}
        </span>
      </div>
    </div>
  );
};

export default EmailRow;
