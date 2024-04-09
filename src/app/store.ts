import { configureStore, Action } from '@reduxjs/toolkit';
import { ThunkAction } from 'redux-thunk';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import booksReducer from '../features/booksSlice';
import favoritesReducer from '../features/favoritesSlice';

const persistConfig = {
  key: 'root',
  storage,
};

const persistedBooksReducer = persistReducer(persistConfig, booksReducer);
const persistedFavoritesReducer = persistReducer(persistConfig, favoritesReducer);

export const store = configureStore({
  reducer: {
    books: persistedBooksReducer,
    favorites: persistedFavoritesReducer,
  },
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;
export type AppDispatch = typeof store.dispatch;
