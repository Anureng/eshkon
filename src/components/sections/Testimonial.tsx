import React from 'react';

export default function Testimonial({ quote, author }: { quote?: string; author?: string }) {
  return (
    <section className="py-16 bg-indigo-50 dark:bg-indigo-950">
      <div className="container mx-auto px-4 text-center">
        <blockquote className="text-2xl italic font-medium text-gray-800 dark:text-gray-200 mb-6">
          "{quote || "This is a great product!"}"
        </blockquote>
        <div className="text-lg font-semibold text-indigo-600 dark:text-indigo-400">
          — {author || "Happy Customer"}
        </div>
      </div>
    </section>
  );
}
