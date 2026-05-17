import React from 'react';
import Link from 'next/link';

export default function CTA({ label, url }: { label?: string; url?: string }) {
  return (
    <section className="py-20 bg-blue-600 dark:bg-blue-800">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold text-white mb-8">Ready to get started?</h2>
        <Link 
          href={url || "#"} 
          className="inline-block bg-white text-blue-600 font-bold py-3 px-8 rounded-lg shadow hover:bg-gray-100 transition-colors"
        >
          {label || "Click Here"}
        </Link>
      </div>
    </section>
  );
}
