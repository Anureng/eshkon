import { NextRequest, NextResponse } from 'next/server';
import { determineBumpType } from '../../../lib/publish/semver';
import { createSnapshot, getLastSnapshotHash } from '../../../lib/publish/snapshot';
import { getPageBySlug } from '../../../lib/contentful/contentfulClient';

export async function POST(req: NextRequest) {
  try {
    const { draftPage, slug } = await req.json();

    // The middleware already checked if the user is a publisher.
    const publishedPage = await getPageBySlug(slug, false);

    const oldSections = publishedPage ? publishedPage.sections : [];
    const newSections = draftPage.sections;

    const bumpType = determineBumpType(oldSections, newSections);
    
    const lastHash = await getLastSnapshotHash(slug);
    const crypto = require('crypto');
    const draftHash = crypto.createHash('sha256').update(JSON.stringify(draftPage)).digest('hex');

    if (lastHash === draftHash) {
      return NextResponse.json({ success: true, version: 'No change', publishedAt: new Date().toISOString(), summary: 'Draft is identical to last snapshot.' });
    }

    const newVersion = `${Date.now()}-${bumpType}`;
    await createSnapshot(draftPage, newVersion);

    return NextResponse.json({ success: true, version: newVersion, publishedAt: new Date().toISOString(), summary: `Published with a ${bumpType} version bump.` });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
