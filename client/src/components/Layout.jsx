import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link, Outlet, useParams } from 'react-router-dom';
import { useEffect } from 'react';

import { ConcertList } from './ConcertList';
import { LoginForm } from './Auth';
import API from '../API';

function NotFoundLayout(props) {
  return (
    <>
      <h2>This route is not valid!</h2>
      <Link to="/">
        <Button variant="primary">Go back to the main page!</Button>
      </Link>
    </>
  );
}

function LoginLayout(props) {
  return (
    <Container>
      <LoginForm login={props.login} />
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
      <div className="container">
        <ConcertList Concerts={props.ConcertList} />
        <Outlet />
      </div>

    </>
  );
}


function ConcertLayout(props) {
  const concertId = useParams();
  // info component
  // seat component
  // "cart" component (posti selezioni + tasto di acquisto + opzione per posti random)
  return (
    <>
    </>
  );
}

function AboutLayout(props) {
  // se ho tempo, pagina con un po' di info sull'esame
  return (
    <>
    </>
  );
}

function OrdersLayout(props) {
  // lista ordini dell'utente
  return (
    <>
    </>
  );
}

export { NotFoundLayout, LoginLayout, HomeLayout, ConcertLayout, AboutLayout, OrdersLayout };