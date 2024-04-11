import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk } from '../app/store';
import axios from 'axios';
import { Book } from '../types/book';

const API_BASE_URL = process.env.REACT_APP_SERVER_BASE_URL || 'http://localhost:3001';
const API_URL = `${API_BASE_URL}/api/books`;

interface BooksState {
  books: Book[];
  loading: boolean;
}

const initialState: BooksState = {
  books: [],
  loading: false,
};

const booksSlice = createSlice({
  name: 'books',
  initialState,
  reducers: {
    getBooksStart(state) {
      state.loading = true;
    },
    getBooksSuccess(state, action: PayloadAction<Book[]>) {
      state.loading = false;
      state.books = action.payload;
    },
    getBooksFailure(state) {
      state.loading = false;
      state.books = [];
    },
  },
});

export const { getBooksStart, getBooksSuccess, getBooksFailure } = booksSlice.actions;

export default booksSlice.reducer;

export const fetchBooks = (searchText: string): AppThunk => async (dispatch) => {
  try {
    dispatch(getBooksStart());
    const response = await axios.get(`${API_URL}?q=${searchText}`);
    dispatch(getBooksSuccess(response.data));
  } catch (error) {
    console.error(error);
    dispatch(getBooksFailure());
  }
};
