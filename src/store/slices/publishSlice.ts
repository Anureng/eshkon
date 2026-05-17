import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PublishState {
  status: 'idle' | 'publishing' | 'published' | 'error';
  currentVersion: string | null;
  lastPublishedAt: string | null;
}

const initialState: PublishState = {
  status: 'idle',
  currentVersion: null,
  lastPublishedAt: null,
};

const publishSlice = createSlice({
  name: 'publish',
  initialState,
  reducers: {
    publishStart(state) {
      state.status = 'publishing';
    },
    publishSuccess(state, action: PayloadAction<{ version: string; publishedAt: string }>) {
      state.status = 'published';
      state.currentVersion = action.payload.version;
      state.lastPublishedAt = action.payload.publishedAt;
    },
    publishError(state) {
      state.status = 'error';
    },
  },
});

export const { publishStart, publishSuccess, publishError } = publishSlice.actions;
export default publishSlice.reducer;
