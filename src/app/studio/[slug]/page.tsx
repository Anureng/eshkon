import React from 'react';
import { getPageBySlug } from '../../../lib/contentful/contentfulClient';
import StudioClient from './StudioClient';
import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';

export default async function StudioPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = await getPageBySlug(slug, true);

  if (!page) {
    notFound();
  }

  const cookieStore = await cookies();
  const role = cookieStore.get('role')?.value || 'viewer';

  return <StudioClient initialPage={page} slug={slug} role={role} />;
}
