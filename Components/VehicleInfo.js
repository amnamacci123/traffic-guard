import React, { useState, useEffect } from "react";
import { Card, Button, Form, Table, Alert } from "react-bootstrap";
import axios from "axios";
import { baseurl } from "../App";

const VehicleInfo = () => {
  const [name, setName] = useState("");
  const [vnumber, setVnumber] = useState("");
  const [mobile, setMobile] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [vList, setVList] = useState([]);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertVariant, setAlertVariant] = useState(""); 

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    try {
      const response = await axios.post(
        baseurl,
        new URLSearchParams({
          tag: "getvehicles",
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      if (response.data) {
        setVList(response.data || []);
      }
    } catch (error) {
      setAlertMessage(error.response?.data?.message || "Error fetching data.");
      setAlertVariant("danger");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        baseurl,
        new URLSearchParams({
          tag: "addvehicle",
          name: name,
          vnumber: vnumber,
          mobile: mobile,
          email:email,
          address: address,
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      setAlertMessage("Data added successfully!");
      setAlertVariant("success");
      fetchVehicles();
      setName("");
      setVnumber("");
      setMobile("");
      setAddress(""); 
    } catch (error) {
      setAlertMessage(error.response?.data?.message || "An error occurred.");
      setAlertVariant("danger");
    }
  };

  return (
    <div className="mt-4">
      <div className="row m-0 p-0">
        <div className="col-md-4">
          <Card>
            <Card.Body>
              <h5 className="text-center mb-4">Add Vehicle Info</h5>
              {alertMessage && (
                <Alert variant={alertVariant}>{alertMessage}</Alert>
              )}
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="name">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Enter your name"
                    className="mb-3"
                  />
                </Form.Group>
                <Form.Group controlId="vehicleRegNo">
                  <Form.Label>Vehicle Reg No:</Form.Label>
                  <Form.Control
                    type="text"
                    value={vnumber}
                    onChange={(e) => setVnumber(e.target.value.toUpperCase())}
                    required
                    placeholder="Enter vehicle registration number"
                    className="mb-3"
                  />
                </Form.Group>
                <Form.Group controlId="mobileNo">
                  <Form.Label>Mobile No:</Form.Label>
                  <Form.Control
                    type="text"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    required
                    pattern="^[0-9]{10}$"
                    maxLength="10"
                    title="Mobile number must be 10 digits"
                    placeholder="Enter your mobile number"
                    className="mb-3"
                  />
                </Form.Group>
                <Form.Group controlId="email">
                  <Form.Label>Email:</Form.Label>
                  <Form.Control
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Enter your email"
                    className="mb-3"
                  />
                </Form.Group>
                <Form.Group controlId="address">
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                    as="textarea"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                    rows={3}
                    placeholder="Enter your address"
                              className="mb-3"
                  />
                </Form.Group>
                <Button variant="warning" type="submit">
                  Submit
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </div>

        {/* Vehicle List Table */}
        <div className="col-md-8 mt-4">
          <Card>
            <Card.Body>
              <h5 className="text-center mb-4">Vehicle List</h5>
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Vehicle Reg No</th>
                    <th>Mobile No</th>
                    <th>Address</th>
                  </tr>
                </thead>
                <tbody>
                  {vList.length > 0 ? (
                    vList.map((vehicle) => (
                      <tr key={vehicle.id}>
                        <td>{vehicle.name}</td>
                        <td>{vehicle.vnumber}</td>
                        <td>{vehicle.mobile}</td>
                        <td>{vehicle.email}</td>
                        <td>{vehicle.address}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center">
                        No vehicles available.
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default VehicleInfo;
