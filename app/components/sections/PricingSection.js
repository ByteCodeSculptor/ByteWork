import Section from '../ui/Section';
import PricingWizard from '../pricing/PricingWizard';

/** Pricing section shell (server component) hosting the interactive wizard. */
export default function PricingSection() {
  return (
    <Section id="pricing" className="bg-gray-50" max="max-w-4xl" reveal>
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-bold text-gray-900">Check Availability &amp; Price</h2>
        <p className="mt-3 text-gray-600">
          Build your quote in a few clicks — deadlines under 7 days incur express fees.
        </p>
      </div>
      <PricingWizard />
    </Section>
  );
}
