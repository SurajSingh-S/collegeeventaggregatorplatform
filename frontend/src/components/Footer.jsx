import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Branding */}
        <div>
          <h2 className="text-xl font-semibold text-primary-400">CampusConnect</h2>
          <p className="mt-2 text-sm text-gray-400">
            Your ultimate platform for discovering, registering, and enjoying college events!
          </p>
        </div>

        {/* Navigation Links */}
        <div>
          <h3 className="text-lg font-medium mb-2">Quick Links</h3>
          <ul className="space-y-1 text-sm">
            <li><Link to="/" className="hover:text-primary-300">Home</Link></li>
            <li><Link to="/events" className="hover:text-primary-300">Events</Link></li>
            
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-medium mb-2">Contact</h3>
          <p className="text-sm text-gray-400">
            Galgotias University<br />
            Greater Noida, India<br />
            Email: support@campusconnect.in
          </p>
        </div>
      </div>

      <div className="border-t border-gray-800 mt-6 pt-4 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} CampusConnect. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
