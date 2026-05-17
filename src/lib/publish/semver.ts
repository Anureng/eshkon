import { Section } from '../schema/pageSchema';

export function determineBumpType(oldSections: Section[], newSections: Section[]): 'major' | 'minor' | 'patch' | 'none' {
  if (oldSections.length === 0 && newSections.length === 0) return 'none';
  
  let bump: 'major' | 'minor' | 'patch' | 'none' = 'none';

  const oldMap = new Map(oldSections.map(s => [s.sectionId, s]));
  const newMap = new Map(newSections.map(s => [s.sectionId, s]));

  // Check for removals or type changes (major)
  for (const [id, oldSec] of oldMap.entries()) {
    const newSec = newMap.get(id);
    if (!newSec) {
      bump = 'major';
    } else if (oldSec.type !== newSec.type) {
      bump = 'major';
    }
  }

  // Check for additions (minor)
  for (const [id] of newMap.entries()) {
    if (!oldMap.has(id)) {
      if (bump !== 'major') bump = 'minor';
    }
  }

  // Check for prop changes (patch)
  if (bump === 'none') {
    for (const [id, newSec] of newMap.entries()) {
      const oldSec = oldMap.get(id);
      if (oldSec && JSON.stringify(oldSec.props) !== JSON.stringify(newSec.props)) {
        bump = 'patch';
      }
    }
  }

  return bump;
}
