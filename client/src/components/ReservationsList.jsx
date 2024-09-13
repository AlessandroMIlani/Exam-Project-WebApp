import { useEffect, useState } from 'react';
import { Row, Container } from 'react-bootstrap';

import API from '../API';

import { LoadingLayout } from './Layout';
import { GenericModal } from './GenericModal';
import { ReservationCard } from './ReservationCard';

import '../styles/ReservationsList.css';

const ReservationsList = () => {
    const [reserverions, setReserverions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [reserverionToDelete, setReserverionToDelete] = useState(null);

    useEffect(() => {
        API.getBookedSeatsByUser().then(reserverions => {
            setReserverions(reserverions);
            setIsLoading(false);
        }).catch(err => {
            setIsLoading(false);
        });
    }, []);

    const handleDelete = (reserverionId) => {
        setReserverionToDelete(reserverionId);
        setShowModal(true);
    };

    const confirmDelete = () => {
        if (reserverionToDelete) {
            API.deleteBookedSeat(reserverionToDelete)
                .then(() => {
                    setReserverions(reserverions.filter(reserverion => reserverion.id !== reserverionToDelete));
                    setShowModal(false);
                    setReserverionToDelete(null);
                })
                .catch(err => {
                    setShowModal(false);
                    setReserverionToDelete(null);
                });
        }
    };

  return (
    <>
      {isLoading ? (
        <LoadingLayout />
      ) : (
        <Container className='main-content'>
          {reserverions.length === 0 ? (
            <h2 className='display-2 text-center my-2'>No reservations found.</h2>
          ) : (
            <>
              <h2 className='display-2 text-center my-3'>Your Reservations</h2>
              <Row>
                {reserverions.map(reserverion => (
                  <ReservationCard key={reserverion.id} reserverion={reserverion} handleDelete={handleDelete} />
                ))}
              </Row>
            </>
          )}
        </Container>
      )}
      <GenericModal
        show={showModal} title="Confirm Delete" items={[]}
        handleClose={() => setShowModal(false)}
        bodyText="Are you sure you want to delete this reservation?"
        onConfirm={confirmDelete}
      />
    </>
  );
};

export { ReservationsList };