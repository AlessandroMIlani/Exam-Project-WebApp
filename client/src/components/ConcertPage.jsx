import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, Card, Container, Alert } from 'react-bootstrap';

import API from '../API';

import { LoadingLayout } from './Layout';
import { ConcertOrder } from './ConcertOrder';
import UserContext from '../contexts/UserContext';
import { getSeat } from '../services/utils';

import "../styles/ConcertPage.css";

const ConcertPage = (props) => {

  const { concertId } = props;

  const [concert, setConcert] = useState(null);
  const [preBookedSeats, setPreBookedSeats] = useState([]);
  const [bookedSeats, setbookedSeats] = useState([]);
  const [ErrorBookedSeats, setErrorBookedSeats] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();  
  const userContext = useContext(UserContext);

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
      navigate('/404');
      props.handleErrors(err);
    });
  }, [concertId]);

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
              key={id} id={`seats-${id}`} className={seatClass}
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
    for (const seat in preBookedSeats) {
      if (preBookedSeats[seat].id === seatId) {
        const newPreBookedSeats = preBookedSeats.filter(seat => seat.id !== seatId);
        setPreBookedSeats(newPreBookedSeats);
        return;
      }
    }
    setPreBookedSeats(prevSeats => [...prevSeats, { id: seatId, label: seatLabel }]);
  };

  return (
    <Container className='main-content my-3'>
      {isLoading
        ? <LoadingLayout />
        : <>
          <Row className='my-3'>
          {showAlert && (
              <Alert className='mt-3 fade show' variant={alertMessage.includes('successfully') ? 'success' : 'danger'} onClose={() => setShowAlert(false)} dismissible>
                {alertMessage}
              </Alert>
            )}
            <Col xs={5}>
              <Card className='generic-card d-flex '>
                <Card.Body className="align-items-stretch">
                  <Card.Title><h2>{concert.name}</h2></Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">{concert.date} at {concert.theater}</Card.Subtitle>
                  <Card.Text>
                    {concert.description}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col xs={{ offset: 2, span: 5 }}>
              <Card className='generic-card d-flex '>
                <Card.Body className='align-items-stretch'>
                  <table className='text-end legend-table'>
                    <tbody>
                      <tr className='align-middle'>
                        <td><strong>Total Seats:</strong></td>
                        <td>{concert.total_seats}</td>
                      </tr>
                      <tr className='align-middle'>
                        <td><strong>Available Seats:</strong></td>
                        <td> {concert.total_seats - bookedSeats.seats.length}</td>
                      </tr>
                      <tr className='align-middle'>
                        <td><strong>Booked Seats:</strong></td>
                        <td>{bookedSeats.seats.length}</td>
                      </tr>
                      {userContext.loggedIn ?
                        <tr className='align-middle'>
                          <td><strong>Selected Seats:</strong></td>
                          <td>{preBookedSeats.length}</td>
                        </tr>
                        : null}
                      <tr className='align-top'>
                        <td>
                          <Row className={`legend-container my-2`}>
                            <Col className='col-lg-4 col-md-12 flex-wrap  justify-content-center'>Available: <div className="legend-square legend-available-square"></div></Col>
                              <Col className='col-lg-4 col-md-12 flex-wrap  justify-content-center'>Booked: <div className="legend-square legend-booked-square"></div></Col>
                              {userContext.loggedIn ? <Col className='col-lg-4 col-md-12 flex-wrap'>Selected: <div className="legend-square legend-pre-booked-square "></div></Col> : null}
                          </Row>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <Row className='my-5'>
            <Col className={!userContext.loggedIn ? 'd-flex justify-content-center ' : "col-12 col-md-8 col-lg-6" }>
              <table className="theater">
                <tbody>
                  {buildTheater()}
                </tbody>
              </table>
            </Col>
            {userContext.loggedIn ?
              <Col className='mt-2 mt-md-2 col-12 col-md-4 col-lg-6 '>
                <ConcertOrder
                  concert={concert} handleErrors={props.handleErrors}
                  setPreBookedSeats={setPreBookedSeats} preBookedSeats={preBookedSeats}
                  bookedSeats={bookedSeats} setbookedSeats={setbookedSeats}
                  setShowAlert={setShowAlert} setAlertMessage={setAlertMessage}
                  setErrorBookedSeats={setErrorBookedSeats}
                />
              </Col>
              : null
            }
          </Row>
        </>
      }
    </Container>
  );
}

export { ConcertPage };