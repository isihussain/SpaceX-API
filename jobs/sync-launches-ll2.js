/* eslint-disable no-continue */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
import got from 'got';
import moment from 'moment-timezone';
import logger from '../middleware/logger.js';
import { fail, success } from '../lib/healthchecks/index.js';

const {
  SPACEX_KEY,
  LL2_SYNC_HEALTHCHECK,
  SPACEX_API: API,
} = process.env;

const LL2_BASE_URL = 'https://ll.thespacedevs.com/2.2.0/launch/';
const USER_AGENT = 'SpaceX-API-Community/4.0.0 (https://github.com/isihussain/SpaceX-API)';

/**
 * Sync recent SpaceX flight manifests and Starship tests from Launch Library 2
 * @return {Promise<void>}
 */
export default async () => {
  try {
    const log = {
      name: 'sync-launches-ll2',
      syncedCount: 0,
      updated: false,
    };

    const response = await got(LL2_BASE_URL, {
      headers: {
        'User-Agent': USER_AGENT,
      },
      searchParams: {
        lsp__name: 'SpaceX',
        ordering: '-net',
        limit: 25,
        format: 'json',
      },
      responseType: 'json',
      throwHttpErrors: false,
    });

    if (response.statusCode === 200 && response.body?.results?.length) {
      for (const launch of response.body.results) {
        if (!launch?.id || !launch?.name || !launch?.net) {
          continue;
        }

        const dateUtc = launch.net;
        const dateUnix = moment(dateUtc).unix();
        const webcastUrl = launch.vidURLs?.[0]?.url ?? null;
        const successStatus = launch.status?.id === 3;

        // Check if launch already exists by launch_library_id
        const existing = await got.post(`${API}/launches/query`, {
          json: {
            query: {
              launch_library_id: launch.id,
            },
            options: {
              limit: 1,
            },
          },
          resolveBodyOnly: true,
          responseType: 'json',
          throwHttpErrors: false,
        });

        if (existing?.docs?.length) {
          const doc = existing.docs[0];
          await got.patch(`${API}/launches/${doc.id}`, {
            json: {
              name: launch.name,
              date_utc: dateUtc,
              date_unix: dateUnix,
              success: successStatus,
              details: launch.mission?.description ?? doc.details,
              ...(webcastUrl ? { 'links.webcast': webcastUrl } : {}),
            },
            headers: {
              'spacex-key': SPACEX_KEY,
            },
          });
          log.syncedCount += 1;
        }
      }
      log.updated = log.syncedCount > 0;
    }

    await success(LL2_SYNC_HEALTHCHECK, log);
    logger.info(log);
  } catch (error) {
    const formatted = {
      name: 'sync-launches-ll2',
      error: error.message,
      stack: error.stack,
    };
    await fail(LL2_SYNC_HEALTHCHECK, formatted);
    logger.error(formatted);
  }
};
