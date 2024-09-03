import { useEffect, useState, useContext } from 'react';
import { Row, Col } from 'react-bootstrap';

import API from '../API';
import { LoadingLayout } from './Layout';

import "../styles/ConcertData.css";

import UserContext from '../contexts/UserContext';
import { getSeat } from '../services/utils';

const ConcertData = (props) => {

  const { preBookedSeats, setPreBookedSeats, bookedSeats, setSeats, concert } = props;
  const { id, name, date, theater, description, rows, columns, total_seats } = concert;
  const [isLoading, setIsLoading] = useState(true);


  const userContext = useContext(UserContext);
  useEffect(() => {
    console.log("ConcertData useEffect");
    API.getBookedSeatsByID(id).then(seats => {
      setSeats(seats);
      setIsLoading(false);

    }).catch(err => {
      console.log(err);
      // show errror
      setIsLoading(false);

    });
  }, [id]);



  const buildTheater = () => {
    return Array.from({ length: rows }).map((_, i) => (
      <tr key={i}>
        {Array.from({ length: columns }).map((_, j) => {
          const id = i * columns + j + 1;
          const seatLabel = getSeat(id, columns);
          const seatClass = `seat ${bookedSeats.seats.includes(id)
            ? 'booked'
            : (userContext.loggedIn && preBookedSeats.seatsId.includes(id))
              ? 'pre-booked'
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

  const bookSeats = (id, seatLabel) => {
    if (preBookedSeats.seatsId.includes(id)) {
      const updatedSeats = preBookedSeats.seatsId.filter(seat => seat !== id);
      const updatedSeatsName = preBookedSeats.seatsLabel.filter(seat => seat !== seatLabel);
      setPreBookedSeats({ ...preBookedSeats, seatsId: updatedSeats, seatsLabel: updatedSeatsName });
    } else {
      const updatedSeats = [...preBookedSeats.seatsId, id];
      const updatedSeatsName = [...preBookedSeats.seatsLabel, seatLabel];
      setPreBookedSeats({ ...preBookedSeats, seatsId: updatedSeats, seatsLabel: updatedSeatsName });
    }
  };

  return (
    <>
      <div>
        <h2>{name}</h2>
        <p>{date}</p>
        <p>{theater}</p>
        <p>{description}</p>
        {isLoading
          ? <LoadingLayout /> :
          <Row>
            <Col>
              <p><strong>Total Seats:</strong></p> {total_seats}
            </Col>
            <Col>
              <p><strong>Available Seats:</strong></p> { total_seats - bookedSeats.seats.length}
            </Col>
            <Col>
              <p><strong>Booked Seats:</strong></p> {bookedSeats.seats.length}
            </Col>
          </Row>}

        {isLoading
          ? <LoadingLayout />
          : <table className="theater">
            <tbody>
              {buildTheater(rows, columns)}
            </tbody>
          </table>
        }
      </div>
    </>
  );
}


export { ConcertData };