import { useState } from 'react';
import { Check } from 'lucide-react';
import { useAuth } from './auth-context';
import { toast } from 'sonner';

interface PricingViewProps {
  onUpgrade: (plan: string, billing: 'monthly' | 'yearly') => void;
}

export function PricingView({ onUpgrade }: PricingViewProps) {
  const { user } = useAuth();
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');

  const handleUpgradeClick = (tier: string) => {
    if (!user) {
      toast.error('Please sign in to upgrade your subscription');
      return;
    }
    onUpgrade(tier, billingPeriod);
  };

  const isCurrentPlan = (tier: string) => user?.subscriptionTier === tier;

  return (
    <div className="w-full" style={{ backgroundColor: '#FFFFFF' }}>
      {/* Page Header */}
      <div className="w-full" style={{ backgroundColor: '#FFF6EE', borderBottom: '1px solid #E8D5C4' }}>
        <div className="max-w-[1400px] mx-auto" style={{ padding: '48px 48px 32px 48px' }}>
          <h1 className="font-bold" style={{ fontSize: '56px', color: '#402E32', marginBottom: '16px', lineHeight: '1.1' }}>Pricing</h1>
          <p className="font-normal" style={{ fontSize: '16px', color: '#B5866E', lineHeight: '1.6' }}>Choose the plan that works for you</p>
        </div>
      </div>

      {/* Billing Toggle */}
      <div className="max-w-[1400px] mx-auto" style={{ padding: '48px 48px 0 48px' }}>
        <div className="flex justify-center" style={{ marginBottom: '48px' }}>
          <div className="inline-flex items-center" style={{ backgroundColor: '#FFF6EE', borderRadius: '100px', padding: '4px', gap: '4px' }}>
            <button
              onClick={() => setBillingPeriod('monthly')}
              className="font-semibold transition-all"
              style={{
                padding: '12px 24px', borderRadius: '100px', border: 'none', cursor: 'pointer', fontSize: '15px',
                backgroundColor: billingPeriod === 'monthly' ? '#F76902' : 'transparent',
                color: billingPeriod === 'monthly' ? '#FFFFFF' : '#B5866E'
              }}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingPeriod('yearly')}
              className="font-semibold transition-all flex items-center"
              style={{
                padding: '12px 24px', borderRadius: '100px', border: 'none', cursor: 'pointer', fontSize: '15px',
                backgroundColor: billingPeriod === 'yearly' ? '#F76902' : 'transparent',
                color: billingPeriod === 'yearly' ? '#FFFFFF' : '#B5866E', gap: '8px'
              }}
            >
              Yearly
              <span className="font-semibold" style={{
                fontSize: '12px',
                backgroundColor: billingPeriod === 'yearly' ? '#FFFFFF' : '#10B981',
                color: billingPeriod === 'yearly' ? '#F76902' : '#FFFFFF',
                padding: '2px 8px', borderRadius: '100px'
              }}>
                Save 30%
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-[1400px] mx-auto" style={{ padding: '0 48px 48px 48px' }}>
        <div className="grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px', maxWidth: '1200px', margin: '0 auto' }}>
          {/* Free Plan */}
          <div className="relative" style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', padding: '32px', boxShadow: '0 1px 3px 0 rgba(64, 46, 50, 0.1)' }}>
            <h3 className="font-semibold" style={{ fontSize: '24px', color: '#402E32', marginBottom: '8px' }}>Free</h3>
            <p className="font-normal" style={{ fontSize: '14px', color: '#B5866E', marginBottom: '24px' }}>Browse listings and explore the marketplace</p>
            <div style={{ marginBottom: '24px' }}>
              <div className="flex items-baseline" style={{ gap: '4px' }}>
                <span className="font-bold" style={{ fontSize: '48px', color: '#402E32', lineHeight: '1' }}>$0</span>
                <span className="font-normal" style={{ fontSize: '16px', color: '#B5866E' }}>/ month</span>
              </div>
            </div>
            <button disabled className="w-full font-semibold" style={{
              padding: '12px 24px', borderRadius: '8px', border: '1px solid #E8D5C4',
              backgroundColor: isCurrentPlan('free') ? '#FFF6EE' : '#FFF6EE',
              color: '#C4A88E', fontSize: '16px', cursor: 'not-allowed', marginBottom: '32px'
            }}>
              {isCurrentPlan('free') ? 'Current Plan' : 'Free Plan'}
            </button>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {['Browse all listings', 'Message sellers', 'Save favorites'].map(f => (
                <div key={f} className="flex items-start" style={{ gap: '12px' }}>
                  <Check size={20} style={{ color: '#10B981', flexShrink: 0, marginTop: '2px' }} />
                  <span className="font-normal" style={{ fontSize: '15px', color: '#5A4A44' }}>{f}</span>
                </div>
              ))}
              {['Cannot post listings', 'Ads displayed'].map(f => (
                <div key={f} className="flex items-start" style={{ gap: '12px' }}>
                  <Check size={20} style={{ color: '#C4A88E', flexShrink: 0, marginTop: '2px' }} />
                  <span className="font-normal" style={{ fontSize: '15px', color: '#C4A88E' }}>{f}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Poster Plan */}
          <div className="relative" style={{
            backgroundColor: '#FFFFFF', borderRadius: '12px', padding: '32px',
            boxShadow: '0 10px 15px -3px rgba(64, 46, 50, 0.1)', border: '2px solid #F76902'
          }}>
            <div className="absolute font-semibold" style={{
              top: '-12px', left: '50%', transform: 'translateX(-50%)',
              backgroundColor: '#F76902', color: '#FFFFFF', fontSize: '12px',
              padding: '4px 16px', borderRadius: '100px'
            }}>
              Most Popular
            </div>
            <h3 className="font-semibold" style={{ fontSize: '24px', color: '#402E32', marginBottom: '8px' }}>Poster</h3>
            <p className="font-normal" style={{ fontSize: '14px', color: '#B5866E', marginBottom: '24px' }}>Post listings and sell your items</p>
            <div style={{ marginBottom: '24px' }}>
              <div className="flex items-baseline" style={{ gap: '4px' }}>
                <span className="font-bold" style={{ fontSize: '48px', color: '#402E32', lineHeight: '1' }}>
                  ${billingPeriod === 'monthly' ? '2.99' : '25'}
                </span>
                <span className="font-normal" style={{ fontSize: '16px', color: '#B5866E' }}>
                  / {billingPeriod === 'monthly' ? 'month' : 'year'}
                </span>
              </div>
              {billingPeriod === 'yearly' && (
                <p className="font-normal" style={{ fontSize: '13px', color: '#B5866E', marginTop: '6px' }}>~$2.08/month</p>
              )}
            </div>
            <button
              onClick={() => handleUpgradeClick('poster')}
              disabled={isCurrentPlan('poster')}
              className="w-full font-semibold transition-all"
              style={{
                padding: '12px 24px', borderRadius: '8px', border: 'none',
                backgroundColor: isCurrentPlan('poster') ? '#FFF6EE' : '#F76902',
                color: isCurrentPlan('poster') ? '#C4A88E' : '#FFFFFF',
                fontSize: '16px', cursor: isCurrentPlan('poster') ? 'not-allowed' : 'pointer', marginBottom: '32px'
              }}
            >
              {isCurrentPlan('poster') ? 'Current Plan' : 'Upgrade'}
            </button>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {['8 active listings at a time', 'Everything from Free tier', 'No ads', 'Priority in search results', 'Listings expire after 60 days', 'Email notifications'].map(f => (
                <div key={f} className="flex items-start" style={{ gap: '12px' }}>
                  <Check size={20} style={{ color: '#10B981', flexShrink: 0, marginTop: '2px' }} />
                  <span className="font-normal" style={{ fontSize: '15px', color: '#5A4A44' }}>{f}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Premium Plan */}
          <div className="relative" style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', padding: '32px', boxShadow: '0 1px 3px 0 rgba(64, 46, 50, 0.1)' }}>
            <h3 className="font-semibold" style={{ fontSize: '24px', color: '#402E32', marginBottom: '8px' }}>Premium</h3>
            <p className="font-normal" style={{ fontSize: '14px', color: '#B5866E', marginBottom: '24px' }}>Unlimited listings and premium features</p>
            <div style={{ marginBottom: '24px' }}>
              <div className="flex items-baseline" style={{ gap: '4px' }}>
                <span className="font-bold" style={{ fontSize: '48px', color: '#402E32', lineHeight: '1' }}>
                  ${billingPeriod === 'monthly' ? '4.99' : '40'}
                </span>
                <span className="font-normal" style={{ fontSize: '16px', color: '#B5866E' }}>
                  / {billingPeriod === 'monthly' ? 'month' : 'year'}
                </span>
              </div>
              {billingPeriod === 'yearly' && (
                <p className="font-normal" style={{ fontSize: '13px', color: '#B5866E', marginTop: '6px' }}>~$3.33/month</p>
              )}
            </div>
            <button
              onClick={() => handleUpgradeClick('premium')}
              disabled={isCurrentPlan('premium')}
              className="w-full font-semibold transition-all"
              style={{
                padding: '12px 24px', borderRadius: '8px',
                border: isCurrentPlan('premium') ? 'none' : '1px solid #E8D5C4',
                backgroundColor: isCurrentPlan('premium') ? '#FFF6EE' : '#FFFFFF',
                color: isCurrentPlan('premium') ? '#C4A88E' : '#402E32',
                fontSize: '16px', cursor: isCurrentPlan('premium') ? 'not-allowed' : 'pointer', marginBottom: '32px'
              }}
            >
              {isCurrentPlan('premium') ? 'Current Plan' : 'Upgrade'}
            </button>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {['20 active listings', 'Everything from Poster tier', 'Featured listing spot (1 per week)', 'Listings never expire', 'Advanced analytics', 'Trusted seller badge'].map(f => (
                <div key={f} className="flex items-start" style={{ gap: '12px' }}>
                  <Check size={20} style={{ color: '#10B981', flexShrink: 0, marginTop: '2px' }} />
                  <span className="font-normal" style={{ fontSize: '15px', color: '#5A4A44' }}>{f}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
