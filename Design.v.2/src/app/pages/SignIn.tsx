import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';

export function SignIn() {
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!email) {
      newErrors.email = 'Email is required.';
    } else if (activeTab === 'signup' && !email.toLowerCase().endsWith('@rit.edu')) {
      newErrors.email = 'Only @rit.edu email addresses are allowed.';
    }

    if (!password) {
      newErrors.password = 'Password is required.';
    } else if (activeTab === 'signup' && password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters.';
    }

    if (activeTab === 'signup') {
      if (!confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password.';
      } else if (password !== confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match.';
      }
    }

    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validate();
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      setSubmitted(true);
      console.log(activeTab === 'signin' ? 'Sign in:' : 'Sign up:', email);
    }
  };

  const handleTabSwitch = (tab: 'signin' | 'signup') => {
    setActiveTab(tab);
    setErrors({});
    setSubmitted(false);
  };

  const inputWrapperStyle = (hasError: boolean) => ({
    display: 'flex',
    alignItems: 'center',
    padding: '12px 16px',
    borderRadius: '8px',
    border: `1px solid ${hasError ? '#EF4444' : '#E5E7EB'}`,
    backgroundColor: '#FFFFFF',
    gap: '8px',
    transition: 'border-color 200ms',
  });

  return (
    <div className="w-full min-h-screen flex" style={{ backgroundColor: '#FFFFFF' }}>
      {/* Left Panel */}
      <div
        className="hidden md:flex flex-shrink-0 items-center justify-center relative overflow-hidden"
        style={{
          width: '42%',
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #FEF3EC 0%, #FFFBF7 50%, #F9FAFB 100%)',
          padding: '48px',
        }}
      >
        <div
          style={{
            position: 'absolute', top: '8%', right: '10%',
            width: '200px', height: '200px', borderRadius: '50%',
            background: 'rgba(247, 105, 2, 0.07)', filter: 'blur(50px)',
          }}
        />
        <div
          style={{
            position: 'absolute', bottom: '15%', left: '5%',
            width: '250px', height: '250px', borderRadius: '50%',
            background: 'rgba(247, 105, 2, 0.04)', filter: 'blur(60px)',
          }}
        />

        <div className="flex flex-col relative z-10" style={{ maxWidth: '400px', gap: '28px' }}>
          <div
            className="inline-flex items-center font-semibold"
            style={{
              fontSize: '13px', color: '#F76902', backgroundColor: '#FFFFFF',
              padding: '8px 16px', borderRadius: '8px',
              border: '1px solid rgba(247, 105, 2, 0.15)',
              width: 'fit-content', boxShadow: '0 2px 8px rgba(247, 105, 2, 0.08)',
            }}
          >
            🎓 RIT Students Only
          </div>

          <h1
            className="font-bold"
            style={{ fontSize: '44px', color: '#111827', lineHeight: '1.1', letterSpacing: '-0.02em' }}
          >
            Swap smarter at RIT
          </h1>

          <p style={{ fontSize: '17px', color: '#6B7280', lineHeight: '1.7' }}>
            Find housing, sell items, and connect with students — all in one place.
          </p>

          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '12px',
              padding: '20px',
              border: '1px solid #E5E7EB',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            }}
          >
            {[
              '✓ RIT-verified community',
              '✓ Housing + Marketplace in one app',
              '✓ Direct messaging with students',
            ].map((item) => (
              <p key={item} style={{ fontSize: '14px', color: '#374151', padding: '4px 0', fontWeight: 500 }}>
                {item}
              </p>
            ))}
          </div>

          <div className="flex items-center" style={{ gap: '12px' }}>
            <div style={{ width: '40px', height: '3px', borderRadius: '2px', backgroundColor: '#F76902' }} />
            <span style={{ fontSize: '13px', color: '#9CA3AF', fontWeight: 500 }}>Trusted by RIT students</span>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div
        className="flex-1 flex items-center justify-center"
        style={{ backgroundColor: '#FFFFFF', padding: '48px 24px' }}
      >
        <div style={{ maxWidth: '420px', width: '100%' }}>
          {/* Tab Toggle */}
          <div
            className="flex"
            style={{
              backgroundColor: '#F9FAFB', padding: '4px', borderRadius: '10px',
              marginBottom: '28px', gap: '4px',
            }}
          >
            {(['signin', 'signup'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => handleTabSwitch(tab)}
                className="flex-1 font-semibold transition-all"
                style={{
                  padding: '10px 20px',
                  borderRadius: '7px',
                  fontSize: '14px',
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor: activeTab === tab ? '#FFFFFF' : 'transparent',
                  color: activeTab === tab ? '#F76902' : '#6B7280',
                  boxShadow: activeTab === tab ? '0 1px 4px rgba(0,0,0,0.06)' : 'none',
                }}
              >
                {tab === 'signin' ? 'Sign In' : 'Sign Up'}
              </button>
            ))}
          </div>

          <h2 className="font-bold" style={{ fontSize: '28px', color: '#111827', marginBottom: '6px', lineHeight: '1.2' }}>
            {activeTab === 'signin' ? 'Welcome back' : 'Create your account'}
          </h2>
          <p style={{ fontSize: '15px', color: '#6B7280', lineHeight: '1.6', marginBottom: '28px' }}>
            {activeTab === 'signin' ? 'Sign in to your BrickCitySwap account' : 'Use your RIT email to get started'}
          </p>

          {submitted && (
            <div
              style={{
                backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0',
                borderRadius: '8px', padding: '12px 16px', marginBottom: '20px',
                fontSize: '14px', color: '#15803D', fontWeight: 500,
              }}
            >
              ✓ {activeTab === 'signin' ? 'Sign in successful!' : 'Account created successfully!'}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Email */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label htmlFor="email" className="font-semibold" style={{ fontSize: '14px', color: '#111827' }}>
                Email
              </label>
              <div style={inputWrapperStyle(!!errors.email)}>
                <Mail size={18} style={{ color: '#9CA3AF', flexShrink: 0 }} />
                <input
                  id="email"
                  type="email"
                  placeholder={activeTab === 'signup' ? 'your.name@rit.edu' : 'Enter your email'}
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: '' })); }}
                  className="flex-1 outline-none"
                  style={{ fontSize: '15px', color: '#111827', backgroundColor: 'transparent' }}
                />
              </div>
              {errors.email && (
                <div className="flex items-center gap-1" style={{ fontSize: '13px', color: '#EF4444' }}>
                  <AlertCircle size={13} />
                  {errors.email}
                </div>
              )}
            </div>

            {/* Password */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label htmlFor="password" className="font-semibold" style={{ fontSize: '14px', color: '#111827' }}>
                Password
              </label>
              <div style={inputWrapperStyle(!!errors.password)}>
                <Lock size={18} style={{ color: '#9CA3AF', flexShrink: 0 }} />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder={activeTab === 'signup' ? 'At least 8 characters' : 'Enter your password'}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: '' })); }}
                  className="flex-1 outline-none"
                  style={{ fontSize: '15px', color: '#111827', backgroundColor: 'transparent' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0', color: '#9CA3AF', flexShrink: 0 }}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <div className="flex items-center gap-1" style={{ fontSize: '13px', color: '#EF4444' }}>
                  <AlertCircle size={13} />
                  {errors.password}
                </div>
              )}
            </div>

            {/* Confirm Password (Sign Up only) */}
            {activeTab === 'signup' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label htmlFor="confirmPassword" className="font-semibold" style={{ fontSize: '14px', color: '#111827' }}>
                  Confirm Password
                </label>
                <div style={inputWrapperStyle(!!errors.confirmPassword)}>
                  <Lock size={18} style={{ color: '#9CA3AF', flexShrink: 0 }} />
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Re-enter your password"
                    value={confirmPassword}
                    onChange={(e) => { setConfirmPassword(e.target.value); setErrors((p) => ({ ...p, confirmPassword: '' })); }}
                    className="flex-1 outline-none"
                    style={{ fontSize: '15px', color: '#111827', backgroundColor: 'transparent' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0', color: '#9CA3AF', flexShrink: 0 }}
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <div className="flex items-center gap-1" style={{ fontSize: '13px', color: '#EF4444' }}>
                    <AlertCircle size={13} />
                    {errors.confirmPassword}
                  </div>
                )}
              </div>
            )}

            {/* Submit */}
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
                boxShadow: '0 4px 14px rgba(247, 105, 2, 0.4)',
                marginTop: '4px',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = '#D55A02';
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = '#F76902';
                (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
              }}
            >
              {activeTab === 'signin' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <p
            className="text-center font-normal"
            style={{ fontSize: '13px', color: '#9CA3AF', lineHeight: '1.5', marginTop: '20px' }}
          >
            {activeTab === 'signup' ? 'Only @rit.edu email addresses are accepted.' : 'Forgot your password? Contact support.'}
          </p>
        </div>
      </div>
    </div>
  );
}
