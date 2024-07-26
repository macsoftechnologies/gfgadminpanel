import React, { useEffect, useState } from "react";
import { getAdvertisements, addAdvertisement, deleteAdvertisement, editAdvertisement } from "service/service";
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
  CardText,
} from "reactstrap";
import { toast, ToastContainer } from "react-toastify";
import { FaEdit, FaEye, FaTimes, FaTrash } from "react-icons/fa";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import MapComponent from "./Map";
import MapViewComponent from "./Mappointer";
import "./Advertisement.css";
import { deleteFileFromServer } from "service/service";

function Advertisements() {
  const [ads, setAds] = useState([]);
  const [isModeltrue, setisModeltrue] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [adIdToDelete, setAdIdToDelete] = useState(null);
  const [viewCardOpen, setViewCardOpen] = useState(false);
  const [selectedAdvertisement, setSelectedAdvertisement] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [existingFiles, setExistingFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    advertisement: [],
    radius: null,
    longitude: 0,
    latitude: 0,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if(!token) {
      window.location.href = '/';
    }
    const fetchdata = async () => {
      try {
        const adsdata = await getAdvertisements();
        setAds(adsdata.data);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };
    fetchdata();
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  const toggleModal = () => {
    setData({
      advertisement: [],
      radius: null,
      longitude: 0,
      latitude: 0,
    });
    setExistingFiles([]);
    setisModeltrue(!isModeltrue);
    setIsEditing(false);
  };

  const toggleDeleteModal = () => {
    setIsDeleteModalOpen(!isDeleteModalOpen);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  
  const handleFileChange = (e) => {
    const { files } = e.target;
    const fileArray = Array.from(files);
    // Clear existingFiles when new files are added
    setExistingFiles([]);
    setData((prevState) => ({
      ...prevState,
      advertisement: [...fileArray], // Update to use only new files
    }));
  };
  

  const handleRemoveFile = (index) => {
    setData((prevState) => {
      const newAdvertisement = [...prevState.advertisement];
      newAdvertisement.splice(index, 1);
      return {
        ...prevState,
        advertisement: newAdvertisement,
      };
    });
  };

  const handleRemoveExistingFile = async (index, _id) => {
    const fileToRemove = existingFiles[index];
    if (fileToRemove.fromServer) {
      try {
        const fileData = {
          _id: _id,
          advertisement: fileToRemove.url
        }
        const response = await deleteFileFromServer(fileData);
        if (response && (response.statusCode === 200 || response.statusCode === 201)) {
          toast.success("File removed successfully");
          setExistingFiles((prevState) => {
            const newFiles = [...prevState];
            newFiles.splice(index, 1);
            return newFiles;
          });
          getAdvertisements();
        } else {
          toast.error("Error: Unable to remove file");
        }
      } catch (error) {
        console.error("Error removing file:", error);
        toast.error("Error: Unable to remove file");
      }
    } else {
      setExistingFiles((prevState) => {
        const newFiles = [...prevState];
        newFiles.splice(index, 1);
        return newFiles;
      });
    }
  };   

  const handlePositionChange = (lat, lng) => {
    setData((prevState) => ({
      ...prevState,
      latitude: lat,
      longitude: lng,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      data.advertisement.forEach((file, index) => {
        formData.append(`advertisement[${index}]`, file);
      });
      formData.append("radius", data.radius);
      formData.append("longitude", data.longitude);
      formData.append("latitude", data.latitude);
      formData.append("existingFiles", JSON.stringify(existingFiles));

      let response;
      if (isEditing) {
        formData.append("_id", data._id);
        response = await editAdvertisement(formData);
      } else {
        response = await addAdvertisement(formData);
      }

      setisModeltrue(false);
      if (response && (response.statusCode === 200 || response.statusCode === 201)) {
        toast.success(`Advertisement ${isEditing ? "updated" : "added"} successfully`);
        setTimeout(() => {
          getAdvertisements().then((userdata) => setAds(userdata.data));
        }, 1000);
      } else {
        toast.error(`Error: Unable to ${isEditing ? "update" : "add"} Advertisement`);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error(`Error: Unable to ${isEditing ? "update" : "add"} Advertisement`);
    }
  };

  const handleDeleteClick = (advertisementId) => {
    setAdIdToDelete(advertisementId);
    toggleDeleteModal();
  };

  const confirmDelete = async () => {
    try {
      const response = await deleteAdvertisement({ _id: adIdToDelete });
      if (response && (response.statusCode === 200 || response.statusCode === 201)) {
        toast.success("Deleted successfully");
        setTimeout(() => {
          setAds(ads.filter((adv) => adv._id !== adIdToDelete));
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

  const handleEditClick = (advertisement) => {
    setData({
      _id: advertisement._id,
      advertisement: [],
      radius: advertisement.radius,
      longitude: advertisement.coordinates.coordinates[0],
      latitude: advertisement.coordinates.coordinates[1],
    });
    setExistingFiles(advertisement.advertisement.map(ad => ({
      url: ad,
      fromServer: true,
    })));
    setIsEditing(true);
    setisModeltrue(true);
  };
  

  const isVideo = (file) => {
    return file.type && file.type.startsWith("video/");
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
                    <CardTitle tag="h4">Advertisements List</CardTitle>
                  </Col>
                  <Col className="text-right">
                    <Button onClick={toggleModal}>Add Advertisement</Button>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                <Table responsive>
                  <thead className="text-primary">
                    <tr>
                      <th>S.No</th>
                      <th>Advertisement</th>
                      <th>Radius</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ads.map((advertisement, index) => (
                      <tr key={advertisement._id}>
                        <td>{index + 1}</td>
                        <td>
                          <Carousel showThumbs={false} showStatus={false} emulateTouch width="300px">
                            {advertisement.advertisement.map((adImage, imgIndex) => (
                              <div key={imgIndex}>
                                {adImage.endsWith(".mp4") ? (
                                  <video
                                    className="adVideoClass"
                                    src={`https://gfg.org.in/${adImage}`}
                                    controls
                                  />
                                ) : (
                                  <img
                                    className="adImageClass"
                                    src={`https://gfg.org.in/${adImage}`}
                                    alt={`Advertisement ${imgIndex + 1}`}
                                  />
                                )}
                              </div>
                            ))}
                          </Carousel>
                        </td>
                        <td>{advertisement.radius}</td>
                        <td className="d-flex">
                          <Button
                            color="success mt-5 mr-3"
                            style={{ marginRight: "5px" }}
                            onClick={() => setSelectedAdvertisement(advertisement)}
                          >
                            <FaEye />
                          </Button>
                          <Button
                            color="primary mt-5 mr-3"
                            onClick={() => handleEditClick(advertisement)}
                          >
                            <FaEdit />
                          </Button>
                          <Button
                            color="danger mt-5 mr-3"
                            onClick={() => handleDeleteClick(advertisement._id)}
                          >
                            <FaTrash />
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

      {/* add/edit modal */}
      <Modal className="modal-lg" isOpen={isModeltrue} toggle={toggleModal}>
        <ModalBody>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col>
                <FormGroup>
                  <Label for="advertisement">Advertisement Files</Label>
                  <Input
                    type="file"
                    name="advertisement"
                    id="advertisement"
                    accept="image/*,video/*"
                    onChange={handleFileChange}
                    multiple
                  />
                </FormGroup>
                <FormGroup>
                  <Label for="radius">Radius</Label>
                  <Input
                    type="number"
                    name="radius"
                    id="radius"
                    value={data.radius}
                    onChange={handleChange}
                  />
                </FormGroup>
              </Col>
              <Col>
              <Carousel className="mb-3" showThumbs={false} showStatus={false} emulateTouch width="300px">
                  {existingFiles.map((file, index) => (
                    <div key={index} className="position-relative">
                      {file.url.endsWith(".mp4") ? (
                        <video src={`https://gfg.org.in/${file.url}`} controls className="adVideoClass" />
                      ) : (
                        <img
                          src={`https://gfg.org.in/${file.url}`}
                          alt={`Selected file ${index + 1}`}
                          className="adImageClass"
                        />
                      )}
                      <Button
                        color="danger"
                        size="sm"
                        className="position-absolute"
                        style={{ top: 10, right: 10 }}
                        onClick={() => handleRemoveExistingFile(index, data._id)}
                      >
                        <FaTimes />
                      </Button>
                    </div>
                  ))}
                  {data.advertisement.map((file, index) => (
                    <div key={index} className="position-relative">
                      {isVideo(file) ? (
                        <video src={URL.createObjectURL(file)} controls className="adVideoClass" />
                      ) : (
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Selected file ${index + 1}`}
                          className="adImageClass"
                        />
                      )}
                      <Button
                        color="danger"
                        size="sm"
                        className="position-absolute"
                        style={{ top: 10, right: 10 }}
                        onClick={() => handleRemoveFile(index)}
                      >
                        <FaTimes />
                      </Button>
                    </div>
                  ))}
                </Carousel>
              </Col>
            </Row>
            <MapComponent
              initialPosition={[data.latitude, data.longitude]}
              onPositionChange={handlePositionChange}
              apiKey="AIzaSyCiUU7Q5X1hTMRAJr0YJZPOxw40FfZcZp0"
            />
            <Button type="submit">{isEditing ? "Update" : "Submit"}</Button>
          </Form>
        </ModalBody>
      </Modal>

      {/* view modal */}
      {selectedAdvertisement && (
        <Modal className="modal-lg" isOpen={true} toggle={() => setSelectedAdvertisement(null)}>
          <ModalBody>
            <Card>
              <CardTitle>Advertisement Details</CardTitle>
              <CardBody>
                <Row>
                  <Col>
                    <Carousel showThumbs={false} showStatus={false} emulateTouch width="300px">
                      {selectedAdvertisement.advertisement.map((adImage, imgIndex) => (
                        <div key={imgIndex}>
                          {adImage.endsWith(".mp4") ? (
                            <video
                              className="adViewVideoClass"
                              src={`https://gfg.org.in/${adImage}`}
                              controls
                            />
                          ) : (
                            <img
                              className="adViewImageClass"
                              src={`https://gfg.org.in/${adImage}`}
                              alt={`Advertisement ${imgIndex + 1}`}
                            />
                          )}
                        </div>
                      ))}
                    </Carousel>
                    <CardText className="mt-5">Radius : {selectedAdvertisement.radius}</CardText>
                  </Col>
                  <Col>
                    {selectedAdvertisement && selectedAdvertisement.coordinates ? (
                      <MapViewComponent
                        initialPosition={[
                          selectedAdvertisement.coordinates.coordinates[1],
                          selectedAdvertisement.coordinates.coordinates[0],
                        ]}
                        apiKey="AIzaSyCiUU7Q5X1hTMRAJr0YJZPOxw40FfZcZp0"
                      />
                    ) : (
                      <div>Loading...</div>
                    )}
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </ModalBody>
        </Modal>
      )}

      {/* delete modal */}
      <Modal
        className="modal-dialog modal-dialog-centered"
        isOpen={isDeleteModalOpen}
        toggle={toggleDeleteModal}
      >
        <ModalBody>Are you sure you want to delete this advertisement?</ModalBody>
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

export default Advertisements;