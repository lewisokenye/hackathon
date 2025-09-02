import React from 'react';
import { Heart, Mail, Phone, MapPin } from 'lucide-react';

function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Heart className="h-8 w-8 text-emerald-400" />
              <span className="text-xl font-bold">HungerLink</span>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              Connecting communities through food donation. Together, we can end hunger one meal at a time.
            </p>
            <div className="flex space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <Mail className="h-4 w-4" />
                <span>hello@hungerlink.org</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-400">
                <Phone className="h-4 w-4" />
                <span>+1 (555) 123-4567</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-300">
              <li><a href="/donations" className="hover:text-emerald-400 transition-colors">Make a Donation</a></li>
              <li><a href="/marketplace" className="hover:text-emerald-400 transition-colors">Food Marketplace</a></li>
              <li><a href="/rewards" className="hover:text-emerald-400 transition-colors">Rewards Program</a></li>
              <li><a href="/map" className="hover:text-emerald-400 transition-colors">Find Locations</a></li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Community</h3>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Volunteer</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Partner With Us</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Success Stories</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Contact Support</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; 2025 HungerLink. All rights reserved. Made with ❤️ for communities everywhere.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;