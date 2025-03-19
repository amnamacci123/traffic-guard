import React from 'react';
import { Link } from 'react-router-dom';

export default function ErrorPage() {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center min-vh-100 bg-light">
      <h1 className="display-4 mb-4">Please Login...!!</h1>
      <p className="lead mb-5">You need to be logged in to access this page.</p>
      <Link to="/" className="btn btn-primary btn-lg">Login Page</Link>
    </div>
  );
}
