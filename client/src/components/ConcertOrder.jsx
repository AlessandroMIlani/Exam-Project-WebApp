import { React } from 'react';
import { Form, Button, Alert, Col, Row } from 'react-bootstrap';

const ConcertOrder = (props) => {

    const { preBookedSeats, setPreBookedSeats, totalSeats,  bookedSeats } = props;

    const confirmPreBooking = (preBookedSeats) => {
        console.log('Booking confirmed: ', preBookedSeats);
    }

    const BookRandSeats = (Nseats) => {
    }

    const maxSeats = bookedSeats.seats === undefined ? totalSeats  : totalSeats - bookedSeats.seats.length;

    return (
        <>
            {preBookedSeats.length > 0 ? preBookedSeats.map((seat, index) => (
                <p key={index}>{seat}</p>
            )) : <p> No seats selected</p>}
            <Form>
                <Form.Group as={Row} controlId="formSeats">
                    <Form.Label column sm={2}>Select a number of seats:</Form.Label>
                    <Col sm={10}>
                        <Form.Control type="number" min="1" max={maxSeats} />
                    </Col>
                </Form.Group>
                <Form.Group as={Row}>
                    <Col sm={{ span: 10, offset: 2 }}>
                        <Button variant="primary" onClick={() => confirmPreBooking(preBookedSeats)}>Confirm Pre-Booked Seats</Button>
                    </Col>
                </Form.Group>
            </Form>
        </>
    );

}



export { ConcertOrder };