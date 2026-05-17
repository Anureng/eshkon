import crypto from 'crypto';
import fs from 'fs/promises';
import path from 'path';
import { Page } from '../schema/pageSchema';

export async function createSnapshot(page: Page, version: string) {
  const hash = crypto.createHash('sha256').update(JSON.stringify(page)).digest('hex');
  
  const snapshotDir = path.join(process.cwd(), 'releases', page.slug);
  await fs.mkdir(snapshotDir, { recursive: true });

  const snapshotPath = path.join(snapshotDir, `${version}.json`);
  
  const snapshotData = {
    version,
    timestamp: new Date().toISOString(),
    hash,
    page,
  };

  await fs.writeFile(snapshotPath, JSON.stringify(snapshotData, null, 2));
  return snapshotData;
}

export async function getLastSnapshotHash(slug: string): Promise<string | null> {
  try {
    const snapshotDir = path.join(process.cwd(), 'releases', slug);
    const files = await fs.readdir(snapshotDir);
    if (files.length === 0) return null;

    files.sort();
    const lastFile = files[files.length - 1];
    const content = await fs.readFile(path.join(snapshotDir, lastFile), 'utf-8');
    const data = JSON.parse(content);
    return data.hash;
  } catch (error) {
    return null;
  }
}
