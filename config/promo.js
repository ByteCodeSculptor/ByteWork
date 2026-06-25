import { services } from '@/config/site';

/**
 * Promo-agent configuration. Each entry is keyed by a service `id` from
 * config/site.js (the single source of truth for names/tech/prices), and adds
 * the promo-specific fields the automation needs. Static `hooks`/`hashtags`
 * double as the safe fallback copy when the AI output is rejected by the
 * integrity filter.
 */

function freeze(value) {
  if (value && typeof value === 'object') {
    Object.values(value).forEach(freeze);
    return Object.freeze(value);
  }
  return value;
}

export const promoSettings = freeze({
  // Slots below are interpreted in this timezone (IST = UTC+5:30).
  tzOffsetMinutes: 330,
  windowHours: 6, // 4 niches × 6h = 24h
  cadenceHours: 6, // informational; the external pinger sets the real cadence
  // Style appended to every image prompt. Note: ask for NO rendered text — the
  // hook/caption live in the Telegram message, not burned into the image.
  imageStyle:
    'vertical 9:16 poster, indigo (#4338ca) and white palette, modern clean tech aesthetic, ' +
    'subtle circuit/code motifs, high contrast, empty space at top for a title, no text, no words, no letters',
  geminiModel: 'gemini-2.5-flash',
});

export const promos = freeze([
  {
    id: 'python', // 00:00 IST
    slot: 0,
    commentKeyword: 'DATASCIENCE',
    hooks: [
      'POV: your ML model is stuck at 40% accuracy and the review is tomorrow.',
      '3 Python + AI final-year ideas you can actually explain in your viva.',
      'The data-cleaning step 90% of students skip (and lose marks for).',
    ],
    hashtags: ['#finalyearproject', '#datascience', '#machinelearning', '#engineeringstudentsindia', '#pythonprojects'],
    imageSubject: 'data science and AI final-year project theme, neural network nodes, charts and python motifs',
    waMessage:
      'Hi! I saw your ByteWork post on Python & AI projects. I want the reference build + source code + 1:1 mentorship so I can learn it and defend my final-year project.',
  },
  {
    id: 'mern', // 06:00 IST
    slot: 6,
    commentKeyword: 'MERN',
    hooks: [
      'POV: submission is in 2 days and your MERN app still won’t connect to MongoDB.',
      'A full-stack MERN project structure that survives a viva, in 30 seconds.',
      'Your guide asked "where is auth?" — here is the fix.',
    ],
    hashtags: ['#finalyearproject', '#mernstack', '#webdevelopment', '#engineeringstudentsindia', '#reactjs'],
    imageSubject: 'MERN stack web development project theme, MongoDB Express React Node icons, dashboard UI',
    waMessage:
      'Hi! I saw your ByteWork post on MERN stack projects. I want the reference build + source code + 1:1 mentorship to learn and defend my final-year project.',
  },
  {
    id: 'java', // 12:00 IST
    slot: 12,
    commentKeyword: 'SPRING',
    hooks: [
      'POV: your guide rejected your Spring Boot architecture diagram. Again.',
      'Microservices vs monolith for your final-year project — pick right in 30s.',
      'The Spring Boot layering most students get wrong before viva.',
    ],
    hashtags: ['#finalyearproject', '#springboot', '#java', '#engineeringstudentsindia', '#microservices'],
    imageSubject: 'Java Spring Boot enterprise architecture theme, microservices boxes and arrows, coffee cup motif',
    waMessage:
      'Hi! I saw your ByteWork post on Java/Spring Boot architecture. I want the reference build + source code + 1:1 mentorship to learn and defend my final-year project.',
  },
  {
    id: 'quantum', // 18:00 IST (peak slot)
    slot: 18,
    commentKeyword: 'QISKIT',
    hooks: [
      'Quantum project due and Qiskit makes zero sense? Watch this.',
      '…and that’s why your Bell-state circuit returns garbage.',
      'A Qiskit final-year project you can build and actually explain.',
    ],
    hashtags: ['#finalyearproject', '#quantumcomputing', '#qiskit', '#engineeringstudentsindia', '#python'],
    imageSubject: 'quantum computing project theme, qubit bloch sphere, circuit diagram, abstract entanglement',
    waMessage:
      'Hi! I saw your ByteWork post on Quantum Computing (Qiskit). I want the reference build + source code + 1:1 mentorship to learn and defend my final-year project.',
  },
]);

/** Convenience: merge a promo entry with its service record from config/site.js. */
export function promoWithService(id) {
  const promo = promos.find((p) => p.id === id);
  const service = services.find((s) => s.id === id);
  return promo && service ? { promo, service } : null;
}
