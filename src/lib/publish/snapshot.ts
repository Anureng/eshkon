import crypto from 'crypto';
import fs from 'fs/promises';
import path from 'path';
import { Page } from '../schema/pageSchema';

const getBaseDir = () => process.env.NODE_ENV === 'production' ? '/tmp' : process.cwd();

export async function createSnapshot(page: Page, version: string) {
  const hash = crypto.createHash('sha256').update(JSON.stringify(page)).digest('hex');
  
  const snapshotDir = path.join(getBaseDir(), 'releases', page.slug);
  await fs.mkdir(snapshotDir, { recursive: true });

  const snapshotPath = path.join(snapshotDir, `${version}.json`);
  const latestPath = path.join(snapshotDir, 'latest.json');
  
  const snapshotData = {
    version,
    timestamp: new Date().toISOString(),
    hash,
    page,
  };

  const dataStr = JSON.stringify(snapshotData, null, 2);
  await fs.writeFile(snapshotPath, dataStr);
  await fs.writeFile(latestPath, dataStr);
  return snapshotData;
}

export async function getLastSnapshotHash(slug: string): Promise<string | null> {
  try {
    const latestPath = path.join(getBaseDir(), 'releases', slug, 'latest.json');
    const content = await fs.readFile(latestPath, 'utf-8');
    const data = JSON.parse(content);
    return data.hash;
  } catch (error) {
    return null;
  }
}
