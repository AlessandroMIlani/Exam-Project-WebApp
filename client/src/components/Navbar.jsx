import {Container, Nav, Navbar as NavBootstrap, Button, NavDropdown, Col, Row} from 'react-bootstrap';
import { GiPirateFlag } from "react-icons/gi";
import { Link, Outlet } from 'react-router-dom';
import { useContext } from 'react';

import UserContext from '../contexts/UserContext';

function Navbar(props) {
  const userContext = useContext(UserContext);
  return (
    <>
      <NavBootstrap bg="dark" data-bs-theme="dark">
        <Container>
          <NavBootstrap.Brand as={Link} to="/">
            <GiPirateFlag /> <span>Pirate Ticket</span>
          </NavBootstrap.Brand>
          <Nav className="ms-auto">
            {userContext.loggedIn ? (
              <NavDropdown title={<span><i className="bi bi-person-circle"></i> <span>{userContext.user.email.split('@')[0]}</span></span>} id="basic-nav-dropdown">
                <NavDropdown.Item as={Link} to="/orders">Orders</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item as={Button} onClick={props.logout}>Logout</NavDropdown.Item>
              </NavDropdown>
            ) : (
              <Nav.Link as={Link} to="/login">Login</Nav.Link>
            )}
          </Nav>
        </Container>
      </NavBootstrap>
      <Outlet />
      <footer className="bg-light text-center text-lg-start mt-auto py-3">
        <Row>
          <Col>
          <p className="mb-0">WebApp Exam Project - PoliTO</p>
          <p className="mb-0">© Matricola: s332136</p>
          </Col>
        </Row>
      </footer>
    </>
  );
}

export { Navbar }