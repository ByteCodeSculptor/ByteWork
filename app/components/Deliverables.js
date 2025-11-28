import React from 'react';

const Deliverables = () => {
  return (
    <section className="py-16 bg-white border-t border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">
            Deliverables & Mentorship
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Transparent scope. No hidden terms.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          
          {/* Column 1: Standard Package (What they get) */}
          <div className="bg-green-50 rounded-2xl p-8 border border-green-100">
            <h3 className="text-xl font-bold text-green-800 mb-6 flex items-center">
              ✅ Standard Package Includes
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <span className="flex-shrink-0 h-6 w-6 text-green-500">✓</span>
                <span className="ml-3 text-gray-700">
                  <strong className="block text-gray-900">Full Source Code</strong>
                  Direct access via GitHub Repository Link.
                </span>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 h-6 w-6 text-green-500">✓</span>
                <span className="ml-3 text-gray-700">
                  <strong className="block text-gray-900">Mentorship Sessions</strong>
                  3 Sessions x 30 Mins (Total 90 mins) to explain the code.
                </span>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 h-6 w-6 text-green-500">✓</span>
                <span className="ml-3 text-gray-700">
                  <strong className="block text-gray-900">Project Documentation</strong>
                  Free up to 20 pages. (Abstract, Diagrams, Conclusion).
                </span>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 h-6 w-6 text-green-500">✓</span>
                <span className="ml-3 text-gray-700">
                  <strong className="block text-gray-900">Quick Start Guide</strong>
                  PDF manual on how to run the project locally.
                </span>
              </li>
            </ul>
          </div>

          {/* Column 2: Limitations & Add-ons (The Rules) */}
          <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
              ⚠️ Limits & Premium Add-ons
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <span className="flex-shrink-0 h-6 w-6 text-orange-500">→</span>
                <span className="ml-3 text-gray-700">
                  <strong className="block text-gray-900">Extended Documentation</strong>
                  Content beyond 20 pages is charged at <b>₹30 per page</b>.
                </span>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 h-6 w-6 text-purple-500">★</span>
                <span className="ml-3 text-gray-700">
                  <strong className="block text-gray-900">Research Paper (IEEE/Springer)</strong>
                  Available as a premium add-on only onDemand.
                </span>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 h-6 w-6 text-red-500">!</span>
                <span className="ml-3 text-gray-700">
                  <strong className="block text-gray-900">Extra Mentorship</strong>
                  Additional sessions beyond the standard 3 are chargeable at 500rs each.
                </span>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 h-6 w-6 text-blue-500">🛠</span>
                <span className="ml-3 text-gray-700">
                  <strong className="block text-gray-900">Remote Installation</strong>
                  AnyDesk support for environment setup is a separate service starts from 500rs.
                </span>
              </li>
            </ul>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Deliverables;