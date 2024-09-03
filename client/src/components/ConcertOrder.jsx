import { React, useState } from 'react';
import { Form, Button, Modal, Col, Row, ButtonGroup } from 'react-bootstrap';
import API from '../API';
import { GenericModal } from './GenericModal';

const ConcertOrder = (props) => {
    const [showModal, setShowModal] = useState(false);
    const [showPrenotationModal, setShowPrenotationModal] = useState(false); // State variable for second modal
    const [numSeats, setNumSeats] = useState(1);


    const { preBookedSeats, setPreBookedSeats, totalSeats, bookedSeats, setSeats, concert } = props;


    const confirmPreBooking = (toBookSeats) => {
        API.bookSeats(concert.id, toBookSeats).then(res => {
            console.log(res);
            setSeats([...seats.seats, ...toBookSeats]);
            setPreBookedSeats({ seatsId: [], seatsLabel: [] });

        }).catch(err => {
            console.log(err);

        });
    }

    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    const handleConfirmClick = () => {
        setShowModal(true);
    };

    const handleClose = () => {
        setShowModal(false);
    };

    const handlePrenotationClick = () => {
        setShowPrenotationModal(true);
    };

    const handlePrenotationClose = () => {
        setShowPrenotationModal(false);
    };

    const confirmPrenotation = () => {
        setPreBookedSeats({ seatsId: [], seatsLabel: [] });
        const availableSeats = Array.from({ length: totalSeats }, (_, i) => i + 1).filter(seat => !bookedSeats.seats.includes(seat));
        if (numSeats > availableSeats.length) {
            console.error('Not enough available seats');
            return;
        }
        const selectedSeats = availableSeats.slice(0, numSeats);
        console.log(`Prenotation created with seats: ${selectedSeats}`);
        confirmPreBooking(selectedSeats);
        // Add your prenotation logic here
        setShowPrenotationModal(false);
    };

    const maxSeats = bookedSeats.seats === undefined ? totalSeats : totalSeats - bookedSeats.seats.length;

    return (
        <>
            <h2>Cart</h2>
            <Form>
                <Form.Group as={Row} controlId="formSeats">
                    <Form.Label column sm={2}>Select a number of seats:</Form.Label>
                    <Row>
                        <Col sm={10}>
                            <Form.Control type="number" min="1" max={maxSeats} onChange={(e) => setNumSeats(e.target.value)} />
                        </Col>
                        <Col>
                            <Button variant="primary" onClick={handlePrenotationClick} className="ml-2">make server choose seats</Button>
                        </Col>
                    </Row>
                </Form.Group>
                <ul>
                    {preBookedSeats.seatsLabel.length > 0 ? preBookedSeats.seatsLabel.map((seat, index) => (
                        <li key={index}>{seat}</li>
                    )) : <p> No seats selected</p>}
                </ul>
                <Form.Group as={Row}>
                    <Col sm={{ span: 10, offset: 2 }}>
                        <Button variant="primary" onClick={handleConfirmClick}>Confirm selected seats</Button>
                    </Col>
                </Form.Group>
            </Form>

            <GenericModal
                show={showModal}
                handleClose={handleClose}
                title="Confirm Booking"
                bodyText="Are you sure you want to book the following seats?"
                items={preBookedSeats.seatsLabel}
                onConfirm={() => confirmPreBooking(preBookedSeats.seatsId)} />

            <GenericModal
                show={showPrenotationModal}
                handleClose={handlePrenotationClose}
                title="Create Prenotation"
                bodyText={`Are you sure you want to create a prenotation with ${numSeats} seats? \n Alredy selected seats will be lost.`}
                items={[]}
                onConfirm={confirmPrenotation}
            />

        </>
    );

}



export { ConcertOrder };