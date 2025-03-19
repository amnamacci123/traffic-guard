import React, { useEffect, useState } from "react";
import axios from "axios";
import { baseurl } from "../App";
import { Table, Modal, Button, Form } from "react-bootstrap";

const ViewViolation = () => {
  const [violations, setViolations] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [editedVehicleNumber, setEditedVehicleNumber] = useState("");
  const [violationid, setViolationId] = useState('')

  const handleGetViolations = async () => {
    try {
      const response = await axios.post(
        baseurl,
        new URLSearchParams({
          tag: "getviolationsdata",
        }),
        {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        }
      );
  
      if (response.data) {
        const sortedViolations = response.data.sort((a, b) => {

          const dateA = new Date(a.datetime); 
          const dateB = new Date(b.datetime);
          return dateB - dateA; 
        });
  
        setViolations(sortedViolations); 
      }
    } catch (error) {
      console.log(
        error?.response?.data?.message || "An error occurred while fetching violations data."
      );
    }
  };
  

  useEffect(() => {
    handleGetViolations();
  }, []);

  const handleImageClick = (image, vehicleNumber,violationid) => {
    setSelectedImage(image);
    setEditedVehicleNumber(vehicleNumber); 
    setViolationId(violationid)
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedImage(null);
    setEditedVehicleNumber(""); 
    setViolationId("")
  };

  const handleSaveVehicleNumber = async () => {
    try {
      const response = await axios.post(
        baseurl,
        new URLSearchParams({
          tag: "updatevnumber",
          id: violationid,
          vnumber: editedVehicleNumber,
        }),
        {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        }
      );
      
      if (response.data && response.data.error === 0) {
        alert("Vehicle number updated successfully.");
        handleGetViolations(); // Refresh the violations list
        closeModal(); // Close the modal
      } else {
        alert(response.data.message || "Failed to update vehicle number.");
      }
    } catch (error) {
      alert(error.response?.data?.message || "An error occurred. Please try again.");
    }
  };

  const sendSms = async (violation) => {
    try {
      const response = await axios.post(
        baseurl,
        new URLSearchParams({
          tag: "sendsms",
          violationid: violation.violationid,
          vnumber: violation.vnumber,
          fine: violation.fine,
          finestatus: "Confirmed",
        }),
        {
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
        }
      );
  
      if (response.data.status === "success") {
        alert(response.data.message); // "SMS sent successfully."
        handleGetViolations();
      } else {
        alert(`Error: ${response.data.message || "SMS sending failed."}`);
        console.log(response.data);
      }
    } catch (error) {
      alert(error.response?.data?.message || "An error occurred. Please try again.");
      console.log(error.response);
    }
  };
  
  

  return (
    <div className="container">
      <h4 className="text-center my-4">Violation Records</h4>
      <Table className="text-center" striped bordered hover>
        <thead>
          <tr>
            <th>Sl No.</th>
            <th>Violation Type</th>
            <th>Fine Amount</th>
            <th>Violation Date</th>
            <th>Vehicle Number</th>
            <th>Image</th>
            <th>Location</th>
            <th>Posted By</th>
            <th>Fine Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {violations.length > 0 ? (
            violations.map((violation) => (
              <tr key={violation.violationid}>
                <td>{violation.violationid}</td>
                <td>{violation.type}</td>
                <td>₹ {violation.fine}/-</td>
                <td>{violation.datetime}</td>
                <td>{violation.vnumber || "No Number"}</td>
                <td>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      handleImageClick(violation.image, violation.vnumber,violation.violationid);
                    }}
                    style={{ color: "blue", textDecoration: "underline" }}
                  >
                    View
                  </a>
                </td>
                <td>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${violation.latitude},${violation.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "blue", textDecoration: "underline" }}
                  >
                    View
                  </a>
                </td>

                <td>{violation.username}</td>
                <td>{violation.finestatus}</td>
                <td>
                  {violation.finestatus === "Pending" && 
                    <Button
                      variant="warning"
                      onClick={() => sendSms(violation)}
                    >
                      Send SMS
                    </Button>
                  }
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9">No violations found.</td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* Modal for displaying the image and editing vehicle number */}
      <Modal show={showModal} onHide={closeModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Violation Image</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <img
            src={selectedImage}
            alt="Selected Violation"
            style={{ width: "100%" }}
          />
          <Form className="mt-3">
            <Form.Group controlId="vehicleNumber">
              <Form.Label>Edit Vehicle Number</Form.Label>
              <Form.Control
                type="text"
                value={editedVehicleNumber}
                onChange={(e) => setEditedVehicleNumber(e.target.value)}
                placeholder="Enter Vehicle Number"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSaveVehicleNumber}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ViewViolation;
