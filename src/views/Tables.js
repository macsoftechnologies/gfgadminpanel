import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Table,
  Row,
  Col, Button, FormGroup, Label, Modal, ModalBody, Input, Form
} from "reactstrap";
import { delUser } from "service/service";
import { getCustomer, addCustomer  } from "service/service";


function Tables() {
  const [users, setUsers] = useState([]);
  const [isModalopen, setisModalopen] = useState(false);
  const [formData, setFormData] = useState({
    userName: "",
    email: "",
    mobileNumber: "",
    address: "",
    password: ""
  });

  useEffect(() => {
    const fetchdata = async () => {
      try {
        const userdata = await getCustomer();

        setUsers(userdata.data);
      } catch (error) {
        console.log(error)
      }
    };
    fetchdata();
  }, []);


  function toggleModal() {
    setisModalopen(!isModalopen)
  };

  function toggleModal(){
    setisModalopen(!isModalopen)
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {

      const response = await addCustomer(formData);
      console.log('response', response);

      setisModalopen(false);
      if (response && response.statusCode === 200) {
        alert("Customer added successfully");
      } else {
        alert("Error: Unable to add customer");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error: Unable to add customer");
    }
  };

  const handleDelete = async (_id) => {
    try {
      const response = await delUser({ _id });
      console.log('response', response);

      console.log(response);
    } catch (error) {

      console.error('Error deleting user:', error);
    }
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <>
      <div className="content">
        <Row>
          <Col md="12">
            <Card>
              <CardHeader>
                <Row>
                  <Col>
                    <CardTitle tag="h4">Users Table</CardTitle>
                  </Col>
                  <Col>
                    <CardTitle className="text-right"><Button onClick={toggleModal}>Add</Button></CardTitle>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                <Table responsive>
                  <thead className="text-primary">
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Address</th>
                      <th>Mobile Number</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user._id}>
                        <td>{user.userName}</td>
                        <td>{user.email}</td>
                        <td>{user.address}</td>
                        <td>{user.mobileNumber}</td>
                        <td><Button color="warning">Edit</Button></td>
                        <td><Button color="warning" onClick={() => handleDelete(user._id)}>Delete</Button></td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
      <Modal isOpen={isModalopen} toggle={toggleModal}>
        <ModalBody>
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label for="name">Name</Label>
              <Input type="text" name="userName" onChange={handleChange} />
            </FormGroup>
            <FormGroup>
              <Label for="email">Email</Label>
              <Input type="email" id="email" name="email" onChange={handleChange} />
            </FormGroup>
            <FormGroup>
              <Label for="address">Address</Label>
              <Input type="address" id="address" name="address" onChange={handleChange} />
            </FormGroup>
            <FormGroup>
              <Label for="password">Password</Label>
              <Input type="password" id="password" name="password" onChange={handleChange} />
            </FormGroup>
            <FormGroup>
              <Label for="Number">PhNumber</Label>
              <Input type="text" name="mobileNumber" onChange={handleChange} />
              <Button>Submit</Button>
            </FormGroup>
          </Form>
        </ModalBody>
      </Modal>
    </>
  );
}

export default Tables;
