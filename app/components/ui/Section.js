import Reveal from './Reveal';

/**
 * Shared section shell: consistent horizontal padding + centered, width-capped
 * container. Pass `reveal` to fade the content in on scroll.
 */
export default function Section({ id, className = '', innerClassName = '', max = 'max-w-6xl', reveal = false, children }) {
  const inner = <div className={`mx-auto ${max} ${innerClassName}`}>{children}</div>;
  return (
    <section id={id} className={`px-4 py-16 sm:px-6 lg:px-8 ${className}`}>
      {reveal ? <Reveal>{inner}</Reveal> : inner}
    </section>
  );
}
