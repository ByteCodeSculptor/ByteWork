import { hero } from '@/config/site';

/** Landing hero. Copy + CTAs come from config; CTAs are anchor links so this
 *  stays a server component and relies on CSS smooth-scroll. */
export default function Hero() {
  return (
    <section className="bg-gradient-to-r from-indigo-900 to-indigo-700 px-4 py-24 text-center text-white">
      <h1 className="mb-6 text-4xl font-extrabold tracking-tight md:text-6xl">{hero.title}</h1>
      <p className="mx-auto mb-8 max-w-3xl text-xl text-indigo-100 md:text-2xl">{hero.subtitle}</p>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <a
          href={hero.primaryCta.href}
          className="rounded-full bg-white px-8 py-3 font-bold text-indigo-900 shadow-lg transition hover:bg-indigo-50"
        >
          {hero.primaryCta.label}
        </a>
        <a
          href={hero.secondaryCta.href}
          className="rounded-full border border-white/60 px-8 py-3 font-bold text-white transition hover:bg-white/10"
        >
          {hero.secondaryCta.label}
        </a>
      </div>
    </section>
  );
}
