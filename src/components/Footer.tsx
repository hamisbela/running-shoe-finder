import React from 'react';
import { Link } from 'react-router-dom';
import { Search, Footprints, Tag, BookOpen } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-green-600 text-white border-t border-green-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Footprints className="h-6 w-6 text-green-200" />
              <h3 className="text-lg font-semibold text-white">Running Shoe Finder By Image</h3>
            </div>
            <p className="text-green-100">
              Your AI-powered companion for running shoe identification. 
              Upload any shoe image and instantly identify the brand, where to buy it, and get performance details for your running needs.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Resources</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <Footprints className="h-4 w-4 text-green-300" />
                <Link to="/" className="text-green-100 hover:text-white">
                  Running Shoe Finder
                </Link>
              </li>
              <li className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-green-300" />
                <Link to="/about" className="text-green-100 hover:text-white">
                  About Our Service
                </Link>
              </li>
              <li className="flex items-center gap-2">
                <Search className="h-4 w-4 text-green-300" />
                <Link to="/contact" className="text-green-100 hover:text-white">
                  Get Help
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Support Our Project</h3>
            <p className="text-green-100 mb-4">
              Help us maintain and improve our free running shoe finder by image tool for runners and fitness enthusiasts everywhere.
            </p>
            <a
              href="https://roihacks.gumroad.com/l/dselxe?utm_campaign=donation-home-page&utm_medium=website&utm_source=running-shoe-finder"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-400 text-gray-900 rounded-md hover:bg-yellow-500 transition-colors"
            >
              Buy us a coffee
            </a>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-green-500">
          <div className="text-center text-green-200">
            <p className="mb-2">&copy; {new Date().getFullYear()} Running Shoe Finder By Image. Helping identify running shoes in a world of endless options.</p>
            <p className="text-sm">
              For informational purposes only. Use running shoe identification results as a guide, not guaranteed matches.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}