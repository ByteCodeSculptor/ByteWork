import { services } from '@/config/site';
import Section from '../ui/Section';
import ServiceCard from '../ui/ServiceCard';

/** Service grid, rendered from the shared config descriptors. */
export default function ServiceCatalog() {
  return (
    <Section id="services" className="bg-gray-50" reveal>
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Specialized Services</h2>
        <p className="mt-4 text-xl text-gray-500">High-value engineering niches for final year projects.</p>
      </div>
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
        {services.map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>
    </Section>
  );
}
