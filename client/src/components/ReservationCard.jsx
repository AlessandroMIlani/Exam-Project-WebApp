import React from 'react';
import { Card, Button, Col } from 'react-bootstrap';
import { FaTrash } from 'react-icons/fa';
import { getSeat } from '../services/utils';

const ReservationCard = ({ reserverion, handleDelete }) => {
  return (
    <Col xs={12} md={4} lg={3} className='mb-3' key={reserverion.id}>
      <Card className='reserverion-card'>
        <Card.Body>
          <Card.Title>{reserverion.concert_name}</Card.Title>
          <Card.Text>
            <strong>Date:</strong> {reserverion.concert_date} <br />
            <strong>Seats:</strong> {reserverion.seats.map(seat => getSeat(seat, reserverion.columns)).join(', ')}
            <Button className='delete-button' variant="danger" size='sm' onClick={() => handleDelete(reserverion.id)}><FaTrash /></Button>
          </Card.Text>
        </Card.Body>
      </Card> 
    </Col>
  );
};

export { ReservationCard };