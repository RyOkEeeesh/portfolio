import type { RouteType } from '@/types/route';

export type PageData = {
  title: string;
  heading?: string;
}

export type UserData = {
  name: string;
  email: string;
  github: string;
};

export type SiteData = {
  routes: Record<RouteType, PageData>;
  user: UserData
} & PageData;
