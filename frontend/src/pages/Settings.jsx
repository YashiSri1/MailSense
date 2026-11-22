import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { Mail, Shield, CheckCircle, AlertTriangle, RefreshCw } from 'lucide-react';

const Settings = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [statusMsg, setStatusMsg] = useState(null);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    const success = searchParams.get('gmail_connected');
    const error = searchParams.get('error');
    if (success === 'true') {
      setStatusMsg({ type: 'success', text: 'Gmail connected successfully!' });
      // In a real app, we might want to refresh the user context here
    } else if (success === 'false' || error) {
      setStatusMsg({ type: 'error', text: error || 'Failed to connect Gmail.' });
    }
  }, [searchParams]);

  const handleConnectGmail = async () => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.get('http://localhost:5000/api/auth/google', {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Redirect to Google OAuth
      window.location.href = data.url;
    } catch {
      setStatusMsg({ type: 'error', text: 'Failed to initiate Gmail connection.' });
    }
  };

  const handleSyncEmails = async () => {
    setIsSyncing(true);
    setStatusMsg(null);
    try {
      const token = localStorage.getItem('token');
      const { data } = await axios.post('http://localhost:5000/api/emails/sync', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStatusMsg({ type: 'success', text: data.message });
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.response?.data?.message || 'Failed to sync emails.' });
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-slate-800 mb-6">Settings</h1>

      {statusMsg && (
        <div className={`p-4 rounded-lg flex items-center ${statusMsg.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {statusMsg.type === 'success' ? <CheckCircle className="w-5 h-5 mr-2" /> : <AlertTriangle className="w-5 h-5 mr-2" />}
          {statusMsg.text}
        </div>
      )}

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        <h2 className="text-xl font-bold text-slate-800 border-b pb-4 mb-6">Connected Accounts</h2>
        
        <div className="flex items-center justify-between p-4 border rounded-lg bg-slate-50">
          <div className="flex items-center space-x-4">
            <div className="bg-red-100 p-3 rounded-full">
              <Mail className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800">Google Gmail</h3>
              <p className="text-sm text-slate-500">
                {user?.hasGmailConnected ? 'Connected to your Gmail account' : 'Not connected'}
              </p>
            </div>
          </div>
          <div>
            {!user?.hasGmailConnected ? (
              <button 
                onClick={handleConnectGmail}
                className="px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors"
              >
                Connect Gmail
              </button>
            ) : (
              <div className="flex items-center space-x-3">
                <button 
                  onClick={handleSyncEmails}
                  disabled={isSyncing}
                  className="px-4 py-2 bg-blue-100 text-blue-700 rounded-md font-medium hover:bg-blue-200 transition-colors flex items-center disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
                  Sync Emails
                </button>
                <span className="px-4 py-2 border border-slate-300 text-slate-600 rounded-md font-medium cursor-not-allowed bg-slate-100">
                  Connected
                </span>
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-6 flex items-start text-sm text-slate-500 bg-blue-50 p-4 rounded-md">
          <Shield className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
          <p>
            MailSense uses Google OAuth 2.0 to securely access your emails. We only request read-only access. 
            We do <strong>not</strong> store your Google password. You can revoke access at any time from your Google Account settings.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Settings;
