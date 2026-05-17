"use client";
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { loadPage, reorderSections, removeSection, updateSectionProp, addSection } from '../../../store/slices/draftPageSlice';
import { selectSection } from '../../../store/slices/uiSlice';
import { Page, Section } from '../../../lib/schema/pageSchema';
import LivePreview from '../../../components/LivePreview';
import { publishStart, publishSuccess, publishError } from '../../../store/slices/publishSlice';
import { publishPage } from '../../actions/publishAction';

export default function StudioClient({ initialPage, slug, role }: { initialPage: Page; slug: string; role: string }) {
  const dispatch = useDispatch();
  const page = useSelector((state: RootState) => state.draftPage.page);
  const selectedSectionId = useSelector((state: RootState) => state.ui.selectedSectionId);

  useEffect(() => {
    if (!page || page.slug !== slug) {
      dispatch(loadPage(initialPage));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, initialPage, slug]);

  if (!page) return <div className="p-10">Loading...</div>;

  const handlePublish = async () => {
    dispatch(publishStart());
    try {
      const data = await publishPage(page, slug);
      if (!data.success) {
        throw new Error(data.error as string);
      }
      dispatch(publishSuccess({ version: data.version as string, publishedAt: data.publishedAt as string }));
      alert(`Published successfully! Version: ${data.version}`);
    } catch (err: any) {
      dispatch(publishError());
      alert('Publish failed: ' + err.message);
    }
  };

  const handleAddSection = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const type = e.target.value;
    if (!type) return;
    const newSection: Section = {
      sectionId: `sec_${Date.now()}`,
      type,
      props: type === 'hero' ? { headline: 'New Hero', subtext: 'Subtext' } : 
             type === 'cta' ? { label: 'Click Me', url: '#' } : {}
    };
    dispatch(addSection({ index: page.sections.length, section: newSection }));
    e.target.value = ""; // reset dropdown
  };

  const selectedSection = page.sections.find(s => s.sectionId === selectedSectionId);

  return (
    <div className="flex h-screen overflow-hidden text-black bg-gray-100">
      {/* LEFT PANEL: Section List */}
      <div className="w-1/4 bg-white border-r border-gray-200 overflow-y-auto flex flex-col">
        <div className="p-4 border-b flex justify-between items-center bg-gray-50">
          <h1 className="text-xl font-bold truncate pr-4">{page.title}</h1>
          {role === 'publisher' && (
            <button onClick={handlePublish} className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-sm font-medium shadow-sm transition-colors whitespace-nowrap">
              Publish
            </button>
          )}
        </div>
        
        <div className="p-4 flex-1 overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-gray-500 text-sm uppercase tracking-wider">Sections</h2>
            <select onChange={handleAddSection} className="text-xs border p-1 rounded bg-gray-50" aria-label="Add Section">
              <option value="">+ Add...</option>
              <option value="hero">Hero</option>
              <option value="featureGrid">Feature Grid</option>
              <option value="testimonial">Testimonial</option>
              <option value="cta">CTA</option>
            </select>
          </div>

          <div className="space-y-2">
            {page.sections.map((sec, i) => (
               <div 
                 key={sec.sectionId} 
                 onClick={() => dispatch(selectSection(sec.sectionId))}
                 className={`p-3 border rounded shadow-sm flex items-center justify-between cursor-pointer transition-colors ${selectedSectionId === sec.sectionId ? 'border-blue-500 bg-blue-50' : 'bg-white hover:border-gray-400'}`}
               >
                  <span className="font-medium text-gray-700 text-sm">{sec.type}</span>
                  <div className="flex gap-1" onClick={e => e.stopPropagation()}>
                    <button aria-label="Move Up" onClick={() => i > 0 && dispatch(reorderSections({ oldIndex: i, newIndex: i - 1 }))} className="p-1 hover:bg-gray-200 rounded text-gray-500">↑</button>
                    <button aria-label="Move Down" onClick={() => i < page.sections.length - 1 && dispatch(reorderSections({ oldIndex: i, newIndex: i + 1 }))} className="p-1 hover:bg-gray-200 rounded text-gray-500">↓</button>
                    <button aria-label="Remove" onClick={() => dispatch(removeSection(sec.sectionId))} className="p-1 hover:bg-red-100 rounded text-red-500">×</button>
                  </div>
               </div>
            ))}
          </div>
        </div>
      </div>

      {/* MIDDLE PANEL: LIVE PREVIEW */}
      <div className="flex-1 bg-gray-100 flex flex-col relative overflow-hidden">
         <div className="p-3 border-b bg-white flex justify-between items-center shadow-sm z-10 absolute top-0 w-full">
           <span className="font-medium text-gray-700 text-sm">Live Preview</span>
           <a href={`/preview/${slug}?draft=true`} target="_blank" rel="noreferrer" className="text-blue-500 hover:text-blue-600 text-xs font-medium">Open Preview ↗</a>
         </div>
         <div className="flex-1 overflow-y-auto pt-14 pb-8 px-8">
           <div className="bg-white rounded shadow-xl overflow-hidden min-h-[600px] border">
             <LivePreview />
           </div>
         </div>
      </div>

      {/* RIGHT PANEL: PROPS EDITOR */}
      <div className="w-1/4 bg-white border-l border-gray-200 overflow-y-auto flex flex-col">
        <div className="p-4 border-b bg-gray-50">
          <h2 className="font-semibold text-gray-500 text-sm uppercase tracking-wider">Properties</h2>
        </div>
        <div className="p-4 flex-1">
          {!selectedSection ? (
            <p className="text-gray-400 text-sm italic">Select a section to edit its properties.</p>
          ) : (
            <div className="space-y-4">
              <div className="mb-4 pb-2 border-b">
                <span className="text-xs text-gray-500 font-mono block">ID: {selectedSection.sectionId}</span>
                <span className="font-medium text-blue-600 block">{selectedSection.type}</span>
              </div>

              {selectedSection.type === 'hero' && (
                <>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Headline</label>
                    <input type="text" className="w-full border p-2 rounded text-sm" 
                      value={(selectedSection.props.headline as string) || ''}
                      onChange={(e) => dispatch(updateSectionProp({ sectionId: selectedSection.sectionId, props: { headline: e.target.value } }))}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Subtext</label>
                    <textarea className="w-full border p-2 rounded text-sm" rows={3}
                      value={(selectedSection.props.subtext as string) || ''}
                      onChange={(e) => dispatch(updateSectionProp({ sectionId: selectedSection.sectionId, props: { subtext: e.target.value } }))}
                    />
                  </div>
                </>
              )}

              {selectedSection.type === 'cta' && (
                <>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Button Label</label>
                    <input type="text" className="w-full border p-2 rounded text-sm" 
                      value={(selectedSection.props.label as string) || ''}
                      onChange={(e) => dispatch(updateSectionProp({ sectionId: selectedSection.sectionId, props: { label: e.target.value } }))}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">URL Destination</label>
                    <input type="text" className="w-full border p-2 rounded text-sm" 
                      value={(selectedSection.props.url as string) || ''}
                      onChange={(e) => dispatch(updateSectionProp({ sectionId: selectedSection.sectionId, props: { url: e.target.value } }))}
                    />
                  </div>
                </>
              )}

              {['featureGrid', 'testimonial'].includes(selectedSection.type) && (
                <p className="text-sm text-gray-500">Prop editing for {selectedSection.type} is omitted for brevity in this brief. Edit in Contentful.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
