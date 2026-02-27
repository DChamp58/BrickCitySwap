import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Shield, Users, Clock, DollarSign } from 'lucide-react';

interface HeroSectionProps {
  onGetStarted: () => void;
}

export function HeroSection({ onGetStarted }: HeroSectionProps) {
  return (
    <div className="bg-gradient-to-b from-[#F76902]/10 to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero */}
        <div className="text-center mb-16">
          <div className="text-6xl mb-6">🐯</div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Welcome to <span className="text-[#F76902]">BrickCitySwap</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            The safe, student-exclusive marketplace for RIT students. Find housing, sell items, 
            and connect with verified RIT students - all in one place.
          </p>
          <Button
            size="lg"
            onClick={onGetStarted}
            className="bg-[#F76902] hover:bg-[#D85802] text-lg px-8 py-6"
          >
            Get Started
          </Button>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card>
            <CardHeader>
              <Shield className="w-10 h-10 text-[#F76902] mb-2" />
              <CardTitle>Safe & Verified</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                RIT email verification ensures you're only dealing with fellow students
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Users className="w-10 h-10 text-[#F76902] mb-2" />
              <CardTitle>Campus-Focused</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Built specifically for RIT students' unique needs, including co-op housing
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Clock className="w-10 h-10 text-[#F76902] mb-2" />
              <CardTitle>Short-Term Leases</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Find sublease options perfect for semester or co-op timelines
              </CardDescription>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <DollarSign className="w-10 h-10 text-[#F76902] mb-2" />
              <CardTitle>Student Pricing</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Affordable subscription tiers designed for student budgets
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Stats */}
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-[#F76902] mb-2">20,000+</div>
              <div className="text-muted-foreground">RIT Students</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-[#F76902] mb-2">100%</div>
              <div className="text-muted-foreground">Verified Users</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-[#F76902] mb-2">Safe</div>
              <div className="text-muted-foreground">Student Community</div>
            </div>
          </div>
        </div>

        {/* Why BrickCitySwap */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center mb-8">Why BrickCitySwap?</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">The Problem</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>❌ Zillow charges high fees and focuses on long-term rentals</li>
                <li>❌ Facebook Marketplace is full of strangers and scams</li>
                <li>❌ Discord servers are cluttered and hard to search</li>
                <li>❌ No transportation to off-campus meetups</li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Our Solution</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>✅ Free browsing with affordable posting tiers</li>
                <li>✅ Verified RIT students only - no strangers</li>
                <li>✅ Clean, searchable interface with filters</li>
                <li>✅ Campus-focused for easy meetups</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}