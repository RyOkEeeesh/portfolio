import fs from 'node:fs/promises';
import path from 'node:path';
import { IMG_CONTAINER } from '@/constants';
import type { PostType } from '@/types';

type imgMapType = Record<string, string>;

// Content-Type と拡張子のマッピング
const MIME_EXTENSION_MAP: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/gif': '.gif',
  'image/webp': '.webp',
  'image/svg+xml': '.svg',
  'image/avif': '.avif',
};

async function downloadImage(url: string, dir: string, fileName: string) {
  const token = process.env.GITHUB_TOKEN;

  const response = await fetch(url, {
    headers: {
      Authorization: `token ${token}`,
      'User-Agent': 'Astro-Build-Script',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch image: ${response.statusText}`);
  }

  // 1. レスポンスヘッダーから MIME タイプを取得して拡張子を判定
  const contentType = response.headers.get('content-type') || '';
  // 例: "image/jpeg; charset=utf-8" から "image/jpeg" の部分だけを取り出す
  const mimeType = contentType.split(';')[0].trim().toLowerCase();

  // マッピングになければデフォルトで .png か URLの末尾などから推測
  const ext = MIME_EXTENSION_MAP[mimeType] || '.png';

  // // 2. 拡張子を含めたユニークなファイル名を生成
  // const hash = Math.random().toString(36).slice(2, 7);
  const outputFilename = `${fileName}${ext}`;

  // 3. ディレクトリの存在確認（なければ作成）
  const dirPath = path.join(process.cwd(), dir);
  await fs.mkdir(dirPath, { recursive: true });

  // 4. バイナリデータを保存
  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const outputPath = path.join(dirPath, outputFilename);
  await fs.writeFile(outputPath, buffer);

  return outputFilename;
}

async function processThumbnail(
  thumbnailUrl: PostType['data']['thumbnail'],
  imagesMap: imgMapType,
): Promise<PostType['data']['thumbnail']> {
  if (!thumbnailUrl) return undefined;
  if (imagesMap[thumbnailUrl]) return imagesMap[thumbnailUrl];

  try {
    const fileName = `thumbnail-${Math.random().toString(36).slice(2, 12)}`;
    console.log(`Downloading thumbnail: ${thumbnailUrl}`);
    const downloadFileName = await downloadImage(thumbnailUrl, `public/${IMG_CONTAINER.THUMBNAIL}`, fileName);
    const downloadImagePath = `/${IMG_CONTAINER.THUMBNAIL}/${downloadFileName}`;
    console.log(`Thumbnail downloaded: ${downloadImagePath}`);
    imagesMap[thumbnailUrl] = downloadImagePath;
    return downloadImagePath;
  } catch (error) {
    console.error(`Failed to download thumbnail: ${thumbnailUrl}`, error);
    return undefined;
  }
}

export async function processPostImgDownload(post: PostType) {
  const mapPath = path.join(process.cwd(), 'src/data/images-map.json');
  const imagesMap: imgMapType = await (async () => {
    try {
      return JSON.parse(await fs.readFile(mapPath, 'utf-8'));
    } catch (_e) {
      return {};
    }
  })();

  // サムネイル
  const _thumbnail: PostType['data']['thumbnail'] = await processThumbnail(post.data.thumbnail, imagesMap);

  await fs.writeFile(mapPath, JSON.stringify(imagesMap, null, 2));
}
