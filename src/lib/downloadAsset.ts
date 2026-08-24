import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { ASSET_MAP_PATH, IMG_CONTAINER } from '@/constants';
import type { PostType } from '@/types';
import { hasValue } from '@/utils';

type AssetMap = Record<string, string>;

const GITHUB_ASSET_REGEX =
  /https:\/\/github\.com\/(?:user-attachments\/assets|assets|[-a-zA-Z0-9_.]+\/[-a-zA-Z0-9_.]+\/assets)\/[-a-zA-Z0-9_.-]+/g;

const MIME_EXTENSION_MAP: Record<string, string> = {
  // 画像
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/gif': '.gif',
  'image/webp': '.webp',
  'image/svg+xml': '.svg',
  'image/avif': '.avif',
  // 動画
  'video/mp4': '.mp4',
  'video/quicktime': '.mov',
  'video/webm': '.webm',
  'video/ogg': '.ogv',
} as const;

const MAP_PATH = path.join(process.cwd(), ASSET_MAP_PATH);
const BODY_DOWNLOAD_CONCURRENCY = 5;

function getGithubToken(): string {
  const token = process.env.GITHUB_TOKEN || import.meta.env.GITHUB_TOKEN;
  if (!hasValue(token)) {
    throw new Error('環境変数 GITHUB_TOKEN が設定されていません');
  }
  return token;
}

async function downloadFile(url: string, dir: string, fileName: string, token: string): Promise<string> {
  let response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      'User-Agent': 'Astro-Build-Script',
    },
    redirect: 'manual',
  });

  // リダイレクト(301/302/307/308)が発生した場合は認証ヘッダーを外して再リクエスト
  if ([301, 302, 307, 308].includes(response.status)) {
    const redirectUrl = response.headers.get('location');
    if (!redirectUrl) {
      throw new Error(`リダイレクト先 URL が取得できませんでした: ${url}`);
    }
    response = await fetch(redirectUrl);
  }

  if (!response.ok) {
    throw new Error(`画像の取得に失敗しました (${response.status} ${response.statusText}): ${url}`);
  }

  const contentType = response.headers.get('content-type');
  if (!hasValue(contentType)) {
    throw new Error(`Content-Type ヘッダーがありません: ${url}`);
  }

  const mimeType = contentType.split(';')[0].trim().toLowerCase();
  const ext = MIME_EXTENSION_MAP[mimeType];
  if (!hasValue(ext)) {
    throw new Error(`未対応の MIME タイプです "${mimeType}": ${url}`);
  }

  const outputFilename = `${fileName}${ext}`;
  const dirPath = path.join(process.cwd(), dir);
  await fs.mkdir(dirPath, { recursive: true });

  console.log(`Downloading: ${url}`);
  const arrayBuffer = await response.arrayBuffer();
  await fs.writeFile(path.join(dirPath, outputFilename), Buffer.from(arrayBuffer));
  console.log(`Downloaded: ${outputFilename}`);

  return outputFilename;
}

function generateRandomFileName(prefix: string): string {
  return `${prefix}-${crypto.randomBytes(6).toString('hex')}`;
}

async function processThumbnail(
  thumbnailUrl: PostType['data']['thumbnail'],
  imagesMap: AssetMap,
  token: string,
): Promise<PostType['data']['thumbnail']> {
  if (!thumbnailUrl) return undefined;
  if (imagesMap[thumbnailUrl]) return imagesMap[thumbnailUrl];

  try {
    const fileName = generateRandomFileName('thumbnail');
    const downloadedFileName = await downloadFile(thumbnailUrl, `public/${IMG_CONTAINER.THUMBNAIL}`, fileName, token);
    const localPath = `/${IMG_CONTAINER.THUMBNAIL}/${downloadedFileName}`;
    imagesMap[thumbnailUrl] = localPath;
    return localPath;
  } catch (error) {
    console.error(`サムネイルのダウンロードに失敗しました: ${thumbnailUrl}`, error);
    return undefined;
  }
}

export async function processBody(
  body: PostType['body'],
  imagesMap: AssetMap,
  token: string,
): Promise<PostType['body']> {
  if (!body) return body;

  const urlList = [...new Set(body.match(GITHUB_ASSET_REGEX) || [])];
  if (urlList.length === 0) return body;

  const replacements: AssetMap = {};
  let index = 0;

  const workerCount = Math.min(BODY_DOWNLOAD_CONCURRENCY, urlList.length);
  const workers = Array.from({ length: workerCount }, async () => {
    while (index < urlList.length) {
      const url = urlList[index++];
      try {
        let localPath = imagesMap[url];

        if (!localPath) {
          const fileName = generateRandomFileName('asset');
          const downloadedFileName = await downloadFile(url, `public/${IMG_CONTAINER.BODY}`, fileName, token);
          localPath = `/${IMG_CONTAINER.BODY}/${downloadedFileName}`;
          imagesMap[url] = localPath;
        }

        replacements[url] = localPath;
      } catch (error) {
        console.error(`アセットファイルのダウンロードに失敗しました: ${url}`, error);
      }
    }
  });

  await Promise.all(workers);

  let updatedBody = body;
  for (const [url, localPath] of Object.entries(replacements)) {
    updatedBody = updatedBody.replaceAll(url, localPath);
  }

  return updatedBody;
}

async function loadAssetMap(): Promise<AssetMap> {
  try {
    return JSON.parse(await fs.readFile(MAP_PATH, 'utf-8'));
  } catch {
    return {};
  }
}

async function saveAssetMap(imagesMap: AssetMap): Promise<void> {
  const current = await loadAssetMap();
  const merged = { ...current, ...imagesMap };
  await fs.writeFile(MAP_PATH, JSON.stringify(merged, null, 2));
}

export async function downloadAsset(post: PostType): Promise<PostType> {
  const token = getGithubToken();
  const imagesMap = await loadAssetMap();

  const thumbnail = await processThumbnail(post.data.thumbnail, imagesMap, token);
  const body = await processBody(post.body, imagesMap, token);

  await saveAssetMap(imagesMap);

  return { ...post, data: { ...post.data, thumbnail }, body };
}
