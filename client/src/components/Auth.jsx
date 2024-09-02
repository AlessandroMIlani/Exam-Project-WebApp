import { useState } from 'react';
import { Form, Button, Alert, Col, Row } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';

function LoginForm(props) {
  const [username, setUsername] = useState('bessassommazou-4952@yopmail.com');
  const [password, setPassword] = useState('kZ2VW*et');

  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();


  const handleSubmit = (event) => {
    event.preventDefault();
    const credentials = { username, password };

    if (!username) {
      setErrorMessage('Username cannot be empty');
    } else if (!password) {
      setErrorMessage('Password cannot be empty');
    } else {
      props.login(credentials)
        .then(() => navigate("/"))
        .catch((err) => {
          setErrorMessage(err.error);
        });
    }
  };

  return (
    <Row className="justify-content-md-center">
      <Col xs={9} data-bs-theme="dark">
        <h2 className="display-3 mb-4">Login</h2>

        <Form onSubmit={handleSubmit} data-bs-theme="dark" className="p-3"style={{border: '1px solid black', borderRadius: '5px'}}>
          {errorMessage ? <Alert dismissible onClose={() => setErrorMessage('')} variant="danger">{errorMessage}</Alert> : null}
          <Form.Group className="mb-3">
            <Form.Label>E-m@il</Form.Label>
            <Form.Control
              type="email"
              value={username} placeholder="Example: john.doe@polito.it"
              onChange={(ev) => setUsername(ev.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              value={password} placeholder="Enter your password"
              onChange={(ev) => setPassword(ev.target.value)}
            />
          </Form.Group>
          <div style={{marginTop: '5rem'}}>
            <Button as={Link} to="/" className="me-2" variant='secondary'> &lt;&lt; Annulla</Button>

            <Button style={{float: 'right'}} variant="dark" type="submit">Login</Button>
          </div>
        </Form>
      </Col>
    </Row>

  )
};


function LoginButton(props) {
  const navigate = useNavigate();
  return (
    <Button variant="outline-light" onClick={() => navigate('/login')}>Login</Button>
  )
}

export { LoginForm, LoginButton };
