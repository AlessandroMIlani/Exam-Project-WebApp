import { useEffect, useState, useContext } from 'react';
import { Row, Col, Button, Container, Card } from 'react-bootstrap';
import { FaTrash } from "react-icons/fa";

import API from '../API';

import { LoadingLayout } from './Layout';
import { getSeat } from '../services/utils';
import { GenericModal } from './GenericModal';

import '../styles/ReservationsList.css';

const ReservationsList = () => {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [orderToDelete, setOrderToDelete] = useState(null);

    useEffect(() => {
        API.getBookedSeatsByUser().then(orders => {
            setOrders(orders);
            setIsLoading(false);
        }).catch(err => {
            setIsLoading(false);
        });
    }, []);

    const handleDelete = (orderId) => {
        setOrderToDelete(orderId);
        setShowModal(true);
    };

    const confirmDelete = () => {
        if (orderToDelete) {
            API.deleteBookedSeat(orderToDelete)
                .then(() => {
                    setOrders(orders.filter(order => order.id !== orderToDelete));
                    setShowModal(false);
                    setOrderToDelete(null);
                })
                .catch(err => {
                    setShowModal(false);
                    setOrderToDelete(null);
                });
        }
    };

    return (
        <>
            {isLoading ? (
                <LoadingLayout />
            ) : (
                <Container className='main-content'>
                    {orders.length === 0 ? (
                        <h2 className='display-2 text-center my-2'>No reservations found.</h2>
                    ) : (
                        <>
                            <h2 className='display-2 text-center my-3'>Your Reservations</h2>
                            <Row>
                                {orders.map(order => (
                                    <Col xs={12} md={4} lg={3} className='mb-3' key={order.id}>
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
                                    </Col>
                                ))}
                            </Row>
                        </>
                    )}
                </Container>
            )}
            <GenericModal
                show={showModal} title="Confirm Delete"  items={[]}
                handleClose={() => setShowModal(false)}
                bodyText="Are you sure you want to delete this reservation?"
                onConfirm={confirmDelete}
            />
        </>
    );
};

export { ReservationsList };