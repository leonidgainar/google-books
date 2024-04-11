import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Input, Row, Col } from 'antd';
import { AppDispatch, RootState } from '../app/store';
import { fetchBooks, setSearchText } from '../features/booksSlice';
import debounce from 'lodash/debounce';

const BookSearch: React.FC = () => {
  const [searchTextLocal, setSearchTextLocal] = useState('');
  const dispatch: AppDispatch = useDispatch();
  const books = useSelector((state: RootState) => state.books.books);
  const searchText = useSelector((state: RootState) => state.books.searchText);

  // eslint-disable-next-line
  const debouncedFetchBooks = useCallback(
    debounce((text: string) => dispatch(fetchBooks(text)), 300),
    [dispatch]
  );

  useEffect(() => {
    if (searchText) {
      setSearchTextLocal(searchText);
    }
  }, [searchText]);

  useEffect(() => {
    if (books.length === 0 && searchText) {
      dispatch(fetchBooks(searchText));
    }
  }, [dispatch, books.length, searchText]);

  useEffect(() => {
    return () => {
      debouncedFetchBooks.cancel();
    };
  }, [debouncedFetchBooks]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const inputText = e.target.value;
    setSearchTextLocal(inputText);
    debouncedFetchBooks(inputText.trim());
    dispatch(setSearchText(inputText));
  }, [debouncedFetchBooks, dispatch]);

  return (
    <Row gutter={[16, 16]} justify='center' style={{ marginBottom: 20 }}>
      <Col>
        <Input
          value={searchTextLocal}
          onChange={handleInputChange}
          placeholder="Search books..."
          style={{ marginRight: 10 }}
          allowClear
        />
      </Col>
    </Row>
  );
};

export default BookSearch;
