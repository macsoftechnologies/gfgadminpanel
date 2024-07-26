import React, { useState } from 'react';
import { Container, Row, Col, Form, FormGroup, Label, Input, Button } from 'reactstrap';
import { loginadmin } from 'service/service';
import { Navigate, useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await loginadmin(email, password);
      console.log(response,'response');
      const token = response.token;
      localStorage.setItem('token', token);
      setIsLoggedIn(true); 
    } catch (error) {
      setError('Invalid details, please try again.');
    }
  };


  if (isLoggedIn || localStorage.getItem('token')) {
    navigate('/admin/dashboard'); 
  }

  return (
    <Container>
      <Row className="justify-content-center mt-5">
        <Col md="4">
          <h2 className="text-center mb-4">Login</h2>
          <Form onSubmit={handleLogin}>
            <FormGroup>
              <Label for="email">Email</Label>
              <Input
                type="email"
                name="email"
                id="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormGroup>
            <FormGroup>
              <Label for="password">Password</Label>
              <Input
                type="password"
                name="password"
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </FormGroup>
            <Button color="primary" block>Login</Button>
          </Form>
          {error && <p className="text-danger mt-3">{error}</p>}
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
