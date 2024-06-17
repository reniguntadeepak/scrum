import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthProvider';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar, Nav, NavDropdown, Container } from 'react-bootstrap';

function NavigationBar() {
  const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    const response = await fetch('/logout', {
      method: 'POST',
    });

    if (response.ok) {
      setIsAuthenticated(false);
      navigate('/loginpage');
    } else {
      console.error('Failed to logout');
    }
  };

  return (
    <Navbar bg="light" variant="navbar-light" expand="lg" style={{backgroundColor: "#e3f2fd"}}>
      <Container>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/home">Home</Nav.Link>
            <Nav.Link as={Link} to="/about">About</Nav.Link>
            <Nav.Link as={Link} to="/session">Create Session</Nav.Link>
            <Nav.Link as={Link} to="/joinsession">Join Session</Nav.Link>
          </Nav>
          <Nav>
            {!isAuthenticated ? (
              <>
                <Nav.Link as={Link} to="/loginpage">Login</Nav.Link>
                <Nav.Link as={Link} to="/signinpage">Sign In</Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavigationBar;
