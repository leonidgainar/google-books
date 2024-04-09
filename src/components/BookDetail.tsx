import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Row, Col } from 'antd';
import { StarOutlined, StarFilled } from '@ant-design/icons';
import Loading from './Loading';
import { AppDispatch, RootState } from '../app/store';
import { Book } from '../types/book';
import { addFavorite, removeFavorite } from '../features/favoritesSlice';

const { Meta } = Card;

const BookDetail: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { id } = useParams<{ id: string }>();
  const books: Book[] = useSelector((state: RootState) => state.books.books);
  const favoriteBooks: Book[] = useSelector((state: RootState) => state.favorites.favorites);

  const [book, setBook] = useState<Book | null>(null);
  const [isFavorite, setFavorite] = useState<boolean>(false);

  useEffect(() => {
    const foundBook = books.find((book: Book) => book.id === id);
    if (foundBook) {
      setBook(foundBook);
    } else {
      // If book is not found in books array, search in favorites
      const foundFavorite = favoriteBooks.find((favBook: Book) => favBook.id === id);
      if (foundFavorite) {
        setBook(foundFavorite);
      }
    }
  }, [books, favoriteBooks, id]);

  useEffect(() => {
    if (book && favoriteBooks.find((favBook: Book) => favBook.id === book.id)) {
      setFavorite(true);
    } else {
      setFavorite(false);
    }
  }, [book, favoriteBooks]);

  

  const handleToggleFavorite = () => {
    if (!book) {
      return;
    }
    if (isFavorite) {
      dispatch(removeFavorite(book.id));
    } else {
      dispatch(addFavorite(book));
    }
    setFavorite(!isFavorite);
  };

  return (
    <>
      {!book ? <Loading /> :
        <Row justify="center">
          <Col xs={24} sm={18} md={12}>
            <Card
              hoverable
              cover={<img style={{ width: '200px', height: "300px", margin: 'auto' }}
                alt={book.volumeInfo.title}
                src={book.volumeInfo.imageLinks?.thumbnail}
              />}
              actions={[
                isFavorite ?
                  <StarFilled key="favorite" title="Remove from favorites" onClick={handleToggleFavorite} /> :
                  <StarOutlined key="favorite" title='Add to favorites' onClick={handleToggleFavorite} />
              ]}
            >
              <Meta title={book.volumeInfo.title} description={book.volumeInfo.subtitle} />
              {book?.searchInfo && <p dangerouslySetInnerHTML={{ __html: book.searchInfo?.textSnippet }} />}
            </Card>
          </Col>
        </Row>
      }
    </>
  );
};

export default BookDetail;
