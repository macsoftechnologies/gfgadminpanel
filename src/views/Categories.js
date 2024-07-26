import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Col,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  Table,
  Form,
} from "reactstrap";
import { addCategory } from "service/service";
import { updateCategory } from "service/service";
import { delCategory } from "service/service";
import { getCategoriesList } from "service/service";
import './Categories.css';

function Categories() {
  const [editCategory, setEditCategory] = useState({});
  const [categories, setCategories] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [categoryIdToDelete, setcategoryIdToDelete] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imagePreview, setImagePreview] = useState(null);
  const [data, setData] = useState({
    categoryName: "",
    categoryImage: null,
  });

  const getCategories = async () => {
    try {
      const response = await getCategoriesList();
      setCategories(response.data);
      setLoading(false);
    } catch (error) {
      console.log("error", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/";
    } else {
      getCategories();
    }
  }, []);

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

  const toggleAddModal = () => {
    setIsAddModalOpen(!isAddModalOpen);
    setData({
      categoryName: "",
    });
    setImagePreview(null);
  };

  const toggleEditModal = () => {
    setIsEditModalOpen(!isEditModalOpen);
  };

  const toggleDeleteModal = () => {
    setIsDeleteModalOpen(!isDeleteModalOpen);
  };

  const handleEditClick = (category) => {
    console.log("category", category);
    setEditCategory(category);
    toggleEditModal();
  };

  const handleDeleteClick = (categoryId) => {
    console.log("categoryId", categoryId);
    setcategoryIdToDelete(categoryId);
    toggleDeleteModal();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    setEditCategory((prevState) => ({
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
      setEditCategory((prevState) => ({
        ...prevState,
        [name]: file,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value);
      });
      console.log("formData", formData);
      const response = await addCategory(formData);
      console.log("response", response);

      setIsAddModalOpen(false);
      if (response && (response.status === 200 || response.status === 201)) {
        toast.success("Category added successfully");
        setTimeout(() => {
          getCategories();
        }, 1000);
      } else {
        toast.error("Error: Unable to add Category");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error: Unable to add Category");
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.entries(editCategory).forEach(([key, value]) => {
        if (key !== "password") {
          formData.append(key, value);
        }
      });
      console.log("formData", formData);
      const response = await updateCategory(formData);
      console.log("response", response);

      setIsEditModalOpen(false);
      if (response && (response.status === 200 || response.status === 201)) {
        toast.success("Category edited successfully");
        setTimeout(() => {
          getCategories();
        }, 1000);
      } else {
        toast.error("Error: Unable to edit Category");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error: Unable to edit Category");
    }
  };

  const confirmDelete = async () => {
    try {
      const response = await delCategory({ _id: categoryIdToDelete });
      if (
        response &&
        (response.statusCode === 200 || response.statusCode === 201)
      ) {
        toast.success("Deleted successfully");
        setTimeout(() => {
          setCategories(
            categories.filter((category) => category._id !== categoryIdToDelete)
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
                    <CardTitle tag="h4">Categories Table</CardTitle>
                  </Col>
                  <Col className="text-right">
                    <Button onClick={toggleAddModal}>Add Category</Button>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                <Table responsive>
                  <thead className="text-primary">
                    <tr>
                      <th>S.No</th>
                      <th style={{width: "50%"}}>Category Name</th>
                      <th style={{width: "50%"}}>Category Image</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((category, index) => (
                      <tr key={category._id}>
                        <td>{index + 1}</td>
                        <td>{category.categoryName}</td>
                        <td>
                          <img
                            src={`https://gfg.org.in/${category.categoryImage}`}
                            alt={category.categoryImage}
                            width="100"
                          />
                        </td>
                        <td className="d-flex">
                          <Button
                            color="primary m-3 mr-3"
                            onClick={() => handleEditClick(category)}
                          >
                            <div className="prodactclass">
                              <FaEdit /> <p className="prodacttext">Edit</p>
                            </div>
                          </Button>
                          <Button
                            color="danger m-3 mr-3"
                            onClick={() => handleDeleteClick(category._id)}
                          >
                            <div className="prodactclass">
                            <FaTrash /> <p className="prodacttext">Delete</p>
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

      {/* add Modal */}
      <Modal
        className="modal-dialog modal-dialog-centered"
        isOpen={isAddModalOpen}
        toggle={toggleAddModal}
      >
        <ModalHeader>Add Category</ModalHeader>
        <Form onSubmit={handleSubmit}>
          <ModalBody>
            <FormGroup className="formGroupClass">
              <Label for="categoryName" className="categoryInput">Category Name : </Label>
              <Input
                type="text"
                name="categoryName"
                id="categoryName"
                value={data.categoryName}
                onChange={handleChange}
              />
            </FormGroup>
            <FormGroup className="formGroupClass">
              <Label for="catgeoryImage" className="categoryInput">Category Image : </Label>
              <Input
                type="file"
                id="catgeoryImage"
                name="catgeoryImage"
                onChange={handleFileChange}
              />
            </FormGroup>
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Product Preview"
                width="100"
                style={{ marginTop: "10px" }}
              />
            )}
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={toggleAddModal}>
              Close
            </Button>
            <Button color="primary" type="submit">
              Submit
            </Button>
          </ModalFooter>
        </Form>
      </Modal>

      {/* edit Modal */}
      <Modal
        className="modal-dialog modal-dialog-centered"
        isOpen={isEditModalOpen}
        toggle={toggleEditModal}
      >
        <ModalHeader>Edit Category</ModalHeader>
        <Form onSubmit={handleEditSubmit}>
          <ModalBody>
            <FormGroup>
              <Label for="categoryName">Category Name</Label>
              <Input
                type="text"
                name="categoryName"
                id="categoryName"
                value={editCategory.categoryName}
                onChange={handleChange}
              />
            </FormGroup>
            <FormGroup>
              <Label for="categoryImage">Category Image</Label>
              <Input
                type="file"
                id="categoryImage"
                name="categoryImage"
                onChange={handleFileChange}
              />
            </FormGroup>
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Category Preview"
                width="100"
                style={{ marginTop: "10px" }}
              />
            ) : (
              editCategory.categoryImage && (
                <img
                  src={`https://gfg.org.in/${editCategory.categoryImage}`}
                  alt="Current Category"
                  width="100"
                  style={{ marginTop: "10px" }}
                />
              )
            )}
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={toggleEditModal}>
              Close
            </Button>
            <Button color="primary" type="submit">
              Submit
            </Button>
          </ModalFooter>
        </Form>
      </Modal>

      {/* delete modal */}
      <Modal
        className="modal-dialog modal-dialog-centered"
        isOpen={isDeleteModalOpen}
        toggle={toggleDeleteModal}
      >
        <ModalBody>Are you sure you want to delete this category?</ModalBody>
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

export default Categories;
