import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Shield, Users, Clock, DollarSign, Home, Package } from 'lucide-react';

interface HomeViewProps {
  onNavigate: (view: 'housing' | 'marketplace' | 'profile') => void;
}

export function HomeView({ onNavigate }: HomeViewProps) {
  return (
    <div className="bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-[#F76902]/10 to-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="text-7xl mb-6 animate-bounce">🐯</div>
            <h1 className="text-5xl sm:text-6xl font-bold mb-6">
              Welcome to <span className="text-[#F76902]">BrickCitySwap</span>
            </h1>
            <p className="text-xl sm:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              The safe, student-exclusive marketplace for RIT students. Find housing, sell items, 
              and connect with verified RIT students - all in one place.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => onNavigate('housing')}
                className="bg-[#F76902] hover:bg-[#D85802] text-lg px-8 py-6"
              >
                <Home className="w-5 h-5 mr-2" />
                Browse Housing
              </Button>
              <Button
                size="lg"
                onClick={() => onNavigate('marketplace')}
                variant="outline"
                className="text-lg px-8 py-6"
              >
                <Package className="w-5 h-5 mr-2" />
                Browse Marketplace
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Why BrickCitySwap Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Why Choose BrickCitySwap?</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Built by RIT students, for RIT students. We understand your unique housing and marketplace needs.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Shield className="w-12 h-12 text-[#F76902] mb-3" />
              <CardTitle>Safe & Verified</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                RIT email verification ensures you're only dealing with fellow students. No strangers, no scams.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Users className="w-12 h-12 text-[#F76902] mb-3" />
              <CardTitle>Campus-Focused</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Built specifically for RIT students' unique needs, including co-op housing and semester leases.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Clock className="w-12 h-12 text-[#F76902] mb-3" />
              <CardTitle>Short-Term Leases</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Find sublease options perfect for semester or co-op timelines. Flexible housing for your schedule.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <DollarSign className="w-12 h-12 text-[#F76902] mb-3" />
              <CardTitle>Student Pricing</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Affordable subscription tiers designed for student budgets. Free to browse, low cost to post.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-r from-[#F76902] to-[#D85802] rounded-2xl shadow-2xl p-12 text-white">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold mb-3">20,000+</div>
              <div className="text-xl opacity-90">Potential RIT Students</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-3 text-center">100%</div>
              <div className="text-xl opacity-90">Verified Users</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-3">Safer Campus Meetups</div>
              <div className="text-xl opacity-90">Recomended On Campus Meetup Locations
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-muted/30 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">
            How BrickCitySwap Works
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-[#F76902] text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  1
                </div>
                <CardTitle>Sign Up</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Create your account with your @rit.edu email. Verification ensures a safe, student-only community.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-[#F76902] text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  2
                </div>
                <CardTitle>Browse or Post</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Search for housing or items with powerful filters, or post your own listings to reach fellow students.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-[#F76902] text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  3
                </div>
                <CardTitle>Connect Safely</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Message sellers directly through our platform and arrange safe, convenient campus meetups.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Ready to Join the BrickCitySwap Community?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Start finding housing and selling items with fellow RIT students today.
          </p>
          <Button
            size="lg"
            onClick={() => onNavigate('profile')}
            className="bg-[#F76902] hover:bg-[#D85802] text-lg px-10 py-6"
          >
            Get Started - It's Free!
          </Button>
        </div>
      </div>
    </div>
  );
}