'use client';

import { useState, useEffect } from 'react';

const PricingCalculator = () => {
  // 1. Define Services and Base Prices
  const services = [
    { id: 'quantum', name: 'Quantum Computing (Qiskit)', basePrice: 15000 },
    { id: 'mern', name: 'MERN Stack Development', basePrice: 12000 },
    { id: 'java', name: 'Java Architecture (Spring)', basePrice: 10000 },
    { id: 'python', name: 'Python & AI Automation', basePrice: 8000 },
  ];

  const [selectedServiceId, setSelectedServiceId] = useState(services[0].id);
  const [deadline, setDeadline] = useState('');
  const [finalPrice, setFinalPrice] = useState(0);
  const [status, setStatus] = useState('Standard');
  const [minDate, setMinDate] = useState('');

  // Helper to find the full service object based on ID
  const getSelectedService = () => services.find(s => s.id === selectedServiceId);

  // Initialize the "min" date to TODAY so past dates are disabled
  useEffect(() => {
    const today = new Date();
    // Format: YYYY-MM-DD
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    setMinDate(`${yyyy}-${mm}-${dd}`);
  }, []);

  useEffect(() => {
    calculatePrice();
  }, [selectedServiceId, deadline]);

  const calculatePrice = () => {
    const currentService = getSelectedService();
    
    // If no deadline is set, just show base price
    if (!deadline) {
        setFinalPrice(currentService.basePrice);
        setStatus('Standard');
        return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to midnight for accurate day diff
    
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today; 
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    let multiplier = 1;
    let statusLabel = 'Standard';

    // 2. The Logic: Days Remaining vs. Price Multiplier
    
    // Safety check: Handle past dates if manually entered
    if (diffDays < 0) {
        setStatus('Invalid Date');
        setFinalPrice(0);
        return;
    }

    // Logic based on Project Plan [cite: 36, 37]
    if (diffDays <= 3) {
      multiplier = 1.40; // Super Rush (+40%)
      statusLabel = 'Super Rush (+40%)';
    } else if (diffDays < 7) {
      multiplier = 1.20; // Express (+20%)
      statusLabel = 'Express (+20%)';
    } else {
      multiplier = 1.0;  // Base Price
      statusLabel = 'Standard';
    }

    setFinalPrice(currentService.basePrice * multiplier);
    setStatus(statusLabel);
  };

  const handleWhatsAppClick = () => {
    if (status === 'Invalid Date') {
        alert("Please select a valid future date.");
        return;
    }

    const serviceName = getSelectedService().name;
    const priceText = finalPrice.toFixed(0);
    
    const message = `Hello! I am interested in the *${serviceName}* service. 
    \n📅 Deadline: ${deadline} 
    \n🚀 Urgency Tier: ${status} 
    \n💰 Estimated Quote: ₹${priceText}
    \nI would like to proceed with the booking.`;

    const encodedMessage = encodeURIComponent(message);
    
    // Replace with your actual number
    window.open(`https://wa.me/919876543210?text=${encodedMessage}`, '_blank');
  };

  return (
    <div className="p-8 max-w-lg mx-auto bg-white rounded-2xl shadow-xl border border-gray-100">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Project Estimator</h2>
      
      {/* Service Selection */}
      <div className="mb-5">
        <label className="block text-sm font-semibold text-gray-700 mb-2">Select Domain</label>
        <select 
          className="block w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
          onChange={(e) => setSelectedServiceId(e.target.value)}
          value={selectedServiceId}
        >
          {services.map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
      </div>

      {/* Date Selection with MIN Attribute */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-2">Project Deadline</label>
        <input 
          type="date" 
          min={minDate} // This disables past dates in the calendar
          className="block w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
          onChange={(e) => setDeadline(e.target.value)}
        />
      </div>

      {/* Price Display */}
      <div className={`p-6 rounded-xl text-center transition-colors duration-300 ${
        status === 'Invalid Date' ? 'bg-gray-100 text-gray-400' :
        status.includes('Rush') || status.includes('Express') 
          ? 'bg-red-50 border border-red-100' 
          : 'bg-green-50 border border-green-100'
      }`}>
        <p className={`text-sm font-bold uppercase tracking-wide ${
             status === 'Invalid Date' ? 'text-gray-500' :
             status.includes('Rush') ? 'text-red-600' : 'text-green-600'
        }`}>
          {status === 'Invalid Date' ? 'Please select a future date' : `${status} Tier Applied`}
        </p>
        <p className="text-4xl font-extrabold mt-2 text-gray-900">
            {status === 'Invalid Date' ? '---' : `₹${finalPrice.toFixed(0)}`}
        </p>
      </div>
      
      {/* Button */}
      <button 
        onClick={handleWhatsAppClick}
        disabled={status === 'Invalid Date'}
        className={`mt-6 w-full font-bold py-4 px-6 rounded-xl flex items-center justify-center transition-transform shadow-lg ${
            status === 'Invalid Date' 
            ? 'bg-gray-300 cursor-not-allowed text-gray-500' 
            : 'bg-green-600 hover:bg-green-700 hover:scale-105 text-white'
        }`}
      >
        <span className="mr-2 text-xl">💬</span>
        Book via WhatsApp
      </button>

      <p className="text-xs text-gray-400 mt-4 text-center">
        *Clicking this will open WhatsApp with your quote pre-filled.
      </p>
    </div>
  );
};

export default PricingCalculator;