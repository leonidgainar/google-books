import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Input, Row, Col } from 'antd';
import { AppDispatch } from '../app/store';
import { fetchBooks } from '../features/booksSlice';

const BookSearch: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const dispatch: AppDispatch = useDispatch();
  let timer: ReturnType<typeof setTimeout>;

  useEffect(() => {
    const savedSearchText = localStorage.getItem('searchText');
    if (savedSearchText) {
      setSearchText(savedSearchText);
    }
  }, []);

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
