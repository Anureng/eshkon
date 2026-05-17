import React from 'react';

export default function UnsupportedSection({ type }: { type: string }) {
  return (
    <section className="py-10 bg-red-50 border border-red-200">
      <div className="container mx-auto px-4 text-center text-red-600">
        Unsupported section type: <strong>{type}</strong>
      </div>
    </section>
  );
}
