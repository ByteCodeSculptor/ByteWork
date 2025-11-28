import Navbar from './components/Navbar'; // Import the new Navbar
import PricingCalculator from './components/PricingCalculator';
import ServiceCatalog from './components/ServiceCatalog';
import Deliverables from './components/Deliverables'; 
import Footer from './components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen bg-white font-sans text-slate-900 flex flex-col">
      
      {/* 1. Navbar (Sticky at top) */}
      <Navbar />

      {/* 2. Hero Section */}
      <section className="bg-gradient-to-r from-indigo-900 to-indigo-700 text-white py-24 px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight">
          Consultancy & Portfolio
        </h1>
        <p className="text-xl md:text-2xl text-indigo-100 max-w-3xl mx-auto mb-8">
          Application Architecture for Quantum, MERN, and Java Projects.
        </p>
        <button className="bg-white text-indigo-900 font-bold py-3 px-8 rounded-full hover:bg-indigo-50 transition shadow-lg">
          View Services
        </button>
      </section>

      {/* 3. Service Catalog */}
      <ServiceCatalog />

      {/* 4. Deliverables & Scope */}
      <Deliverables />

      {/* 5. Pricing Calculator */}
      <section className="py-16 bg-gray-50 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900">
              Check Availability & Price
            </h2>
            <p className="mt-3 text-gray-600">
              Deadlines closer than 7 days incur express fees.
            </p>
          </div>
          <PricingCalculator />
        </div>
      </section>

      {/* 6. Footer Section */}
      <Footer />
      
    </main>
  );
}