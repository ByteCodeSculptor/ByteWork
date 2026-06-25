import { contact } from '@/config/site';

/** Sticky top nav. CTA is an anchor link (CSS smooth-scroll), so no client JS. */
export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-gray-100 bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          <a href="#top" className="flex flex-shrink-0 items-center">
            <span className="mr-3 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600 shadow-md transition-colors hover:bg-indigo-700">
              <span className="font-mono text-lg font-bold text-white" aria-hidden="true">{'</>'}</span>
            </span>
            <span className="text-xl font-bold tracking-tight text-gray-900">
              {contact.brand.name}
              <span className="text-indigo-600">{contact.brand.suffix}</span>
            </span>
          </a>

          <div className="hidden items-center space-x-8 md:flex">
            <a
              href="#pricing"
              className="rounded-full bg-indigo-50 px-4 py-2 text-sm font-bold text-indigo-700 transition hover:bg-indigo-100"
            >
              Get Quote
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
