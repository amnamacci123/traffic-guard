import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { baseurl } from '../App';
import { FaUserAlt } from 'react-icons/fa';
import { RiLockPasswordFill } from 'react-icons/ri';
import { Button } from 'react-bootstrap';

export default function Login() {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault(); 
    if (!userId || !password) {
      alert('Please fill all fields');
      return;
    }

    try {
      const response = await axios.post(
        baseurl,
        new URLSearchParams({
          tag: "adminlogin",
          username: userId,
          password: password,
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      if (response.data && response.data.error === 0) {
        console.log(response.data);
        
        sessionStorage.setItem('user', JSON.stringify(response.data));
        alert("Login successfully");
        navigate('/dashboard');
      } else {
        alert(response.data.message || "Invalid credentials");
      }
    } catch (error) {
      alert(error.response?.data?.message || "An error occurred. Please try again.");
    }
  };

  
  return (
    <div className="row m-0">
      <div className="col-6 bg-danger bg" style={{ height: "100vh" }}>
        <h1 className="text">Traffic Guard</h1>
      </div>
      <div className="col-lg-6" style={{ height: "100vh" }}>
        <div className="log1 w-50">
          <h1 className="text-center">Login</h1>
          <form onSubmit={handleLogin}>
            <div className="input-group my-4">
              <span className="input-group-text">
                <FaUserAlt />
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Enter Username"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                required
              />
            </div>
            <div className="input-group my-4">
              <span className="input-group-text">
                <RiLockPasswordFill />
              </span>
              <input
                type="password"
                className="form-control"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div>
              <Button variant="dark" type="submit">
                Login
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
