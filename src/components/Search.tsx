import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Input, Row, Col } from 'antd';
import { AppDispatch, RootState } from '../app/store';
import  { fetchBooks } from '../features/booksSlice';

const BookSearch: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const dispatch: AppDispatch = useDispatch();
  const books = useSelector((state: RootState) => state.books.books);
  
  const savedSearchText = localStorage.getItem('searchText');
  let timer: ReturnType<typeof setTimeout>;

  useEffect(() => {
    if (savedSearchText) {
      setSearchText(savedSearchText);
    }
  }, [savedSearchText]);

  useEffect(() => {
    if (books.length === 0 && savedSearchText) {
      dispatch(fetchBooks(savedSearchText));
    }
  }, [dispatch, books.length, savedSearchText]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputText = e.target.value;
    setSearchText(inputText.trim());

    clearTimeout(timer);

    timer = setTimeout(() => {
      dispatch(fetchBooks(inputText.trim()));
      // Save the search term to local storage
      localStorage.setItem('searchText', inputText.trim());
    }, 500);
  };

  return (
    <Row gutter={[16, 16]} justify='center' style={{ marginBottom: 20 }}>
      <Col>
        <Input
          value={searchText}
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
