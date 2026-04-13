import React, { useState } from 'react';
import { Mail, Lock, User as UserIcon } from 'lucide-react';
import { useAuth } from './auth-context';
import { toast } from 'sonner';

export function AuthView() {
  const { signIn, signUp } = useAuth();
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signIn(email, password);
      toast.success('Successfully signed in!');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await signUp(email, password, name);
      toast.success('Account created successfully!');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  // Sign In / Sign Up view
  return (
    <div className="w-full min-h-screen flex" style={{ backgroundColor: '#FFFFFF' }}>
      {/* Left Panel - Branding */}
      <div
        className="flex-shrink-0 flex items-center justify-center relative overflow-hidden hidden lg:flex"
        style={{
          width: '40%', minHeight: '100vh',
          background: 'linear-gradient(135deg, #FFF6EE 0%, #FFFBF7 50%, #FFF6EE 100%)',
          padding: '48px'
        }}
      >
        <div
          style={{ position: 'absolute', top: '10%', right: '15%', width: '180px', height: '180px', borderRadius: '50%', background: 'rgba(247, 105, 2, 0.05)', filter: 'blur(40px)' }}
        />
        <div
          style={{ position: 'absolute', bottom: '20%', left: '10%', width: '220px', height: '220px', borderRadius: '50%', background: 'rgba(247, 105, 2, 0.03)', filter: 'blur(50px)' }}
        />
        <div className="flex flex-col relative z-10" style={{ maxWidth: '420px', gap: '32px' }}>
          <div
            className="inline-flex items-center font-semibold"
            style={{
              fontSize: '13px', color: '#F76902', backgroundColor: '#FFFFFF',
              padding: '8px 16px', borderRadius: '8px', border: '1px solid rgba(247, 105, 2, 0.15)',
              width: 'fit-content', boxShadow: '0 2px 8px rgba(247, 105, 2, 0.08)'
            }}
          >
            RIT Students Only
          </div>
          <h1 className="font-bold" style={{ fontSize: '48px', color: '#402E32', lineHeight: '1.1', letterSpacing: '-0.02em' }}>
            Swap smarter at RIT
          </h1>
          <p className="font-normal" style={{ fontSize: '18px', color: '#B5866E', lineHeight: '1.6' }}>
            Find housing, sell items, and connect with students — all in one place.
          </p>
          <div style={{ marginTop: '16px' }}>
            <div className="flex items-center" style={{ gap: '16px' }}>
              <div style={{ width: '48px', height: '4px', borderRadius: '2px', backgroundColor: '#F76902' }} />
              <span className="font-medium" style={{ fontSize: '14px', color: '#C4A88E' }}>Trusted by RIT students</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Card */}
      <div className="flex-1 flex items-center justify-center" style={{ backgroundColor: '#FFFFFF', padding: '48px' }}>
        <div className="bg-white" style={{ maxWidth: '440px', width: '100%', padding: '48px' }}>
          {/* Tab Toggle */}
          <div className="flex" style={{ backgroundColor: '#FFF6EE', padding: '4px', borderRadius: '8px', marginBottom: '32px', gap: '4px' }}>
            <button
              type="button"
              onClick={() => setActiveTab('signin')}
              className="flex-1 font-semibold transition-all"
              style={{
                padding: '10px 24px', borderRadius: '6px', fontSize: '14px', border: 'none', cursor: 'pointer',
                backgroundColor: activeTab === 'signin' ? '#FFFFFF' : 'transparent',
                color: activeTab === 'signin' ? '#F76902' : '#B5866E',
                boxShadow: activeTab === 'signin' ? '0 2px 4px rgba(64, 46, 50, 0.04)' : 'none'
              }}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('signup')}
              className="flex-1 font-semibold transition-all"
              style={{
                padding: '10px 24px', borderRadius: '6px', fontSize: '14px', border: 'none', cursor: 'pointer',
                backgroundColor: activeTab === 'signup' ? '#FFFFFF' : 'transparent',
                color: activeTab === 'signup' ? '#F76902' : '#B5866E',
                boxShadow: activeTab === 'signup' ? '0 2px 4px rgba(64, 46, 50, 0.04)' : 'none'
              }}
            >
              Sign Up
            </button>
          </div>

          <h2 className="font-bold" style={{ fontSize: '32px', color: '#402E32', marginBottom: '8px', lineHeight: '1.2' }}>
            {activeTab === 'signin' ? 'Sign in to BrickCitySwap' : 'Create your account'}
          </h2>
          <p className="font-normal" style={{ fontSize: '16px', color: '#B5866E', lineHeight: '1.6', marginBottom: '32px' }}>
            Use your RIT email to continue
          </p>

          <form
            onSubmit={activeTab === 'signin' ? handleSignIn : handleSignUp}
            style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
          >
            {activeTab === 'signup' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label className="font-semibold" style={{ fontSize: '14px', color: '#402E32' }}>Name</label>
                <div className="flex items-center bg-white" style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid #E8D5C4', gap: '8px' }}>
                  <UserIcon size={20} style={{ color: '#C4A88E' }} />
                  <input type="text" placeholder="Your full name" value={name} onChange={(e) => setName(e.target.value)} required
                    className="flex-1 outline-none" style={{ fontSize: '16px', color: '#402E32', backgroundColor: 'transparent', border: 'none' }}
                  />
                </div>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label className="font-semibold" style={{ fontSize: '14px', color: '#402E32' }}>Email</label>
              <div className="flex items-center bg-white" style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid #E8D5C4', gap: '8px' }}>
                <Mail size={20} style={{ color: '#C4A88E' }} />
                <input type="email" placeholder="your.name@rit.edu" value={email} onChange={(e) => setEmail(e.target.value)} required
                  className="flex-1 outline-none" style={{ fontSize: '16px', color: '#402E32', backgroundColor: 'transparent', border: 'none' }}
                />
              </div>
              {activeTab === 'signup' && (
                <p className="font-normal" style={{ fontSize: '13px', color: '#C4A88E', marginTop: '4px' }}>Only RIT emails allowed</p>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label className="font-semibold" style={{ fontSize: '14px', color: '#402E32' }}>Password</label>
              <div className="flex items-center bg-white" style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid #E8D5C4', gap: '8px' }}>
                <Lock size={20} style={{ color: '#C4A88E' }} />
                <input type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} required
                  className="flex-1 outline-none" style={{ fontSize: '16px', color: '#402E32', backgroundColor: 'transparent', border: 'none' }}
                />
              </div>
            </div>

            {activeTab === 'signup' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label className="font-semibold" style={{ fontSize: '14px', color: '#402E32' }}>Confirm Password</label>
                <div className="flex items-center bg-white" style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid #E8D5C4', gap: '8px' }}>
                  <Lock size={20} style={{ color: '#C4A88E' }} />
                  <input type="password" placeholder="Confirm your password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required
                    className="flex-1 outline-none" style={{ fontSize: '16px', color: '#402E32', backgroundColor: 'transparent', border: 'none' }}
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full font-semibold transition-all"
              style={{
                backgroundColor: '#F76902', color: '#FFFFFF', padding: '14px 24px',
                borderRadius: '8px', fontSize: '16px', border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
                boxShadow: '0 4px 14px rgba(247, 105, 2, 0.4)'
              }}
              onMouseEnter={(e) => { if (!loading) { e.currentTarget.style.backgroundColor = '#D85802'; e.currentTarget.style.transform = 'translateY(-2px)'; } }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#F76902'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              {loading
                ? (activeTab === 'signin' ? 'Signing In...' : 'Creating Account...')
                : (activeTab === 'signin' ? 'Sign In' : 'Create Account')}
            </button>
          </form>

          <div className="text-center" style={{ marginTop: '16px' }}>
            <p className="font-normal" style={{ fontSize: '13px', color: '#C4A88E', lineHeight: '1.5' }}>
              RIT email required for access
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
