import React from 'react';
import { Card, Button, Col } from 'react-bootstrap';
import { FaTrash } from 'react-icons/fa';
import { getSeat } from '../services/utils';

const ReservationCard = ({ order, handleDelete }) => {
  return (
      <Card className='order-card'>
        <Card.Body>
          <Card.Title>{order.concert_name}</Card.Title>
          <Card.Text>
            <strong>Date:</strong> {order.concert_date} <br />
            <strong>Seats:</strong> {order.seats.map(seat => getSeat(seat, order.columns)).join(', ')}
            <Button className='delete-button' variant="danger" size='sm' onClick={() => handleDelete(order.id)}><FaTrash /></Button>
          </Card.Text>
        </Card.Body>
      </Card>
  );
};

export { ReservationCard };