import { useEffect, useState, useContext } from 'react';
import { Row, Col, Card, Container, Alert } from 'react-bootstrap';

import API from '../API';
import { LoadingLayout } from './Layout';
import { ConcertOrder } from './ConcertOrder';

import "../styles/ConcertPage.css";

import UserContext from '../contexts/UserContext';
import { getSeat } from '../services/utils';

const ConcertPage = (props) => {

  const [concert, setConcert] = useState(null);
  const [preBookedSeats, setPreBookedSeats] = useState([]);
  const [bookedSeats, setbookedSeats] = useState([]);
  const [ErrorBookedSeats, setErrorBookedSeats] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const userContext = useContext(UserContext);
  const { authToken, setAuthToken } = props;
  const { concertId } = props;

  useEffect(() => {
    API.getConcertByID(concertId).then(NewConcert => {
      setConcert(NewConcert);
      API.getBookedSeatsByID(NewConcert.id).then(seats => {
        setbookedSeats(seats);
        setIsLoading(false);
      }).catch(err => {
        props.handleErrors(err);
        setIsLoading(false);
      });
    }).catch(err => {
      props.handleErrors(err);
    });
  }, [concertId]);



  const [isLoading, setIsLoading] = useState(true);


  const buildTheater = () => {
    return Array.from({ length: concert.rows }).map((_, i) => (
      <tr key={i}>
        {Array.from({ length: concert.columns }).map((_, j) => {
          const id = i * concert.columns + j + 1;
          const seatLabel = getSeat(id, concert.columns);
            const seatClass = `seat ${ErrorBookedSeats.includes(id)
            ? 'error-booked'
            : (userContext.loggedIn && preBookedSeats.find(seat => seat.id === id))
              ? 'pre-booked'
              : (bookedSeats.seats.includes(id))
              ? 'booked'
              : 'available'
            }`;

          return (
            <td
              key={id}
              id={`seats-${id}`}
              className={seatClass}
              onClick={() => userContext.loggedIn && !bookedSeats.seats.includes(id) && bookSeats(id, seatLabel)}
            >
              {seatLabel}
            </td>
          );
        })}
      </tr>
    ));
  };

  const bookSeats = (seatId, seatLabel) => {
    console.log('bookSeats', seatId, seatLabel);
    for (const seat in preBookedSeats) {
      if (preBookedSeats[seat].id === seatId) {
        const newPreBookedSeats = preBookedSeats.filter(seat => seat.id !== seatId);
        console.log('newPreBookedSeats', newPreBookedSeats);
        setPreBookedSeats(newPreBookedSeats);
        return;
      }
    }
    setPreBookedSeats(prevSeats => [...prevSeats, { id: seatId, label: seatLabel }]);
  };

  // rename concert info
  return (
    <Container className='mb-5'>

      {isLoading
        ? <LoadingLayout />
        : <>
          <Row className='my-3'>
            <Col xs={5}>
              <Card className='concert-card' style={{ height: '10rem' }}>
                <Card.Body>
                  <Card.Title><h2>{concert.name}</h2></Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">{concert.date} at {concert.theater}</Card.Subtitle>
                  <Card.Text>
                    {concert.description}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={{ offset: 2, span: 5 }}>
              <Card className='concert-card' style={{ height: '10rem' }}>
                <Card.Body >
                  <table style={{ height: '100%', width: '100%' }} className='text-end'>
                    <tbody>
                      <tr className='align-middle'>
                        <td><strong>Total Seats:</strong></td>
                        <td>{concert.total_seats}</td>
                      </tr>
                      <tr className='align-middle'>
                        <td><strong className='legend-available'>Available Seats:</strong></td>
                        <td> {concert.total_seats - bookedSeats.seats.length}</td>
                      </tr>
                      <tr className='align-middle'>
                        <td><strong className='legend-booked'>Booked Seats:</strong></td>
                        <td>{bookedSeats.seats.length}</td>
                      </tr>
                      <tr className='align-middle'>
                        <td><strong className='legend-pre-booked'>Selected Seats:</strong></td>
                        <td>{preBookedSeats.length}</td>
                      </tr>
                    </tbody>
                  </table>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <Row>
          {showAlert && (
        <Alert className='mt-3 fade show' variant={alertMessage.includes('successfully') ? 'success' : 'danger'} onClose={() => setShowAlert(false)} dismissible>
          {alertMessage}
        </Alert>
      )}
            <Col className={!userContext.loggedIn ? 'd-flex justify-content-center' : null}>
              <table className="theater">
                <tbody>
                  {buildTheater()}
                </tbody>
              </table>
            </Col>
            <Col>
              {userContext.loggedIn ?
                <ConcertOrder
                  concert={concert}
                  preBookedSeats={preBookedSeats}
                  setPreBookedSeats={setPreBookedSeats}
                  totalSeats={concert.total_seats}
                  bookedSeats={bookedSeats}
                  setbookedSeats={setbookedSeats}
                  authToken={authToken}
                  setAuthToken={setAuthToken}
                  setShowAlert={setShowAlert}
                  setAlertMessage={setAlertMessage}
                  setErrorBookedSeats={setErrorBookedSeats}
                />
                : null
              }
            </Col>
          </Row>
        </>
      }
    </Container>
  );
}


export { ConcertPage };