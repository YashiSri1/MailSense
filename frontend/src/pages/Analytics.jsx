import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const Analytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/analytics', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setData(response.data);
      } catch (error) {
        console.error('Failed to fetch analytics', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) return <div className="p-8 text-center text-slate-500">Loading analytics...</div>;

  const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#64748b'];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-slate-800 border-b pb-4">Inbox Analytics</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 text-center">
          <h3 className="text-slate-500 text-sm font-semibold uppercase tracking-wider mb-2">Total Emails</h3>
          <p className="text-4xl font-bold text-slate-800">{data?.totalEmails || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 text-center">
          <h3 className="text-slate-500 text-sm font-semibold uppercase tracking-wider mb-2">Action Required</h3>
          <p className="text-4xl font-bold text-orange-600">{data?.actionRequiredCount || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 text-center">
          <h3 className="text-slate-500 text-sm font-semibold uppercase tracking-wider mb-2">Responses Needed</h3>
          <p className="text-4xl font-bold text-blue-600">{data?.responseRequiredCount || 0}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 h-96">
          <h2 className="text-lg font-bold text-slate-800 mb-6">Emails by Category</h2>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data?.categoryDistribution}
                cx="50%"
                cy="45%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {data?.categoryDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 h-96">
          <h2 className="text-lg font-bold text-slate-800 mb-6">Emails by Priority</h2>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data?.priorityDistribution}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip cursor={{ fill: '#f1f5f9' }} />
              <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100">
        <h2 className="text-lg font-bold text-indigo-900 mb-2">MailSense Insights</h2>
        <p className="text-indigo-800">
          Out of {data?.totalEmails || 0} total emails, {data?.actionRequiredCount || 0} required your direct action and {data?.responseRequiredCount || 0} needed a response. 
          Your AI pipeline successfully categorized your communications to help you focus on what matters.
        </p>
      </div>
    </div>
  );
};

export default Analytics;
