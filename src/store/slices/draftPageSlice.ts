import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Page, Section } from '../../lib/schema/pageSchema';

interface DraftPageState {
  page: Page | null;
}

const initialState: DraftPageState = {
  page: null,
};

const draftPageSlice = createSlice({
  name: 'draftPage',
  initialState,
  reducers: {
    loadPage(state, action: PayloadAction<Page>) {
      state.page = action.payload;
    },
    addSection(state, action: PayloadAction<{ index: number; section: Section }>) {
      if (state.page) {
        state.page.sections.splice(action.payload.index, 0, action.payload.section);
      }
    },
    removeSection(state, action: PayloadAction<string>) {
      if (state.page) {
        state.page.sections = state.page.sections.filter(s => s.sectionId !== action.payload);
      }
    },
    reorderSections(state, action: PayloadAction<{ oldIndex: number; newIndex: number }>) {
      if (state.page) {
        const [moved] = state.page.sections.splice(action.payload.oldIndex, 1);
        state.page.sections.splice(action.payload.newIndex, 0, moved);
      }
    },
    updateSectionProp(state, action: PayloadAction<{ sectionId: string; props: any }>) {
      if (state.page) {
        const section = state.page.sections.find(s => s.sectionId === action.payload.sectionId);
        if (section) {
          section.props = { ...section.props, ...action.payload.props };
        }
      }
    },
  },
});

export const { loadPage, addSection, removeSection, reorderSections, updateSectionProp } = draftPageSlice.actions;
export default draftPageSlice.reducer;
