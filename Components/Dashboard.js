import React, { useState, useEffect } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import ErrorPage from './ErrorPage';
import { Container, Row, Col, Card } from 'react-bootstrap';
import Image from '../../src/dashboard.jpg'

export default function Dashboard() {
  const admin = JSON.parse(sessionStorage.getItem("user"));
  const navigate = useNavigate();
  const location = useLocation();

  const [violationsCount, setViolationsCount] = useState(0);
  const [complaintsCount, setComplaintsCount] = useState(0);
  const [usersCount, setUsersCount] = useState(0);

  // Simulating data fetch on component mount
  useEffect(() => {
    setViolationsCount(1200);  // Example data
    setComplaintsCount(450);   // Example data
    setUsersCount(1350);       // Example data
  }, []);

  function Logout() {
    sessionStorage.clear();
    navigate("/");
  }

  if (!admin.username) {
    return <ErrorPage />;
  }

  // Conditionally render statistics based on the current path
  const isDashboardPage = location.pathname === '/dashboard';

  return (
    <div>
      {/* Navbar */}
      <nav className="navbar navbar-dark bg-dark navbar-expand-lg">
        <Container fluid>
          <div>
            <span className="navbar-brand fw-bold fs-4 text-white">
            <Link className="text-white" to="/dashboard" style={{textDecoration:"none"}}>
                    Welcome Admin
                  </Link>
            </span>
          </div>
          <div className="collapse navbar-collapse" id="navbarScroll">
            <ul className="navbar-nav ms-auto" style={{ maxHeight: "100px" }}>
              <div className="d-flex my-1 justify-content-center">
                <li className="nav-item">
                  <Link className="nav-link text-white" to="violation">
                    View Violations
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-white" to="complaints">
                    View Complaints
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-white" to="vehicle">
                    Vehicle Details
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-white" to="password">
                    Update Password
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-white" to="/" onClick={Logout}>
                    Logout
                  </Link>
                </li>
              </div>
            </ul>
          </div>
        </Container>
      </nav>

      {/* Display statistics only on /dashboard route */}
      {isDashboardPage && (
        <Container className="my-4">
          <img src={Image} alt=""  width="100%" />
          <Row className="g-3 mt-4">
            {/* Violation Card */}
            <Col md={4} sm={12}>
              <Card className="text-white bg-danger">
                <Card.Body>
                  <Card.Title className="text-center">Violations</Card.Title>
                  <Card.Text className="display-4 text-center">{violationsCount}+</Card.Text>
                </Card.Body>
              </Card>
            </Col>

            {/* Complaints Card */}
            <Col md={4} sm={12}>
              <Card className="text-dark bg-warning">
                <Card.Body>
                  <Card.Title className="text-center">Complaints</Card.Title>
                  <Card.Text className="display-4 text-center">{complaintsCount}+</Card.Text>
                </Card.Body>
              </Card>
            </Col>

            {/* Users Card */}
            <Col md={4} sm={12}>
              <Card className="text-white bg-success">
                <Card.Body>
                  <Card.Title className="text-center">Users Registered</Card.Title>
                  <Card.Text className="display-4 text-center">{usersCount}+</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      )}

      {/* Outlet for child routes */}
      <Outlet />
    </div>
  );
}
