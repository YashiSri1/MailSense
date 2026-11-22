import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, CheckCircle, Clock, AlertCircle, ShieldAlert } from 'lucide-react';
import { format } from 'date-fns';

const EmailDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [email, setEmail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [taskCreated, setTaskCreated] = useState(false);

  useEffect(() => {
    const fetchEmail = async () => {
      try {
        const token = localStorage.getItem('token');
        const { data } = await axios.get(`http://localhost:5000/api/emails/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setEmail(data);
      } catch (error) {
        console.error('Failed to fetch email', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEmail();
  }, [id]);

  const handleAnalyze = async () => {
    setAnalyzing(true);
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.post(`http://localhost:5000/api/emails/${id}/analyze`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEmail(data);
    } catch (error) {
      console.error('Failed to analyze email', error);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleCreateTask = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/tasks', {
        title: email.action || `Follow up on: ${email.subject}`,
        description: `Action extracted from email: ${email.subject}`,
        dueDate: email.deadline || null,
        priority: email.priority,
        emailId: email._id,
        source: 'EMAIL'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTaskCreated(true);
    } catch (error) {
      console.error('Failed to create task', error);
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-500">Loading email...</div>;
  if (!email) return <div className="p-8 text-center text-red-500">Email not found.</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Navigation */}
      <button 
        onClick={() => navigate('/inbox')}
        className="flex items-center text-slate-500 hover:text-slate-800 transition-colors"
      >
        <ArrowLeft className="w-5 h-5 mr-2" /> Back to Inbox
      </button>

      {/* Header Info */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">{email.subject}</h1>
            <div className="flex items-center text-slate-600 space-x-2">
              <span className="font-semibold text-slate-800">{email.sender}</span>
              <span>&lt;{email.senderEmail || 'unknown@example.com'}&gt;</span>
            </div>
            <div className="text-sm text-slate-400 mt-1">
              {format(new Date(email.receivedAt), 'PPP p')}
            </div>
          </div>
          <div className="flex space-x-2">
            <span className="px-3 py-1 bg-slate-100 text-slate-700 text-sm font-bold rounded border uppercase">
              {email.category}
            </span>
            {email.isImportant && (
              <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-sm font-bold rounded border-yellow-200 uppercase flex items-center">
                Important
              </span>
            )}
          </div>
        </div>
      </div>

      {/* AI Analysis Section */}
      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-6 rounded-xl shadow-sm border border-blue-100 relative">
        <div className="flex items-center justify-between mb-4">
          <h3 className="flex items-center text-blue-800 font-bold uppercase tracking-wide text-sm">
            <ShieldAlert className="w-5 h-5 mr-2" /> MailSense Intelligence
          </h3>
          <button 
            onClick={handleAnalyze} 
            disabled={analyzing}
            className="text-xs font-semibold bg-white text-blue-600 px-3 py-1 rounded-md border border-blue-200 hover:bg-blue-50 disabled:opacity-50"
          >
            {analyzing ? 'Analyzing...' : 'Re-analyze'}
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h4 className="text-xs font-semibold text-blue-600 uppercase mb-1">Summary</h4>
              <p className="text-slate-800 font-medium">{email.summary}</p>
            </div>
            {email.intent && (
              <div>
                <h4 className="text-xs font-semibold text-blue-600 uppercase mb-1">Detected Intent</h4>
                <p className="text-slate-800">{email.intent}</p>
              </div>
            )}
          </div>
          
          {(email.requiresAction || email.deadline) && (
            <div className="bg-white p-4 rounded-lg border border-blue-100 shadow-sm space-y-3">
              {email.requiresAction && (
                <div>
                  <h4 className="text-xs font-semibold text-orange-600 uppercase mb-1 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" /> Action Required
                  </h4>
                  <p className="text-slate-800 font-medium">{email.action}</p>
                </div>
              )}
              {email.deadline && (
                <div>
                  <h4 className="text-xs font-semibold text-red-600 uppercase mb-1 flex items-center">
                    <Clock className="w-4 h-4 mr-1" /> Deadline
                  </h4>
                  <p className="text-red-700 font-bold">
                    {format(new Date(email.deadline), 'PPP p')}
                  </p>
                </div>
              )}
              <div className="pt-2">
                <button 
                  onClick={handleCreateTask}
                  disabled={taskCreated}
                  className={`w-full py-2 rounded-md font-medium text-sm transition-colors flex items-center justify-center ${
                    taskCreated ? 'bg-green-100 text-green-700 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  <CheckCircle className="w-4 h-4 mr-2" /> 
                  {taskCreated ? 'Task Created' : 'Create Task'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Original Email Content */}
      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 min-h-[300px]">
        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wide border-b pb-2 mb-4">Original Message</h3>
        <div className="text-slate-700 whitespace-pre-wrap font-serif">
          {email.body || email.snippet}
        </div>
      </div>
    </div>
  );
};

export default EmailDetail;
