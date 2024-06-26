import { useState, useEffect } from 'react';
import {
  Container,
  Card,
  Button,
  Row,
  Col
} from 'react-bootstrap';

// import { getMe, deleteBook } from '../utils/API';
import Auth from '../utils/auth';
import { removeBookId } from '../utils/localStorage';

import { useQuery } from '@apollo/client';
import { useMutation } from '@apollo/client';
import { REMOVE_BOOK } from '../utils/mutations';
import { GET_ME } from '../utils/queries';

const SavedBooks = () => {

  // Added refetch so each time the component is called it refetches the query
  const { loading, data, refetch } = useQuery(GET_ME);

  // Creates mutation hook and each time the mutation is called it refetches the query
  const [removeBook, { error }] = useMutation(REMOVE_BOOK, {
    refetchQueries: [
      GET_ME,
      'me'
    ]
  });

  // Calls the refetch each time the component is called
  useEffect(() => {
    refetch()
  }, []);

  const user = data || [];

  if(loading){
    return <div>Loading...</div>
  };

  if(!user?.me.savedBooks){
    return(
      <h1>
        You need to be logged in to see this!
      </h1>
    )
  };
  
  // Variable for the users saved books
  const userBooks = user.me.savedBooks;
    
  // function for handling deleting a book
  const handleDeleteBook = async (bookId) => {
  
    try {
      const { data } = await removeBook({
        variables: {
          bookId
        }
      });

      if (!data) {
        throw new Error('something went wrong!');
      }

      // upon success, remove book's id from localStorage
      removeBookId(bookId);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div className="text-light bg-dark p-5">
        <Container>
          <h1>Viewing saved books!</h1>
        </Container>
      </div>
      <Container>
        <h2 className='pt-5'>
          {userBooks.length
            ? `Viewing ${userBooks.length} saved ${userBooks.length === 1 ? 'book' : 'books'}:`
            : 'You have no saved books!'}
        </h2>
        <Row>
          {userBooks.map((book) => {
            return (
              <Col md="4" key={book.bookId}>
                <Card  border='dark'>
                  {book.image ? <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' /> : null}
                  <Card.Body>
                    <Card.Title>{book.title}</Card.Title>
                    <p className='small'>Authors: {book.authors}</p>
                    <Card.Text>{book.description}</Card.Text>
                    <Button className='btn-block btn-danger' onClick={() => handleDeleteBook(book.bookId)}>
                      Delete this Book!
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    </>
  );
};

export default SavedBooks;
