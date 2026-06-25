// Theme key → Tailwind classes. Written as full literal strings so the
// Tailwind v4 scanner picks them up (never build class names by interpolation).
const THEME = {
  purple: 'bg-purple-100 text-purple-700',
  blue: 'bg-blue-100 text-blue-700',
  red: 'bg-red-100 text-red-700',
  green: 'bg-green-100 text-green-700',
};

/** Presentational card for a single service descriptor from config. */
export default function ServiceCard({ service }) {
  const badge = THEME[service.theme] ?? THEME.blue;
  return (
    <div className="group relative rounded-lg bg-white p-6 shadow-sm transition-shadow duration-200 hover:shadow-md focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500">
      <span className={`inline-flex rounded-lg p-3 ring-4 ring-white ${badge}`}>
        <span className="text-2xl" aria-hidden="true">{service.icon}</span>
      </span>
      <div className="mt-8">
        <h3 className="text-lg font-medium text-gray-900">{service.name}</h3>
        <p className="mt-2 text-sm text-gray-500">{service.description}</p>
      </div>
      <div className="mt-4 border-t border-gray-100 pt-4">
        <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">Tech Stack</span>
        <p className="mt-1 text-sm font-medium text-gray-900">{service.tech}</p>
      </div>
    </div>
  );
}
