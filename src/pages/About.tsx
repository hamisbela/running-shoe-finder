import React from 'react';
import { Footprints } from 'lucide-react';

export default function About() {
  return (
    <div className="bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">About Us</h1>
        
        <div className="bg-white rounded-xl shadow-lg p-8 prose max-w-none">
          <p>
            Welcome to Running Shoe Finder By Image, your trusted resource for AI-powered running shoe identification.
            We're passionate about helping runners, fitness enthusiasts, and athletic shoppers identify
            specific running shoes, discover where to buy them, and get performance insights through advanced technology
            that analyzes visual characteristics of athletic footwear.
          </p>

          <h2>Our Mission</h2>
          <p>
            Our mission is to make running shoe identification accessible to everyone by providing a free, easy-to-use
            running shoe finder by image tool. In an era of endless athletic footwear options across countless retailers, we aim to help you
            quickly identify running shoes you love, understand where to purchase them, and receive personalized performance advice.
            Our free running shoe finder by image is designed to eliminate the frustration of finding that perfect pair you spotted online
            or in person, helping more people find the ideal running shoes for their needs.
          </p>

          <h2>Why Choose Our Tool?</h2>
          <ul>
            <li>Advanced AI recognition algorithms trained on diverse running shoe datasets</li>
            <li>Detailed analysis reports with brand and model identification</li>
            <li>Comprehensive performance information about cushioning, support, and intended use</li>
            <li>Direct links to purchase options from various retailers</li>
            <li>Price comparisons to help you find the best deals</li>
            <li>Personalized recommendations based on the identified shoes</li>
            <li>Completely free to use running shoe finder by image</li>
            <li>No registration required</li>
            <li>Privacy-focused approach</li>
            <li>User-friendly interface for runners of all tech levels</li>
          </ul>

          <h2>Support Our Project</h2>
          <p>
            We're committed to keeping this running shoe finder by image tool free and accessible to everyone.
            If you find our tool useful, consider supporting us by buying us a coffee.
            Your support helps us maintain and improve the service, ensuring it remains available to all
            who want to identify and purchase running shoes.
          </p>

          <div className="mt-8 text-center">
            <a
              href="https://roihacks.gumroad.com/l/dselxe?utm_campaign=donation-home-page&utm_medium=website&utm_source=running-shoe-finder"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-400 text-gray-900 rounded-lg hover:bg-yellow-500 transition-colors text-lg font-semibold"
            >
              Support Our Work
            </a>
          </div>
          
          <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="flex items-center text-xl font-bold text-gray-900 mb-4">
              <Footprints className="h-5 w-5 text-green-500 mr-2" />
              Important Disclaimer
            </h3>
            <p className="text-gray-700">
              While our free running shoe finder by image tool uses sophisticated algorithms to analyze footwear, it's important to understand that no identification system is 100% accurate. Running shoe models evolve rapidly, and similar designs may appear across multiple brands. 
            </p>
            <p className="text-gray-700 mt-2">
              Our free running shoe finder by image should be used as a helpful guide in your running journey, not as a definitive source. We encourage checking multiple retailers and considering various options when making purchase decisions. Prices and availability may vary based on location and time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}