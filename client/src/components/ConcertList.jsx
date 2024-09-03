import 'bootstrap/dist/css/bootstrap.min.css';
import {React, useEffect, useState} from 'react';
import { Row, Col, Form, FormControl, DropdownButton, Dropdown } from 'react-bootstrap';


import ConcertCard from './ConcertCard'; // Import the ConcertCard component

const ConcertList = (props) => {
  // TODO: Implement the search functionality
  const [filterConcerts, setFilterConcerts] = useState([]);
  const [sortOption, setSortOption] = useState('alphabetical');

  useEffect(() => {
    setFilterConcerts(props.Concerts);
  }, [props.Concerts]);

  const handleSearch = (event) => {
    console.log(event.target.value);
    const searchValue = event.target.value ;
    const filteredConcerts = props.Concerts.filter((concert) =>
      concert.name.toLowerCase().includes(searchValue.toLowerCase())
    );
    setFilterConcerts(filteredConcerts);
  };

  const handleSort = (option) => {
    setSortOption(option);
    let sortedConcerts = [...filterConcerts];
    switch (option) {
      case 'alphabetical':
        sortedConcerts.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'date':
        sortedConcerts.sort((a, b) => new Date(a.date) - new Date(b.date));
        break;
      case 'reverseAlphabetical':
        sortedConcerts.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'reverseDate':
        sortedConcerts.sort((a, b) => new Date(b.date) - new Date(a.date));
        break;
      default:
        break;
    }
    setFilterConcerts(sortedConcerts);
  };


  return (
    <>
      <div className='mx-auto w-25'>
        <h2 className='display-2'>Concerts</h2>
        <Row>
          <Col>
        <Form>
          <FormControl
            type='text'
            placeholder='Search'
            className='mr-sm-2'
            onChange={handleSearch}
          />
        </Form>
        </Col>
        <Col>
        <DropdownButton
          id="dropdown-basic-button"
          title={"Sorted in " + sortOption + " order"} 
          className="mt-3"
          onSelect={handleSort}
        >
          <Dropdown.Item eventKey="alphabetical">Alphabetical</Dropdown.Item>
          <Dropdown.Item eventKey="date">Date</Dropdown.Item>
          <Dropdown.Item eventKey="reverseAlphabetical">Reverse Alphabetical</Dropdown.Item>
          <Dropdown.Item eventKey="reverseDate">Reverse Date</Dropdown.Item>
        </DropdownButton>
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