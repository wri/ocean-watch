// utils
import { logger } from 'utils/logs';
import { WRIAPI } from 'utils/axios';

import type { User } from 'types/user';


/**
 * Register a new user based on the email + password combination
 * Check out the API docs for this endpoint {@link https://resource-watch.github.io/doc-api/index-rw.html#registration|here}
 * @param {Object} options
 * @returns {Object}
 */
export const registerUser = ({ email }) => {
  logger.info('Register user');
  return WRIAPI.post('auth/sign-up', {
    email,
    apps: [process.env.NEXT_PUBLIC_APPLICATIONS],
  })
    .then((response) => response.data)
    .catch(({ response }) => {
      const { status, statusText } = response;
      logger.error(`Error registering user: ${status}: ${statusText}`);
      throw new Error(`Error registering user: ${status}: ${statusText}`);
    });
};

export const fetchUser = (userToken): Promise<User> =>
  WRIAPI.get('/auth/user/me', {
    headers: {
      Authorization: userToken,
    },
  })
    .then((res) => res.data)
    .catch(() => {
      throw Error('unable to fetch user');
    });
