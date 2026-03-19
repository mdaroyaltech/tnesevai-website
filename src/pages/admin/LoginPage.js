// src/pages/admin/LoginPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import {
  FaShieldAlt, FaEnvelope, FaLock, FaEye, FaEyeSlash,
  FaArrowRight, FaHome, FaCheckCircle, FaTimesCircle,
} from 'react-icons/fa';

// ── Floating particle ──────────────────────────────────────
function Particle({ style }) {
  return (
    <div style={{
      position: 'absolute', borderRadius: '50%',
      background: 'rgba(34,197,94,0.15)',
      animation: 'particleFloat 6s ease-in-out infinite',
      pointerEvents: 'none',
      ...style,
    }} />
  );
}

export default function LoginPage() {
  const { login }   = useAuth();
  const navigate    = useNavigate();
  const [email,     setEmail]     = useState('');
  const [pass,      setPass]      = useState('');
  const [showPw,    setShowPw]    = useState(false);
  const [status,    setStatus]    = useState('idle'); // idle | loading | success | error
  const [shake,     setShake]     = useState(false);
  const [mounted,   setMounted]   = useState(false);

  useEffect(() => {
    setTimeout(() => setMounted(true), 50);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !pass) { toast.error('Please enter email and password'); return; }

    setStatus('loading');

    try {
      await login(email, pass);
      setStatus('success');
      // ✅ Success — green flash, then navigate
      setTimeout(() => {
        toast.success('Welcome back!');
        navigate('/admin');
      }, 900);
    } catch {
      setStatus('error');
      // ❌ Error — shake animation, then reset
      setShake(true);
      setTimeout(() => { setShake(false); setStatus('idle'); }, 700);
      toast.error('Invalid email or password');
    }
  };

  const isLoading = status === 'loading';
  const isSuccess = status === 'success';
  const isError   = status === 'error';

  return (
    <>
      <style>{`
        @keyframes particleFloat {
          0%,100% { transform: translateY(0) scale(1); opacity: 0.6; }
          50%      { transform: translateY(-30px) scale(1.1); opacity: 1; }
        }
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(40px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes shakeX {
          0%,100% { transform: translateX(0); }
          15%     { transform: translateX(-8px); }
          30%     { transform: translateX(8px); }
          45%     { transform: translateX(-6px); }
          60%     { transform: translateX(6px); }
          75%     { transform: translateX(-3px); }
          90%     { transform: translateX(3px); }
        }
        @keyframes successPulse {
          0%   { box-shadow: 0 0 0 0 rgba(34,197,94,0.5); }
          70%  { box-shadow: 0 0 0 20px rgba(34,197,94,0); }
          100% { box-shadow: 0 0 0 0 rgba(34,197,94,0); }
        }
        @keyframes errorFlash {
          0%,100% { background: linear-gradient(135deg,#050f05,#15803d); }
          50%     { background: linear-gradient(135deg,#2d0a0a,#991b1b); }
        }
        @keyframes spinBtn {
          to { transform: rotate(360deg); }
        }
        @keyframes checkBounce {
          0%   { transform: scale(0); opacity: 0; }
          60%  { transform: scale(1.3); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes labelFloat {
          from { opacity:0; transform:translateY(4px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .input-row:focus-within .input-label {
          color: #15803d;
        }
      `}</style>

      <div style={{
        minHeight: '100vh',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'linear-gradient(135deg,#020a02 0%,#071407 40%,#0a1f0a 100%)',
        padding: '1rem', position: 'relative', overflow: 'hidden',
      }}>

        {/* ── Animated particles ── */}
        <Particle style={{ width:160, height:160, top:'10%',  left:'8%',  animationDelay:'0s',   animationDuration:'7s'  }} />
        <Particle style={{ width:100, height:100, top:'60%',  left:'5%',  animationDelay:'1.5s', animationDuration:'9s'  }} />
        <Particle style={{ width:200, height:200, top:'15%',  right:'6%', animationDelay:'0.8s', animationDuration:'8s'  }} />
        <Particle style={{ width:80,  height:80,  bottom:'15%',right:'12%',animationDelay:'2s',   animationDuration:'6s'  }} />
        <Particle style={{ width:120, height:120, bottom:'20%',left:'15%', animationDelay:'0.3s', animationDuration:'10s' }} />

        {/* ── Grid background ── */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `
            linear-gradient(rgba(34,197,94,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(34,197,94,0.04) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }} />

        {/* ── Center glow ── */}
        <div style={{
          position: 'absolute', top:'50%', left:'50%',
          transform: 'translate(-50%,-50%)',
          width: 600, height: 600, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(34,197,94,0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        {/* ── Card ── */}
        <div style={{
          position: 'relative', zIndex: 1,
          width: '100%', maxWidth: 'min(420px,100%)',
          animation: mounted ? 'cardIn 0.6s cubic-bezier(0.22,1,0.36,1) forwards' : 'none',
          opacity: mounted ? 1 : 0,
        }}>

          {/* Card body */}
          <div style={{
            background: 'white', borderRadius: 28, overflow: 'hidden',
            boxShadow: '0 40px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)',
            animation: isSuccess ? 'successPulse 0.8s ease' : 'none',
            transform: shake ? undefined : 'none',
            ...(shake && { animation: 'shakeX 0.6s ease' }),
          }}>

            {/* ── Header ── */}
            <div style={{
              padding: '36px 36px 28px',
              textAlign: 'center', position: 'relative', overflow: 'hidden',
              background: isSuccess
                ? 'linear-gradient(135deg,#052e16,#16a34a)'
                : isError
                  ? 'linear-gradient(135deg,#1a0505,#991b1b)'
                  : 'linear-gradient(135deg,#050f05,#0f2a1a,#15803d)',
              transition: 'background 0.4s ease',
            }}>
              {/* Grid lines in header */}
              <div style={{
                position:'absolute', inset:0,
                backgroundImage:'linear-gradient(rgba(255,255,255,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.03) 1px,transparent 1px)',
                backgroundSize:'25px 25px',
              }} />

              <div style={{ position: 'relative', zIndex: 1 }}>
                {/* Icon — changes based on status */}
                <div style={{
                  width: 68, height: 68, margin: '0 auto 16px',
                  borderRadius: 22, border: '1px solid rgba(255,255,255,0.2)',
                  background: isSuccess
                    ? 'rgba(34,197,94,0.3)'
                    : isError
                      ? 'rgba(239,68,68,0.3)'
                      : 'rgba(255,255,255,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.4s ease',
                }}>
                  {isSuccess ? (
                    <FaCheckCircle style={{
                      color: '#4ade80', fontSize: 30,
                      animation: 'checkBounce 0.5s cubic-bezier(0.22,1,0.36,1)',
                    }} />
                  ) : isError ? (
                    <FaTimesCircle style={{
                      color: '#f87171', fontSize: 30,
                      animation: 'checkBounce 0.3s ease',
                    }} />
                  ) : (
                    <FaShieldAlt style={{ color: 'white', fontSize: 28 }} />
                  )}
                </div>

                <h1 style={{
                  color: 'white', fontWeight: 900, fontSize: '1.35rem',
                  marginBottom: 4, letterSpacing: '-0.02em', transition: 'all 0.3s',
                }}>
                  {isSuccess ? 'Access Granted!' : isError ? 'Access Denied' : 'Admin Login'}
                </h1>
                <p style={{
                  fontSize: 12, transition: 'all 0.3s',
                  color: isSuccess ? '#86efac' : isError ? '#fca5a5' : 'rgba(134,239,172,0.7)',
                }}>
                  {isSuccess
                    ? 'Redirecting to dashboard...'
                    : isError
                      ? 'Wrong email or password'
                      : 'Royal Computers · Secure Access'
                  }
                </p>
              </div>
            </div>

            {/* ── Form ── */}
            <form onSubmit={handleSubmit} style={{ padding: '28px 32px 32px' }}>

              {/* Email field */}
              <div className="input-row" style={{ marginBottom: 18 }}>
                <label className="input-label" style={{
                  display: 'block', fontSize: 11, fontWeight: 800,
                  color: '#9ca3af', letterSpacing: '0.1em',
                  textTransform: 'uppercase', marginBottom: 8,
                  transition: 'color 0.2s', animation: 'labelFloat 0.4s ease',
                }}>
                  Email Address
                </label>
                <div style={{ position: 'relative' }}>
                  <FaEnvelope style={{
                    position: 'absolute', left: 15, top: '50%',
                    transform: 'translateY(-50%)', color: '#9ca3af', fontSize: 13,
                    pointerEvents: 'none',
                  }} />
                  <input
                    type="email" value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="admin@royalcomputers.in"
                    disabled={isLoading || isSuccess}
                    style={{
                      width: '100%', padding: '13px 14px 13px 44px',
                      borderRadius: 14, fontSize: 14, fontWeight: 500,
                      outline: 'none', background: '#f9fafb',
                      border: `2px solid ${isError ? '#fca5a5' : '#e5e7eb'}`,
                      transition: 'all 0.2s', boxSizing: 'border-box',
                      color: '#1f2937',
                    }}
                    onFocus={e => { e.target.style.borderColor = '#22c55e'; e.target.style.background = 'white'; e.target.style.boxShadow = '0 0 0 4px rgba(34,197,94,0.08)'; }}
                    onBlur={e  => { e.target.style.borderColor = isError ? '#fca5a5' : '#e5e7eb'; e.target.style.background = '#f9fafb'; e.target.style.boxShadow = 'none'; }}
                  />
                </div>
              </div>

              {/* Password field */}
              <div className="input-row" style={{ marginBottom: 28 }}>
                <label className="input-label" style={{
                  display: 'block', fontSize: 11, fontWeight: 800,
                  color: '#9ca3af', letterSpacing: '0.1em',
                  textTransform: 'uppercase', marginBottom: 8,
                  transition: 'color 0.2s',
                }}>
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <FaLock style={{
                    position: 'absolute', left: 15, top: '50%',
                    transform: 'translateY(-50%)', color: '#9ca3af', fontSize: 13,
                    pointerEvents: 'none',
                  }} />
                  <input
                    type={showPw ? 'text' : 'password'}
                    value={pass}
                    onChange={e => setPass(e.target.value)}
                    placeholder="••••••••"
                    disabled={isLoading || isSuccess}
                    style={{
                      width: '100%', padding: '13px 46px 13px 44px',
                      borderRadius: 14, fontSize: 14, fontWeight: 500,
                      outline: 'none', background: '#f9fafb',
                      border: `2px solid ${isError ? '#fca5a5' : '#e5e7eb'}`,
                      transition: 'all 0.2s', boxSizing: 'border-box',
                      color: '#1f2937',
                    }}
                    onFocus={e => { e.target.style.borderColor = '#22c55e'; e.target.style.background = 'white'; e.target.style.boxShadow = '0 0 0 4px rgba(34,197,94,0.08)'; }}
                    onBlur={e  => { e.target.style.borderColor = isError ? '#fca5a5' : '#e5e7eb'; e.target.style.background = '#f9fafb'; e.target.style.boxShadow = 'none'; }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    style={{
                      position: 'absolute', right: 14, top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none', border: 'none',
                      color: '#9ca3af', cursor: 'pointer', padding: 4,
                      transition: 'color 0.2s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.color = '#374151'}
                    onMouseLeave={e => e.currentTarget.style.color = '#9ca3af'}
                  >
                    {showPw ? <FaEyeSlash style={{ fontSize: 15 }} /> : <FaEye style={{ fontSize: 15 }} />}
                  </button>
                </div>

                {/* ❌ Error hint under password */}
                {isError && (
                  <p style={{
                    marginTop: 8, fontSize: 12, color: '#ef4444', fontWeight: 600,
                    display: 'flex', alignItems: 'center', gap: 6,
                    animation: 'labelFloat 0.3s ease',
                  }}>
                    <FaTimesCircle style={{ fontSize: 11 }} />
                    Incorrect credentials. Please try again.
                  </p>
                )}
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={isLoading || isSuccess}
                style={{
                  width: '100%', padding: '15px', borderRadius: 16,
                  border: 'none', cursor: (isLoading || isSuccess) ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  fontWeight: 800, fontSize: 15, color: 'white',
                  transition: 'all 0.3s ease',
                  background: isSuccess
                    ? 'linear-gradient(135deg,#16a34a,#22c55e)'
                    : isError
                      ? 'linear-gradient(135deg,#dc2626,#ef4444)'
                      : isLoading
                        ? '#9ca3af'
                        : 'linear-gradient(135deg,#15803d,#22c55e)',
                  boxShadow: isSuccess
                    ? '0 8px 24px rgba(34,197,94,0.5)'
                    : isError
                      ? '0 8px 24px rgba(239,68,68,0.4)'
                      : isLoading
                        ? 'none'
                        : '0 8px 24px rgba(34,197,94,0.35)',
                  transform: (isLoading || isSuccess) ? 'none' : undefined,
                }}
                onMouseEnter={e => {
                  if (!isLoading && !isSuccess && !isError) {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 12px 32px rgba(34,197,94,0.45)';
                  }
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow = isSuccess
                    ? '0 8px 24px rgba(34,197,94,0.5)'
                    : '0 8px 24px rgba(34,197,94,0.35)';
                }}
              >
                {isLoading && (
                  <>
                    <span style={{
                      width: 18, height: 18, borderRadius: '50%',
                      border: '2.5px solid rgba(255,255,255,0.3)',
                      borderTopColor: 'white', display: 'inline-block',
                      animation: 'spinBtn 0.7s linear infinite',
                    }} />
                    Signing in...
                  </>
                )}
                {isSuccess && (
                  <>
                    <FaCheckCircle style={{ fontSize: 16, animation: 'checkBounce 0.4s ease' }} />
                    Access Granted!
                  </>
                )}
                {isError && (
                  <>
                    <FaTimesCircle style={{ fontSize: 16 }} />
                    Try Again
                  </>
                )}
                {status === 'idle' && (
                  <>
                    Sign In <FaArrowRight style={{ fontSize: 12 }} />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* ── Below card ── */}
          <div style={{
            textAlign: 'center', marginTop: 20,
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
            animation: mounted ? 'cardIn 0.6s 0.15s cubic-bezier(0.22,1,0.36,1) both' : 'none',
          }}>
            <Link to="/" style={{ textDecoration: 'none' }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                background: 'rgba(255,255,255,0.07)',
                border: '1px solid rgba(255,255,255,0.15)',
                color: 'rgba(134,239,172,0.85)', fontWeight: 700, fontSize: 13,
                padding: '11px 24px', borderRadius: 12, cursor: 'pointer',
                transition: 'all 0.2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.background='rgba(255,255,255,0.14)'; e.currentTarget.style.color='white'; e.currentTarget.style.borderColor='rgba(255,255,255,0.3)'; }}
                onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.07)'; e.currentTarget.style.color='rgba(134,239,172,0.85)'; e.currentTarget.style.borderColor='rgba(255,255,255,0.15)'; }}
              >
                <FaHome style={{ fontSize: 13 }} /> Back to Website
              </div>
            </Link>
            <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: 11 }}>
              © Royal Computers · Authorized Admin Portal
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
