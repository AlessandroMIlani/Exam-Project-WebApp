import { useState } from 'react';
import { Form, Button, Alert, Col, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function LoginForm(props) {
  const [email, setEmail] = useState('mario@nintendo.com');
  const [password, setPassword] = useState('kZ2VW*et');

  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    const credentials = { email, password };
    if (!email) {
      setErrorMessage('Email cannot be empty');
    } else if (!password) {
      setErrorMessage('Password cannot be empty');
    } else {
      props.login(credentials)
        .then((res) => {
          if (res.code === 200) {
            navigate(-1);
          } else {
            props.handleErrors(err); 
            setErrorMessage("How did you end up here?: " + res.message); // If the return from the api is not 200 but also not an error
          }
        })
        .catch((err) => {
          props.handleErrors(err);
          setErrorMessage(err.message);
        });
    }
  };

  return (
    <Row className="d-flex  justify-content-md-center main-content my-3">
      <Col xs={7} data-bs-theme="dark">
        <h2 className="display-3 mb-4">Login</h2>
        <Form onSubmit={handleSubmit} data-bs-theme="dark" className="p-3" style={{border: '1px solid black', borderRadius: '5px'}}>
          {errorMessage ? <Alert dismissible onClose={() => setErrorMessage('')} variant="danger">{errorMessage}</Alert> : null}
          <Form.Group className="mb-3">
            <Form.Label>E-m@il</Form.Label>
            <Form.Control
              type="email" value={email} placeholder="Example: john.doe@polito.it"
              onChange={(ev) => setEmail(ev.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password" value={password} placeholder="Enter your password"
              onChange={(ev) => setPassword(ev.target.value)}
            />
          </Form.Group>
          <div style={{marginTop: '5rem'}}>
          <Button onClick={() => navigate(-1)} className="me-2" variant='secondary'> &lt;&lt; Back</Button>
            <Button style={{float: 'right'}} variant="dark" type="submit">Login</Button>
          </div>
        </Form>
      </Col>
    </Row>

  )
};

export { LoginForm };