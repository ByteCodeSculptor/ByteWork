import Navbar from './components/layout/Navbar';
import Hero from './components/sections/Hero';
import ServiceCatalog from './components/sections/ServiceCatalog';
import Deliverables from './components/sections/Deliverables';
import PricingCalculator from './components/PricingCalculator';
import Footer from './components/layout/Footer';

export default function Home() {
  return (
    <main id="top" className="flex min-h-screen flex-col bg-white font-sans text-slate-900">
      <Navbar />
      <Hero />
      <ServiceCatalog />
      <Deliverables />

      {/* Pricing — replaced by the multi-step wizard in Phase 3 */}
      <section id="pricing" className="bg-gray-50 px-4 py-16">
        <div className="mx-auto max-w-3xl">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold text-gray-900">Check Availability &amp; Price</h2>
            <p className="mt-3 text-gray-600">Deadlines closer than 7 days incur express fees.</p>
          </div>
          <PricingCalculator />
        </div>
      </section>

      <Footer />
    </main>
  );
}
