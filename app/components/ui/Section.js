/**
 * Shared section shell: consistent horizontal padding + centered, width-capped
 * container. Keeps every section from repeating the same wrapper classes.
 */
export default function Section({ id, className = '', innerClassName = '', max = 'max-w-6xl', children }) {
  return (
    <section id={id} className={`px-4 py-16 sm:px-6 lg:px-8 ${className}`}>
      <div className={`mx-auto ${max} ${innerClassName}`}>{children}</div>
    </section>
  );
}
