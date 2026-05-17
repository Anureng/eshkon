import React from 'react';
import { getPageBySlug } from '../../../lib/contentful/contentfulClient';
import SectionRenderer from '../../../components/SectionRenderer';
import { notFound } from 'next/navigation';

export default async function PreviewPage({ 
  params, 
  searchParams 
}: { 
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ preview?: string }>;
}) {
  const { slug } = await params;
  const sParams = await searchParams;
  const isPreview = sParams.preview === 'true';

  const page = await getPageBySlug(slug, isPreview);

  if (!page) {
    notFound();
  }

  return (
    <main>
      <title>{page.title}</title>
      <SectionRenderer sections={page.sections} />
    </main>
  );
}
