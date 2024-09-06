import 'bootstrap/dist/css/bootstrap.min.css';
import { React, useEffect, useState } from 'react';
import { Row, Col, Form, FormControl, InputGroup } from 'react-bootstrap';
import { FaSearch } from "react-icons/fa";

import ConcertCard from './ConcertCard'; // Import the ConcertCard component

const ConcertList = (props) => {
  // TODO: Implement the search functionality
  const [filterConcerts, setFilterConcerts] = useState([]);
  const [sortOption, setSortOption] = useState('alphabetical');

  useEffect(() => {
    setFilterConcerts(props.Concerts);
  }, [props.Concerts]);

  const handleSearch = (event) => {
    const searchValue = event.target.value;
    const filteredConcerts = props.Concerts.filter((concert) =>
      concert.name.toLowerCase().includes(searchValue.toLowerCase())
    );
    setFilterConcerts(filteredConcerts);
  };


  return (
    <>
      <div className="text-center">      
        <h2 className='display-2'>Concerts</h2>
      </div>
      <div className='mx-auto w-25 my-3'>
        <Row>
          <Col>
            <Form>
              <InputGroup>
                <InputGroup.Text id="btnSearcher"><FaSearch /></InputGroup.Text>
                <FormControl
                  type='text'
                  placeholder='Search'
                  className='mr-sm-2'
                  onChange={handleSearch}
                />
              </InputGroup>
            </Form>
          </Col>
        </Row>
      </div>
      <Row className='mt-3'>
        {filterConcerts.map((concert, index) => (
          <Col key={index} xs={12} md={4} lg={3} className='mb-3'>
            <ConcertCard concert={concert} />
          </Col>
        ))}
      </Row>
    </>
  );
};


export { ConcertList };