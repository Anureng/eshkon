import React from 'react';

export default function Hero({ headline, subtext }: { headline?: string; subtext?: string }) {
  return (
    <section className="py-20 bg-blue-50 dark:bg-slate-900">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
          {headline || "Hero Headline"}
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          {subtext || "Hero subtext goes here."}
        </p>
      </div>
    </section>
  );
}
