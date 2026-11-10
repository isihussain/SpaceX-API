import got from 'got';
import * as fuzz from 'fuzzball';
import Parser from 'rss-parser';
import { fail, success } from '../lib/healthchecks/index.js';
import { logger } from '../middleware/index.js';

const YOUTUBE_PREFIX = 'https://youtu.be';
const CHANNEL_ID = 'UCtI0Hodo5o5dUb67FeUjDeA';
const {
  SPACEX_KEY,
  WEBCAST_HEALTHCHECK,
  SPACEX_API: API,
} = process.env;

/**
 * Extract 11-character YouTube video ID from various URL formats
 *
 * @param {string} url - YouTube URL
 * @returns {string|null} 11-char YouTube ID or null
 */
export const parseYoutubeId = (url) => {
  if (!url || typeof url !== 'string') return null;
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  return match ? match[1] : null;
};

/**
 * Check for new SpaceX webcast links
 * @return {Promise<void>}
 */
export default async () => {
  try {
    let updated = false;
    let match = false;
    const parser = new Parser();
    const url = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;
    const rssResult = await got(url, {
      resolveBodyOnly: true,
    });
    const result = await parser.parseString(rssResult);
    if (!result?.items?.length) {
      logger.info({ name: 'webcast', message: 'No items in YouTube RSS feed' });
      return;
    }
    const latest = result.items[0];
    const rssTitle = latest.title;
    const rssYoutubeId = parseYoutubeId(latest.link);

    if (!rssYoutubeId) {
      logger.warn({ name: 'webcast', message: `Could not parse YouTube ID from link: ${latest.link}` });
      return;
    }

    const launches = await got.post(`${API}/launches/query`, {
      json: {
        query: {
          upcoming: true,
        },
        options: {
          sort: {
            flight_number: 'asc',
          },
          limit: 1,
        },
      },
      resolveBodyOnly: true,
      responseType: 'json',
    });

    if (!launches?.docs?.length) {
      logger.info({ name: 'webcast', message: 'No upcoming launches found to update' });
      return;
    }

    const launchId = launches.docs[0].id;
    const missionName = launches.docs[0].name;

    const ratio = fuzz.ratio(rssTitle, missionName);
    // Prevent matching on mission control audio videos
    if (!rssTitle.includes('audio') && ratio >= 50) {
      match = true;
      const pastLaunches = await got.post(`${API}/launches/query`, {
        json: {
          query: {
            upcoming: false,
          },
          options: {
            sort: {
              flight_number: 'desc',
            },
            limit: 1,
          },
        },
        resolveBodyOnly: true,
        responseType: 'json',
      });
      const pastYoutubeId = pastLaunches?.docs?.[0]?.links?.youtube_id;
      if (rssYoutubeId !== pastYoutubeId) {
        await got.patch(`${API}/launches/${launchId}`, {
          json: {
            'links.webcast': `${YOUTUBE_PREFIX}/${rssYoutubeId}`,
            'links.youtube_id': rssYoutubeId,
          },
          headers: {
            'spacex-key': SPACEX_KEY,
          },
        });
        updated = true;
      }
    }
    const log = {
      name: 'webcast',
      ratio,
      match,
      updated,
      youtubeTitle: rssTitle,
      youtubeId: rssYoutubeId,
    };
    await success(WEBCAST_HEALTHCHECK, log);
    logger.info(log);
  } catch (error) {
    const formatted = {
      name: 'webcast',
      error: error.message,
      stack: error.stack,
    };
    await fail(WEBCAST_HEALTHCHECK, formatted);
    logger.error(formatted);
  }
};