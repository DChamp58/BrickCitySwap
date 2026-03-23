import React, { useState } from 'react';
import { Mail, Lock, Camera, User as UserIcon } from 'lucide-react';
import { useAuth } from './auth-context';
import { toast } from 'sonner';

export function AuthView() {
  const { user, signIn, signUp, signOut, updateProfile } = useAuth();
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

  // Logged-in: Profile view
  if (user) {
    return (
      <div className="w-full min-h-screen" style={{ backgroundColor: '#F9FAFB', padding: '48px 24px' }}>
        <div className="mx-auto" style={{ maxWidth: '800px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <div>
            <h1 className="font-bold" style={{ fontSize: '56px', color: '#0F172A', marginBottom: '8px', lineHeight: '1.1' }}>Profile</h1>
            <p className="font-normal" style={{ fontSize: '16px', color: '#64748B', lineHeight: '1.6' }}>Manage your account information</p>
          </div>

          <div className="bg-white" style={{ borderRadius: '12px', border: '1px solid #E5E7EB', padding: '32px' }}>
            {/* Avatar and User Info */}
            <div className="flex items-center" style={{ gap: '16px', marginBottom: '32px' }}>
              <div className="relative flex-shrink-0" style={{ width: '64px', height: '64px' }}>
                <div
                  className="flex items-center justify-center font-semibold"
                  style={{
                    width: '64px', height: '64px', borderRadius: '50%',
                    backgroundColor: '#FEF3EC', color: '#F76902', fontSize: '24px',
                    border: '2px solid #FFFFFF', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
                  }}
                >
                  {user.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)}
                </div>
                <button
                  className="absolute flex items-center justify-center hover:opacity-80 transition-opacity"
                  style={{
                    bottom: '0', right: '0', width: '24px', height: '24px',
                    borderRadius: '50%', backgroundColor: '#F76902',
                    border: '2px solid #FFFFFF', cursor: 'pointer'
                  }}
                >
                  <Camera size={12} style={{ color: '#FFFFFF' }} />
                </button>
              </div>
              <div style={{ flex: 1 }}>
                <h2 className="font-semibold" style={{ fontSize: '20px', color: '#111827', marginBottom: '4px' }}>{user.name}</h2>
                <p className="font-normal" style={{ fontSize: '14px', color: '#6B7280' }}>{user.email}</p>
              </div>
              <span
                className="font-medium"
                style={{
                  fontSize: '13px', color: '#F76902', backgroundColor: '#FEF3EC',
                  padding: '4px 12px', borderRadius: '12px', textTransform: 'capitalize'
                }}
              >
                {user.subscriptionTier} plan
              </span>
            </div>

            <div style={{ height: '1px', backgroundColor: '#E5E7EB', marginBottom: '32px' }} />

            {/* Profile Details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <label className="font-semibold" style={{ fontSize: '14px', color: '#111827', display: 'block', marginBottom: '8px' }}>Full Name</label>
                <input type="text" value={user.name} readOnly className="w-full outline-none"
                  style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid #E5E7EB', fontSize: '16px', color: '#111827', backgroundColor: '#F9FAFB' }}
                />
              </div>
              <div>
                <label className="font-semibold" style={{ fontSize: '14px', color: '#111827', display: 'block', marginBottom: '8px' }}>Email Address</label>
                <input type="email" value={user.email} readOnly className="w-full outline-none"
                  style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid #E5E7EB', fontSize: '16px', color: '#111827', backgroundColor: '#F9FAFB' }}
                />
              </div>
            </div>

            <div style={{ marginTop: '32px', display: 'flex', gap: '12px' }}>
              <button
                onClick={signOut}
                className="font-semibold transition-all"
                style={{
                  backgroundColor: '#FFFFFF', color: '#DC2626', padding: '12px 24px',
                  borderRadius: '8px', fontSize: '16px', border: '1px solid #E5E7EB', cursor: 'pointer'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#FEF2F2'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#FFFFFF'; }}
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Logged-out: Sign In / Sign Up view
  return (
    <div className="w-full min-h-screen flex" style={{ backgroundColor: '#FFFFFF' }}>
      {/* Left Panel - Branding */}
      <div
        className="flex-shrink-0 flex items-center justify-center relative overflow-hidden hidden lg:flex"
        style={{
          width: '40%', minHeight: '100vh',
          background: 'linear-gradient(135deg, #FEF3EC 0%, #FFFBF7 50%, #F9FAFB 100%)',
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
          <h1 className="font-bold" style={{ fontSize: '48px', color: '#111827', lineHeight: '1.1', letterSpacing: '-0.02em' }}>
            Swap smarter at RIT
          </h1>
          <p className="font-normal" style={{ fontSize: '18px', color: '#6B7280', lineHeight: '1.6' }}>
            Find housing, sell items, and connect with students — all in one place.
          </p>
          <div style={{ marginTop: '16px' }}>
            <div className="flex items-center" style={{ gap: '16px' }}>
              <div style={{ width: '48px', height: '4px', borderRadius: '2px', backgroundColor: '#F76902' }} />
              <span className="font-medium" style={{ fontSize: '14px', color: '#9CA3AF' }}>Trusted by RIT students</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Card */}
      <div className="flex-1 flex items-center justify-center" style={{ backgroundColor: '#FFFFFF', padding: '48px' }}>
        <div className="bg-white" style={{ maxWidth: '440px', width: '100%', padding: '48px' }}>
          {/* Tab Toggle */}
          <div className="flex" style={{ backgroundColor: '#F9FAFB', padding: '4px', borderRadius: '8px', marginBottom: '32px', gap: '4px' }}>
            <button
              type="button"
              onClick={() => setActiveTab('signin')}
              className="flex-1 font-semibold transition-all"
              style={{
                padding: '10px 24px', borderRadius: '6px', fontSize: '14px', border: 'none', cursor: 'pointer',
                backgroundColor: activeTab === 'signin' ? '#FFFFFF' : 'transparent',
                color: activeTab === 'signin' ? '#F76902' : '#6B7280',
                boxShadow: activeTab === 'signin' ? '0 2px 4px rgba(0, 0, 0, 0.04)' : 'none'
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
                color: activeTab === 'signup' ? '#F76902' : '#6B7280',
                boxShadow: activeTab === 'signup' ? '0 2px 4px rgba(0, 0, 0, 0.04)' : 'none'
              }}
            >
              Sign Up
            </button>
          </div>

          <h2 className="font-bold" style={{ fontSize: '32px', color: '#111827', marginBottom: '8px', lineHeight: '1.2' }}>
            {activeTab === 'signin' ? 'Sign in to BrickCitySwap' : 'Create your account'}
          </h2>
          <p className="font-normal" style={{ fontSize: '16px', color: '#6B7280', lineHeight: '1.6', marginBottom: '32px' }}>
            Use your RIT email to continue
          </p>

          <form
            onSubmit={activeTab === 'signin' ? handleSignIn : handleSignUp}
            style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
          >
            {activeTab === 'signup' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label className="font-semibold" style={{ fontSize: '14px', color: '#111827' }}>Name</label>
                <div className="flex items-center bg-white" style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid #E5E7EB', gap: '8px' }}>
                  <UserIcon size={20} style={{ color: '#9CA3AF' }} />
                  <input type="text" placeholder="Your full name" value={name} onChange={(e) => setName(e.target.value)} required
                    className="flex-1 outline-none" style={{ fontSize: '16px', color: '#111827', backgroundColor: 'transparent', border: 'none' }}
                  />
                </div>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label className="font-semibold" style={{ fontSize: '14px', color: '#111827' }}>Email</label>
              <div className="flex items-center bg-white" style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid #E5E7EB', gap: '8px' }}>
                <Mail size={20} style={{ color: '#9CA3AF' }} />
                <input type="email" placeholder="your.name@rit.edu" value={email} onChange={(e) => setEmail(e.target.value)} required
                  className="flex-1 outline-none" style={{ fontSize: '16px', color: '#111827', backgroundColor: 'transparent', border: 'none' }}
                />
              </div>
              {activeTab === 'signup' && (
                <p className="font-normal" style={{ fontSize: '13px', color: '#9CA3AF', marginTop: '4px' }}>Only RIT emails allowed</p>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label className="font-semibold" style={{ fontSize: '14px', color: '#111827' }}>Password</label>
              <div className="flex items-center bg-white" style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid #E5E7EB', gap: '8px' }}>
                <Lock size={20} style={{ color: '#9CA3AF' }} />
                <input type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} required
                  className="flex-1 outline-none" style={{ fontSize: '16px', color: '#111827', backgroundColor: 'transparent', border: 'none' }}
                />
              </div>
            </div>

            {activeTab === 'signup' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label className="font-semibold" style={{ fontSize: '14px', color: '#111827' }}>Confirm Password</label>
                <div className="flex items-center bg-white" style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid #E5E7EB', gap: '8px' }}>
                  <Lock size={20} style={{ color: '#9CA3AF' }} />
                  <input type="password" placeholder="Confirm your password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required
                    className="flex-1 outline-none" style={{ fontSize: '16px', color: '#111827', backgroundColor: 'transparent', border: 'none' }}
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
              onMouseEnter={(e) => { if (!loading) { e.currentTarget.style.backgroundColor = '#D55A02'; e.currentTarget.style.transform = 'translateY(-2px)'; } }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#F76902'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              {loading
                ? (activeTab === 'signin' ? 'Signing In...' : 'Creating Account...')
                : (activeTab === 'signin' ? 'Sign In' : 'Create Account')}
            </button>
          </form>

          <div className="text-center" style={{ marginTop: '16px' }}>
            <p className="font-normal" style={{ fontSize: '13px', color: '#9CA3AF', lineHeight: '1.5' }}>
              RIT email required for access
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
