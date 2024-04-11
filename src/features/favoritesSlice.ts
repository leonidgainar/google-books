import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { AppThunk } from '../app/store';
import { Book } from '../types/book';

const API_BASE_URL = process.env.REACT_APP_SERVER_BASE_URL || 'http://localhost';
const API_PORT = process.env.REACT_APP_SERVER_PORT || '3001';
const API_URL = `${API_BASE_URL}:${API_PORT}/api/favorites`;

interface FavoritesState {
  favorites: Book[];
  loading?: boolean;
  error?: string | null;
}

const initialState: FavoritesState = {
  favorites: [],
  loading: false,
  error: null,
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    addFavoriteStart(state) {
      state.loading = true;
      state.error = null;
    },
    addFavoriteSuccess(state, action: PayloadAction<Book>) {
      state.loading = false;
      state.favorites.push(action.payload);
    },
    addFavoriteFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    removeFavoriteStart(state) {
      state.loading = true;
      state.error = null;
    },
    removeFavoriteSuccess(state, action: PayloadAction<string>) {
      state.loading = false;
      state.favorites = state.favorites.filter((book) => book.id !== action.payload);
    },
    removeFavoriteFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    getFavoritesStart(state) {
      state.loading = true;
      state.error = null;
    },
    getFavoritesSuccess(state, action: PayloadAction<Book[]>) {
      state.loading = false;
      state.favorites = action.payload;
    },
    getFavoritesFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  addFavoriteStart,
  addFavoriteSuccess,
  addFavoriteFailure,
  removeFavoriteStart,
  removeFavoriteSuccess,
  removeFavoriteFailure,
  getFavoritesStart,
  getFavoritesSuccess,
  getFavoritesFailure,
} = favoritesSlice.actions;

export default favoritesSlice.reducer;

export const addFavoriteBook = (book: Book): AppThunk => async (dispatch) => {
  try {
    dispatch(addFavoriteStart());
    // Make API request to add book to favorites in SQLite
    await axios.post(API_URL, book);
    dispatch(addFavoriteSuccess(book));
  } catch (error: any) {
    dispatch(addFavoriteFailure(error.message || 'Failed to add book to favorites'));
  }
};

export const deleteFavoriteBook = (bookId: string): AppThunk => async (dispatch) => {
  try {
    dispatch(removeFavoriteStart());
    // Make API request to delete book from favorites in SQLite
    await axios.delete(`${API_URL}/${bookId}`);
    dispatch(removeFavoriteSuccess(bookId));
  } catch (error: any) {
    dispatch(removeFavoriteFailure(error.message || 'Failed to delete book from favorites'));
  }
};

export const getFavoriteBooks = (): AppThunk => async (dispatch) => {
  try {
    dispatch(getFavoritesStart());
    // Make API request to fetch favorite books from SQLite
    const response = await axios.get(API_URL);
    dispatch(getFavoritesSuccess(response.data));
  } catch (error: any) {
    dispatch(getFavoritesFailure(error.message || 'Failed to fetch favorite books'));
  }
};