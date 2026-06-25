'use client';

import { useInView } from '@/lib/hooks/useInView';

/** Wraps content in a scroll-triggered fade-up reveal (motion-safe via CSS). */
export default function Reveal({ children, className = '' }) {
  const [ref, inView] = useInView();
  return (
    <div ref={ref} className={`reveal ${className}`} data-visible={inView ? 'true' : undefined}>
      {children}
    </div>
  );
}
