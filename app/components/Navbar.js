'use client'; // <--- ADD THIS LINE AT THE VERY TOP

import React from 'react';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          
          {/* Logo Section */}
          <div className="flex-shrink-0 flex items-center cursor-pointer">
            <div className="h-10 w-10 bg-indigo-600 rounded-lg flex items-center justify-center mr-3 shadow-md hover:bg-indigo-700 transition-colors">
              <svg 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  d="M4 4L12 20" 
                  stroke="white" 
                  strokeWidth="3" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
                <path 
                  d="M20 4L12 20" 
                  stroke="white" 
                  strokeWidth="3" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  className="opacity-70" 
                />
                <circle cx="12" cy="4" r="2" fill="white" className="opacity-90" />
              </svg>
            </div>
            
            <span className="font-bold text-xl tracking-tight text-gray-900">
              V-Tech<span className="text-indigo-600">.Solutions</span>
            </span>
          </div>

          {/* Navigation Links (Desktop) */}
          <div className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
              className="bg-indigo-50 text-indigo-700 hover:bg-indigo-100 px-4 py-2 rounded-full text-sm font-bold transition"
            >
              Get Quote
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;