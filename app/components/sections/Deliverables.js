import { deliverables } from '@/config/site';
import Section from '../ui/Section';

/** "What you get / what's extra" scope section, driven by config. */
export default function Deliverables() {
  return (
    <Section className="border-t border-gray-100 bg-white">
      <div className="mb-12 text-center">
        <h2 className="text-3xl font-bold text-gray-900">Deliverables &amp; Mentorship</h2>
        <p className="mt-4 text-lg text-gray-600">Transparent scope. No hidden terms.</p>
      </div>

      <div className="grid gap-12 md:grid-cols-2">
        <div className="rounded-2xl border border-green-100 bg-green-50 p-8">
          <h3 className="mb-6 flex items-center text-xl font-bold text-green-800">✅ Standard Package Includes</h3>
          <ul className="space-y-4">
            {deliverables.included.map((item) => (
              <li key={item.title} className="flex items-start">
                <span className="h-6 w-6 flex-shrink-0 text-green-500">✓</span>
                <span className="ml-3 text-gray-700">
                  <strong className="block text-gray-900">{item.title}</strong>
                  {item.detail}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-8">
          <h3 className="mb-6 flex items-center text-xl font-bold text-gray-800">⚠️ Limits &amp; Premium Add-ons</h3>
          <ul className="space-y-4">
            {deliverables.limits.map((item) => (
              <li key={item.title} className="flex items-start">
                <span className="h-6 w-6 flex-shrink-0 text-orange-500" aria-hidden="true">{item.icon}</span>
                <span className="ml-3 text-gray-700">
                  <strong className="block text-gray-900">{item.title}</strong>
                  {item.detail}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
