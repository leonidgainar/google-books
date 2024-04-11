import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Card, Row, Col } from 'antd';
import { AppDispatch, RootState } from '../app/store';
import { getFavoriteBooks } from '../features/favoritesSlice';
import Loading from './Loading';

const { Meta } = Card;

const FavoriteBookList: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();

  const favoriteBooks = useSelector((state: RootState) => state.favorites.favorites);
  const loading = useSelector((state: RootState) => state.favorites.loading);
  
  useEffect(() => {
    if (favoriteBooks.length === 0) {
      dispatch(getFavoriteBooks());
    }
  }, [dispatch, favoriteBooks.length]);

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <Row justify="center" gutter={[16, 16]}>
          {favoriteBooks.length === 0 && (
            <Col span={24}>
              <h2>No favorite books</h2>
            </Col>
          )}
          {favoriteBooks.map((book) => (
            <Col key={book.id} xs={24} sm={12} md={8} lg={6} xl={6}>
              <Link to={`/books/${book.id}`}>
                <Card
                  hoverable
                  style={{ height: '100%' }}
                  cover={<img style={{ width: '200px', height: '300px', margin: 'auto' }}
                    alt={book.title}
                    src={book?.thumbnail}
                  />}
                >
                  <Meta title={book.title} description={book.subtitle} />
                  {book?.searchInfo && <p dangerouslySetInnerHTML={{ __html: book.searchInfo }} />}
                </Card>
              </Link>
            </Col>
          ))}
        </Row>
      )}
    </>
  );
};

export default FavoriteBookList;
