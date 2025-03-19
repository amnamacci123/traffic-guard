import React, { useState } from 'react';
import { Form, Button, Alert, Container } from 'react-bootstrap';
import axios from 'axios';
import { baseurl } from '../App';

const UpdatePassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');


  const handleUpdatePassword = async (event) => {
    event.preventDefault();

    // Basic validation
    if (!newPassword || !confirmPassword) {
      alert('Please fill all fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New password and confirmation do not match.');
      return;
    }

    try {
      const user = JSON.parse(sessionStorage.getItem('user'));
      const username = user?.username;

      // Send the update password request
      const response = await axios.post(
        baseurl,
        new URLSearchParams({
          tag: 'updatepassword',
          username: username,
          password: newPassword,
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      if (response.data && response.data.error === 0) {
        setMessage('Password updated successfully.');
        setError('');
        // Clear the form
        setNewPassword('');
        setConfirmPassword('');

      } else {
        setError(response.data.message || 'Error updating password.');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'An error occurred. Please try again.');
    }
  };

  return (
    <Container style={{ maxWidth: '500px', marginTop: '50px' }}>
      <h4 className="text-center">Update Password</h4>
      {message && <Alert variant="success">{message}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleUpdatePassword}>

        <Form.Group controlId="newPassword" className="mb-3">
          <Form.Label>New Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="confirmPassword" className="mb-3">
          <Form.Label>Confirm New Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </Form.Group>

        <Button variant="warning" type="submit" className="w-100">
          Update Password
        </Button>
      </Form>
    </Container>
  );
};

export default UpdatePassword;
