import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { Row, Col } from 'react-bootstrap';


import ConcertCard from './ConcertCard'; // Import the ConcertCard component

const ConcertList = (props) => {
  return (
    <>
      <div className='mx-auto w-25'>
        <h2 className='display-2'>Concerts</h2>
        search: <input className="form-control" type="text" />
      </div>
      <Row className='mt-3'>
        {props.Concerts.map((concert, index) => (
          <Col key={index} xs={12} md={4} lg={3} className='mb-3'>
            <ConcertCard concert={concert} />
          </Col>
        ))}
      </Row>
    </>
  );
};


export { ConcertList };