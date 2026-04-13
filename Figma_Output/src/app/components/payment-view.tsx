import { useState } from 'react';
import { CreditCard, Lock, Check, ChevronLeft } from 'lucide-react';
import { toast } from 'sonner';

interface PaymentViewProps {
  plan: string;
  billing: 'monthly' | 'yearly';
  onBack: () => void;
  onSuccess: () => void;
}

const planDetails = {
  poster: {
    name: 'Poster',
    monthlyPrice: '2.99',
    yearlyPrice: '25',
    description: 'Post listings and sell your items',
  },
  premium: {
    name: 'Premium',
    monthlyPrice: '4.99',
    yearlyPrice: '40',
    description: 'Unlimited listings and premium features',
  },
};

export function PaymentView({ plan, billing, onBack, onSuccess }: PaymentViewProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const currentPlan = planDetails[plan as keyof typeof planDetails] ?? planDetails.poster;
  const price = billing === 'monthly' ? currentPlan.monthlyPrice : currentPlan.yearlyPrice;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      toast.success(`Successfully upgraded to ${currentPlan.name}!`);
      onSuccess();
    }, 2000);
  };

  return (
    <div className="w-full min-h-screen" style={{ backgroundColor: '#FFF6EE' }}>
      {/* Back Link */}
      <div className="w-full" style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid #E8D5C4' }}>
        <div className="max-w-[1200px] mx-auto" style={{ padding: '24px 48px' }}>
          <button
            onClick={onBack}
            className="inline-flex items-center transition-opacity hover:opacity-70"
            style={{ gap: '8px', color: '#B5866E', fontSize: '15px', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            <ChevronLeft size={18} />
            Back to Pricing
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-[1200px] mx-auto" style={{ padding: '64px 48px' }}>
        <div
          className="grid"
          style={{ gridTemplateColumns: '1fr 400px', gap: '48px', alignItems: 'start' }}
        >
          {/* Payment Form */}
          <div>
            <h1 className="font-bold" style={{ fontSize: '32px', color: '#402E32', marginBottom: '8px' }}>
              Complete your upgrade
            </h1>
            <p className="font-normal" style={{ fontSize: '16px', color: '#B5866E', marginBottom: '48px' }}>
              Enter your payment details to get started
            </p>

            <form onSubmit={handleSubmit}>
              {/* Card Information */}
              <div style={{ marginBottom: '32px' }}>
                <label
                  className="font-medium flex items-center"
                  style={{ fontSize: '14px', color: '#402E32', marginBottom: '8px', gap: '8px' }}
                >
                  <CreditCard size={16} style={{ color: '#B5866E' }} />
                  Card Information
                </label>
                <div
                  className="w-full"
                  style={{ backgroundColor: '#FFFFFF', borderRadius: '8px', border: '1px solid #E8D5C4' }}
                >
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    required
                    className="w-full"
                    style={{
                      padding: '12px 16px', fontSize: '15px', border: 'none',
                      borderRadius: '8px 8px 0 0', borderBottom: '1px solid #E8D5C4',
                      outline: 'none', backgroundColor: 'transparent', color: '#402E32',
                    }}
                  />
                  <div className="grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
                    <input
                      type="text"
                      placeholder="MM / YY"
                      required
                      className="w-full"
                      style={{
                        padding: '12px 16px', fontSize: '15px', border: 'none',
                        borderRight: '1px solid #E8D5C4', borderRadius: '0 0 0 8px',
                        outline: 'none', backgroundColor: 'transparent', color: '#402E32',
                      }}
                    />
                    <input
                      type="text"
                      placeholder="CVC"
                      required
                      className="w-full"
                      style={{
                        padding: '12px 16px', fontSize: '15px', border: 'none',
                        borderRadius: '0 0 8px 0', outline: 'none',
                        backgroundColor: 'transparent', color: '#402E32',
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Cardholder Name */}
              <div style={{ marginBottom: '32px' }}>
                <label
                  className="font-medium"
                  style={{ fontSize: '14px', color: '#402E32', marginBottom: '8px', display: 'block' }}
                >
                  Cardholder Name
                </label>
                <input
                  type="text"
                  placeholder="Full name on card"
                  required
                  className="w-full"
                  style={{
                    padding: '12px 16px', fontSize: '15px', border: '1px solid #E8D5C4',
                    borderRadius: '8px', outline: 'none', backgroundColor: '#FFFFFF', color: '#402E32',
                  }}
                />
              </div>

              {/* Email */}
              <div style={{ marginBottom: '32px' }}>
                <label
                  className="font-medium"
                  style={{ fontSize: '14px', color: '#402E32', marginBottom: '8px', display: 'block' }}
                >
                  Email
                </label>
                <input
                  type="email"
                  placeholder="you@rit.edu"
                  required
                  className="w-full"
                  style={{
                    padding: '12px 16px', fontSize: '15px', border: '1px solid #E8D5C4',
                    borderRadius: '8px', outline: 'none', backgroundColor: '#FFFFFF', color: '#402E32',
                  }}
                />
                <p className="font-normal" style={{ fontSize: '13px', color: '#B5866E', marginTop: '6px' }}>
                  Receipt will be sent to this email
                </p>
              </div>

              {/* Security Notice */}
              <div
                className="flex items-start"
                style={{
                  padding: '16px', backgroundColor: '#FFF6EE', borderRadius: '8px',
                  gap: '12px', marginBottom: '32px', border: '1px solid #E8D5C4',
                }}
              >
                <Lock size={18} style={{ color: '#B5866E', flexShrink: 0, marginTop: '2px' }} />
                <p className="font-normal" style={{ fontSize: '14px', color: '#B5866E', margin: 0 }}>
                  Your payment information is encrypted and secure. We never store your card details.
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full font-semibold transition-all"
                style={{
                  padding: '16px 24px', borderRadius: '8px', border: 'none',
                  backgroundColor: isProcessing ? '#D85802' : '#F76902',
                  color: '#FFFFFF', fontSize: '16px',
                  cursor: isProcessing ? 'not-allowed' : 'pointer',
                  opacity: isProcessing ? 0.7 : 1,
                  transitionDuration: '200ms',
                }}
              >
                {isProcessing ? 'Processing...' : `Pay $${price}`}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="sticky" style={{ top: '96px' }}>
            <div
              style={{
                backgroundColor: '#FFFFFF', borderRadius: '12px', padding: '32px',
                border: '1px solid #E8D5C4', boxShadow: '0 1px 3px 0 rgba(64, 46, 50, 0.08)',
              }}
            >
              <h3
                className="font-semibold"
                style={{ fontSize: '18px', color: '#402E32', marginBottom: '24px' }}
              >
                Order Summary
              </h3>

              {/* Plan Details */}
              <div style={{ marginBottom: '24px' }}>
                <div className="flex items-center justify-between" style={{ marginBottom: '8px' }}>
                  <span className="font-medium" style={{ fontSize: '15px', color: '#402E32' }}>
                    {currentPlan.name} Plan
                  </span>
                  <span className="font-semibold" style={{ fontSize: '15px', color: '#402E32' }}>
                    ${price}
                  </span>
                </div>
                <p className="font-normal" style={{ fontSize: '13px', color: '#B5866E', margin: 0 }}>
                  Billed {billing === 'monthly' ? 'monthly' : 'yearly'}
                </p>
              </div>

              {/* Divider */}
              <div style={{ height: '1px', backgroundColor: '#E8D5C4', marginBottom: '24px' }} />

              {/* Total */}
              <div className="flex items-center justify-between" style={{ marginBottom: '24px' }}>
                <span className="font-semibold" style={{ fontSize: '16px', color: '#402E32' }}>
                  Total due today
                </span>
                <span className="font-bold" style={{ fontSize: '24px', color: '#402E32' }}>
                  ${price}
                </span>
              </div>

              {/* Divider */}
              <div style={{ height: '1px', backgroundColor: '#E8D5C4', marginBottom: '24px' }} />

              {/* Features Included */}
              <div>
                <h4
                  className="font-semibold"
                  style={{ fontSize: '14px', color: '#402E32', marginBottom: '16px' }}
                >
                  What's included
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div className="flex items-start" style={{ gap: '8px' }}>
                    <Check size={16} style={{ color: '#10B981', flexShrink: 0, marginTop: '2px' }} />
                    <span className="font-normal" style={{ fontSize: '14px', color: '#5A4A44' }}>
                      {plan === 'premium' ? '20 active listings' : '8 active listings'}
                    </span>
                  </div>
                  <div className="flex items-start" style={{ gap: '8px' }}>
                    <Check size={16} style={{ color: '#10B981', flexShrink: 0, marginTop: '2px' }} />
                    <span className="font-normal" style={{ fontSize: '14px', color: '#5A4A44' }}>
                      No ads
                    </span>
                  </div>
                  <div className="flex items-start" style={{ gap: '8px' }}>
                    <Check size={16} style={{ color: '#10B981', flexShrink: 0, marginTop: '2px' }} />
                    <span className="font-normal" style={{ fontSize: '14px', color: '#5A4A44' }}>
                      Priority in search
                    </span>
                  </div>
                  {plan === 'premium' && (
                    <>
                      <div className="flex items-start" style={{ gap: '8px' }}>
                        <Check size={16} style={{ color: '#10B981', flexShrink: 0, marginTop: '2px' }} />
                        <span className="font-normal" style={{ fontSize: '14px', color: '#5A4A44' }}>
                          Featured listings
                        </span>
                      </div>
                      <div className="flex items-start" style={{ gap: '8px' }}>
                        <Check size={16} style={{ color: '#10B981', flexShrink: 0, marginTop: '2px' }} />
                        <span className="font-normal" style={{ fontSize: '14px', color: '#5A4A44' }}>
                          Trusted seller badge
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Money Back Guarantee */}
            <div
              className="flex items-center"
              style={{
                marginTop: '16px', padding: '16px', backgroundColor: '#FFF6EE',
                borderRadius: '8px', gap: '12px', border: '1px solid #E8D5C4',
              }}
            >
              <div
                className="flex items-center justify-center"
                style={{
                  width: '32px', height: '32px', borderRadius: '50%',
                  backgroundColor: '#F76902', flexShrink: 0,
                }}
              >
                <Check size={18} style={{ color: '#FFFFFF' }} />
              </div>
              <p className="font-medium" style={{ fontSize: '13px', color: '#402E32', margin: 0 }}>
                30-day money back guarantee
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
