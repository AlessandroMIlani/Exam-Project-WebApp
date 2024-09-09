import { React, useState, useContext } from 'react';
import { Form, Button, ListGroup, Card, Toast } from 'react-bootstrap';
import { FaTrash } from "react-icons/fa";
import { RiDiscountPercentFill } from "react-icons/ri";

import API from '../API';

import { GenericModal } from './GenericModal';
import UserContext from '../contexts/UserContext';


const ConcertOrder = (props) => {
    const [showModal, setShowModal] = useState(false);
    const [showPrenotationModal, setShowPrenotationModal] = useState(false); // State variable for second modal
    const [numSeats, setNumSeats] = useState(1);
    const [showDiscountToast, setDiscountToast] = useState(false);
    const [discountMessage, setDiscountMessage] = useState('');

    const { preBookedSeats, setPreBookedSeats, bookedSeats, setbookedSeats, concert } = props;
    const { setAlertMessage, setShowAlert, setErrorBookedSeats } = props;


    const userContext = useContext(UserContext);


    const confirmPreBooking = (toBookSeats) => {
        API.bookSeats(concert.id, toBookSeats).then(res => {
            setbookedSeats({ id: bookedSeats.id, seats: [...bookedSeats.seats, ...toBookSeats] });
            getDiscount(preBookedSeats.map(seat => seat.label));
            setPreBookedSeats([]);
            setErrorBookedSeats([]);
            setAlertMessage('Seats successfully booked! Go to your prenotations to see the details.');
            setShowAlert(true);
        }).catch(err => {
            if (err.seats !== undefined) {
                setAlertMessage(`sorry, but ${err.seats.length} ${err.seats.length > 1 ? 'seats are' : 'seat is'} already booked`);
                setErrorBookedSeats(err.seats);
                setPreBookedSeats({ seatsId: [], seatsLabel: [] });
                setShowAlert(true);
            }
            else {
                setAlertMessage('Booking failed. Please try again.');
                setShowAlert(true);
            }
        });
    }

    const confirmPrenotationByServer = () => {
        setPreBookedSeats([]);
        const availableSeats = Array.from({ length: concert.total_seats }, (_, i) => i + 1).filter(seat => !bookedSeats.seats.includes(seat));
        if (numSeats > availableSeats.length) { return; }
        confirmPreBooking(availableSeats.slice(0, numSeats));
        setShowPrenotationModal(false);
    };

    const getDiscount = (seats) => {
        if (userContext.authToken) {
            API.getDiscount(seats, userContext.authToken).then(res => {
                setDiscountMessage("You have Won a " + res.discount + "% discount!! Valid for the upcoming concert season");
                setDiscountToast(true);
            }).catch(err => {
                setAlertMessage('Discount non available.');
                setShowAlert(true);
            });
        }
    };

    // Handlers for modals and toasts
    const handleConfirmClick = () => { setShowModal(true); };
    const handleBookingClose = () => { setShowModal(false); };
    const handleDiscountClose = () => { setDiscountToast(false); };

    const handlePrenotationClick = () => { setShowPrenotationModal(true); };
    const handlePrenotationByserverClose = () => { setShowPrenotationModal(false); };

    const handleRemoveSeat = (index) => {
        const newSeats = [...preBookedSeats];
        newSeats.splice(index, 1);
        setPreBookedSeats(newSeats);
    }

    const prenotationList = (seats) => {
        return (seats.map((seat, index) => {
            return <ListGroup.Item key={index}>{seat.label}<span onClick={() => handleRemoveSeat(index)} style={{ float: 'right', cursor: 'pointer' }}><FaTrash className='text-danger' /></span> </ListGroup.Item>;
        }));
    }

    return (
        <>
            <Card>
                <Card.Body>
                    <Form>
                        <Form.Group controlId="formSeats">
                            <Form.Label>Select a number of seats:</Form.Label>
                            <Form.Control
                                type="number"
                                min="1"
                                max={concert.total_seats - bookedSeats.seats.length}
                                value={numSeats}
                                onChange={(e) => {
                                    if (e.target.value > 1) {
                                        const newValue = Math.min(e.target.value, concert.total_seats - bookedSeats.seats.length);
                                        setNumSeats(newValue);
                                    } else { setNumSeats(e.target.value); }
                                }}
                            />
                            <Button className='mt-2' variant="dark" onClick={handlePrenotationClick}>Prenotate</Button>
                        </Form.Group>
                    </Form>
                </Card.Body>
            </Card>

            {preBookedSeats.length > 0 ?
                <Card className='mt-2'>
                    <Card.Body>
                        <Button className='w-50 mb-2' variant="dark"
                            onClick={handleConfirmClick}>Confirm selected seats
                        </Button>
                        <ListGroup style={{ maxHeight: '15rem', overflowY: 'scroll' }}>
                            {prenotationList(preBookedSeats)}
                        </ListGroup>
                    </Card.Body>
                </Card>
                : null}

            <GenericModal
                show={showModal} items={preBookedSeats.map(seat => seat.label)}
                handleClose={handleBookingClose} title="Confirm Booking"
                bodyText="Are you sure you want to book the following seats?"
                onConfirm={() => {
                    confirmPreBooking(preBookedSeats.map(seat => seat.id));
                    handleBookingClose();
                }} />

            <GenericModal
                show={showPrenotationModal} items={[]}
                handleClose={handlePrenotationByserverClose} title="Create Prenotation"
                bodyText={`Are you sure you want to create a prenotation with ${numSeats} seats? \n Alredy selected seats will be lost.`}
                onConfirm={() => {
                    confirmPrenotationByServer();
                    handlePrenotationByserverClose();
                }}
            />
                <Toast style={{ zIndex: '200' }} delay={6000} animation={true} autohide
                    className='position-absolute top-0 start-50 translate-middle-x mx-3 my-3'
                    onClose={handleDiscountClose} show={showDiscountToast} >
                    <Toast.Header>
                        <RiDiscountPercentFill />
                        <strong className="me-auto">Discount</strong>
                    </Toast.Header>
                    <Toast.Body>{discountMessage}</Toast.Body>
                </Toast>
        </>
    );
}

export { ConcertOrder };