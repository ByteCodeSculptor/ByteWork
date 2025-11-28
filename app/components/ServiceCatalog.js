import React from 'react';

const ServiceCatalog = () => {
  // Data derived from Source
  const services = [
    {
      title: "Quantum Computing",
      tech: "Qiskit, Python",
      description: "Implementation of algorithms using Qiskit, simulation projects, and theoretical basics.",
      icon: "⚛️", // You can replace these with real SVG icons later
      color: "bg-purple-100 text-purple-700"
    },
    {
      title: "MERN Stack Development",
      tech: "MongoDB, Express, React, Node",
      description: "Full-stack modern web applications. Includes handling environment variables and database connections.",
      icon: "🌐",
      color: "bg-blue-100 text-blue-700"
    },
    {
      title: "Java Architecture",
      tech: "Spring Boot, Microservices",
      description: "Enterprise-grade design patterns, API development, and robust backend structures.",
      icon: "☕",
      color: "bg-red-100 text-red-700"
    },
    {
      title: "Python & AI",
      tech: "Django, Flask, Pandas",
      description: "Data analysis, automation scripts, and web backends optimized for research.",
      icon: "🐍",
      color: "bg-green-100 text-green-700"
    }
  ];

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Specialized Services
          </h2>
          <p className="mt-4 text-xl text-gray-500">
            High-value engineering niches for final year projects.
          </p>
        </div>

        {/* Grid Layout for Service Cards */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-2">
          {services.map((service, index) => (
            <div 
              key={index} 
              className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <div>
                <span className={`rounded-lg inline-flex p-3 ring-4 ring-white ${service.color}`}>
                  <span className="text-2xl">{service.icon}</span>
                </span>
              </div>
              <div className="mt-8">
                <h3 className="text-lg font-medium">
                  <span className="absolute inset-0" aria-hidden="true" />
                  {service.title}
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  {service.description}
                </p>
              </div>
              <div className="mt-4 border-t border-gray-100 pt-4">
                <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Tech Stack
                </span>
                <p className="text-sm font-medium text-gray-900 mt-1">
                  {service.tech}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServiceCatalog;