"use server";

import { determineBumpType } from '../../lib/publish/semver';
import { createSnapshot, getLastSnapshotHash } from '../../lib/publish/snapshot';
import { getPageBySlug } from '../../lib/contentful/contentfulClient';
import { cookies } from 'next/headers';
import { Page } from '../../lib/schema/pageSchema';
import crypto from 'crypto';

export async function publishPage(draftPage: Page, slug: string) {
  try {
    const cookieStore = await cookies();
    const role = cookieStore.get('role')?.value;
    
    if (role !== 'publisher') {
      return { success: false, error: 'Forbidden: You must be a Publisher to perform this action.' };
    }

    const publishedPage = await getPageBySlug(slug, false);
    const oldSections = publishedPage ? publishedPage.sections : [];
    const newSections = draftPage.sections;

    const bumpType = determineBumpType(oldSections, newSections);
    
    const lastHash = await getLastSnapshotHash(slug);
    const draftHash = crypto.createHash('sha256').update(JSON.stringify(draftPage)).digest('hex');

    if (lastHash === draftHash) {
      return { success: true, version: 'No change', publishedAt: new Date().toISOString(), summary: 'nothing changed' };
    }

    const newVersion = `${Date.now()}-${bumpType}`;
    await createSnapshot(draftPage, newVersion);

    return { success: true, version: newVersion, publishedAt: new Date().toISOString(), summary: `Published with a ${bumpType} version bump.` };
  } catch (err: any) {
    console.error("Server Action Publish Error:", err);
    return { success: false, error: err.message || 'An unexpected server error occurred.' };
  }
}
