import fs from 'node:fs/promises';
import path from 'node:path';
import { ASSET_MAP_PATH, IMG_CONTAINER } from '@/constants';

// JSONマップファイルのパス
const MAP_PATH = path.join(process.cwd(), ASSET_MAP_PATH);

// 残したいファイル・ディレクトリの相対パス指定 (標準化して判定用に使用)
const PRESERVED_PATH = path.normalize('public/thumbnail/index.png');

/**
 * ディレクトリ内のファイルを再帰的に削除（指定された例外を除く）
 */
async function cleanDirectory(dirPath: string): Promise<void> {
  try {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);
      const relativePath = path.normalize(path.relative(process.cwd(), fullPath));

      // 残すファイルと完全一致する場合はスキップ
      if (relativePath === PRESERVED_PATH) {
        console.log(`[Keep] ${relativePath}`);
        continue;
      }

      if (entry.isDirectory()) {
        await cleanDirectory(fullPath);
        // ディレクトリが空になった場合はディレクトリ自体も削除
        const remaining = await fs.readdir(fullPath);
        if (remaining.length === 0) {
          await fs.rmdir(fullPath);
          console.log(`[Removed Dir] ${relativePath}`);
        }
      } else {
        await fs.unlink(fullPath);
        console.log(`[Deleted File] ${relativePath}`);
      }
    }
  } catch (_) {
    console.error(`Error cleaning directory ${dirPath}:`);
  }
}

/**
 * JSON マップファイルの削除
 */
async function removeAssetMap(): Promise<void> {
  try {
    await fs.unlink(MAP_PATH);
    console.log(`[Deleted JSON] ${path.relative(process.cwd(), MAP_PATH)}`);
  } catch (_) {
    console.log(`[Skip] JSON map file does not exist.`);
  }
}

async function main(): Promise<void> {
  console.log('--- Asset Cleanup Started ---');

  // 1. サムネイル用ディレクトリのクリーンアップ
  if (IMG_CONTAINER.THUMBNAIL) {
    const thumbnailDir = path.join(process.cwd(), 'public', IMG_CONTAINER.THUMBNAIL);
    await cleanDirectory(thumbnailDir);
  }

  // 2. 本文アセット用ディレクトリのクリーンアップ
  if (IMG_CONTAINER.BODY) {
    const bodyDir = path.join(process.cwd(), 'public', IMG_CONTAINER.BODY);
    await cleanDirectory(bodyDir);
  }

  // 3. JSONマップファイルの削除
  await removeAssetMap();

  console.log('--- Asset Cleanup Completed ---');
}

main().catch(err => {
  console.error('Failed to clean assets:', err);
  process.exit(1);
});
