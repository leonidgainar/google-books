import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Card, Row, Col } from 'antd';
import { RootState } from '../app/store';
import BookSearch from './BookSearch';
import Loading from './Loading';

const { Meta } = Card;

const BookList: React.FC = () => {
  const books = useSelector((state: RootState) => state.books.books);
  const loading = useSelector((state: RootState) => state.books.loading);

  return (
    <>
      <BookSearch />
      {loading ? <Loading /> :
        <Row justify="center" gutter={[16, 16]}>
          {books.map((book) => (
            <Col key={book.id} xs={24} sm={12} md={8} lg={6} xl={6}>
              <Link to={`/books/${book.id}`} >
                <Card
                  hoverable
                  style={{ height: '100%' }}
                  cover={<img style={{ width: '200px', height: "300px", margin: 'auto' }}
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
      }
    </>
  );
};

export default BookList;
