import { useEffect, useState, useContext } from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import API from '../API';
import { LoadingLayout } from './Layout';
import UserContext from '../contexts/UserContext';
import { GenericModal } from './GenericModal';
import { getSeat } from '../services/utils';
import '../styles/OrdersList.css';

const OrdersList = (props) => {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [orderToDelete, setOrderToDelete] = useState(null);

    useEffect(() => {
        API.getBookedSeatsByUser().then(orders => {
            setOrders(orders);
            setIsLoading(false);
        }).catch(err => {
            console.log(err);
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
                    console.error(err);
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
                <div className='container px-4'>
                    <h2>Your Reservations</h2>
                    {orders.length === 0 ? (
                        <p>No reservations found.</p>
                    ) : (
                        <div>
                            {orders.map(order => (
                                <Row key={order.id} className="mb-3">
                                    <Col>
                                        <div className="d-flex justify-content-between align-items-center border rounded p-3 order-card">
                                            <div className="d-flex align-items-center">
                                                <i className="bi bi-dot" style={{ fontSize: '1.5rem', marginRight: '10px' }}></i>
                                                <div>
                                                    <h5>{order.concert_name}</h5>
                                                    <p><strong>Date:</strong> {order.concert_date}</p>
                                                    <p><strong>Seats:</strong> {order.seats.map(seat => getSeat(seat, order.columns)).join(', ')}</p>
                                                </div>
                                            </div>
                                            <Button variant="danger" onClick={() => handleDelete(order.id)}>Delete</Button>
                                        </div>
                                    </Col>
                                </Row>
                            ))}
                        </div>
                    )}
                </div>
            )}
            <GenericModal
                show={showModal}
                handleClose={() => setShowModal(false)}
                title="Confirm Deletion"
                bodyText="Are you sure you want to delete this reservation?"
                items={[]}
                onConfirm={confirmDelete}
            />
        </>
    );
};

export { OrdersList };