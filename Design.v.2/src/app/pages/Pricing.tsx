import { useState } from 'react';
import { Check } from 'lucide-react';

export function Pricing() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');

  return (
    <div className="w-full" style={{ backgroundColor: '#FFFFFF' }}>
      {/* Page Header */}
      <div 
        className="w-full"
        style={{ 
          backgroundColor: '#F9FAFB',
          borderBottom: '1px solid #E5E7EB'
        }}
      >
        <div 
          className="max-w-[1400px] mx-auto"
          style={{ padding: '48px 48px 32px 48px' }}
        >
          <h1 
            className="font-bold"
            style={{ 
              fontSize: '56px',
              color: '#0F172A',
              marginBottom: '16px',
              lineHeight: '1.1'
            }}
          >
            Pricing
          </h1>
          <p 
            className="font-normal"
            style={{ 
              fontSize: '16px',
              color: '#64748B',
              lineHeight: '1.6'
            }}
          >
            Choose the plan that works for you
          </p>
        </div>
      </div>

      {/* Pricing Toggle */}
      <div className="max-w-[1400px] mx-auto" style={{ padding: '48px 48px 0 48px' }}>
        <div className="flex justify-center" style={{ marginBottom: '48px' }}>
          <div 
            className="inline-flex items-center"
            style={{
              backgroundColor: '#F3F4F6',
              borderRadius: '100px',
              padding: '4px',
              gap: '4px'
            }}
          >
            {/* Monthly Option */}
            <button
              onClick={() => setBillingPeriod('monthly')}
              className="font-semibold transition-all"
              style={{
                padding: '12px 24px',
                borderRadius: '100px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '15px',
                backgroundColor: billingPeriod === 'monthly' ? '#F76902' : 'transparent',
                color: billingPeriod === 'monthly' ? '#FFFFFF' : '#6B7280',
                transitionDuration: '200ms'
              }}
            >
              Monthly
            </button>

            {/* Yearly Option with Badge */}
            <button
              onClick={() => setBillingPeriod('yearly')}
              className="font-semibold transition-all flex items-center"
              style={{
                padding: '12px 24px',
                borderRadius: '100px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '15px',
                backgroundColor: billingPeriod === 'yearly' ? '#F76902' : 'transparent',
                color: billingPeriod === 'yearly' ? '#FFFFFF' : '#6B7280',
                gap: '8px',
                transitionDuration: '200ms'
              }}
            >
              Yearly
              <span
                className="font-semibold"
                style={{
                  fontSize: '12px',
                  backgroundColor: billingPeriod === 'yearly' ? '#FFFFFF' : '#10B981',
                  color: billingPeriod === 'yearly' ? '#F76902' : '#FFFFFF',
                  padding: '2px 8px',
                  borderRadius: '100px'
                }}
              >
                Save 30%
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-[1400px] mx-auto" style={{ padding: '0 48px 48px 48px' }}>
        {/* Pricing Cards Grid */}
        <div 
          className="grid"
          style={{ 
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '32px',
            maxWidth: '1200px',
            margin: '0 auto'
          }}
        >
          {/* Free Plan */}
          <div 
            className="relative"
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '12px',
              padding: '32px',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
            }}
          >
            <h3 
              className="font-semibold"
              style={{
                fontSize: '24px',
                color: '#111827',
                marginBottom: '8px'
              }}
            >
              Free
            </h3>
            <p 
              className="font-normal"
              style={{
                fontSize: '14px',
                color: '#6B7280',
                marginBottom: '24px'
              }}
            >
              Browse listings and explore the marketplace
            </p>
            
            <div style={{ marginBottom: '24px' }}>
              <div className="flex items-baseline" style={{ gap: '4px' }}>
                <span 
                  className="font-bold"
                  style={{
                    fontSize: '48px',
                    color: '#111827',
                    lineHeight: '1'
                  }}
                >
                  $0
                </span>
                <span 
                  className="font-normal"
                  style={{
                    fontSize: '16px',
                    color: '#6B7280'
                  }}
                >
                  / month
                </span>
              </div>
            </div>

            <button
              disabled
              className="w-full font-semibold"
              style={{
                padding: '12px 24px',
                borderRadius: '8px',
                border: '1px solid #E5E7EB',
                backgroundColor: '#F9FAFB',
                color: '#9CA3AF',
                fontSize: '16px',
                cursor: 'not-allowed',
                marginBottom: '32px'
              }}
            >
              Current Plan
            </button>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div className="flex items-start" style={{ gap: '12px' }}>
                <Check size={20} style={{ color: '#10B981', flexShrink: 0, marginTop: '2px' }} />
                <span className="font-normal" style={{ fontSize: '15px', color: '#4B5563' }}>
                  Browse all listings
                </span>
              </div>
              <div className="flex items-start" style={{ gap: '12px' }}>
                <Check size={20} style={{ color: '#10B981', flexShrink: 0, marginTop: '2px' }} />
                <span className="font-normal" style={{ fontSize: '15px', color: '#4B5563' }}>
                  Message sellers
                </span>
              </div>
              <div className="flex items-start" style={{ gap: '12px' }}>
                <Check size={20} style={{ color: '#10B981', flexShrink: 0, marginTop: '2px' }} />
                <span className="font-normal" style={{ fontSize: '15px', color: '#4B5563' }}>
                  Save favorites
                </span>
              </div>
              <div className="flex items-start" style={{ gap: '12px' }}>
                <Check size={20} style={{ color: '#9CA3AF', flexShrink: 0, marginTop: '2px' }} />
                <span className="font-normal" style={{ fontSize: '15px', color: '#9CA3AF' }}>
                  Cannot post listings
                </span>
              </div>
              <div className="flex items-start" style={{ gap: '12px' }}>
                <Check size={20} style={{ color: '#9CA3AF', flexShrink: 0, marginTop: '2px' }} />
                <span className="font-normal" style={{ fontSize: '15px', color: '#9CA3AF' }}>
                  Ads displayed
                </span>
              </div>
            </div>
          </div>

          {/* Poster Plan - Most Popular */}
          <div 
            className="relative"
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '12px',
              padding: '32px',
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
              border: '2px solid #F76902'
            }}
          >
            {/* Most Popular Badge */}
            <div 
              className="absolute font-semibold"
              style={{
                top: '-12px',
                left: '50%',
                transform: 'translateX(-50%)',
                backgroundColor: '#F76902',
                color: '#FFFFFF',
                fontSize: '12px',
                padding: '4px 16px',
                borderRadius: '100px'
              }}
            >
              Most Popular
            </div>

            <h3 
              className="font-semibold"
              style={{
                fontSize: '24px',
                color: '#111827',
                marginBottom: '8px'
              }}
            >
              Poster
            </h3>
            <p 
              className="font-normal"
              style={{
                fontSize: '14px',
                color: '#6B7280',
                marginBottom: '24px'
              }}
            >
              Post listings and sell your items
            </p>
            
            <div style={{ marginBottom: '24px' }}>
              <div className="flex items-baseline" style={{ gap: '4px' }}>
                <span 
                  className="font-bold"
                  style={{
                    fontSize: '48px',
                    color: '#111827',
                    lineHeight: '1'
                  }}
                >
                  ${billingPeriod === 'monthly' ? '2.99' : '25'}
                </span>
                <span 
                  className="font-normal"
                  style={{
                    fontSize: '16px',
                    color: '#6B7280'
                  }}
                >
                  / {billingPeriod === 'monthly' ? 'month' : 'year'}
                </span>
              </div>
              {billingPeriod === 'yearly' && (
                <p 
                  className="font-normal"
                  style={{
                    fontSize: '13px',
                    color: '#6B7280',
                    marginTop: '6px'
                  }}
                >
                  ~$2.08/month
                </p>
              )}
            </div>

            <button
              className="w-full font-semibold transition-all"
              style={{
                padding: '12px 24px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: '#F76902',
                color: '#FFFFFF',
                fontSize: '16px',
                cursor: 'pointer',
                marginBottom: '32px',
                transitionDuration: '200ms'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#D55A02';
                e.currentTarget.style.transform = 'scale(1.02)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#F76902';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              Upgrade
            </button>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div className="flex items-start" style={{ gap: '12px' }}>
                <Check size={20} style={{ color: '#10B981', flexShrink: 0, marginTop: '2px' }} />
                <span className="font-normal" style={{ fontSize: '15px', color: '#4B5563' }}>
                  8 active listings at a time
                </span>
              </div>
              <div className="flex items-start" style={{ gap: '12px' }}>
                <Check size={20} style={{ color: '#10B981', flexShrink: 0, marginTop: '2px' }} />
                <span className="font-normal" style={{ fontSize: '15px', color: '#4B5563' }}>
                  Everything from Free tier
                </span>
              </div>
              <div className="flex items-start" style={{ gap: '12px' }}>
                <Check size={20} style={{ color: '#10B981', flexShrink: 0, marginTop: '2px' }} />
                <span className="font-normal" style={{ fontSize: '15px', color: '#4B5563' }}>
                  No ads
                </span>
              </div>
              <div className="flex items-start" style={{ gap: '12px' }}>
                <Check size={20} style={{ color: '#10B981', flexShrink: 0, marginTop: '2px' }} />
                <span className="font-normal" style={{ fontSize: '15px', color: '#4B5563' }}>
                  Priority in search results
                </span>
              </div>
              <div className="flex items-start" style={{ gap: '12px' }}>
                <Check size={20} style={{ color: '#10B981', flexShrink: 0, marginTop: '2px' }} />
                <span className="font-normal" style={{ fontSize: '15px', color: '#4B5563' }}>
                  Listings expire after 60 days
                </span>
              </div>
              <div className="flex items-start" style={{ gap: '12px' }}>
                <Check size={20} style={{ color: '#10B981', flexShrink: 0, marginTop: '2px' }} />
                <span className="font-normal" style={{ fontSize: '15px', color: '#4B5563' }}>
                  Email notifications
                </span>
              </div>
            </div>
          </div>

          {/* Premium Plan */}
          <div 
            className="relative"
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '12px',
              padding: '32px',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
            }}
          >
            <h3 
              className="font-semibold"
              style={{
                fontSize: '24px',
                color: '#111827',
                marginBottom: '8px'
              }}
            >
              Premium
            </h3>
            <p 
              className="font-normal"
              style={{
                fontSize: '14px',
                color: '#6B7280',
                marginBottom: '24px'
              }}
            >
              Unlimited listings and premium features
            </p>
            
            <div style={{ marginBottom: '24px' }}>
              <div className="flex items-baseline" style={{ gap: '4px' }}>
                <span 
                  className="font-bold"
                  style={{
                    fontSize: '48px',
                    color: '#111827',
                    lineHeight: '1'
                  }}
                >
                  ${billingPeriod === 'monthly' ? '4.99' : '40'}
                </span>
                <span 
                  className="font-normal"
                  style={{
                    fontSize: '16px',
                    color: '#6B7280'
                  }}
                >
                  / {billingPeriod === 'monthly' ? 'month' : 'year'}
                </span>
              </div>
              {billingPeriod === 'yearly' && (
                <p 
                  className="font-normal"
                  style={{
                    fontSize: '13px',
                    color: '#6B7280',
                    marginTop: '6px'
                  }}
                >
                  ~$3.33/month
                </p>
              )}
            </div>

            <button
              className="w-full font-semibold transition-all"
              style={{
                padding: '12px 24px',
                borderRadius: '8px',
                border: '1px solid #E5E7EB',
                backgroundColor: '#FFFFFF',
                color: '#111827',
                fontSize: '16px',
                cursor: 'pointer',
                marginBottom: '32px',
                transitionDuration: '200ms'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#F9FAFB';
                e.currentTarget.style.borderColor = '#111827';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#FFFFFF';
                e.currentTarget.style.borderColor = '#E5E7EB';
              }}
            >
              Upgrade
            </button>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div className="flex items-start" style={{ gap: '12px' }}>
                <Check size={20} style={{ color: '#10B981', flexShrink: 0, marginTop: '2px' }} />
                <span className="font-normal" style={{ fontSize: '15px', color: '#4B5563' }}>
                  20 active listings
                </span>
              </div>
              <div className="flex items-start" style={{ gap: '12px' }}>
                <Check size={20} style={{ color: '#10B981', flexShrink: 0, marginTop: '2px' }} />
                <span className="font-normal" style={{ fontSize: '15px', color: '#4B5563' }}>
                  Everything from Poster tier
                </span>
              </div>
              <div className="flex items-start" style={{ gap: '12px' }}>
                <Check size={20} style={{ color: '#10B981', flexShrink: 0, marginTop: '2px' }} />
                <span className="font-normal" style={{ fontSize: '15px', color: '#4B5563' }}>
                  Featured listing spot (1 per week)
                </span>
              </div>
              <div className="flex items-start" style={{ gap: '12px' }}>
                <Check size={20} style={{ color: '#10B981', flexShrink: 0, marginTop: '2px' }} />
                <span className="font-normal" style={{ fontSize: '15px', color: '#4B5563' }}>
                  Listings never expire
                </span>
              </div>
              <div className="flex items-start" style={{ gap: '12px' }}>
                <Check size={20} style={{ color: '#10B981', flexShrink: 0, marginTop: '2px' }} />
                <span className="font-normal" style={{ fontSize: '15px', color: '#4B5563' }}>
                  Advanced analytics
                </span>
              </div>
              <div className="flex items-start" style={{ gap: '12px' }}>
                <Check size={20} style={{ color: '#10B981', flexShrink: 0, marginTop: '2px' }} />
                <span className="font-normal" style={{ fontSize: '15px', color: '#4B5563' }}>
                  Trusted seller badge
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}