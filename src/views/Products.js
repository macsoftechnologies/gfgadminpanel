import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Row,
  Col,
  Button,
  Table,
  Modal,
  ModalBody,
  ModalFooter,
  FormGroup,
  Label,
  Input,
  Form,
  CardImg,
  CardText,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
} from "reactstrap";
import {
  addProducts,
  getProducts,
  viewProduct,
  delProduct,
} from "service/service";
import { toast, ToastContainer } from "react-toastify";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";
import { json } from "react-router-dom";
import { editProducts } from "service/service";
import "./Products.css";
import { getCategoriesList } from "service/service";

function Products() {
  const [editProduct, setEditProduct] = useState({
    _id: "",
    productName: "",
    productImage: "",
    categoryId: "",
    productSpecifications: [],
  });
  const [products, setProducts] = useState([]);
  const [isOpen, setModalOpen] = useState(false);
  const [viewCardOpen, setViewCardOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isEditModeltrue, setisEditModeltrue] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productIdToDelete, setProductIdToDelete] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [categoryList, setCategoryList] = useState([]);
  const [categoryName, setCategoryName] = useState("Select a category");
  const [formData, setFormData] = useState({
    productName: "",
    productImage: "",
    categoryId: "",
    productSpecifications: [],
  }); 
  const [searchQuery, setSearchQuery] = useState("");

  const fetchProducts = async () => {
    try {
      const productsData = await getProducts();
      setProducts(productsData);
      setLoading(false);
    } catch (error) {
      console.log("Error:", error);
      setLoading(false);
    }
  };

  const fetchCategoryList = async () => {
    try {
      const response = await getCategoriesList();
      setCategoryList(response.data);
    } catch (error) {
      console.log("Error:", error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/";
    }
    fetchCategoryList();
    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) => {
    const searchLower = searchQuery.toLowerCase();
  
    const productNameLower = product.productName?.toLowerCase() || '';
    const categoryNameLower = product.categoryId?.[0]?.categoryName?.toLowerCase() || '';
    
    return productNameLower.includes(searchLower) || categoryNameLower.includes(searchLower);
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
    setFormData({
      productName: "",
      productImage: "",
      productSpecifications: [],
    });
    setModalOpen(!isOpen);
  };

  const toggleEditModal = () => {
    setisEditModeltrue(!isEditModeltrue);
  };

  const toggleDeleteModal = () => {
    setIsDeleteModalOpen(!isDeleteModalOpen);
  };

  const handleAddSpecification = () => {
    setFormData((prevState) => ({
      ...prevState,
      productSpecifications: [
        ...(prevState.productSpecifications || []),
        { name: "", value: "" },
      ],
    }));
    setEditProduct((prevState) => ({
      ...prevState,
      productSpecifications: [
        ...(prevState.productSpecifications || []),
        { name: "", value: "" },
      ],
    }));
  };

  const handleRemoveSpecification = (index) => {
    setFormData((prevState) => ({
      ...prevState,
      productSpecifications: prevState.productSpecifications.filter(
        (_, i) => i !== index
      ),
    }));
    setEditProduct((prevState) => ({
      ...prevState,
      productSpecifications: prevState.productSpecifications.filter(
        (_, i) => i !== index
      ),
    }));
  };

  const handleChangeSpecification = (index, field, value) => {
    setFormData((prevState) => ({
      ...prevState,
      productSpecifications: prevState.productSpecifications.map((spec, i) =>
        i === index ? { ...spec, [field]: value } : spec
      ),
    }));
    setEditProduct((prevState) => ({
      ...prevState,
      productSpecifications: prevState.productSpecifications.map((spec, i) =>
        i === index ? { ...spec, [field]: value } : spec
      ),
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
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
      setFormData((prevState) => ({
        ...prevState,
        [name]: file,
      }));
      setEditProduct((prevState) => ({
        ...prevState,
        [name]: file,
      }));
    }
  };

  const viewProductDetails = async (productId) => {
    try {
      const response = await viewProduct(productId);
      const product = response.data.data;
      setViewCardOpen(true);
      setSelectedProduct(product[0]);
      console.log(product);
    } catch (error) {
      console.error("Error fetching product details:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formattedSpecifications = formData.productSpecifications.reduce(
        (acc, curr) => {
          acc[curr.name] = curr.value;
          return acc;
        },
        {}
      );

      const updatedFormData = {
        ...formData,
        productSpecifications: formattedSpecifications,
      };

      const response = await addProducts(updatedFormData);

      console.log("Add product response:", response);
      setModalOpen(false);

      if (
        response &&
        (response.statusCode === 200 || response.statusCode === 201)
      ) {
        toast.success("Product added successfully");
        setTimeout(() => {
          getProducts().then((productdata) => setProducts(productdata));
        }, 1000);
      } else {
        console.log("Error:", response);
        toast.error("Error: Unable to add product");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error: Unable to add product");
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const formattedSpecifications = editProduct.productSpecifications.reduce(
        (acc, curr) => {
          acc[curr.name] = curr.value;
          return acc;
        },
        {}
      );

      const updatedFormData = {
        ...editProduct,
        productSpecifications: formattedSpecifications,
      };

      const response = await editProducts(updatedFormData);

      console.log("Edit product response:", response);
      setisEditModeltrue(false);
      if (
        response &&
        (response.data.statusCode === 200 || response.data.statusCode === 201)
      ) {
        toast.success("Product edited successfully");
        setTimeout(() => {
          getProducts().then((productdata) => setProducts(productdata));
        }, 1000);
      } else {
        toast.error("Error: Unable to edit Product");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error: Unable to edit Product");
    }
  };

  const handleEditClick = (product) => {
    console.log("editProduct", product);
    setEditProduct({
      _id: product._id,
      productName: product.productName,
      productImage: product.productImage,
      categoryId: product?.categoryId[0]?.categoryId || null,
      productSpecifications: Object.entries(product.productSpecifications).map(
        ([name, value]) => ({
          name,
          value,
        })
      ),
    });
    setFormData({
      productName: product.productName,
      productImage: product.productImage,
      categoryId: product?.categoryId[0]?.categoryId || null,
      productSpecifications: Object.entries(product.productSpecifications).map(
        ([name, value]) => ({
          name,
          value,
        })
      ),
    });
    setCategoryName(
      product?.categoryId[0]?.categoryName || "Select a category"
    );
    toggleEditModal();
  };

  const handleDeleteClick = (productId) => {
    setProductIdToDelete(productId);
    toggleDeleteModal();
  };

  const handleSelectChange = (event) => {
    const selectedCategory = event.target.value;
    setFormData({
      ...formData,
      categoryId: selectedCategory,
    });
    setEditProduct({
      ...editProduct,
      categoryId: selectedCategory,
    });
  };

  const confirmDelete = async () => {
    try {
      const response = await delProduct({ _id: productIdToDelete });
      if (
        response &&
        (response.statusCode === 200 || response.statusCode === 201)
      ) {
        toast.success("Deleted successfully");
        setTimeout(() => {
          setProducts(
            products.filter((product) => product._id !== productIdToDelete)
          );
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
                    <CardTitle tag="h4">Products</CardTitle>
                  </Col>
                  <Col>
                    <InputGroup className="no-border">
                      <Input
                        placeholder="Search by category name..."
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
                    <Button className="addingButtonClass" onClick={toggleModal}>Add Product</Button>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                <Table responsive>
                  <thead className="text-primary">
                    <tr>
                      <th>S.No</th>
                      <th>Product Name</th>
                      <th>Image</th>
                      <th>Categoty Name</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((product, index) => (
                      <tr key={product._id}>
                        <th>{index + 1}</th>
                        <td>{product.productName}</td>
                        <td>
                          <img
                            src={`https://api.gfg.org.in/${product.productImage}`}
                            alt={product.productName}
                            className="productImageClass"
                          />
                        </td>
                        <td>{product.categoryId[0]?.categoryName}</td>
                        <td>
                          <Button
                            color="success"
                            style={{ marginRight: "5px" }}
                            onClick={() => viewProductDetails(product._id)}
                          >
                            <div className="prodactclass">
                              <FaEye />
                            </div>
                          </Button>

                          <Button
                            color="primary"
                            style={{ marginRight: "5px" }}
                            onClick={() => handleEditClick(product)}
                          >
                            <div className="prodactclass">
                              <FaEdit />
                            </div>
                          </Button>
                          <Button
                            color="danger"
                            onClick={() => handleDeleteClick(product._id)}
                          >
                            <div className="prodactclass">
                              <FaTrash />
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
      <Modal className="modal-lg" isOpen={isOpen} toggle={toggleModal}>
        <ModalBody>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col>
                <FormGroup>
                  <Label for="productName">Product Name</Label>
                  <Input
                    type="text"
                    name="productName"
                    id="productName"
                    value={formData.productName}
                    onChange={(e) =>
                      setFormData({ ...formData, productName: e.target.value })
                    }
                  />
                </FormGroup>
              </Col>
              <Col>
                <Row>
                  <Col>
                    <FormGroup>
                      <Label for="productImage">Product Image</Label>
                      <Input
                        type="file"
                        name="productImage"
                        id="productImage"
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
            <FormGroup>
              <Label for="productCategory">Product Category</Label>
              <Input
                type="select"
                name="categoryId"
                id="categoryId"
                onChange={handleSelectChange}
              >
                <option value="">Select a category</option>
                {categoryList &&
                  categoryList.map((category) => (
                    <option value={category.categoryId}>
                      {category.categoryName}
                    </option>
                  ))}
              </Input>
            </FormGroup>
            <FormGroup>
              <Label for="productSpecifications">Product Specifications</Label>
              {formData.productSpecifications.map((specification, index) => (
                <Row key={index}>
                  <Col>
                    <Input
                      type="text"
                      placeholder="Name"
                      value={specification.name}
                      onChange={(e) =>
                        handleChangeSpecification(index, "name", e.target.value)
                      }
                    />
                  </Col>
                  <Col>
                    <Input
                      type="text"
                      placeholder="Value"
                      value={specification.value}
                      onChange={(e) =>
                        handleChangeSpecification(
                          index,
                          "value",
                          e.target.value
                        )
                      }
                    />
                  </Col>
                  <Col>
                    <Button
                      className="mt-0"
                      type="button"
                      onClick={() => handleRemoveSpecification(index)}
                    >
                      Remove
                    </Button>
                  </Col>
                </Row>
              ))}
              <Button type="button" onClick={handleAddSpecification}>
                Add Specification
              </Button>
            </FormGroup>
            <Button color="secondary" onClick={toggleModal}>
              Close
            </Button>
            <Button color="primary" type="submit">
              Submit
            </Button>
          </Form>
        </ModalBody>
      </Modal>

      {selectedProduct && (
        <Modal isOpen={true} toggle={() => setSelectedProduct(null)}>
          <ModalBody>
            <Card>
              <CardBody>
                <CardImg
                  src={`https://api.gfg.org.in/${selectedProduct.productImage}`}
                  alt={selectedProduct.productName}
                />
                <CardTitle tag="h5">{selectedProduct.productName}</CardTitle>
                <CardText className="categoryNameClass">
                  <CardTitle className="categoryIndicationClass" tag="h6">
                    Category Name :
                  </CardTitle>{" "}
                  {selectedProduct.categoryId[0]?.categoryName}
                </CardText>
                <CardText>Product Specifications:</CardText>
                <ul>
                  {selectedProduct.productSpecifications &&
                    Object.entries(selectedProduct.productSpecifications).map(
                      (specification, index) => (
                        <li>
                          <strong>{specification[0]}:</strong>{" "}
                          {specification[1]}
                        </li>
                      )
                    )}
                </ul>
              </CardBody>
            </Card>
            <Button color="secondary" onClick={() => setSelectedProduct(null)}>
              Close
            </Button>
          </ModalBody>
        </Modal>
      )}

      {/* edit modal */}
      <Modal
        className="modal-lg"
        isOpen={isEditModeltrue}
        toggle={toggleEditModal}
      >
        <ModalBody>
          <Form onSubmit={handleEditSubmit}>
            <Row>
              <Col>
                <FormGroup>
                  <Label for="productName">Product Name</Label>
                  <Input
                    type="text"
                    name="productName"
                    id="productName"
                    value={editProduct.productName}
                    onChange={handleChange}
                  />
                </FormGroup>
              </Col>
              <Col>
                <Row>
                  <Col>
                    <FormGroup>
                      <Label for="productImage">Product Image</Label>
                      <Input
                        type="file"
                        name="productImage"
                        id="productImage"
                        onChange={handleFileChange}
                      />
                    </FormGroup>
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
                      editProduct.productImage && (
                        <img
                          src={`https://api.gfg.org.in/${editProduct.productImage}`}
                          alt="Current Product"
                          width="100"
                          style={{ marginTop: "10px" }}
                        />
                      )
                    )}
                  </Col>
                </Row>
              </Col>
            </Row>

            <FormGroup>
              <Label for="productCategory">Product Category</Label>
              <Input
                type="select"
                name="categoryId"
                id="categoryId"
                onChange={handleSelectChange}
              >
                <option>{categoryName}</option>
                {categoryList &&
                  categoryList.map((category) => (
                    <option value={category?.categoryId}>
                      {category?.categoryName}
                    </option>
                  ))}
              </Input>
            </FormGroup>
            <FormGroup>
              <Label>Product Specifications</Label>
              {editProduct.productSpecifications &&
              editProduct.productSpecifications.length > 0 ? (
                editProduct.productSpecifications.map((spec, index) => (
                  <div key={index}>
                    <Row>
                      <Col>
                        <Input
                          type="text"
                          placeholder="Name"
                          value={spec.name}
                          onChange={(e) =>
                            handleChangeSpecification(
                              index,
                              "name",
                              e.target.value
                            )
                          }
                        />
                      </Col>
                      <Col>
                        <Input
                          type="text"
                          placeholder="Value"
                          value={spec.value}
                          onChange={(e) =>
                            handleChangeSpecification(
                              index,
                              "value",
                              e.target.value
                            )
                          }
                        />
                      </Col>
                      <Col>
                        <Button
                          className="mt-0"
                          onClick={() => handleRemoveSpecification(index)}
                        >
                          Remove
                        </Button>
                      </Col>
                    </Row>
                  </div>
                ))
              ) : (
                editProduct.productSpecifications.map((spec, index) => (
                  <div key={index}>
                    <Row>
                      <Col>
                        <Input
                          type="text"
                          placeholder="Name"
                          value={spec.name}
                          onChange={(e) =>
                            handleChangeSpecification(
                              index,
                              "name",
                              e.target.value
                            )
                          }
                        />
                      </Col>
                      <Col>
                        <Input
                          type="text"
                          placeholder="Value"
                          value={spec.value}
                          onChange={(e) =>
                            handleChangeSpecification(
                              index,
                              "value",
                              e.target.value
                            )
                          }
                        />
                      </Col>
                      <Col>
                        <Button
                          className="mt-0"
                          onClick={() => handleRemoveSpecification(index)}
                        >
                          Remove
                        </Button>
                      </Col>
                    </Row>
                  </div>
                ))
              )}

              <Button onClick={handleAddSpecification}>
                Add Specification
              </Button>
            </FormGroup>
            <Button color="secondary" onClick={toggleEditModal}>
              Close
            </Button>
            <Button color="primary" type="submit">
              Submit
            </Button>
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

export default Products;
