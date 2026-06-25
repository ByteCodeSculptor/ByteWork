/**
 * Academic-integrity guardrail for AI-generated promo copy.
 *
 * Two layers of defense:
 *  1. INTEGRITY_SYSTEM_RULES — injected into the LLM system prompt.
 *  2. findViolations()/isClean() — a post-generation banned-phrase filter that
 *     rejects copy implying contract cheating, so nothing scammy ships even if
 *     the model drifts. On violation, callers fall back to vetted static copy.
 */

export const INTEGRITY_SYSTEM_RULES = `
You write ethical, high-converting social copy for ByteWork (V-Tech.Solutions), a freelance dev
consultancy that helps final-year engineering students LEARN and BUILD their own projects.

POSITION THE OFFER AS: a reference implementation + clean source code + 1:1 mentorship + viva/defense
preparation, so the STUDENT understands the work and can defend it as their own effort.

HARD RULES (never break):
- NEVER imply we complete assignments that a student submits as their own work.
- NEVER use or imply: "do your assignment/homework/project for you", "submit it as your own",
  "pass it off as yours", "guaranteed marks/grades/pass/distinction", "100% marks", "plagiarism-free",
  "contract cheating", or cheating on exams/vivas.
- No fake scarcity, no false guarantees, no promises about grades or exam outcomes.

TONE: punchy, relatable to deadline stress, Hinglish allowed — but always steer toward learning + mentorship.
`.trim();

// Case-insensitive patterns that indicate contract-cheating / scammy framing.
// Deliberately context-scoped to avoid false positives on legit dev terms
// (e.g. "Python cheat sheet" must NOT trip the filter).
const BANNED_PATTERNS = [
  /\b(do|doing|complete|completing|write|writing|build|building|make|making)\s+(your|the)\s+(assignment|homework|project|thesis|report|dissertation)\s+for\s+you\b/i,
  /\bsubmit\s+(it|this|them)?\s*as\s+your\s+own\b/i,
  /\bpass(ing)?\s+(it|this|them)\s+off\s+as\s+your(s|\s+own)\b/i,
  /\bturn\s+it\s+in\s+as\s+your\s+own\b/i,
  /\bguarantee(d|s)?\s+(you\s+)?(\w+\s+){0,2}(marks|grades?|pass(ing)?|distinction|results?)\b/i,
  /\b100\s*%\s*(marks|pass|grade|results?)\b/i,
  /\bplagiaris(m|e|ed|ing)?(\s*-?\s*free)?\b/i,
  /\bcontract\s+cheating\b/i,
  /\bcheat(ing)?\s+(on|in)\s+(your|the)\s+(exam|viva|assignment|test)\b/i,
];

/** Return the list of banned patterns that match anywhere in `text`. */
export function findViolations(text) {
  if (!text) return [];
  const str = String(text);
  return BANNED_PATTERNS.filter((re) => re.test(str)).map((re) => re.source);
}

/** True when `text` contains no banned phrasing. */
export function isClean(text) {
  return findViolations(text).length === 0;
}

/**
 * Validate every string field of a generated copy object.
 * @returns {{clean: boolean, violations: string[]}}
 */
export function vetCopy(copy) {
  const parts = [copy?.hook, copy?.caption, ...(Array.isArray(copy?.hashtags) ? copy.hashtags : [])];
  const violations = parts.flatMap((p) => findViolations(p));
  return { clean: violations.length === 0, violations: [...new Set(violations)] };
}
