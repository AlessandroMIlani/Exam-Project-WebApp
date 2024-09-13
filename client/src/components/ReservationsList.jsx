import { useEffect, useState } from 'react';
import { Row, Col, Container } from 'react-bootstrap';

import API from '../API';

import { LoadingLayout } from './Layout';
import { GenericModal } from './GenericModal';
import { ReservationCard } from './ReservationCard';

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
                                        <ReservationCard order={order} handleDelete={handleDelete} />
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