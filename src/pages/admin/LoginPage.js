// src/pages/admin/LoginPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { FaShieldAlt, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaArrowRight } from 'react-icons/fa';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate  = useNavigate();
  const [email,   setEmail]   = useState('');
  const [pass,    setPass]    = useState('');
  const [showPw,  setShowPw]  = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !pass) { toast.error('Enter email and password'); return; }
    setLoading(true);
    try {
      await login(email, pass);
      toast.success('Welcome back!');
      navigate('/admin');
    } catch { toast.error('Invalid email or password'); }
    setLoading(false);
  };

  return (
    <div style={{
      minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center',
      background:'linear-gradient(135deg,#050f05 0%,#0f2a1a 50%,#052e16 100%)',
      padding:'1rem', position:'relative', overflow:'hidden',
    }}>
      {/* Background grid */}
      <div style={{
        position:'absolute', inset:0,
        backgroundImage:'linear-gradient(rgba(34,197,94,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(34,197,94,0.05) 1px,transparent 1px)',
        backgroundSize:'60px 60px',
      }} />
      {/* Glow */}
      <div style={{ position:'absolute', top:'20%', right:'20%', width:400, height:400, borderRadius:'50%', background:'radial-gradient(circle,rgba(34,197,94,0.15) 0%,transparent 70%)', pointerEvents:'none' }} />

      <div style={{ position:'relative', zIndex:1, width:'100%', maxWidth:'min(420px, 100%)' }}>
        <div style={{
          background:'white', borderRadius:32, overflow:'hidden',
          boxShadow:'0 40px 80px rgba(0,0,0,0.4)',
        }}>
          {/* Top header */}
          <div style={{
            background:'linear-gradient(135deg,#050f05,#15803d)',
            padding:'40px 36px', textAlign:'center', position:'relative', overflow:'hidden',
          }}>
            <div style={{ position:'absolute', inset:0, backgroundImage:'linear-gradient(rgba(255,255,255,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.03) 1px,transparent 1px)', backgroundSize:'30px 30px' }} />
            <div style={{ position:'relative', zIndex:1 }}>
              <div style={{
                width:64, height:64, background:'rgba(255,255,255,0.12)', borderRadius:20,
                display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px',
                border:'1px solid rgba(255,255,255,0.2)',
              }}>
                <FaShieldAlt style={{ color:'white', fontSize:26 }} />
              </div>
              <h1 style={{ color:'white', fontWeight:900, fontSize:'1.4rem', marginBottom:4 }}>Admin Login</h1>
              <p style={{ color:'rgba(134,239,172,0.8)', fontSize:12 }}>Royal Computers · Secure Access</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ padding:'36px' }}>
            <div style={{ marginBottom:18 }}>
              <label style={{ display:'block', fontSize:11, fontWeight:800, color:'#6b7280', letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:8 }}>Email</label>
              <div style={{ position:'relative' }}>
                <FaEnvelope style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', color:'#9ca3af', fontSize:13 }} />
                <input type="email" value={email} onChange={e=>setEmail(e.target.value)}
                  placeholder="admin@royalcomputers.in"
                  style={{ width:'100%', padding:'13px 14px 13px 42px', borderRadius:16, border:'2px solid #e5e7eb', fontSize:14, fontWeight:500, outline:'none', background:'#f9fafb', transition:'border-color 0.2s', boxSizing:'border-box' }}
                  onFocus={e=>e.target.style.borderColor='#22c55e'}
                  onBlur={e=>e.target.style.borderColor='#e5e7eb'}
                />
              </div>
            </div>

            <div style={{ marginBottom:28 }}>
              <label style={{ display:'block', fontSize:11, fontWeight:800, color:'#6b7280', letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:8 }}>Password</label>
              <div style={{ position:'relative' }}>
                <FaLock style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', color:'#9ca3af', fontSize:13 }} />
                <input type={showPw?'text':'password'} value={pass} onChange={e=>setPass(e.target.value)}
                  placeholder="••••••••"
                  style={{ width:'100%', padding:'13px 42px', borderRadius:16, border:'2px solid #e5e7eb', fontSize:14, fontWeight:500, outline:'none', background:'#f9fafb', transition:'border-color 0.2s', boxSizing:'border-box' }}
                  onFocus={e=>e.target.style.borderColor='#22c55e'}
                  onBlur={e=>e.target.style.borderColor='#e5e7eb'}
                />
                <button type="button" onClick={() => setShowPw(!showPw)} style={{ position:'absolute', right:14, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', color:'#9ca3af', cursor:'pointer' }}>
                  {showPw ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} style={{
              width:'100%', padding:'15px', borderRadius:18,
              background: loading ? '#9ca3af' : 'linear-gradient(135deg,#15803d,#22c55e)',
              color:'white', fontWeight:800, fontSize:15, border:'none', cursor: loading?'not-allowed':'pointer',
              display:'flex', alignItems:'center', justifyContent:'center', gap:8,
              boxShadow: loading ? 'none' : '0 8px 24px rgba(34,197,94,0.35)',
              transition:'all 0.2s',
            }}>
              {loading ? (
                <><span style={{ display:'inline-block', width:18, height:18, border:'2.5px solid rgba(255,255,255,0.3)', borderTopColor:'white', borderRadius:'50%', animation:'spinSlow 0.7s linear infinite' }} /> Signing in...</>
              ) : (
                <> Sign In <FaArrowRight style={{ fontSize:12 }} /></>
              )}
            </button>
          </form>
        </div>

        <p style={{ textAlign:'center', color:'rgba(134,239,172,0.5)', fontSize:11, marginTop:20 }}>
          © Royal Computers · Authorized Admin Portal
        </p>
      </div>
    </div>
  );
}
