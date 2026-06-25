import { describe, it, expect } from 'vitest';
import { graphBase, releaseAssetUrl, buildContainerParams, isTerminalStatus } from '@/lib/promo/instagram.mjs';

describe('graphBase', () => {
  it('builds the versioned graph URL', () => expect(graphBase('v21.0')).toBe('https://graph.facebook.com/v21.0'));
});

describe('releaseAssetUrl', () => {
  it('builds a public release asset URL', () =>
    expect(releaseAssetUrl('owner/repo', 'tag1', 'out.mp4')).toBe(
      'https://github.com/owner/repo/releases/download/tag1/out.mp4'
    ));
});

describe('buildContainerParams', () => {
  it('sets REELS media_type with the video url + token', () => {
    const p = buildContainerParams({ videoUrl: 'https://x/y.mp4', caption: 'hi', accessToken: 'T' });
    expect(p).toMatchObject({ media_type: 'REELS', video_url: 'https://x/y.mp4', caption: 'hi', access_token: 'T' });
  });
  it('truncates caption to the 2200-char limit', () => {
    expect(buildContainerParams({ videoUrl: 'u', caption: 'x'.repeat(3000), accessToken: 'T' }).caption.length).toBe(2200);
  });
});

describe('isTerminalStatus', () => {
  it('FINISHED/ERROR/EXPIRED are terminal; IN_PROGRESS is not', () => {
    expect(isTerminalStatus('FINISHED')).toBe(true);
    expect(isTerminalStatus('ERROR')).toBe(true);
    expect(isTerminalStatus('EXPIRED')).toBe(true);
    expect(isTerminalStatus('IN_PROGRESS')).toBe(false);
  });
});
