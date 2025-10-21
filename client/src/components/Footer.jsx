// src/components/Footer.jsx
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 px-3 py-2 mt-10 w-full">
      <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8 text-sm mt-2">

        {/* About AlertNet */}
        <div>
          <h3 className="text-white font-semibold text-lg mb-2">About AlertNet</h3>
          <p>
            AlertNet is a citizen-powered incident reporting platform helping people respond faster to nearby emergencies.
          </p>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-white font-semibold text-lg mb-2">Contact</h3>
          <p>Email: <a href="mailto:support@alertnet.in" className="text-blue-400 hover:underline">support@alertnet.in</a></p>
          <p>Phone: +91-999-000-0000</p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white font-semibold text-lg mb-2">Quick Links</h3>
          <ul className="space-y-1">
            <li><a href="/" className="hover:underline">Home</a></li>
            <li><a href="/report" className="hover:underline">Report Incident</a></li>
            <li><a href="/dashboard" className="hover:underline">Dashboard</a></li>
            <li><a href="/about" className="hover:underline">About</a></li>
          </ul>
        </div>

        {/* Testimonials */}
        <div>
          <h3 className="text-white font-semibold text-lg mb-2">Testimonials</h3>
          <p className="italic text-gray-400">"This platform alerted me just in time to avoid a major accident nearby!"</p>
          <p className="italic text-gray-400 mt-2">"Thanks to AlertNet, we helped a fire victim within minutes."</p>
        </div>
      </div>

      <div className="text-center mt-10 text-xs text-gray-500">
        &copy; {new Date().getFullYear()} AlertNet. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
