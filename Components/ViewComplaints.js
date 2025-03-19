import React, { useEffect, useState } from "react";
import axios from "axios";
import { baseurl } from "../App";
import { Button, Modal, Form } from "react-bootstrap";

const ViewComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [responseText, setResponseText] = useState("");
  const [showImageModal, setShowImageModal] = useState(false);
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedComplaintId, setSelectedComplaintId] = useState(null);

  // Fetch complaints data
  const fetchComplaints = async () => {
    try {
      const response = await axios.post(
        baseurl,
        new URLSearchParams({
          tag: "getcomplaints",
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
  
      if (response.data) {

        const sortedComplaints = response.data.sort((a, b) => {
          const dateA = new Date(a.datetime);
          const dateB = new Date(b.datetime);
          return dateB - dateA; 
        });
        setComplaints(sortedComplaints);
      }
    } catch (error) {
      console.log(
        error.response?.data?.message ||
          "An error occurred while fetching complaints data."
      );
    }
  };
  

  console.log(complaints);
  
  // Handle image modal
  const handleImageClick = (image) => {
    setSelectedImage(image);
    setShowImageModal(true);
  };

  const closeImageModal = () => {
    setShowImageModal(false);
    setSelectedImage(null);
  };

  // Handle response modal
  const openResponseModal = (complaintId) => {
    setSelectedComplaintId(complaintId);
    setResponseText(""); // Clear previous text
    setShowResponseModal(true);
  };

  const closeResponseModal = () => {
    setShowResponseModal(false);
    setSelectedComplaintId(null);
  };

  // Send response
  const handleSendResponse = async () => {
    try {
      await axios.post(
        baseurl,
        new URLSearchParams({
          tag: "updateresponse",
          id: selectedComplaintId,
          response: responseText,
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      alert("Response sent successfully");
      closeResponseModal();
      fetchComplaints(); // Refresh complaints list after sending response
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "An error occurred while sending the response."
      );
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  return (
    <div className="container">
      <h4 className="text-center my-3">Manage Complaints</h4>
      <table className="table ">
        <thead>
          <tr>
            <th>Complaint ID</th>
            <th>Name</th>
            <th>Description</th>
            <th>Date</th>
            <th>Location</th>
            <th>Image</th>
            <th>Reply</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {complaints.length > 0 ? (
            complaints.map((complaint) => (
              <tr key={complaint.id}>
                <td>{complaint.id}</td>
                <td>{complaint.username}</td>
                <td>{complaint.description}</td>
                <td>{complaint.datetime}</td>
                <td>
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${complaint.latitude},${complaint.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "blue", textDecoration: "underline" }}
                  >
                    View on Map
                  </a>
                </td>
                <td>
                  {complaint.image ? (
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handleImageClick(complaint.image);
                      }}
                      style={{ color: "blue", textDecoration: "underline" }}
                    >
                      View Image
                    </a>
                  ) : (
                    "No Image"
                  )}
                </td>
                <td>{complaint?.response}</td>
                <td
                  className={
                    complaint.status === "Completed"
                      ? "text-success fw-bold"
                      : "text-danger fw-bold"
                  }
                >
                  {complaint?.status}
                </td>

                <td>
                  <Button
                    variant="warning"
                    onClick={() => openResponseModal(complaint.id)}
                  >
                    Reply
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">No complaints found.</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Modal for displaying the image */}
      <Modal show={showImageModal} onHide={closeImageModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Complaint Image</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <img src={selectedImage} alt="Complaint" style={{ width: "100%" }} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeImageModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal for sending response */}
      <Modal show={showResponseModal} onHide={closeResponseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Send Response</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Response</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={responseText}
              onChange={(e) => setResponseText(e.target.value)}
              placeholder="Enter your response"
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeResponseModal}>
            Cancel
          </Button>
          <Button variant="warning" onClick={handleSendResponse}>
            Submit Response
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ViewComplaints;
