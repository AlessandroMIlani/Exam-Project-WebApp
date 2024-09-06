import { React, useState } from 'react';
import { Form, Button, ListGroup, Card, Toast } from 'react-bootstrap';
import API from '../API';
import { GenericModal } from './GenericModal';
import { FaTrash } from "react-icons/fa";
import { RiDiscountPercentFill } from "react-icons/ri";

const ConcertOrder = (props) => {
    const [showModal, setShowModal] = useState(false);
    const [showPrenotationModal, setShowPrenotationModal] = useState(false); // State variable for second modal
    const [numSeats, setNumSeats] = useState(1);
    const [showDiscountToast, setDiscountToast] = useState(false);
    const [discountMessage, setDiscountMessage] = useState('');

    const { preBookedSeats, setPreBookedSeats} = props;
    const { totalSeats,  concert} = props;
    const { bookedSeats, setbookedSeats } = props;
    const { setAlertMessage, setShowAlert, setErrorBookedSeats } = props;
    const { authToken, setAuthToken } = props;

    const confirmPreBooking = (toBookSeats) => {
        API.bookSeats(concert.id, toBookSeats).then(res => {
            setbookedSeats({
                id: bookedSeats.id,
                seats: [...bookedSeats.seats, ...toBookSeats]
            });
            getDiscount(preBookedSeats.map(seat => seat.label));
            setPreBookedSeats([]);
            setErrorBookedSeats([]);
            setAlertMessage('Seats successfully booked! Go to your prenotations to see the details.');
            setShowAlert(true);
        }).catch(err => {
            if(err.seats !== undefined){
                setAlertMessage(`sorry, but ${err.seats.length} ${err.seats.length > 1 ? 'seats are' : 'seat is'} already booked`);
                setErrorBookedSeats(err.seats);
                setPreBookedSeats({ seatsId: [], seatsLabel: [] });
                setShowAlert(true);
            }
            else{
            setAlertMessage('Booking failed. Please try again.');
            setShowAlert(true);
            }
        });
    }

    const getDiscount = (seats) => {
        if (authToken) {
            API.getDiscount(seats, authToken).then(res => {
                setDiscountMessage("You have Won a discount " + res.discount + "% Discount!! Valid for the upcoming concert season");
                setDiscountToast(true);
            }).catch(err => {
                // sistemare
                API.getAuthToken().then(resp => setAuthToken(resp.token));
                API.getDiscount(seats, authToken).then(res => {
                    setShowAlert(false);
                    setDiscountMessage("You have Won a discount " + res.discount + "% Discount!! Valid for the upcoming concert season");
                    setDiscountToast(true);
                }).catch(err => {
                    setAlertMessage('Discaunt non available.');
                    setShowAlert(true);
                });
            });
        }
    };

    const handleConfirmClick = () => { setShowModal(true); };

    const handleBookingClose = () => { setShowModal(false); };

    const handleDiscountClose = () => {  setDiscountToast(false); };

    const handlePrenotationClick = () => { setShowPrenotationModal(true); };

    const handlePrenotationByserverClose = () => { setShowPrenotationModal(false); };

    const confirmPrenotationByServer = () => {
        setPreBookedSeats({ seatsId: [], seatsLabel: [] });
        const availableSeats = Array.from({ length: totalSeats }, (_, i) => i + 1).filter(seat => !bookedSeats.seats.includes(seat));
        if (numSeats > availableSeats.length) {
            return;
        }
        const selectedSeats = availableSeats.slice(0, numSeats);
        confirmPreBooking(selectedSeats);
        setShowPrenotationModal(false);
    };



    const prenotationList = (seats) => {
        return (seats.map((seat, index) => {
            return <ListGroup.Item key={index}>{seat.label}<span onClick={() => handleRemoveSeat(index)} style={{ float: 'right', cursor: 'pointer' }}><FaTrash className='text-danger' /></span> </ListGroup.Item>;
        }));
    }

    const handleRemoveSeat = (index) => {
        const newSeats = [...preBookedSeats];
        newSeats.splice(index, 1);
        setPreBookedSeats(newSeats);
    }

    const maxSeats = bookedSeats.seats === undefined ? totalSeats : totalSeats - bookedSeats.seats.length;

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
                                max={maxSeats}
                                onChange={(e) => setNumSeats(e.target.value)}
                            />
                            <Button variant="dark" onClick={handlePrenotationClick} className="mt-2 w-50">Make server choose seats</Button>
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
                show={showModal}
                handleClose={handleBookingClose}
                title="Confirm Booking"
                bodyText="Are you sure you want to book the following seats?"
                items={preBookedSeats.map(seat => seat.label)}
                onConfirm={() => {
                    confirmPreBooking(preBookedSeats.map(seat => seat.id));
                    handleBookingClose();
                }} />

            <GenericModal
                show={showPrenotationModal}
                handleClose={handlePrenotationByserverClose}
                title="Create Prenotation"
                bodyText={`Are you sure you want to create a prenotation with ${numSeats} seats? \n Alredy selected seats will be lost.`}
                items={[]}
                onConfirm={() => {
                    confirmPrenotationByServer();
                    handlePrenotationByserverClose();
                }}
            />

            <Toast className='position-absolute top-0 start-50 translate-middle-x mx-3 my-3' 
                    onClose={handleDiscountClose} show={showDiscountToast} animation={true}>
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