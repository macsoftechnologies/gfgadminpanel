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
  Container,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
} from "reactstrap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getMerchants, addMerchant, delUser } from "service/service";
import { FaEdit, FaTrash, FaBox } from "react-icons/fa";
import MapComponent from "./Map"; // Import the new MapComponent
import { editCustomer, merchantProducts } from "service/service";
import "./Merchant.css";
import { delMerchantProduct } from "service/service";
import { editMerchantProduct } from "service/service";

function Merchant() {
  const [editProduct, setEditProduct] = useState({
    _id: "",
    price: "",
  });
  const [editUser, setEditUser] = useState({});
  const [users, setUsers] = useState([]);
  const [isModeltrue, setisModeltrue] = useState(false);
  const [isEditModeltrue, setisEditModeltrue] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isProductEditModeltrue, setIsProductEditModeltrue] = useState(false);
  const [isProductDeleteModalOpen, setIsProductDeleteModalOpen] =
    useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState(null);
  const [productIdToDelete, setProductIdToDelete] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imagePreview1, setImagePreview1] = useState(null);
  const [imagePreview2, setImagePreview2] = useState(null);
  const [isProductsModeltrue, setisProductsModeltrue] = useState(false);
  const [merchantProductsList, setMerchantProductsList] = useState([]);
  const [merchantDetails, setMerchantDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [merchantProductImage, setMerchantProductImage] = useState("");
  const [merchantProductName, setMerchantProductName] = useState("");
  const [data, setData] = useState({
    userName: "",
    mobileNumber: "",
    address: "",
    profileImage: null,
    shopImage: null,
    shopName: "",
    latitude: 18.5314,
    longitude: 73.845,
  });

  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/";
    }
    const fetchdata = async () => {
      try {
        const userdata = await getMerchants();
        setUsers(userdata.data);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };
    fetchdata();
  }, []);

  const filteredUsers = users.filter((user) => {
    const searchLower = searchQuery.toLowerCase();
    const addressLower = user.address.toLowerCase();
    return addressLower.includes(searchLower);
  });

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

  const toggleModal = () => {
    setImagePreview(null);
    setImagePreview1(null);
    setImagePreview2(null);
    setisModeltrue(!isModeltrue);
  };

  const toggleProductsModal = () => {
    setisProductsModeltrue(!isProductsModeltrue);
  };

  const toggleEditModal = () => {
    setisEditModeltrue(!isEditModeltrue);
  };

  const toggleDeleteModal = () => {
    setIsDeleteModalOpen(!isDeleteModalOpen);
  };

  const toggleProductEditModal = () => {
    setIsProductEditModeltrue(!isProductEditModeltrue);
  };

  const toggleProductDeleteModal = () => {
    setIsProductDeleteModalOpen(!isProductDeleteModalOpen);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value);
      });
      console.log("formData", formData);
      const response = await addMerchant(formData);
      console.log("response", response);

      setisModeltrue(false);
      if (response && (response.status === 200 || response.status === 201)) {
        toast.success("Merchant added successfully");
        setTimeout(() => {
          getMerchants().then((userdata) => setUsers(userdata.data));
        }, 1000);
      } else {
        toast.error("Error: Unable to add Merchant");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error: Unable to add Merchant");
    }
  };

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
        toast.success("Merchant edited successfully");
        setTimeout(() => {
          getMerchants().then((userdata) => setUsers(userdata.data));
        }, 1000);
      } else {
        toast.error("Error: Unable to edit Merchant");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error: Unable to edit Merchant");
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
    setEditProduct((prevState) => ({
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

  const handleFileChange1 = (e) => {
    const { name, files } = e.target;
    const file = files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview1(reader.result);
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

  const handleDeleteClick = (userId) => {
    setUserIdToDelete(userId);
    toggleDeleteModal();
  };

  const handleEditClick = (user) => {
    console.log("editUser", user);
    setEditUser(user);
    toggleEditModal();
  };

  const handleProductDeleteClick = (productId) => {
    setProductIdToDelete(productId);
    toggleProductDeleteModal();
  };

  const handleProductEditClick = (product) => {
    console.log("editProduct", product);
    setEditProduct({
      ...editProduct,
      _id: product?._id,
      price: product?.price,
    });
    setMerchantProductImage(product?.adminProductId[0]?.productImage);
    setMerchantProductName(product?.adminProductId[0]?.productName);
    toggleProductEditModal();
  };

  const handleProductEditSubmit = async () => {
    try {
      // console.log("merchantDetails", merchantDetails);
      const response = await editMerchantProduct(editProduct);
      if (
        (response && response.statusCode === 200) ||
        response.statusCode === 201
      ) {
        toast.success(`Success: ${response.message}`);
        setTimeout(() => {
          refreshAfterEditProd(merchantDetails);
        }, 1000);
        toggleProductEditModal();
      }
    } catch (error) {
      console.log("error", error);
      toast.error("Error: Unable to edit merchantproduct");
    }
  };

  const confirmProductDelete = async () => {
    try {
      // console.log("merchantDetails", merchantDetails);
      const response = await delMerchantProduct({ _id: productIdToDelete });
      if (
        response &&
        (response.statusCode === 200 || response.statusCode === 201)
      ) {
        toast.success("Deleted successfully");
        setTimeout(() => {
          setMerchantProductsList(
            merchantProductsList.filter(
              (product) => product._id !== productIdToDelete
            )
          );
          // setTimeout(() => {
          //   refreshAfterEditProd(merchantDetails);
          // }, 1000);
        }, 1000);
      } else {
        toast.error("Error: Unable to delete");
      }
    } catch (error) {
      console.error("Error deleting merchant product:", error);
      toast.error("Error: Unable to delete");
    }
    toggleProductDeleteModal();
  };

  const refreshAfterEditProd = async (user) => {
    try {
      setMerchantDetails(user);
      const response = await merchantProducts({ userId: user.userId });
      console.log("response", response);
      if (
        response &&
        (response.statusCode === 200 || response.statusCode === 201)
      ) {
        setMerchantProductsList(response.data);
        toggleProductEditModal();
      } else {
        toast.error(`Error: No products Found for this merchant`);
      }
    } catch (error) {
      toast.error("Error: Unable to load merchant products");
    }
  };

  const handleProductClick = async (user) => {
    try {
      setMerchantDetails(user);
      const response = await merchantProducts({ userId: user.userId });
      console.log("response", response);
      if (
        response &&
        (response.statusCode === 200 || response.statusCode === 201)
      ) {
        setMerchantProductsList(response.data);
        toggleProductsModal();
      } else {
        toast.error(`Error: No products Found for this merchant`);
      }
    } catch (error) {
      toast.error("Error: Unable to load merchant products");
    }
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
                  <Col>
                    <InputGroup className="no-border">
                      <Input
                        placeholder="Search by city, landmark, or pincode"
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        // style={{ marginBottom: "20px" }}
                      />
                      <InputGroupAddon addonType="append">
                        <InputGroupText>
                          <i className="nc-icon nc-zoom-split" />
                        </InputGroupText>
                      </InputGroupAddon>
                    </InputGroup>
                  </Col>
                  <Col className="text-right">
                    <Button className="addingButtonClass" onClick={toggleModal}>Add Merchant</Button>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                <Table responsive>
                  <thead className="text-primary text-align-center">
                    <tr>
                      <th>S.No</th>
                      <th style={{ width: "17%" }}>Name</th>
                      <th style={{ width: "17%" }}>Address</th>
                      <th style={{ width: "17%" }}>Mobile</th>
                      <th style={{ width: "17%" }}>User Image</th>
                      <th style={{ width: "17%" }}>Shop Name</th>
                      <th style={{ width: "17%", fontSize: "12px" }}>
                        Shop Image
                      </th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user, index) => (
                      <tr key={user._id}>
                        <td>{index + 1}</td>
                        <td>{user.userName}</td>
                        <td>{user.address}</td>
                        <td>{user.mobileNumber}</td>
                        <td className="tabletdClass">
                          <img
                            className="tableImageClass"
                            src={`https://api.gfg.org.in/${user.profileImage}`}
                            alt={user.profileImage}
                            width="100"
                            height='100'
                          />
                        </td>
                        <td>{user.shopName}</td>
                        <td className="tabletdClass">
                          <img
                          className="tableImageClass"
                            src={`https://api.gfg.org.in/${user.shopImage}`}
                            alt={user.shopImage}
                            width="100"
                            height='100'
                          />
                        </td>
                        <td className="customerListActionClass">
                          <Button
                            color="success"
                            className="actionbuttonclass"
                            onClick={() => handleProductClick(user)}
                          >
                            <FaBox />
                          </Button>
                          <Button
                            color="primary"
                            className="actionbuttonclass"
                            onClick={() => handleEditClick(user)}
                          >
                            <FaEdit />
                          </Button>
                          <Button
                            color="danger"
                            className="actionbuttonclass"
                            onClick={() => handleDeleteClick(user._id)}
                          >
                            <FaTrash />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                {/* <Pagination
                  totalRecords={users.length}
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                /> */}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>

      {/* add merchant modal */}
      <Modal
        className="modal-lg modal-dialog-scrollable"
        isOpen={isModeltrue}
        toggle={toggleModal}
      >
        <ModalHeader>Add Merchant</ModalHeader>
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
                  <Label for="mobileNumber">Mobile Number</Label>
                  <Input
                    type="text"
                    name="mobileNumber"
                    id="mobileNumber"
                    value={data.mobileNumber}
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
                  <Label for="shopName">Shop Name</Label>
                  <Input
                    type="text"
                    id="shopName"
                    name="shopName"
                    value={data.shopName}
                    onChange={handleChange}
                  />
                </FormGroup>
                <Row>
                  <Col>
                    <FormGroup>
                      <Label for="shopImage">Shop Image</Label>
                      <Input
                        type="file"
                        name="shopImage"
                        id="shopImage"
                        onChange={handleFileChange}
                      />
                      {imagePreview && (
                        <img
                          src={imagePreview}
                          alt="Product Preview"
                          width="100"
                          style={{ marginTop: "10px" }}
                        />
                      )}
                    </FormGroup>
                  </Col>
                  <Col>
                    <FormGroup>
                      <Label for="profileImage">Profile Image</Label>
                      <Input
                        type="file"
                        id="profileImage"
                        name="profileImage"
                        onChange={handleFileChange1}
                      />
                      {imagePreview && (
                        <img
                          src={imagePreview1}
                          alt="Product Preview"
                          width="100"
                          style={{ marginTop: "10px" }}
                        />
                      )}
                    </FormGroup>
                  </Col>
                </Row>
              </Col>
            </Row>
            <MapComponent
              initialPosition={[data.latitude, data.longitude]}
              onPositionChange={handlePositionChange}
              apiKey="AIzaSyCiUU7Q5X1hTMRAJr0YJZPOxw40FfZcZp0"
            />
            <Button color="secondary" onClick={toggleModal}>
              Close
            </Button>
            <Button color="primary" type="submit">
              Submit
            </Button>
          </Form>
        </ModalBody>
      </Modal>
      {/* edit merchant modal */}
      <Modal
        className="modal-lg modal-dialog-scrollable"
        isOpen={isEditModeltrue}
        toggle={toggleEditModal}
      >
        <ModalHeader>Edit Merchant</ModalHeader>
        <ModalBody>
          <Form>
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
                  <Label for="shopName">Shop Name</Label>
                  <Input
                    type="text"
                    id="shopName"
                    name="shopName"
                    value={editUser.shopName}
                    onChange={handleChange}
                  />
                </FormGroup>
                <Row>
                  <Col>
                    <FormGroup>
                      <Label for="shopImage">Shop Image</Label>
                      <Input
                        type="file"
                        name="shopImage"
                        id="shopImage"
                        onChange={handleFileChange}
                      />
                      {imagePreview ? (
                        <img
                          src={imagePreview}
                          alt="Product Preview"
                          width="100"
                          style={{ marginTop: "10px" }}
                        />
                      ) : (
                        editUser.shopImage && (
                          <img
                            src={`https://api.gfg.org.in/${editUser.shopImage}`}
                            alt="Current Product"
                            width="100"
                            style={{ marginTop: "10px" }}
                          />
                        )
                      )}
                    </FormGroup>
                  </Col>
                  <Col>
                    <FormGroup>
                      <Label for="profileImage">Profile Image</Label>
                      <Input
                        type="file"
                        id="profileImage"
                        name="profileImage"
                        onChange={handleFileChange1}
                      />
                      {imagePreview1 ? (
                        <img
                          src={imagePreview1}
                          alt="Product Preview"
                          width="100"
                          style={{ marginTop: "10px" }}
                        />
                      ) : (
                        editUser.profileImage && (
                          <img
                            src={`https://api.gfg.org.in/${editUser.profileImage}`}
                            alt="Current Product"
                            width="100"
                            style={{ marginTop: "10px" }}
                          />
                        )
                      )}
                    </FormGroup>
                  </Col>
                </Row>
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
            <Button
              type="btn"
              color="secondary"
              onClick={() => toggleEditModal()}
            >
              Close
            </Button>
            <Button
              color="primary"
              type="submit"
              onClick={() => handleEditSubmit()}
            >
              Submit
            </Button>
          </Form>
        </ModalBody>
      </Modal>
      {/* delete merchant modal */}
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
      {/* productslist modal */}
      <Modal
        className="modal-lg"
        isOpen={isProductsModeltrue}
        toggle={toggleProductsModal}
      >
        <Card>
          <CardHeader>
            <Row>
              <Col>
                <CardTitle>Merchant Products</CardTitle>
              </Col>
              <Col>
                <CardTitle>MerchantName: {merchantDetails.userName}</CardTitle>
              </Col>
            </Row>
          </CardHeader>
          <CardBody>
            <Table responsive>
              <thead className="text-primary text-align-center">
                <tr>
                  <th>S.No</th>
                  <th>Product Name</th>
                  <th>Product Image</th>
                  <th>Price</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {merchantProductsList.map((product, index) => (
                  <tr key={product._id}>
                    <td>{index + 1}</td>
                    <td>{product?.adminProductId[0]?.productName}</td>
                    <td>
                      <img
                        src={`https://api.gfg.org.in/${product?.adminProductId[0]?.productImage}`}
                        alt={product?.adminProductId[0]?.productImage}
                        width="100"
                      />
                    </td>
                    <td>
                      <i class="fas fa-rupee-sign"></i>
                      {product.price}
                    </td>
                    <td
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <Button
                        color="primary"
                        onClick={() => handleProductEditClick(product)}
                      >
                        Edit
                      </Button>
                      <Button
                        color="danger"
                        onClick={() => handleProductDeleteClick(product._id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <Button
              type="btn"
              color="secondary"
              onClick={() => toggleProductsModal()}
            >
              Close
            </Button>
          </CardBody>
        </Card>
      </Modal>
      {/* edit merchant product modal */}
      <Modal
        className="modal-lg modal-dialog-centered"
        isOpen={isProductEditModeltrue}
        toggle={toggleProductEditModal}
      >
        <ModalHeader className="w-100">
          <Row>
            <Col>Edit Product</Col>
            <Col className="prodmerchantName">
              <span className="merchantNameLabel">MerchantName</span>
              <span className="merchantnametext">
                {" "}
                :{merchantDetails.userName}
              </span>
            </Col>
          </Row>
        </ModalHeader>
        <ModalBody>
          <Container>
            <Row>
              <Col className="editProductDetails">
                <div className="editproductClass">
                  <h6 className="editProductHeading">Product Name :</h6>
                  <p className="editproductText">{merchantProductName}</p>
                </div>
                <div className="editproductClass">
                  <h6 className="editProductHeading">Price :</h6>
                  <div className="editProdInputClass">
                    <i class="fas fa-rupee-sign editProdRupee"></i>
                    <Input
                      className="editProductInput"
                      type="text"
                      name="price"
                      id="price"
                      value={editProduct.price}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </Col>
              <Col>
                <div className="editproductClass">
                  <h6 className="editProductHeading">Product Image :</h6>
                  <img
                    className="editProdImage"
                    src={`https://api.gfg.org.in/${merchantProductImage}`}
                  />
                </div>
              </Col>
            </Row>
          </Container>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={() => toggleProductEditModal()}>
            Cancel
          </Button>
          <Button color="primary" onClick={() => handleProductEditSubmit()}>
            Submit
          </Button>
        </ModalFooter>
      </Modal>
      {/* delete merchant product modal */}
      <Modal
        className="modal-dialog modal-dialog-centered"
        isOpen={isProductDeleteModalOpen}
        toggle={toggleProductDeleteModal}
      >
        <ModalBody>
          Are you sure you want to delete this merchant product?
        </ModalBody>
        <ModalFooter>
          <Button color="danger" onClick={confirmProductDelete}>
            Delete
          </Button>
          <Button color="secondary" onClick={toggleProductDeleteModal}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
      <ToastContainer />
    </>
  );
}

export default Merchant;
