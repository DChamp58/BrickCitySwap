import { useState } from 'react';
import { Mail, Lock } from 'lucide-react';

export function SignIn() {
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === 'signin') {
      console.log('Sign in with:', email, password);
    } else {
      if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
      }
      console.log('Sign up with:', email, password);
    }
  };

  return (
    <div 
      className="w-full min-h-screen flex"
      style={{ 
        backgroundColor: '#FFFFFF'
      }}
    >
      {/* Left Panel - Branding (40%) */}
      <div
        className="flex-shrink-0 flex items-center justify-center relative overflow-hidden"
        style={{
          width: '40%',
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #FEF3EC 0%, #FFFBF7 50%, #F9FAFB 100%)',
          padding: '48px'
        }}
      >
        {/* Abstract Shapes - Subtle decorative elements */}
        <div
          style={{
            position: 'absolute',
            top: '10%',
            right: '15%',
            width: '180px',
            height: '180px',
            borderRadius: '50%',
            background: 'rgba(247, 105, 2, 0.05)',
            filter: 'blur(40px)'
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '20%',
            left: '10%',
            width: '220px',
            height: '220px',
            borderRadius: '50%',
            background: 'rgba(247, 105, 2, 0.03)',
            filter: 'blur(50px)'
          }}
        />

        {/* Content */}
        <div 
          className="flex flex-col relative z-10"
          style={{ 
            maxWidth: '420px',
            gap: '32px'
          }}
        >
          {/* Badge */}
          <div 
            className="inline-flex items-center font-semibold"
            style={{
              fontSize: '13px',
              color: '#F76902',
              backgroundColor: '#FFFFFF',
              padding: '8px 16px',
              borderRadius: '8px',
              border: '1px solid rgba(247, 105, 2, 0.15)',
              width: 'fit-content',
              boxShadow: '0 2px 8px rgba(247, 105, 2, 0.08)'
            }}
          >
            🎓 RIT Students Only
          </div>

          {/* Headline */}
          <h1 
            className="font-bold"
            style={{
              fontSize: '48px',
              color: '#111827',
              lineHeight: '1.1',
              letterSpacing: '-0.02em'
            }}
          >
            Swap smarter at RIT
          </h1>

          {/* Subtext */}
          <p 
            className="font-normal"
            style={{
              fontSize: '18px',
              color: '#6B7280',
              lineHeight: '1.6'
            }}
          >
            Find housing, sell items, and connect with students — all in one place.
          </p>

          {/* Additional decorative element */}
          <div style={{ marginTop: '16px' }}>
            <div 
              className="flex items-center"
              style={{ gap: '16px' }}
            >
              <div 
                style={{
                  width: '48px',
                  height: '4px',
                  borderRadius: '2px',
                  backgroundColor: '#F76902'
                }}
              />
              <span 
                className="font-medium"
                style={{
                  fontSize: '14px',
                  color: '#9CA3AF'
                }}
              >
                Trusted by RIT students
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Card (60%) */}
      <div
        className="flex-1 flex items-center justify-center"
        style={{
          backgroundColor: '#FFFFFF',
          padding: '48px'
        }}
      >
        {/* Sign In Card */}
        <div
          className="bg-white"
          style={{
            maxWidth: '440px',
            width: '100%',
            padding: '48px'
          }}
        >
          {/* Tab Toggle */}
          <div 
            className="flex"
            style={{
              backgroundColor: '#F9FAFB',
              padding: '4px',
              borderRadius: '8px',
              marginBottom: '32px',
              gap: '4px'
            }}
          >
            <button
              type="button"
              onClick={() => setActiveTab('signin')}
              className="flex-1 font-semibold transition-all"
              style={{
                padding: '10px 24px',
                borderRadius: '6px',
                fontSize: '14px',
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
                padding: '10px 24px',
                borderRadius: '6px',
                fontSize: '14px',
                backgroundColor: activeTab === 'signup' ? '#FFFFFF' : 'transparent',
                color: activeTab === 'signup' ? '#F76902' : '#6B7280',
                boxShadow: activeTab === 'signup' ? '0 2px 4px rgba(0, 0, 0, 0.04)' : 'none'
              }}
            >
              Sign Up
            </button>
          </div>

          {/* Title */}
          <h2 
            className="font-bold"
            style={{
              fontSize: '32px',
              color: '#111827',
              marginBottom: '8px',
              lineHeight: '1.2'
            }}
          >
            {activeTab === 'signin' ? 'Sign in to BrickCitySwap' : 'Create your account'}
          </h2>

          {/* Subtitle */}
          <p 
            className="font-normal"
            style={{
              fontSize: '16px',
              color: '#6B7280',
              lineHeight: '1.6',
              marginBottom: '32px'
            }}
          >
            Use your RIT email to continue
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Email Input */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label 
                className="font-semibold"
                htmlFor="email"
                style={{
                  fontSize: '14px',
                  color: '#111827'
                }}
              >
                Email
              </label>
              <div 
                className="flex items-center bg-white"
                style={{
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: '1px solid #E5E7EB',
                  gap: '8px'
                }}
              >
                <Mail size={20} style={{ color: '#9CA3AF' }} />
                <input
                  id="email"
                  type="email"
                  placeholder="your.name@rit.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1 outline-none"
                  style={{
                    fontSize: '16px',
                    color: '#111827',
                    backgroundColor: 'transparent'
                  }}
                />
              </div>
              {activeTab === 'signup' && (
                <p 
                  className="font-normal"
                  style={{
                    fontSize: '13px',
                    color: '#9CA3AF',
                    marginTop: '4px'
                  }}
                >
                  Only RIT emails allowed
                </p>
              )}
            </div>

            {/* Password Input */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label 
                className="font-semibold"
                htmlFor="password"
                style={{
                  fontSize: '14px',
                  color: '#111827'
                }}
              >
                Password
              </label>
              <div 
                className="flex items-center bg-white"
                style={{
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: '1px solid #E5E7EB',
                  gap: '8px'
                }}
              >
                <Lock size={20} style={{ color: '#9CA3AF' }} />
                <input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="flex-1 outline-none"
                  style={{
                    fontSize: '16px',
                    color: '#111827',
                    backgroundColor: 'transparent'
                  }}
                />
              </div>
            </div>

            {/* Confirm Password Input (Sign Up only) */}
            {activeTab === 'signup' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label 
                  className="font-semibold"
                  htmlFor="confirmPassword"
                  style={{
                    fontSize: '14px',
                    color: '#111827'
                  }}
                >
                  Confirm Password
                </label>
                <div 
                  className="flex items-center bg-white"
                  style={{
                    padding: '12px 16px',
                    borderRadius: '8px',
                    border: '1px solid #E5E7EB',
                    gap: '8px'
                  }}
                >
                  <Lock size={20} style={{ color: '#9CA3AF' }} />
                  <input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="flex-1 outline-none"
                    style={{
                      fontSize: '16px',
                      color: '#111827',
                      backgroundColor: 'transparent'
                    }}
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full font-semibold transition-all"
              style={{
                backgroundColor: '#F76902',
                color: '#FFFFFF',
                padding: '14px 24px',
                borderRadius: '8px',
                fontSize: '16px',
                border: 'none',
                cursor: 'pointer',
                transitionDuration: '200ms',
                boxShadow: '0 4px 14px rgba(247, 105, 2, 0.4)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#D55A02';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(247, 105, 2, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#F76902';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 14px rgba(247, 105, 2, 0.4)';
              }}
            >
              {activeTab === 'signin' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          {/* RIT Email Notice */}
          <div 
            className="text-center"
            style={{
              marginTop: '16px'
            }}
          >
            <p 
              className="font-normal"
              style={{
                fontSize: '13px',
                color: '#9CA3AF',
                lineHeight: '1.5'
              }}
            >
              RIT email required for access
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}