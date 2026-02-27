import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { toast } from 'sonner';
import { ArrowLeft, Check } from 'lucide-react';

interface EmailVerificationViewProps {
  onComplete: (email: string, password: string, name: string) => Promise<void>;
}

export function EmailVerificationView({ onComplete }: EmailVerificationViewProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendVerificationCode = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate RIT email
    if (!email.endsWith('@rit.edu')) {
      toast.error('Please use your RIT email address (@rit.edu)');
      return;
    }

    setLoading(true);
    try {
      // Simulate sending verification code
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Verification code sent to ' + email);
      setStep(2);
    } catch (error) {
      toast.error('Failed to send verification code');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const code = verificationCode.join('');
    if (code.length !== 6) {
      toast.error('Please enter the complete 6-digit code');
      return;
    }

    setLoading(true);
    try {
      // Simulate code verification
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Email verified successfully!');
      setStep(3);
    } catch (error) {
      toast.error('Invalid verification code');
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await onComplete(email, password, name);
    } catch (error) {
      toast.error('Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Verification code resent!');
    } catch (error) {
      toast.error('Failed to resend code');
    } finally {
      setLoading(false);
    }
  };

  const handleCodeInput = (index: number, value: string) => {
    if (value.length > 1) {
      value = value[0];
    }

    const newCode = [...verificationCode];
    newCode[index] = value;
    setVerificationCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleCodeKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`);
      prevInput?.focus();
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <Card>
        <CardHeader>
          {/* Progress Indicator */}
          <div className="flex items-center justify-center gap-2 mb-6">
            {[1, 2, 3].map((stepNum) => (
              <div key={stepNum} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
                    stepNum < step
                      ? 'bg-green-500 text-white'
                      : stepNum === step
                      ? 'bg-[#F76902] text-white'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {stepNum < step ? <Check className="w-5 h-5" /> : stepNum}
                </div>
                {stepNum < 3 && (
                  <div
                    className={`w-12 h-1 ${
                      stepNum < step ? 'bg-green-500' : 'bg-muted'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {step === 1 && (
            <>
              <CardTitle className="text-2xl">Join BrickCitySwap</CardTitle>
              <CardDescription className="text-base">RIT Students Only</CardDescription>
            </>
          )}
          {step === 2 && (
            <>
              <CardTitle className="text-2xl">Check your RIT email</CardTitle>
              <CardDescription className="text-base">
                We sent a 6-digit code to <strong>{email}</strong>
              </CardDescription>
            </>
          )}
          {step === 3 && (
            <>
              <CardTitle className="text-2xl">Complete Your Profile</CardTitle>
              <CardDescription className="text-base">
                Just a few more details to get started
              </CardDescription>
            </>
          )}
        </CardHeader>

        <CardContent>
          {/* Step 1: Email Entry */}
          {step === 1 && (
            <form onSubmit={handleSendVerificationCode} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">RIT Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="yourname@rit.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Only @rit.edu email addresses are accepted
                </p>
              </div>
              <Button
                type="submit"
                className="w-full bg-[#F76902] hover:bg-[#D85802]"
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Send Verification Code'}
              </Button>
            </form>
          )}

          {/* Step 2: Verification Code */}
          {step === 2 && (
            <form onSubmit={handleVerifyCode} className="space-y-6">
              <div className="space-y-3">
                <Label>Enter 6-Digit Code</Label>
                <div className="flex gap-2 justify-center">
                  {verificationCode.map((digit, index) => (
                    <Input
                      key={index}
                      id={`code-${index}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleCodeInput(index, e.target.value)}
                      onKeyDown={(e) => handleCodeKeyDown(index, e)}
                      className="w-12 h-14 text-center text-xl font-bold"
                      required
                    />
                  ))}
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-[#F76902] hover:bg-[#D85802]"
                disabled={loading}
              >
                {loading ? 'Verifying...' : 'Verify'}
              </Button>

              <div className="flex flex-col gap-2 text-center">
                <button
                  type="button"
                  onClick={handleResendCode}
                  className="text-sm text-[#F76902] hover:underline"
                  disabled={loading}
                >
                  Resend code
                </button>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-sm text-muted-foreground hover:text-foreground flex items-center justify-center gap-1"
                >
                  <ArrowLeft className="w-3 h-3" />
                  Change email
                </button>
              </div>
            </form>
          )}

          {/* Step 3: Complete Profile */}
          {step === 3 && (
            <form onSubmit={handleCompleteSignup} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Create Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="profile-photo" className="text-sm text-muted-foreground">
                  Profile Photo (Optional)
                </Label>
                <Input
                  id="profile-photo"
                  type="file"
                  accept="image/*"
                  className="cursor-pointer"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-[#F76902] hover:bg-[#D85802]"
                disabled={loading}
              >
                {loading ? 'Creating Account...' : 'Complete Signup'}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}