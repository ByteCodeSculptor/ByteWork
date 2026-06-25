import { contact, services } from '@/config/site';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-800 bg-gray-900 py-12 text-gray-300">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 sm:px-6 md:grid-cols-3 lg:px-8">
        <div>
          <h3 className="mb-2 text-2xl font-bold text-white">{contact.name}</h3>
          <p className="mb-4 text-sm text-gray-400">{contact.role}.</p>
          <p className="text-xs text-gray-500">
            Specializing in Quantum Computing, MERN Stack, Python and Java enterprise architectures.
          </p>
        </div>

        <div>
          <h4 className="mb-4 text-lg font-semibold text-white">Services</h4>
          <ul className="space-y-2 text-sm">
            {services.map((service) => (
              <li key={service.id}>
                <a href="#services" className="transition hover:text-indigo-400">{service.name}</a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-lg font-semibold text-white">Connect</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center">
              <span className="mr-2" aria-hidden="true">📧</span>
              <a href={`mailto:${contact.email}`} className="transition hover:text-white">{contact.email}</a>
            </li>
            <li className="flex items-center">
              <span className="mr-2" aria-hidden="true">🐙</span>
              <a href={contact.github} target="_blank" rel="noopener noreferrer" className="transition hover:text-white">
                GitHub ({contact.githubLabel})
              </a>
            </li>
            <li className="flex items-center">
              <span className="mr-2" aria-hidden="true">💼</span>
              <a href={contact.portfolioUrl} target="_blank" rel="noopener noreferrer" className="transition hover:text-white">
                Portfolio Profile
              </a>
            </li>
            <li className="flex items-center">
              <span className="mr-2" aria-hidden="true">💬</span>
              <a href={`https://wa.me/${contact.whatsapp}`} target="_blank" rel="noopener noreferrer" className="transition hover:text-white">
                WhatsApp Direct
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-12 max-w-6xl border-t border-gray-800 px-4 pt-8 text-center text-xs text-gray-600 sm:px-6 lg:px-8">
        <p>© {year} {contact.name}. All rights reserved. | Built with Next.js &amp; Tailwind CSS.</p>
      </div>
    </footer>
  );
}
