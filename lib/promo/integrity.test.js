import { describe, it, expect } from 'vitest';
import { isClean, findViolations, vetCopy, INTEGRITY_SYSTEM_RULES } from '@/lib/promo/integrity';

describe('integrity filter', () => {
  it('passes ethical, mentorship-framed copy', () => {
    expect(isClean('Learn it with a reference build + 1:1 mentorship so you can defend your viva.')).toBe(true);
  });

  it('does NOT false-positive on legit dev terms like "cheat sheet"', () => {
    expect(isClean('Grab this Python cheat sheet before your review.')).toBe(true);
    expect(isClean('A clean Spring Boot architecture you can actually explain.')).toBe(true);
  });

  it('flags "do your assignment for you"', () => {
    expect(isClean('We will do your assignment for you overnight.')).toBe(false);
  });

  it('flags "submit it as your own"', () => {
    expect(isClean('Just submit it as your own, no one will know.')).toBe(false);
  });

  it('flags guaranteed-marks and 100% claims', () => {
    expect(isClean('Guaranteed distinction in your final year!')).toBe(false);
    expect(isClean('Score 100% marks, guaranteed.')).toBe(false);
  });

  it('flags plagiarism-free and contract cheating framing', () => {
    expect(isClean('100% plagiarism-free, ready to submit.')).toBe(false);
    expect(isClean('The best contract cheating service in India.')).toBe(false);
  });

  it('vetCopy aggregates violations across fields', () => {
    const dirty = { hook: 'submit it as your own', caption: 'guaranteed pass', hashtags: ['#finalyearproject'] };
    const res = vetCopy(dirty);
    expect(res.clean).toBe(false);
    expect(res.violations.length).toBeGreaterThanOrEqual(2);
  });

  it('vetCopy passes clean copy', () => {
    const ok = { hook: 'Build it and defend it', caption: 'Source + mentorship', hashtags: ['#qiskit'] };
    expect(vetCopy(ok).clean).toBe(true);
  });

  it('exposes system rules for the prompt', () => {
    expect(INTEGRITY_SYSTEM_RULES).toMatch(/never/i);
    expect(INTEGRITY_SYSTEM_RULES).toMatch(/mentorship/i);
  });
});
