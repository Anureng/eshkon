import { createClient } from 'contentful';
import { pageSchema, Page } from '../schema/pageSchema';

const space = process.env.CONTENTFUL_SPACE_ID!;
const deliveryAccessToken = process.env.CONTENTFUL_DELIVERY_API_KEY!;
const previewAccessToken = process.env.CONTENTFUL_PREVIEW_API_KEY!;

const deliveryClient = createClient({
  space,
  accessToken: deliveryAccessToken,
});

const previewClient = createClient({
  space,
  accessToken: previewAccessToken,
  host: 'preview.contentful.com',
});

export async function getPageBySlug(slug: string, preview: boolean): Promise<Page | null> {
  const client = preview ? previewClient : deliveryClient;

  try {
    const response = await client.getEntries({
      content_type: 'page',
      'fields.slug': slug,
      include: 2,
    });

    if (response.items.length === 0) {
      return null;
    }

    const item = response.items[0];
    
    // Map Contentful response to our shape
    const mappedPage = {
      pageId: item.fields.pageId as string,
      slug: item.fields.slug as string,
      title: item.fields.title as string,
      sections: (item.fields.sections as any[])?.map((sec: any) => ({
        sectionId: sec.fields.sectionId,
        type: sec.fields.type,
        props: sec.fields.props,
      })) || [],
    };

    // Validate using Zod
    return pageSchema.parse(mappedPage);
  } catch (error) {
    console.error('Error fetching page from Contentful:', error);
    throw error;
  }
}
