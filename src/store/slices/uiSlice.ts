import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UiState {
  selectedSectionId: string | null;
  isPanelOpen: boolean;
}

const initialState: UiState = {
  selectedSectionId: null,
  isPanelOpen: true,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    selectSection(state, action: PayloadAction<string | null>) {
      state.selectedSectionId = action.payload;
    },
    togglePanel(state) {
      state.isPanelOpen = !state.isPanelOpen;
    },
  },
});

export const { selectSection, togglePanel } = uiSlice.actions;
export default uiSlice.reducer;
