import React from 'react';

export default function FeatureGrid({ features }: { features?: { title: string; description: string }[] }) {
  return (
    <section className="py-20 bg-white dark:bg-slate-800">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {(features || []).map((feature, i) => (
            <div key={i} className="p-6 border rounded-lg shadow-sm bg-gray-50 dark:bg-slate-700 dark:border-slate-600">
              <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
