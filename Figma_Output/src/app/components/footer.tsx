import React from 'react';
import { Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-muted/50 border-t mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🐯</span>
              <span className="font-bold text-lg">BrickCitySwap</span>
            </div>
            <p className="text-sm text-muted-foreground">
              The safe, student-exclusive marketplace for RIT students.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">About</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Built by RIT students, for RIT students</li>
              <li>Verified @rit.edu email required</li>
              <li>Campus-focused marketplace</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Community</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Housing & Subletting</li>
              <li>Marketplace Items</li>
              <li>Safe Student Transactions</li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-6 text-center text-sm text-muted-foreground">
          <div className="flex items-center justify-center gap-1">
            Made with <Heart className="w-4 h-4 text-[#F76902] fill-current" /> for the RIT community
          </div>
          <div className="mt-2">
            © 2026 BrickCitySwap. For RIT Students Only.
          </div>
        </div>
      </div>
    </footer>
  );
}