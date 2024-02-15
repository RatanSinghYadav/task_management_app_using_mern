import React, { useEffect, useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import "../Assets/Styles/UserProfileEdit.css";
import swal from "sweetalert";
import { url } from "../utils/constant";

const ProfileEdit = () => {
  const [userShortDetail, setUserShortDetail] = useState({
    fname: "",
    lname: "",
    email: "",
    number: "",
    currentLocation: "",
  })

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserShortDetail({
      ...userShortDetail, [name]: value,
    })
  };

  const submitUserShortDetail = async (e) => {
    e.preventDefault();
    const { fname, lname, email, number, currentLocation, } = userShortDetail;

    try {
      const response = await fetch(`${url}/api/v1/user/updateUser`, {
        method: 'POST',
        headers: {
          'token': localStorage.getItem('token'),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fname, lname, email, number, currentLocation
        })
      });

      const data = await response.json();
      // console.log(data)
      if (response.ok) {
        setSuccess(true);
        setError(null);
        swal({
          title: "Success",
          text: "Data Updated Successfully!",
          icon: "success",
          button: "Ok",
      });
      } else {
        setSuccess(false);
        setError(data.message || 'Job post creation failed');
      }
    } catch (error) {
      console.error('Error during job post creation:', error);
      setSuccess(false);
      setError('Job post creation failed');
    }
  }

  // get user details

  const fetchUserProfileAllDetails = async () => {
    try {
      const response = await fetch(`${url}/verifyuser`, {
        method: 'POST',
        headers: {
          'token': localStorage.getItem('token'),
          'Content-Type': 'application/json',
        },
      });
      const getResponse = await response.json();
      // console.log(getResponse);
      setUserShortDetail(getResponse.data)
    }
    catch (e) {
      console.log('error in verifying token:', e);
    }
  };


  useEffect(() => {

    fetchUserProfileAllDetails();
  }, []);


  return (
    <>
    {/* desktop view */}
      <div className="container profileEdit-desktop">
      <Form className="profile-form-1">
        <p className="form-heads">Profile Edit</p>

        {/* {/ 1st Row /} */}
        <Row>
          <Col>
            <Form.Label>First Name*</Form.Label>
            <Form.Control
              type="text"
              name="fname"
              value={userShortDetail.fname}
              onChange={handleChange}

            />
          </Col>
          <Col>
            <Form.Label>Last Name*</Form.Label>
            <Form.Control
              type="text"
              name="lname"
              value={userShortDetail.lname}
              onChange={handleChange}

            />
          </Col>
        </Row>

        {/* {/ 2nd Row /} */}
        <Row>
          <Col>
            <Form.Label>Email*</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={userShortDetail.email}
              onChange={handleChange}

            />
          </Col>
          <Col>
            <Form.Label>Phone Number*</Form.Label>
            <Form.Control
              type="tel"
              name="number"
              value={userShortDetail.number}
              onChange={handleChange}

            />
          </Col>
        </Row>

        {/* {/ 3rd Row /} */}
        <Row>
          <Col>
            <Form.Label>Current Location*</Form.Label>
            <Form.Control
              type="text"
              name="currentLocation"
              value={userShortDetail.currentLocation}
              onChange={handleChange}

            />
          </Col>
          <Col className="userDetailUpdateBtn-1">
            <button onClick={submitUserShortDetail} className="update-btn-1">
              update
            </button>
          </Col>
        </Row>
      </Form>
    </div>

    {/* mobile view */}
    <div className="container profileEdit-mobile">
      <Form className="profile-form-1">
        <p className="form-heads">Profile Edit</p>

        {/* {/ 1st Row /} */}
        <Row>
          <Col>
            <Form.Label>First Name*</Form.Label>
            <Form.Control
              type="text"
              name="fname"
              value={userShortDetail.fname}
              onChange={handleChange}

            />
          </Col>
          <Col>
            <Form.Label>Last Name*</Form.Label>
            <Form.Control
              type="text"
              name="lname"
              value={userShortDetail.lname}
              onChange={handleChange}

            />
          </Col>
        </Row>

        {/* {/ 2nd Row /} */}
        <Row>
          <Col>
            <Form.Label>Email*</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={userShortDetail.email}
              onChange={handleChange}

            />
          </Col>
          <Col>
            <Form.Label>Phone Number*</Form.Label>
            <Form.Control
              type="tel"
              name="number"
              value={userShortDetail.number}
              onChange={handleChange}

            />
          </Col>
        </Row>

        {/* {/ 3rd Row /} */}
        <Row>
          <Col>
            <Form.Label>Current Location*</Form.Label>
            <Form.Control
              type="text"
              name="currentLocation"
              value={userShortDetail.currentLocation}
              onChange={handleChange}

            />
          </Col>
          <Col className="userDetailUpdateBtn-1">
            <button onClick={submitUserShortDetail} className="update-btn-1">
              update
            </button>
          </Col>
        </Row>
      </Form>
    </div>
    </>

  );
};

export default ProfileEdit;