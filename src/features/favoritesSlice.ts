import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Book } from '../types/book';

interface FavoritesState {
  favorites: Book[];
}

const initialState: FavoritesState = {
  favorites: [],
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    addFavorite(state, action: PayloadAction<Book>) {
      if (state.favorites.some((book) => book.id === action.payload.id)) {
        return;
      }
      state.favorites.push(action.payload);
    },
    removeFavorite(state, action: PayloadAction<string>) {
      if (!state.favorites.some((book) => book.id === action.payload)) {
        return;
      }
      state.favorites = state.favorites.filter((book) => book.id !== action.payload);
    },
  },
});

export const { addFavorite, removeFavorite } = favoritesSlice.actions;

export default favoritesSlice.reducer;
