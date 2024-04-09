import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavigationBar from './NavigationBar';
import BookList from '../components/BookList';
import BookDetail from '../components/BookDetail';
import FavoriteBookList from '../components/FavoriteBookList';

const App: React.FC = () => {
  return (
    <Router>
      <NavigationBar />
      <Routes>
        <Route path="/" element={<BookList />} />
        <Route path="/books/:id" element={<BookDetail />} />
        <Route path="/favorites" element={<FavoriteBookList />} />
      </Routes>
    </Router>
  );
};

export default App;
