import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { useAuth } from './auth-context';
import { toast } from 'sonner';

export function AuthView() {
  const { user, signIn, signUp, signOut, updateProfile } = useAuth();
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpName, setSignUpName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signIn(signInEmail, signInPassword);
      toast.success('Successfully signed in!');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to sign in');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signUp(signUpEmail, signUpPassword, signUpName);
      toast.success('Account created successfully!');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  const handleUpgradeSubscription = (tier: string) => {
    // TODO: implement payment/subscription
    if (user) {
      updateProfile({ ...user, subscriptionTier: tier });
      toast.success(`Upgraded to ${tier} tier!`);
    }
  };

  if (user) {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Manage your BrickCitySwap account</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Name</Label>
              <div className="text-lg font-medium">{user.name}</div>
            </div>
            <div>
              <Label>Email</Label>
              <div className="text-lg">{user.email}</div>
            </div>
            <div>
              <Label>Current Subscription</Label>
              <div className="text-lg font-medium capitalize">{user.subscriptionTier}</div>
            </div>
            <Button onClick={signOut} variant="destructive">
              Sign Out
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Subscription Plans</CardTitle>
            <CardDescription>Choose the plan that works best for you</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <Card className={user.subscriptionTier === 'free' ? 'border-[#F76902]' : ''}>
                <CardHeader>
                  <CardTitle className="text-xl">Free (Browser)</CardTitle>
                  <div className="text-2xl font-bold">$0/mo</div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="text-sm">• Browse all listings</div>
                  <div className="text-sm">• Message sellers</div>
                  <div className="text-sm">• Save favorites</div>
                  <div className="text-sm text-muted-foreground">• Cannot post listings</div>
                  <div className="text-sm text-muted-foreground">• Ads displayed</div>
                </CardContent>
              </Card>

              <Card className={user.subscriptionTier === 'poster' ? 'border-[#F76902]' : ''}>
                <CardHeader>
                  <CardTitle className="text-xl">Poster</CardTitle>
                  <div className="text-2xl font-bold">$2.99/mo</div>
                  <div className="text-sm text-muted-foreground">or $25/year</div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="text-sm">• 8 active listings</div>
                  <div className="text-sm">• No ads</div>
                  <div className="text-sm">• Priority in search</div>
                  <div className="text-sm">• Email notifications</div>
                  {user.subscriptionTier !== 'poster' && (
                    <Button
                      onClick={() => handleUpgradeSubscription('poster')}
                      disabled={loading}
                      className="w-full mt-4 bg-[#F76902] hover:bg-[#D85802]"
                    >
                      {user.subscriptionTier === 'free' ? 'Upgrade' : 'Switch'}
                    </Button>
                  )}
                </CardContent>
              </Card>

              <Card className={user.subscriptionTier === 'premium' ? 'border-[#F76902]' : ''}>
                <CardHeader>
                  <CardTitle className="text-xl">Premium</CardTitle>
                  <div className="text-2xl font-bold">$4.99/mo</div>
                  <div className="text-sm text-muted-foreground">or $40/year</div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="text-sm">• 20 active listings</div>
                  <div className="text-sm">• Featured spot (1/week)</div>
                  <div className="text-sm">• No expiration</div>
                  <div className="text-sm">• Advanced analytics</div>
                  <div className="text-sm">• Trusted seller badge</div>
                  {user.subscriptionTier !== 'premium' && (
                    <Button
                      onClick={() => handleUpgradeSubscription('premium')}
                      disabled={loading}
                      className="w-full mt-4 bg-[#F76902] hover:bg-[#D85802]"
                    >
                      Upgrade
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Welcome to BrickCitySwap</CardTitle>
          <CardDescription>Sign in or create an account with your RIT email</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="signin">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email">Email</Label>
                  <Input
                    id="signin-email"
                    type="email"
                    placeholder="your.email@rit.edu"
                    value={signInEmail}
                    onChange={(e) => setSignInEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signin-password">Password</Label>
                  <Input
                    id="signin-password"
                    type="password"
                    value={signInPassword}
                    onChange={(e) => setSignInPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full bg-[#F76902] hover:bg-[#D85802]" disabled={loading}>
                  {loading ? 'Signing In...' : 'Sign In'}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Name</Label>
                  <Input
                    id="signup-name"
                    type="text"
                    placeholder="John Doe"
                    value={signUpName}
                    onChange={(e) => setSignUpName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">RIT Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="your.email@rit.edu"
                    value={signUpEmail}
                    onChange={(e) => setSignUpEmail(e.target.value)}
                    required
                  />
                  <p className="text-xs text-muted-foreground">Must use an @rit.edu email address</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    value={signUpPassword}
                    onChange={(e) => setSignUpPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full bg-[#F76902] hover:bg-[#D85802]" disabled={loading}>
                  {loading ? 'Creating Account...' : 'Create Account'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
