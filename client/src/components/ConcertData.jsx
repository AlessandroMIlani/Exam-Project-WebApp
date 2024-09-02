import { useEffect, useState, useContext } from 'react';
import API from '../API';
import { LoadingLayout } from './Layout';

import "../styles/ConcertData.css";

import UserContext from '../contexts/UserContext';


const ConcertData = (props) => {

  const { preBookedSeats, setPreBookedSeats, bookedSeats, setSeats, concert } = props;
  const { id, name, date, theater, description, rows, columns } = concert;

  const userContext = useContext(UserContext);

  useEffect(() => {
    API.getBookedSeatsByID(id).then(seats => {
      setSeats(seats);
    }).catch(err => {
      console.log(err);
    });
  }, [id]);

  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }


  function getCoodinates(seatNumber, rows, cols) {
    const row = Math.floor((seatNumber - 1) / cols);
    const col = (seatNumber - 1) % cols;
    const letter = String.fromCharCode(65 + row);
    return { letter, col };
  }

  function getSeat(seatNumber, rows, cols) {
    const { letter, col } = getCoodinates(seatNumber, rows, cols);
    return `${letter}-${col + 1}`;
  }



  const buildTheater = () => {
    const theaterRows = [];
    for (let i = 0; i < rows; i++) {
      const rowCells = [];
      for (let j = 0; j < columns; j++) {
        const id = i * columns + j + 1;
        const seatLabel = getSeat(id, rows, columns);
        rowCells.push(
          <td
            key={id}
            id={`seats-${id}`}
            className={`seat ${bookedSeats.length === 0 ? "available" : bookedSeats.seats.includes(id) ? 'booked' : preBookedSeats.includes(id) ? 'pre-booked' : 'available'} `}
            onClick={() => !bookedSeats.seats.includes(id) && bookSeats(id)}
          >
            {seatLabel}
          </td>
        );
      }
      theaterRows.push(<tr key={i}>{rowCells}</tr>);
    }
    return theaterRows;
  };

  const bookSeats = (id) => {
    if (preBookedSeats.includes(id)) {
      const updatedSeats = preBookedSeats.filter(seat => seat !== id);
      setPreBookedSeats(updatedSeats);
    } else {
      const updatedSeats = [...preBookedSeats, id];
      setPreBookedSeats(updatedSeats);
    }
  };

  const sendSeats = () => {
    console.debug(preBookedSeats);
    console.debug(carts);
  };


  return (
    <>
      <div>
        <h2>{name}</h2>
        <p>{date}</p>
        <p>{theater}</p>
        <p>{description}</p>
        {rows && columns
          ? <table class="theater">
            <tbody>
              {buildTheater(rows, columns)}
            </tbody>
          </table>
          : <LoadingLayout />
        }
      </div>
    </>
  );
}


export { ConcertData };