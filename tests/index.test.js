import { parseYoutubeId } from '../jobs/webcast.js';
import { DEFAULT_PORT, HEALTHCHECK_PREFIX } from '../lib/constants.js';
import transformQuery from '../routes/launches/v4/_transform-query.js';
import { fail, start, success } from '../lib/healthchecks/index.js';

describe('Sanity & Configuration Tests', () => {
  it('should expect true to be true', () => {
    expect(true).toBe(true);
  });

  it('should have valid default constants', () => {
    expect(DEFAULT_PORT).toBe(6673);
    expect(HEALTHCHECK_PREFIX).toBe('https://hc-ping.com');
  });
});

describe('Webcast YouTube ID Parser', () => {
  it('should extract ID from standard watch URL', () => {
    expect(parseYoutubeId('https://www.youtube.com/watch?v=21X5lGlDOfg')).toBe('21X5lGlDOfg');
  });

  it('should extract ID from watch URL with additional query parameters', () => {
    const url = 'https://www.youtube.com/watch?v=21X5lGlDOfg&feature=channel';
    expect(parseYoutubeId(url)).toBe('21X5lGlDOfg');
  });

  it('should extract ID from short youtu.be URL', () => {
    expect(parseYoutubeId('https://youtu.be/21X5lGlDOfg')).toBe('21X5lGlDOfg');
  });

  it('should extract ID from short youtu.be URL with timestamp', () => {
    expect(parseYoutubeId('https://youtu.be/21X5lGlDOfg?t=42')).toBe('21X5lGlDOfg');
  });

  it('should extract ID from embed URL', () => {
    expect(parseYoutubeId('https://www.youtube.com/embed/21X5lGlDOfg')).toBe('21X5lGlDOfg');
  });

  it('should return null for invalid or empty URLs', () => {
    expect(parseYoutubeId('')).toBeNull();
    expect(parseYoutubeId(null)).toBeNull();
    expect(parseYoutubeId(undefined)).toBeNull();
    expect(parseYoutubeId('https://google.com')).toBeNull();
  });
});

describe('Healthcheck utility guards', () => {
  it('should return false if id is null or not provided', async () => {
    expect(await start()).toBe(false);
    expect(await success()).toBe(false);
    expect(await fail()).toBe(false);
  });
});

describe('Transform Query Helper', () => {
  it('should pass-through standard query without populate', async () => {
    const input = { query: { upcoming: true } };
    const result = await transformQuery(input);
    expect(result).toEqual({ query: { upcoming: true } });
  });

  it('should rewrite crew to crew.crew in populate path string', async () => {
    const input = { options: { populate: 'crew' } };
    const result = await transformQuery(input);
    expect(result.options.populate).toBe('crew.crew');
  });

  it('should rewrite crew in populate object path', async () => {
    const input = { options: { populate: { path: 'crew' } } };
    const result = await transformQuery(input);
    expect(result.options.populate.path).toBe('crew.crew');
  });

  it('should rewrite crew in populate array of objects', async () => {
    const input = { options: { populate: [{ path: 'crew' }, { path: 'payloads' }] } };
    const result = await transformQuery(input);
    expect(result.options.populate[0].path).toBe('crew.crew');
    expect(result.options.populate[1].path).toBe('payloads');
  });
});
