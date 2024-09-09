import React from 'react';
import { Modal, Button, ListGroup } from 'react-bootstrap';
import PropTypes from 'prop-types';

const GenericModal = ({ show, handleClose, title, bodyText, items, onConfirm }) => {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {bodyText}
        {items.length > 0 ?
                <ListGroup style={{ maxHeight: '15rem', overflowY: 'scroll' }}>
                {items.map((item, index) => (
                  <ListGroup.Item key={index}>{item}</ListGroup.Item>
                ))}
              </ListGroup>
              : null}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        {bodyText.includes("delete") ?
          <Button variant="danger" onClick={onConfirm}>
            Delete
          </Button>
          :
          <Button variant="primary" onClick={onConfirm}>
            Confirm
          </Button>  
      }

      </Modal.Footer>
    </Modal>
  );
};

GenericModal.propTypes = {
  show: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  bodyText: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(PropTypes.string).isRequired,
  onConfirm: PropTypes.func.isRequired,
};

export { GenericModal };