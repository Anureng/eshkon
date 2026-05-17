import React from 'react';
import Hero from './sections/Hero';
import FeatureGrid from './sections/FeatureGrid';
import Testimonial from './sections/Testimonial';
import CTA from './sections/CTA';

export const sectionRegistry: Record<string, React.ComponentType<any>> = {
  hero: Hero,
  featureGrid: FeatureGrid,
  testimonial: Testimonial,
  cta: CTA,
};
