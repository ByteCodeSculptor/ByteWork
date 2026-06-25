/**
 * Single source of truth for all V-Tech business data.
 *
 * Every component, the pricing engine, the WhatsApp facade, and the SEO/JSON-LD
 * layer read from here — nothing below should hardcode a price, a service, or a
 * contact detail. The frozen exports act as shared, immutable descriptors
 * (one object per service, reused by reference everywhere they're rendered).
 */

function deepFreeze(value) {
  if (value && typeof value === 'object') {
    Object.values(value).forEach(deepFreeze);
    return Object.freeze(value);
  }
  return value;
}

export const currency = deepFreeze({ code: 'INR', symbol: '₹' });

export const contact = deepFreeze({
  name: 'Vishnu Vardhan',
  role: 'Freelance Application Architect & Consultant',
  brand: { name: 'V-Tech', suffix: '.Solutions' },
  whatsapp: '919182407243',
  email: 'ramki3244@gmail.com',
  github: 'https://github.com/ByteCodeSculptor',
  githubLabel: 'ByteCodeSculptor',
  portfolioUrl: 'https://my-portfolio-git-main-bytecodesculptors-projects.vercel.app/',
});

export const hero = deepFreeze({
  title: 'Consultancy & Portfolio',
  subtitle: 'Application Architecture for Quantum, MERN, and Java Projects.',
  primaryCta: { label: 'View Services', href: '#services' },
  secondaryCta: { label: 'Get a Quote', href: '#pricing' },
});

/**
 * The four service offerings. `theme` is a semantic key mapped to Tailwind
 * classes in ServiceCard (kept as literal class strings there so the v4
 * scanner can see them). `basePrice` is in INR.
 */
export const services = deepFreeze([
  {
    id: 'quantum',
    name: 'Quantum Computing',
    shortName: 'Quantum Computing (Qiskit)',
    tech: 'Qiskit, Python',
    description:
      'Implementation of algorithms using Qiskit, simulation projects, and theoretical basics.',
    icon: '⚛️',
    theme: 'purple',
    basePrice: 10000,
  },
  {
    id: 'mern',
    name: 'MERN Stack Development',
    shortName: 'MERN Stack Development',
    tech: 'MongoDB, Express, React, Node',
    description:
      'Full-stack modern web applications. Includes handling environment variables and database connections.',
    icon: '🌐',
    theme: 'blue',
    basePrice: 12000,
  },
  {
    id: 'java',
    name: 'Java Architecture',
    shortName: 'Java Architecture (Spring)',
    tech: 'Spring Boot, Microservices',
    description:
      'Enterprise-grade design patterns, API development, and robust backend structures.',
    icon: '☕',
    theme: 'red',
    basePrice: 12000,
  },
  {
    id: 'python',
    name: 'Python & AI',
    shortName: 'Python & AI Automation',
    tech: 'Django, Flask, Pandas',
    description:
      'Data analysis, automation scripts, and web backends optimized for research.',
    icon: '🐍',
    theme: 'green',
    basePrice: 9000,
  },
]);

/**
 * Deadline urgency tiers, ordered tightest-first. The pricing engine picks the
 * first tier whose `maxDays` the remaining days fall within (<=).
 */
export const pricingTiers = deepFreeze([
  { id: 'super-rush', label: 'Super Rush', maxDays: 3, multiplier: 1.4, surchargeLabel: '+40%' },
  { id: 'express', label: 'Express', maxDays: 6, multiplier: 1.2, surchargeLabel: '+20%' },
  { id: 'standard', label: 'Standard', maxDays: Infinity, multiplier: 1.0, surchargeLabel: '' },
]);

/**
 * Selectable extras in the pricing wizard.
 * - type 'quantity' → numeric input, line total = price * quantity
 * - type 'toggle'   → on/off; `price` may be null for "on request" items
 */
export const addOns = deepFreeze([
  {
    id: 'extra-docs',
    label: 'Extended Documentation',
    description: 'Pages beyond the included 20.',
    price: 30,
    unit: 'page',
    type: 'quantity',
  },
  {
    id: 'extra-mentorship',
    label: 'Extra Mentorship Session',
    description: 'Sessions beyond the standard 3.',
    price: 500,
    unit: 'session',
    type: 'quantity',
  },
  {
    id: 'remote-install',
    label: 'Remote Installation (AnyDesk)',
    description: 'Guided environment setup.',
    price: 500,
    unit: 'from',
    type: 'toggle',
  },
  {
    id: 'research-paper',
    label: 'Research Paper (IEEE/Springer)',
    description: 'Premium add-on, quoted on request.',
    price: null,
    unit: 'on request',
    type: 'toggle',
  },
]);

/** Static scope copy for the Deliverables section. */
export const deliverables = deepFreeze({
  included: [
    { title: 'Full Source Code', detail: 'Direct access via GitHub repository link.' },
    { title: 'Mentorship Sessions', detail: '3 sessions × 30 mins (90 mins total) to explain the code.' },
    { title: 'Project Documentation', detail: 'Free up to 20 pages (abstract, diagrams, conclusion).' },
    { title: 'Quick Start Guide', detail: 'PDF manual on how to run the project locally.' },
  ],
  limits: [
    { icon: '→', title: 'Extended Documentation', detail: 'Content beyond 20 pages is charged at ₹30 per page.' },
    { icon: '★', title: 'Research Paper (IEEE/Springer)', detail: 'Available as a premium add-on, on demand.' },
    { icon: '!', title: 'Extra Mentorship', detail: 'Sessions beyond the standard 3 are ₹500 each.' },
    { icon: '🛠', title: 'Remote Installation', detail: 'AnyDesk setup support, a separate service from ₹500.' },
  ],
});

export const seo = deepFreeze({
  title: 'V-Tech.Solutions — Freelance App Architecture (Quantum, MERN, Java, Python)',
  description:
    'Freelance application architecture and final-year project development across Quantum Computing (Qiskit), the MERN stack, Java/Spring Boot, and Python/AI — with source code, mentorship, and documentation included.',
  url: contact.portfolioUrl,
  keywords: [
    'freelance developer',
    'final year project',
    'Quantum Computing Qiskit',
    'MERN stack development',
    'Spring Boot architecture',
    'Python AI automation',
    'project mentorship',
  ],
});
