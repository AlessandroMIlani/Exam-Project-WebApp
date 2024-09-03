import { Container, Row, Col, Button, Spinner } from 'react-bootstrap';
import { Link, Outlet, useParams } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';


import UserContext from '../contexts/UserContext'; 
import API from '../API';

import { ConcertList } from './ConcertList';
import { LoginForm } from './Auth';
import { ConcertData } from './ConcertData';
import { ConcertOrder } from './ConcertOrder';
import { OrdersList } from './OrdersList';


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


function ConcertLayout() {
  const [concert, setConcert] = useState(null);
  const [preBookedSeats, setPreBookedSeats] = useState({ seatsId: [], seatsLabel: [] });
  const [bookedSeats, setSeats] = useState([]);
  const { concertId } = useParams();
  const userContext = useContext(UserContext);
  
  useEffect(() => {
    API.getConcertByID(concertId).then(NewConcert => {
      setConcert(NewConcert);
    }).catch(err => {
      props.handleErrors(err);
    });
  }, [concertId]);


  // info component
  // seat component
  // "cart" component (posti selezioni + tasto di acquisto + opzione per posti random)
  return (
    <>
      {concert === null 
        ? <LoadingLayout /> 
        : <div className='container'>
            <ConcertData concert={concert} preBookedSeats={preBookedSeats} setPreBookedSeats={setPreBookedSeats} bookedSeats={bookedSeats} setSeats={setSeats} />
            {userContext.loggedIn
              ? <ConcertOrder concert={concert} preBookedSeats={preBookedSeats} setPreBookedSeats={setPreBookedSeats} totalSeats={concert.total_seats} bookedSeats={bookedSeats} setSeats={setSeats}/>
              : <p> For order a ticket you need to login! </p>
            }
          </div>}
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
    <OrdersList />
    <Outlet />
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

export { NotFoundLayout, LoadingLayout, LoginLayout, HomeLayout, ConcertLayout, AboutLayout, OrdersLayout };