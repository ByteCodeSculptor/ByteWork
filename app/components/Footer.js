import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 py-12 border-t border-gray-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Column 1: Brand & Role */}
        <div>
          <h3 className="text-2xl font-bold text-white mb-2">
            Your Vishnu Vardhan
          </h3>
          <p className="text-sm text-gray-400 mb-4">
            Freelance Application Architect & Consultant.
          </p>
          <p className="text-xs text-gray-500">
            Specializing in Quantum Computing, MERN Stack, Python and Java Enterprise Architectures.
          </p>
        </div>

        {/* Column 2: Quick Links / Legal */}
        <div>
          <h4 className="text-lg font-semibold text-white mb-4">Services</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-indigo-400 transition">Quantum Research</a></li>
            <li><a href="#" className="hover:text-indigo-400 transition">MERN Development</a></li>
            <li><a href="#" className="hover:text-indigo-400 transition">Spring Boot Architecture</a></li>
            <li><a href="#" className="hover:text-indigo-400 transition">Express Pricing</a></li>
          </ul>
        </div>

        {/* Column 3: Contact & Socials */}
        <div>
          <h4 className="text-lg font-semibold text-white mb-4">Connect</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center">
              <span className="mr-2">📧</span>
              <a href="mailto:ramki3244@gmail.com" className="hover:text-white transition">
                ramki3244@gmail.com
              </a>
            </li>
            <li className="flex items-center">
              <span className="mr-2">🐙</span>
              <a href="https://github.com/ByteCodeSculptor" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
                GitHub (Portfolio)
              </a>
            </li>
            <li className="flex items-center">
              <span className="mr-2">💼</span>
              <a href="https://my-portfolio-git-main-bytecodesculptors-projects.vercel.app/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
                Portfolio Profile
              </a>
            </li>
            <li className="flex items-center">
              <span className="mr-2">💬</span>
              <a href="https://wa.me/919182407243" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
                WhatsApp Direct
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright Line */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-gray-800 text-center text-xs text-gray-600">
        <p>© {currentYear} All rights reserved. | Built with Next.js & Tailwind CSS.</p>
      </div>
    </footer>
  );
};

export default Footer;