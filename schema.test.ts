import { pageSchema, sectionSchema } from './src/lib/schema/pageSchema';

describe('Schema Validations', () => {
  it('Valid page passes validation', () => {
    const validPage = {
      pageId: '123',
      slug: 'home',
      title: 'Home Page',
      sections: [
        { sectionId: 's1', type: 'hero', props: { headline: 'Hello' } }
      ]
    };
    expect(() => pageSchema.parse(validPage)).not.toThrow();
  });

  it('Missing required field fails', () => {
    const invalidPage = {
      slug: 'home', // missing pageId, title, sections
    };
    expect(() => pageSchema.parse(invalidPage)).toThrow();
  });

  it('Invalid section type fails', () => {
    const invalidSection = {
      sectionId: 's1',
      // missing type
      props: {}
    };
    expect(() => sectionSchema.parse(invalidSection)).toThrow();
  });
});
