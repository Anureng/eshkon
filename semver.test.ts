import { determineBumpType } from './src/lib/publish/semver';

describe('SemVer Logic', () => {
  const oldSections = [
    { sectionId: 's1', type: 'hero', props: { text: 'A' } }
  ];

  it('Text change -> patch', () => {
    const newSections = [
      { sectionId: 's1', type: 'hero', props: { text: 'B' } }
    ];
    expect(determineBumpType(oldSections, newSections)).toBe('patch');
  });

  it('Added section -> minor', () => {
    const newSections = [
      { sectionId: 's1', type: 'hero', props: { text: 'A' } },
      { sectionId: 's2', type: 'cta', props: {} }
    ];
    expect(determineBumpType(oldSections, newSections)).toBe('minor');
  });

  it('Removed section -> major', () => {
    const newSections: any[] = [];
    expect(determineBumpType(oldSections, newSections)).toBe('major');
  });

  it('Same content -> no bump (none)', () => {
    const newSections = [
      { sectionId: 's1', type: 'hero', props: { text: 'A' } }
    ];
    expect(determineBumpType(oldSections, newSections)).toBe('none');
  });
});
