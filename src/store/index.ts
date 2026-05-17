import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import createWebStorage from 'redux-persist/lib/storage/createWebStorage';
import draftPageReducer from './slices/draftPageSlice';
import uiReducer from './slices/uiSlice';
import publishReducer from './slices/publishSlice';

const createNoopStorage = () => {
  return {
    getItem(_key: string) { return Promise.resolve(null); },
    setItem(_key: string, value: any) { return Promise.resolve(value); },
    removeItem(_key: string) { return Promise.resolve(); },
  };
};

const storage = typeof window !== 'undefined' ? createWebStorage('local') : createNoopStorage();

const persistConfig = {
  key: 'draftPage',
  storage,
  whitelist: ['page'], // only persist page
};

const persistedDraftReducer = persistReducer(persistConfig, draftPageReducer);

const rootReducer = combineReducers({
  draftPage: persistedDraftReducer,
  ui: uiReducer,
  publish: publishReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // for redux-persist
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
