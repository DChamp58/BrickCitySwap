import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Check, X, Star } from 'lucide-react';
import { useAuth } from './auth-context';
import { toast } from 'sonner';

export function PricingView() {
  const { user, updateProfile } = useAuth();
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [loading, setLoading] = useState(false);

  const handleUpgradeSubscription = async (tier: string) => {
    if (!user) {
      toast.error('Please sign in to upgrade your subscription');
      return;
    }
    setLoading(true);
    try {
      // TODO: implement real payment/subscription
      await new Promise(resolve => setTimeout(resolve, 500));
      updateProfile({ ...user, subscriptionTier: tier });
      toast.success(`Successfully upgraded to ${tier} tier!`);
    } catch (error) {
      toast.error('Failed to update subscription');
    } finally {
      setLoading(false);
    }
  };

  const plans = [
    {
      name: 'Free (Browser)',
      tier: 'free',
      price: { monthly: 0, yearly: 0 },
      description: 'Perfect for students just looking for housing or items to buy',
      popular: false,
      features: [
        { text: 'Cannot post listings', included: false },
        { text: 'Browse all housing and marketplace listings', included: true },
        { text: 'Message sellers', included: true },
        { text: 'Save favorites', included: true },
        { text: 'Ads displayed on all pages', included: false, note: true },
      ],
    },
    {
      name: 'Poster',
      tier: 'poster',
      price: { monthly: 2.99, yearly: 25 },
      description: 'Start selling with essential posting features',
      popular: true,
      features: [
        { text: '8 active listings at a time', included: true },
        { text: 'Everything from Free tier', included: true },
        { text: 'No ads', included: true },
        { text: 'Priority in search results', included: true },
        { text: 'Listings expire after 60 days', included: true, note: true },
        { text: 'Email notifications for your listings', included: true },
      ],
    },
    {
      name: 'Premium',
      tier: 'premium',
      price: { monthly: 4.99, yearly: 40 },
      description: 'For power sellers who need advanced features',
      popular: false,
      features: [
        { text: '20 active listings', included: true },
        { text: 'Everything from Poster tier', included: true },
        { text: 'Featured listing spot (1 per week)', included: true },
        { text: 'Listings never expire (while subscribed)', included: true },
        { text: 'Advanced analytics (views, saves, messages)', included: true },
        { text: 'Badge showing you\'re a trusted seller', included: true },
      ],
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4">
          Choose Your <span className="text-[#F76902]">BrickCitySwap</span> Plan
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          Whether you're browsing or selling, we have a plan that fits your needs and budget
        </p>

        {/* Billing Toggle */}
        <div className="inline-flex items-center gap-4 p-1 bg-muted rounded-lg">
          <button
            onClick={() => setBillingPeriod('monthly')}
            className={`px-6 py-2 rounded-md transition-colors ${
              billingPeriod === 'monthly'
                ? 'bg-[#F76902] text-white'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingPeriod('yearly')}
            className={`px-6 py-2 rounded-md transition-colors ${
              billingPeriod === 'yearly'
                ? 'bg-[#F76902] text-white'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Yearly
            <Badge variant="secondary" className="ml-2">Save 30%</Badge>
          </button>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-3 gap-8 mb-12">
        {plans.map((plan) => (
          <Card
            key={plan.tier}
            className={`relative ${
              plan.popular
                ? 'border-[#F76902] shadow-xl scale-105'
                : user?.subscriptionTier === plan.tier
                ? 'border-[#F76902]'
                : ''
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-[#F76902] hover:bg-[#D85802] px-4 py-1">
                  <Star className="w-3 h-3 mr-1" />
                  Most Popular
                </Badge>
              </div>
            )}

            {user?.subscriptionTier === plan.tier && (
              <div className="absolute -top-4 right-4">
                <Badge variant="secondary">Current Plan</Badge>
              </div>
            )}

            <CardHeader className="text-center pb-8">
              <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
              <div className="mb-4">
                <div className="text-4xl font-bold">
                  ${billingPeriod === 'monthly' ? plan.price.monthly : plan.price.yearly}
                </div>
                <div className="text-muted-foreground">
                  /{billingPeriod === 'monthly' ? 'month' : 'year'}
                </div>
                {billingPeriod === 'yearly' && plan.price.yearly > 0 && (
                  <div className="text-sm text-[#F76902] mt-1">
                    ${(plan.price.yearly / 12).toFixed(2)}/month
                  </div>
                )}
              </div>
              <CardDescription className="text-base">{plan.description}</CardDescription>
            </CardHeader>

            <CardContent>
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    {feature.included ? (
                      <Check className="w-5 h-5 text-[#F76902] flex-shrink-0 mt-0.5" />
                    ) : (
                      <X className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                    )}
                    <span
                      className={
                        !feature.included && !feature.note
                          ? 'text-muted-foreground line-through'
                          : ''
                      }
                    >
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>

              {user?.subscriptionTier === plan.tier ? (
                <Button disabled className="w-full" variant="outline">
                  Current Plan
                </Button>
              ) : (
                <Button
                  onClick={() => handleUpgradeSubscription(plan.tier)}
                  disabled={loading || !user}
                  className={`w-full ${
                    plan.popular
                      ? 'bg-[#F76902] hover:bg-[#D85802]'
                      : ''
                  }`}
                  variant={plan.popular ? 'default' : 'outline'}
                >
                  {!user
                    ? 'Sign In to Subscribe'
                    : plan.tier === 'free'
                    ? 'Downgrade'
                    : user?.subscriptionTier === 'free'
                    ? 'Upgrade'
                    : 'Switch Plan'}
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* FAQ Section */}
      <div className="max-w-3xl mx-auto mt-16">
        <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Can I change plans anytime?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">What happens to my listings if I downgrade?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                If you downgrade to a tier with fewer listing slots, your oldest listings will be paused until you're within the limit. You can reactivate them by removing other listings.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Is there a refund policy?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Annual subscriptions can be refunded within the first 7 days. Monthly subscriptions are non-refundable but you can cancel anytime.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">What payment methods do you accept?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                We accept all major credit cards, debit cards, and PayPal. All payments are processed securely.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Trust Section */}
      <div className="text-center mt-16 p-8 bg-muted/30 rounded-lg">
        <h3 className="text-2xl font-bold mb-4">Trusted by RIT Students</h3>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Join thousands of RIT students who trust BrickCitySwap for safe, verified housing and marketplace transactions. 
          All plans include our commitment to security and student-first features.
        </p>
      </div>
    </div>
  );
}