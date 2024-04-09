import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Card, Row, Col } from 'antd';
import Loading from './Loading';
import { RootState } from '../app/store';
import BookSearch from './Search';

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
                    alt={book.volumeInfo.title}
                    src={book.volumeInfo.imageLinks?.thumbnail}
                  />}
                >
                  <Meta title={book.volumeInfo.title} description={book.volumeInfo.subtitle} />
                  {book?.searchInfo && <p dangerouslySetInnerHTML={{ __html: book.searchInfo?.textSnippet }} />}
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
