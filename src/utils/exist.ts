type Maybe<T> = T | null | undefined;

export const hasValue = <T>(value: Maybe<T>): value is T => {
  if (value === null || value === undefined) return false;

  if (typeof value === 'number') {
    return !Number.isNaN(value);
  }

  if (typeof value === 'string') {
    return value.trim().length > 0;
  }

  if (Array.isArray(value)) {
    return value.length > 0;
  }

  if (typeof value === 'object') {
    return Object.keys(value).length > 0;
  }

  return true;
};

export const isHttpUrl = (value: string): boolean => {
  if (!value?.trim()) return false;

  try {
    const parsed = new URL(value);
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch {
    return false;
  }
};

export const checkUrlExists = async (url: string): Promise<boolean> => {
  if (!isHttpUrl(url)) {
    return false;
  }

  try {
    const response = await fetch(url, {
      method: 'HEAD',
      mode: 'cors',
    });

    if (response.ok) {
      return true;
    }

    const fallback = await fetch(url, {
      method: 'GET',
      mode: 'cors',
    });

    return fallback.ok;
  } catch {
    return false;
  }
};

export const checkImageExists = async (src: Maybe<string>): Promise<boolean> => {
  if (!hasValue(src)) {
    return false;
  }

  const imageUrl = src.trim();

  if (imageUrl.startsWith('//') || (!imageUrl.startsWith('/') && !isHttpUrl(imageUrl))) {
    return false;
  }

  try {
    const response = await fetch(imageUrl, {
      method: 'GET',
      mode: 'cors',
    });

    if (!response.ok) {
      return false;
    }

    const contentType = response.headers.get('content-type') ?? '';
    const fileExtension = /\.(png|jpe?g|gif|webp|avif|svg|bmp)$/i;

    return contentType.startsWith('image/') || fileExtension.test(imageUrl);
  } catch {
    return false;
  }
};

export const checkResourceExists = async (value: unknown): Promise<boolean> => {
  if (value === null || value === undefined) {
    return false;
  }

  if (typeof value === 'string') {
    const trimmed = value.trim();

    if (!trimmed) {
      return false;
    }

    if (isHttpUrl(trimmed)) {
      return checkUrlExists(trimmed);
    }

    return true;
  }

  if (Array.isArray(value)) {
    if (value.length === 0) {
      return false;
    }

    const results = await Promise.all(value.map(item => checkResourceExists(item)));
    return results.every(Boolean);
  }

  if (typeof value === 'object') {
    if ('src' in value && typeof value.src === 'string') {
      return checkResourceExists(value.src);
    }

    if ('url' in value && typeof value.url === 'string') {
      return checkResourceExists(value.url);
    }

    return Object.keys(value).length > 0;
  }

  return true;
};

export default {
  hasValue,
  isHttpUrl,
  checkUrlExists,
  checkImageExists,
  checkResourceExists,
};
