"use client";
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import SectionRenderer from './SectionRenderer';

export default function LivePreview() {
  // We read directly from Redux here so there is NO prop passing.
  // This guarantees that any edit to Redux triggers a direct re-render of this preview.
  const page = useSelector((state: RootState) => state.draftPage.page);

  if (!page) {
    return <div className="p-10 text-gray-500">No page data in draft...</div>;
  }

  return <SectionRenderer sections={page.sections} />;
}
