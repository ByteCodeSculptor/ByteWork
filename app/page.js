import Navbar from './components/layout/Navbar';
import Hero from './components/sections/Hero';
import ServiceCatalog from './components/sections/ServiceCatalog';
import Deliverables from './components/sections/Deliverables';
import PricingSection from './components/sections/PricingSection';
import Footer from './components/layout/Footer';

export default function Home() {
  return (
    <main id="top" className="flex min-h-screen flex-col bg-white font-sans text-slate-900">
      <Navbar />
      <Hero />
      <ServiceCatalog />
      <Deliverables />
      <PricingSection />
      <Footer />
    </main>
  );
}
