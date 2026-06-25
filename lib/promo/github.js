const GITHUB_API = 'https://api.github.com';

/** Body for a repository_dispatch that triggers the promo-render workflow. */
export function buildDispatchBody(payload) {
  return { event_type: 'promo-render', client_payload: payload };
}

/**
 * Trigger the GitHub Actions video render via repository_dispatch.
 * `repo` is "owner/name"; `token` is a fine-grained PAT with Contents: write.
 * Returns true on success (GitHub responds 204 No Content).
 */
export async function dispatchRender({ token, repo, payload, timeoutMs = 15000 }) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(`${GITHUB_API}/repos/${repo}/dispatches`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
        'Content-Type': 'application/json',
      },
      signal: controller.signal,
      body: JSON.stringify(buildDispatchBody(payload)),
    });
    if (!res.ok) throw new Error(`GitHub dispatch ${res.status}: ${await res.text()}`);
    return true;
  } finally {
    clearTimeout(timer);
  }
}
