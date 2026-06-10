import { useState } from 'react'
import { Zap, Mail, Lock, User, ArrowRight, Chrome } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const FEATURES = [
  { icon: '🎬', text: 'Multi-track timeline editing' },
  { icon: '🤖', text: 'AI Auto-Captions & Silence Cut' },
  { icon: '🚀', text: 'One-click publish to YouTube, TikTok & Instagram' },
  { icon: '📊', text: 'Cloud sync — access from any device' },
]

export default function Login() {
  const { login } = useAuth()
  const [tab, setTab]         = useState('signin')
  const [name, setName]       = useState('')
  const [email, setEmail]     = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    if (!email.trim() || !password.trim()) { setError('Please fill in all fields.'); return }
    if (tab === 'signup' && !name.trim()) { setError('Please enter your name.'); return }
    setLoading(true)
    await new Promise(r => setTimeout(r, 900))
    login(email, password, tab === 'signup' ? name : undefined)
    setLoading(false)
  }

  const googleLogin = async () => {
    setLoading(true)
    await new Promise(r => setTimeout(r, 1200))
    login('demo@peakedit.io', 'demo', 'Alex Creator')
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 flex">
      {/* Left panel — marketing */}
      <div className="hidden lg:flex flex-col justify-between w-[480px] shrink-0 bg-[#0A0A0A] border-r border-[#1A1A1A] p-12">
        <div>
          <div className="flex items-center gap-2.5 mb-16">
            <div className="w-9 h-9 bg-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-900/50">
              <Zap size={18} className="text-white" fill="white" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">PeakEdit</span>
            <span className="text-[10px] bg-violet-900/60 text-violet-300 border border-violet-700/40 px-1.5 py-0.5 rounded-full font-medium ml-1">Pro</span>
          </div>

          <h2 className="text-3xl font-bold text-white mb-3 leading-snug">
            The AI-Powered Video Editor<br />for Creators
          </h2>
          <p className="text-zinc-400 text-base leading-relaxed mb-10">
            Edit faster, reach further. PeakEdit combines professional-grade tools with AI automation so you can focus on what matters — your content.
          </p>

          <div className="flex flex-col gap-4">
            {FEATURES.map(f => (
              <div key={f.text} className="flex items-center gap-3">
                <span className="text-lg">{f.icon}</span>
                <span className="text-zinc-300 text-sm">{f.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 p-4 bg-[#111] rounded-2xl border border-[#1F1F1F]">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-white text-sm font-bold shrink-0">A</div>
          <div>
            <p className="text-xs font-semibold text-zinc-200">Alex Creator</p>
            <p className="text-[11px] text-zinc-500">"PeakEdit cut my editing time in half. The AI captions are insane."</p>
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center">
              <Zap size={15} className="text-white" fill="white" />
            </div>
            <span className="font-bold text-white">PeakEdit</span>
          </div>

          <h1 className="text-2xl font-bold text-white mb-1">
            {tab === 'signin' ? 'Welcome back' : 'Create your account'}
          </h1>
          <p className="text-zinc-500 text-sm mb-6">
            {tab === 'signin' ? "Sign in to your PeakEdit workspace" : "Start creating in seconds — no credit card required"}
          </p>

          {/* Tab switch */}
          <div className="flex bg-[#111] border border-[#1F1F1F] rounded-xl p-1 mb-5">
            {[['signin','Sign in'],['signup','Sign up']].map(([id, label]) => (
              <button key={id} onClick={() => { setTab(id); setError('') }}
                className={`flex-1 py-1.5 rounded-lg text-sm font-medium transition-all ${tab === id ? 'bg-violet-600 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}>
                {label}
              </button>
            ))}
          </div>

          <form onSubmit={submit} className="flex flex-col gap-3">
            {tab === 'signup' && (
              <div className="relative">
                <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input value={name} onChange={e => setName(e.target.value)} type="text"
                  placeholder="Full name" autoComplete="name"
                  className="w-full bg-[#111] border border-[#252525] rounded-xl pl-9 pr-3 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-violet-500/60 transition-colors" />
              </div>
            )}
            <div className="relative">
              <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input value={email} onChange={e => setEmail(e.target.value)} type="email"
                placeholder="Email address" autoComplete="email"
                className="w-full bg-[#111] border border-[#252525] rounded-xl pl-9 pr-3 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-violet-500/60 transition-colors" />
            </div>
            <div className="relative">
              <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input value={password} onChange={e => setPassword(e.target.value)} type="password"
                placeholder="Password" autoComplete={tab === 'signup' ? 'new-password' : 'current-password'}
                className="w-full bg-[#111] border border-[#252525] rounded-xl pl-9 pr-3 py-2.5 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-violet-500/60 transition-colors" />
            </div>

            {error && <p className="text-xs text-red-400 bg-red-950/30 border border-red-800/30 rounded-lg px-3 py-2">{error}</p>}

            <button type="submit" disabled={loading}
              className="w-full bg-violet-600 hover:bg-violet-500 disabled:opacity-60 text-white font-semibold py-2.5 rounded-xl text-sm transition-colors flex items-center justify-center gap-2 shadow-lg shadow-violet-900/40 mt-1">
              {loading ? (
                <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> {tab === 'signup' ? 'Creating account…' : 'Signing in…'}</>
              ) : (
                <>{tab === 'signup' ? 'Create Account' : 'Sign In'} <ArrowRight size={15} /></>
              )}
            </button>
          </form>

          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-[#1F1F1F]" />
            <span className="text-[11px] text-zinc-600">or</span>
            <div className="flex-1 h-px bg-[#1F1F1F]" />
          </div>

          <button onClick={googleLogin} disabled={loading}
            className="w-full flex items-center justify-center gap-2.5 py-2.5 rounded-xl border border-[#2A2A2A] bg-[#111] hover:bg-[#161616] text-sm text-zinc-300 font-medium transition-colors disabled:opacity-60">
            <Chrome size={15} className="text-zinc-400" />
            Continue with Google
          </button>

          <p className="text-center text-xs text-zinc-600 mt-6">
            By continuing you agree to PeakEdit's{' '}
            <span className="text-zinc-500 cursor-pointer hover:text-zinc-400">Terms</span> and{' '}
            <span className="text-zinc-500 cursor-pointer hover:text-zinc-400">Privacy Policy</span>
          </p>
        </div>
      </div>
    </div>
  )
}
