export const POSTS = 'posts' as const;
export const DATA = 'data' as const;

export const PREV_URL = 'prev-url' as const;

// url
export const BASE_URL = 'kaji.blog' as const;

// slug
export const ROUTES = {
  ABOUT: 'about',
  PROJECT: 'project',
  BLOG: 'blog',
  NOTE: 'note',
  TAGS: 'tags',
} as const;

// elements class names
export const ELEMENTS = {
  POST_IMG: 'post-img',
} as const;

export const ISSUE_META = {
  THUMBNAIL: 'thumbnail',
  DESCRIPTION: 'description',
} as const;

export const IMG_CONTAINER = {
  THUMBNAIL: 'thumbnail',
  BODY: 'download-asset',
} as const;

export const FEATURED = 'featured' as const;

export const ASSET_MAP_PATH = 'src/data/assets-map.json' as const;
