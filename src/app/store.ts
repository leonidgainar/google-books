import { configureStore, Action } from '@reduxjs/toolkit';
import { ThunkAction } from 'redux-thunk';
import booksReducer from '../features/booksSlice';
import favoritesReducer from '../features/favoritesSlice';


export const store = configureStore({
  reducer: {
    books: booksReducer,
    favorites: favoritesReducer,
  },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;
export type AppDispatch = typeof store.dispatch;
