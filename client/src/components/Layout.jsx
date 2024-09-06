import { Container, Button, Spinner } from 'react-bootstrap';
import { Link, Outlet, useParams } from 'react-router-dom';
import { useEffect } from 'react';


import API from '../API';

import { ConcertList } from './ConcertList';
import { LoginForm } from './LoginForm';
import { ReservationsList } from './ReservationsList';
import { ConcertPage} from './ConcertPage.jsx';
import { Footer } from '../components/Footer'

function NotFoundLayout(props) {
  return (
    <>
      <h2>This route is not valid!</h2>
      <Link to="/">
        <Button variant="primary">Go back to the main page!</Button>
      </Link>
      <Footer />
    </>
  );
}

function LoginLayout(props) {
  return (
    <Container>
      <LoginForm login={props.login} />
      <Footer />
    </Container>
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
      <Container>
        <ConcertList Concerts={props.ConcertList} />
        <Outlet />
        <Footer />
      </Container>

    </>
  );
}


function ConcertLayout(props) {
  const { concertId } = useParams();

  return (
    <>
      <ConcertPage authToken={props.authToken} setAuthToken={props.setAuthToken} handleErrors={props.handleErrors} concertId={concertId}/>
      <Footer />
    </>
  )
}

function ReservationsLayout(props) {
  // lista ordini dell'utente
  return (
    <>
    <ReservationsList />
    <Outlet />
    <Footer />
    </>
  );
}

function LoadingLayout(props) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Spinner animation="border" />
    </div>
  );
}

export { NotFoundLayout, LoadingLayout, LoginLayout, HomeLayout, ConcertLayout, ReservationsLayout };