import { BASE_URL } from '@/constants';
import type { SiteDataType, UserDataType } from '@/types';

const user = {
  name: {
    last: '加地',
    first: '良寅',
  },
  reading: {
    last: 'kaji',
    first: 'ryoin',
  },
  email: 'ryokesh.dev@gmail.com',
  githubId: 'RyOkEeeesh',
  affiliation: 'HAL東京',
} satisfies UserDataType;

export const SITE_DATA = {
  title: BASE_URL,
  heading: BASE_URL,
  user,
} satisfies SiteDataType;
