import React from 'react';
import { getPageBySlug } from '../../../lib/contentful/contentfulClient';
import SectionRenderer from '../../../components/SectionRenderer';
import { notFound } from 'next/navigation';
import fs from 'fs/promises';
import path from 'path';
import LivePreview from '../../../components/LivePreview';

export default async function PreviewPage({ 
  params, 
  searchParams 
}: { 
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ draft?: string }>;
}) {
  const { slug } = await params;
  const sParams = await searchParams;
  const isDraftMode = sParams.draft === 'true';

  if (isDraftMode) {
    return (
      <main>
        <title>Draft Preview</title>
        <LivePreview />
      </main>
    );
  }

  let page = null;
  try {
    const baseDir = process.env.NODE_ENV === 'production' ? '/tmp' : process.cwd();
    const latestPath = path.join(baseDir, 'releases', slug, 'latest.json');
    const content = await fs.readFile(latestPath, 'utf-8');
    const data = JSON.parse(content);
    page = data.page;
  } catch (error) {
    page = await getPageBySlug(slug, false);
  }

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
