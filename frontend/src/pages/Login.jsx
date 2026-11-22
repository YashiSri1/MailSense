import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Check, Inbox, Sparkles } from 'lucide-react';

const Login = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('demo@mailsense.app');
  const [password, setPassword] = useState('password123');
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (isSignUp) {
        await register(name, email, password);
      } else {
        await login(email, password);
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || (isSignUp ? 'Could not create your account.' : 'Invalid email or password.'));
    }
  };

  const switchMode = (signUp) => {
    setIsSignUp(signUp);
    setError('');
    if (signUp) {
      setName('');
      setEmail('');
      setPassword('');
    } else {
      setEmail('demo@mailsense.app');
      setPassword('password123');
    }
  };

  return (
    <div className="app-noise flex min-h-screen bg-[#f5f8fb]">
      <div className="hidden lg:flex lg:w-[52%] flex-col justify-between bg-[#102a43] p-12 text-white relative overflow-hidden">
        <div className="absolute -right-28 -top-28 h-80 w-80 rounded-full border-28 border-[#193b58]" /><div className="absolute -bottom-36 -left-20 h-96 w-96 rounded-full border-42 border-[#193b58]" />
        <div className="relative"><div className="flex items-center gap-2.5"><div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#2cb1bc] text-[#102a43]"><Sparkles size={18} /></div><span className="display-font text-xl font-bold">MailSense</span></div></div>
        <div className="relative max-w-lg rise-in"><p className="mono-label mb-5 text-xs text-[#74e0d5]">THE INTELLIGENT INBOX</p><h1 className="display-font text-5xl font-bold leading-[1.08] tracking-tight">Make email feel<br /><span className="text-[#74e0d5]">manageable again.</span></h1><p className="mt-6 max-w-md text-lg leading-8 text-[#c6d5e1]">MailSense turns a noisy inbox into a clear list of what matters, what can wait, and what to do next.</p><div className="mt-9 space-y-3 text-sm text-[#dce7ef]"><div className="flex items-center gap-3"><Check size={16} className="text-[#74e0d5]" /> AI-prioritized conversations</div><div className="flex items-center gap-3"><Check size={16} className="text-[#74e0d5]" /> Follow-ups that never slip through</div><div className="flex items-center gap-3"><Check size={16} className="text-[#74e0d5]" /> Ask your inbox in plain English</div></div></div>
        <p className="relative text-xs text-[#718fa8]">Built for people who have better things to do than triage email.</p>
      </div>
      <div className="flex flex-1 items-center justify-center px-6 py-10"><div className="w-full max-w-105 rise-in-delay">
        <div className="mb-9 lg:hidden flex items-center gap-2.5"><div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#2cb1bc] text-[#102a43]"><Sparkles size={18} /></div><span className="display-font text-xl font-bold text-[#102a43]">MailSense</span></div>
        <div className="mb-8"><div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#d7f1ed] text-[#126e68]"><Inbox size={22} /></div><h2 className="display-font text-3xl font-bold tracking-tight text-[#102a43]">{isSignUp ? 'Create your account' : 'Welcome back'}</h2><p className="mt-2 text-[#627d98]">{isSignUp ? 'Start turning your inbox into a clear plan.' : 'Your inbox is waiting for a little clarity.'}</p></div>
        {error && <p className="mb-4 rounded-xl bg-[#fff1ee] px-4 py-3 text-sm font-medium text-[#c2412d]">{error}</p>}
        <form onSubmit={handleSubmit}>
          {isSignUp && <div className="mb-4"><label className="mb-2 block text-sm font-semibold text-[#334e68]">Full name</label><input required type="text" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Alex Morgan" className="w-full rounded-xl border border-[#d8e2eb] bg-white px-4 py-3 text-[#102a43] outline-none transition placeholder:text-[#9fb3c8] focus:border-[#2cb1bc] focus:ring-4 focus:ring-[#d7f1ed]" /></div>}
          <div className="mb-4">
            <label className="mb-2 block text-sm font-semibold text-[#334e68]">Email address</label>
            <input 
              required
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-[#d8e2eb] bg-white px-4 py-3 text-[#102a43] outline-none transition focus:border-[#2cb1bc] focus:ring-4 focus:ring-[#d7f1ed]"
            />
          </div>
          <div className="mb-6">
            <label className="mb-2 block text-sm font-semibold text-[#334e68]">Password</label>
            <input 
              required
              minLength={6}
              type="password"
              autoComplete={isSignUp ? 'new-password' : 'current-password'}
              placeholder={isSignUp ? 'At least 6 characters' : 'Your password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-[#d8e2eb] bg-white px-4 py-3 text-[#102a43] outline-none transition focus:border-[#2cb1bc] focus:ring-4 focus:ring-[#d7f1ed]"
            />
          </div>
          <button type="submit" className="group mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[#102a43] px-4 py-3.5 font-bold text-white transition hover:bg-[#193b58]">
            {isSignUp ? 'Create account' : 'Open my inbox'} <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" />
          </button>
        </form>
        <div className="mt-6 flex items-center justify-center gap-1 text-sm text-[#829ab1]"><span>{isSignUp ? 'Already have an account?' : 'New to MailSense?'}</span><button type="button" onClick={() => switchMode(!isSignUp)} className="font-bold text-[#126e68] hover:text-[#102a43]">{isSignUp ? 'Sign in' : 'Create an account'}</button></div>
        {!isSignUp && <p className="mt-3 text-center text-xs text-[#829ab1]">Demo account: demo@mailsense.app</p>}
      </div>
      </div>
    </div>
  );
};

export default Login;
