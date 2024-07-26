import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Table,
  Row,
  Col,
  Button,
  ModalFooter,
  Modal,
  ModalBody,
  FormGroup,
  Label,
  Input,
  Form,
  ModalHeader,
} from "reactstrap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEdit, FaTrash } from "react-icons/fa";
import MapComponent from "./Map";
import "./Customer.css";
import {
  getCustomers,
  getMerchants,
  delUser,
  addCustomer,
  editCustomer,
} from "service/service";

function Customer() {
  const [editUser, setEditUser] = useState({});
  const [users, setUsers] = useState([]);
  const [isModeltrue, setisModeltrue] = useState(false);
  const [isEditModeltrue, setisEditModeltrue] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    userName: "",
    email: "",
    mobileNumber: "",
    altMobileNumber: "",
    address: "",
    profileImage: null,
    password: "",
    latitude: 0,
    longitude: 0,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/";
    }
    const fetchdata = async () => {
      try {
        const userdata = await getCustomers();
        setUsers(userdata.data);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };
    fetchdata();
  }, []);

  const toggleModal = () => {
    setImagePreview(null);
    setisModeltrue(!isModeltrue);
  };

  const toggleEditModal = () => {
    setisEditModeltrue(!isEditModeltrue);
  };

  const toggleDeleteModal = () => {
    setIsDeleteModalOpen(!isDeleteModalOpen);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value);
      });
      console.log("formData", formData);
      const response = await addCustomer(formData);
      console.log("response", response);

      setisModeltrue(false);
      if (response && (response.status === 200 || response.status === 201)) {
        toast.success("Custmoer added successfully");
        setTimeout(() => {
          getCustomers().then((userdata) => setUsers(userdata.data));
        }, 1000);
      } else {
        toast.error("Error: Unable to add Customer");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error: Unable to add Customer");
    }
  };

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <div className="spinner-border" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.entries(editUser).forEach(([key, value]) => {
        if (key !== "password") {
          formData.append(key, value);
        }
      });
      console.log("formData", formData);
      const response = await editCustomer(formData);
      console.log("response", response);

      setisEditModeltrue(false);
      if (response && (response.status === 200 || response.status === 201)) {
        toast.success("Customer edited successfully");
        setTimeout(() => {
          getCustomers().then((userdata) => setUsers(userdata.data));
        }, 1000);
      } else {
        toast.error("Error: Unable to edit Customer");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error: Unable to edit Customer");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    setEditUser((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      setData((prevState) => ({
        ...prevState,
        [name]: file,
      }));
      setEditUser((prevState) => ({
        ...prevState,
        [name]: file,
      }));
    }
  };

  const handlePositionChange = (lat, lng, address) => {
    setData((prevState) => ({
      ...prevState,
      latitude: lat,
      longitude: lng,
      address: address,
    }));
    setEditUser((prevState) => ({
      ...prevState,
      latitude: lat,
      longitude: lng,
      address: address,
    }));
  };

  const handleEditClick = (user) => {
    console.log("editUser", user);
    setEditUser(user);
    toggleEditModal();
  };

  const handleDeleteClick = (userId) => {
    setUserIdToDelete(userId);
    toggleDeleteModal();
  };

  const confirmDelete = async () => {
    try {
      const response = await delUser({ _id: userIdToDelete });
      if (
        response &&
        (response.statusCode === 200 || response.statusCode === 201)
      ) {
        toast.success("Deleted successfully");
        setTimeout(() => {
          setUsers(users.filter((user) => user._id !== userIdToDelete));
        }, 1000);
      } else {
        toast.error("Error: Unable to delete");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Error: Unable to delete");
    }
    toggleDeleteModal();
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
                  <Col className="text-right">
                    <Button onClick={toggleModal}>Add Customer</Button>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                <Table responsive>
                  <thead className="text-primary">
                    <tr>
                      <th>S.No</th>
                      <th style={{ width: "25%" }}>Name</th>
                      <th style={{ width: "25%" }}>Mobile Number</th>
                      <th style={{ width: "25%" }}>Profile Image</th>
                      <th style={{ width: "25%" }}>Address</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user, index) => (
                      <tr key={user._id}>
                        <td>{index + 1}</td>
                        <td>{user.userName}</td>
                        <td>{user.mobileNumber}</td>
                        <td>
                          <img
                            className="tableImageClass1"
                            src={`https://gfg.org.in/${user.profileImage}`}
                            alt={user.profileImage}
                            width="100"
                          />
                        </td>
                        <td>{user.address}</td>
                        <td>
                          <Button
                            color="primary"
                            className="actionbuttonclass1"
                            onClick={() => handleEditClick(user)}
                          >
                            <div className="actionbuttondiv">
                              <FaEdit />
                              <p className="actiontext">Edit</p>
                            </div>
                          </Button>
                          <Button
                            color="danger"
                            className="actionbuttonclass1"
                            onClick={() => handleDeleteClick(user._id)}
                          >
                            <div className="actionbuttondiv">
                              <FaTrash />
                              <p className="actiontext">Delete</p>
                            </div>
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
      <Modal
        className="modal-lg modal-dialog-scrollable"
        isOpen={isModeltrue}
        toggle={toggleModal}
      >
        <ModalHeader>Add Customer</ModalHeader>
        <ModalBody>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col>
                <FormGroup>
                  <Label for="userName">Name</Label>
                  <Input
                    type="text"
                    name="userName"
                    id="userName"
                    value={data.userName}
                    onChange={handleChange}
                  />
                </FormGroup>

                <FormGroup>
                  <Label for="mapAddress">Address</Label>
                  <Input
                    type="text"
                    name="mapAddress"
                    id="mapAddress"
                    value={data.address}
                    onChange={(e) =>
                      setData({ ...data, address: e.target.value })
                    }
                  />
                </FormGroup>
              </Col>
              <Col>
                <FormGroup>
                  <Label for="mobileNumber">Mobile Number</Label>
                  <Input
                    type="text"
                    name="mobileNumber"
                    id="mobileNumber"
                    value={data.mobileNumber}
                    onChange={handleChange}
                  />
                </FormGroup>
                <Row>
                  <Col>
                    <FormGroup>
                      <Label for="profileImage">Profile Image</Label>
                      <Input
                        type="file"
                        id="profileImage"
                        name="profileImage"
                        onChange={handleFileChange}
                      />
                    </FormGroup>
                  </Col>
                  <Col>
                    {imagePreview && (
                      <img
                        src={imagePreview}
                        alt="Product Preview"
                        width="100"
                        style={{ marginTop: "10px" }}
                      />
                    )}
                  </Col>
                </Row>
              </Col>
            </Row>
            <MapComponent
              initialPosition={[data.latitude, data.longitude]}
              onPositionChange={handlePositionChange}
              apiKey="AIzaSyCiUU7Q5X1hTMRAJr0YJZPOxw40FfZcZp0"
            />
            <Button color="secondary" onClick={toggleModal}>Close</Button>
            <Button color="primary" type="submit">Submit</Button>
          </Form>
        </ModalBody>
      </Modal>

      <Modal
        className="modal-lg  modal-dialog-scrollable"
        isOpen={isEditModeltrue}
        toggle={toggleEditModal}
      >
        <ModalHeader>Edit Customer</ModalHeader>
        <ModalBody>
          <Form onSubmit={handleEditSubmit}>
            <Row>
              <Col>
                <FormGroup>
                  <Label for="userName">Name</Label>
                  <Input
                    type="text"
                    name="userName"
                    id="userName"
                    value={editUser.userName}
                    onChange={handleChange}
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="mapAddress">Address</Label>
                  <Input
                    type="text"
                    name="mapAddress"
                    id="mapAddress"
                    value={editUser.address}
                    onChange={(e) =>
                      setEditUser({ ...editUser, address: e.target.value })
                    }
                  />
                </FormGroup>
              </Col>
              <Col>
                <FormGroup>
                  <Label for="mobileNumber">Mobile Number</Label>
                  <Input
                    type="text"
                    name="mobileNumber"
                    id="mobileNumber"
                    value={editUser.mobileNumber}
                    onChange={handleChange}
                  />
                </FormGroup>
                <FormGroup>
                  <Row>
                    <Col>
                      <Label for="profileImage">Profile Image</Label>
                      <Input
                        type="file"
                        id="profileImage"
                        name="profileImage"
                        onChange={handleFileChange}
                      />
                    </Col>
                    <Col>
                      {imagePreview ? (
                        <img
                          src={imagePreview}
                          alt="Product Preview"
                          width="100"
                          style={{ marginTop: "10px" }}
                        />
                      ) : (
                        editUser.profileImage && (
                          <img
                            src={`https://gfg.org.in/${editUser.profileImage}`}
                            alt="Current Product"
                            width="100"
                            style={{ marginTop: "10px" }}
                          />
                        )
                      )}
                    </Col>
                  </Row>
                </FormGroup>
              </Col>
            </Row>
            {editUser && editUser.coordinates ? (
              <MapComponent
                initialPosition={[
                  editUser.coordinates.coordinates[1],
                  editUser.coordinates.coordinates[0],
                ]}
                onPositionChange={handlePositionChange}
                apiKey="AIzaSyCiUU7Q5X1hTMRAJr0YJZPOxw40FfZcZp0"
              />
            ) : (
              <div>Loading...</div> // Or any other fallback UI you prefer
            )}
            <Button color="secondary" onClick={toggleEditModal}>Close</Button>
            <Button color="primary" type="submit">Submit</Button>
          </Form>
        </ModalBody>
      </Modal>

      <Modal
        className="modal-dialog modal-dialog-centered"
        isOpen={isDeleteModalOpen}
        toggle={toggleDeleteModal}
      >
        <ModalBody>Are you sure you want to delete this user?</ModalBody>
        <ModalFooter>
          <Button color="danger" onClick={confirmDelete}>
            Delete
          </Button>
          <Button color="secondary" onClick={toggleDeleteModal}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
      <ToastContainer />
    </>
  );
}

export default Customer;
