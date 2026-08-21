import type { UserInfo } from '@/types';

export type UserDataType = {
  name: UserInfo;
  reading: UserInfo;
  email: string;
  githubId: string;
  affiliation: string,
};

export type SiteDataType = {
  title: string;
  heading?: string;
  user: UserDataType;
};
