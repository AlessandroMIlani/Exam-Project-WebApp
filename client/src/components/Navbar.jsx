import {Container, Nav, Navbar as NavBootstrap, Button, NavDropdown} from 'react-bootstrap';
import { GiPirateFlag } from "react-icons/gi";
import { Link, Outlet } from 'react-router-dom';
import { useContext } from 'react';
import { FaUser } from "react-icons/fa";
import { GiPirateHat } from "react-icons/gi";

import UserContext from '../contexts/UserContext';

import "../styles/Navbar.css";

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
              <NavDropdown title={<span>{userContext.user.isLoyal ? <GiPirateHat size={20} /> : <FaUser size={20} />}  {userContext.user.email.split('@')[0]}</span>} id="basic-nav-dropdown">
                <NavDropdown.Item as={Link} to="/reservations">Reservations</NavDropdown.Item>
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
    </>
  );
}

export { Navbar }