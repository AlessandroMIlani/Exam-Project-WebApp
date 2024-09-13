import { Container, Button, Spinner } from 'react-bootstrap';
import { Link, useParams, Navigate } from 'react-router-dom';
import { useEffect } from 'react';


import API from '../API';

import { ConcertList } from './ConcertList';
import { LoginForm } from './LoginForm';
import { ReservationsList } from './ReservationsList';
import { ConcertPage } from './ConcertPage';
import { Footer } from '../components/Footer'

function NotFoundLayout(props) {
  return (
    <>
      <Container className='main-content  my-3'>
        <h2 className='display-2 text-center my-2'>This route is not valid!</h2>
        <Container className='mx-auto w-25 my-3'>
          <Link to="/">
            <Button variant="danger">Go back to the main page!</Button>
          </Link>
        </Container>
        <Footer />
      </Container>
    </ >
  );
}

function LoginLayout(props) {
  return (
    <>
      <LoginForm login={props.login} handleErrors={props.handleErrors} />
      <Footer />
    </>
  );
}

function HomeLayout(props) {

  useEffect(() => {
    API.getConcerts().then(concerts => {
      props.setConcertList(concerts);
    }).catch(err => {
      props.handleErrors(err);
    });
  }, []);

  return (
    <>
      <ConcertList Concerts={props.ConcertList} />
      <Footer />
    </>
  );
}

function ConcertLayout(props) {
  const { concertId } = useParams();

  return (
    <>
      <ConcertPage handleErrors={props.handleErrors} concertId={concertId} />
      <Footer />
    </>
  )
}

function ReservationsLayout(props) {
  // If i move this check to the router, it will navigate a logged user to home after a refresh
  return (
    <>
      <ReservationsList />
      <Footer />
    </>
  );
}

function LoadingLayout() {
  return (
    <Container style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Spinner animation="border" />
    </Container>
  );
}

export { NotFoundLayout, LoadingLayout, LoginLayout, HomeLayout, ConcertLayout, ReservationsLayout };