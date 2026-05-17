import React from 'react';
import { Section } from '../lib/schema/pageSchema';
import { sectionRegistry } from './sectionRegistry';
import UnsupportedSection from './sections/UnsupportedSection';
import ErrorBoundary from './ErrorBoundary';

export default function SectionRenderer({ sections }: { sections: Section[] }) {
  return (
    <ErrorBoundary>
      {sections.map((section) => {
        const Component = sectionRegistry[section.type] || UnsupportedSection;
        return (
          <div key={section.sectionId} id={section.sectionId} className="w-full">
            <Component {...section.props} type={section.type} />
          </div>
        );
      })}
    </ErrorBoundary>
  );
}
