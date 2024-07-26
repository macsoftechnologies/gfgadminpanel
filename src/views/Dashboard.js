import React, { useEffect, useState } from "react";
// react plugin used to create charts
import { Line, Pie } from "react-chartjs-2";
// reactstrap components
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardTitle,
  Row,
  Col,
} from "reactstrap";
import "./Dashboard.css";
// core components
import {
  dashboard24HoursPerformanceChart,
  dashboardEmailStatisticsChart,
  dashboardNASDAQChart,
} from "variables/charts.js";

import {
  getMerchant,
  getCustomers,
  getProducts,
  getAdvertisements,
} from "service/service";
import { Link, useNavigate } from "react-router-dom";
import { getCategoriesList } from "service/service";

function Dashboard() {
  const [merchantsData, setMerchantsData] = useState();
  const [customerData, setCustomerData] = useState();
  const [productCount, setProductCount] = useState();
  const [advertisementCount, setAdvertisementCount] = useState();
  const [categoriesCount, setCategoriesCount] = useState();
  const [merchantsLoading, setMerchantsLoading] = useState(true);
  const [customersLoading, setCustomersLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(true);
  const [adsLoading, setAdsLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const navigate = useNavigate();

  const fetchMerchants = async () => {
    try {
      const { count, data } = await getMerchant();
      setMerchantsData(count);
      setMerchantsLoading(false);
    } catch (error) {
      console.error("Error fetching merchants data:", error);
      setMerchantsLoading(false);
    }
  };

  const fetchCustomer = async () => {
    try {
      const { count, data } = await getCustomers();
      setCustomerData(count);
      setCustomersLoading(false);
    } catch (error) {
      console.log(error);
      setCustomersLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await getProducts();
      console.log("productCountResponse", response);
      const count = response.length;
      console.log("count", count);
      setProductCount(count);
      setProductsLoading(false);
    } catch (error) {
      console.log(error);
      setProductsLoading(false);
    }
  };

  const fetchAdvertisements = async () => {
    try {
      const response = await getAdvertisements();
      console.log("advertismentcountresponse", response);
      const count = response.data.length;
      console.log("count", count);
      setAdvertisementCount(count);
      setAdsLoading(false);
    } catch (error) {
      console.log(error);
      setAdsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await getCategoriesList();
      console.log("advertismentcountresponse", response);
      const count = response.data.length;
      console.log("count", count);
      setCategoriesCount(count);
      setCategoriesLoading(false);
    } catch (error) {
      console.log(error);
      setCategoriesLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/";
    }
    fetchCustomer();
    fetchMerchants();
    fetchProducts();
    fetchAdvertisements();
    fetchCategories();
  }, []);

  return (
    <>
      <div className="content">
        <Row>
          <Col lg="3" md="6" sm="6">
            <Card className="card-stats customersDashCard">
              <CardBody>
                <Row>
                  <Col md="4" xs="5">
                    <div className="icon-big text-center icon-warning">
                      <i className="nc-icon nc-single-02 nciconsClass" />
                    </div>
                  </Col>
                  <Col md="8" xs="7">
                    <div className="numbers">
                      <p className="card-category cardCategory">Customers</p>
                      <CardTitle tag="p">
                        {customersLoading ? (
                          <div
                            className="spinner-border text-light"
                            role="status"
                          >
                            <span className="sr-only">Loading...</span>
                          </div>
                        ) : (
                          customerData
                        )}
                      </CardTitle>
                      <Link to="/admin/Customers">
                        <p className="viewmoreclass">
                          View More <span>{">>"}</span>
                        </p>
                      </Link>
                    </div>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
          <Col lg="3" md="6" sm="6">
            <Card className="card-stats merchantsDashCard">
              <CardBody>
                <Row>
                  <Col md="4" xs="5">
                    <div className="icon-big text-center icon-warning">
                      <i className="nc-icon nc-shop nciconsClass" />
                    </div>
                  </Col>
                  <Col md="8" xs="7">
                    <div className="numbers">
                      <p className="card-category cardCategory">Merchants</p>
                      <CardTitle tag="p">
                        {merchantsLoading ? (
                          <div
                            className="spinner-border text-light"
                            role="status"
                          >
                            <span className="sr-only">Loading...</span>
                          </div>
                        ) : (
                          merchantsData
                        )}
                      </CardTitle>
                      <Link to="/admin/Merchant">
                        <p className="viewmoreclass">
                          View More <span>{">>"}</span>
                        </p>
                      </Link>
                    </div>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
          <Col lg="3" md="6" sm="6">
            <Card className="card-stats productsDashCard">
              <CardBody>
                <Row>
                  <Col md="4" xs="5">
                    <div className="icon-big text-center icon-warning">
                      <i className="nc-icon nc-basket nciconsClass" />
                    </div>
                  </Col>
                  <Col md="8" xs="7">
                    <div className="numbers">
                      <p className="card-category cardCategory">Products</p>
                      <CardTitle tag="p">
                        {productsLoading ? (
                          <div
                            className="spinner-border text-light"
                            role="status"
                          >
                            <span className="sr-only">Loading...</span>
                          </div>
                        ) : (
                          productCount
                        )}
                      </CardTitle>
                      <Link to="/admin/Products">
                        <p className="viewmoreclass">
                          View More <span>{">>"}</span>
                        </p>
                      </Link>
                    </div>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
          <Col lg="3" md="6" sm="6">
            <Card className="card-stats advertisementsDashCard">
              <CardBody>
                <Row>
                  <Col md="4" xs="5">
                    <div className="icon-big text-center icon-warning">
                      <i className="nc-icon nc-laptop nciconsClass" />
                    </div>
                  </Col>
                  <Col md="8" xs="7">
                    <div className="numbers">
                      <p className="card-category cardCategory">
                        Advertisements
                      </p>
                      <CardTitle tag="p">
                        {adsLoading ? (
                          <div
                            className="spinner-border text-light"
                            role="status"
                          >
                            <span className="sr-only">Loading...</span>
                          </div>
                        ) : (
                          advertisementCount
                        )}
                      </CardTitle>
                      <Link to="/admin/Advertisements">
                        <p className="viewmoreclass">
                          View More <span>{">>"}</span>
                        </p>
                      </Link>
                    </div>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
          <Col lg="3" md="6" sm="6">
            <Card className="card-stats categoriesDashCard">
              <CardBody>
                <Row>
                  <Col md="4" xs="5">
                    <div className="icon-big text-center icon-warning">
                      <i className="nc-icon nc-tag-content nciconsClass" />
                    </div>
                  </Col>
                  <Col md="8" xs="7">
                    <div className="numbers">
                      <p className="card-category cardCategory">
                        Categories
                      </p>
                      <CardTitle tag="p">
                        {categoriesLoading ? (
                          <div
                            className="spinner-border text-light"
                            role="status"
                          >
                            <span className="sr-only">Loading...</span>
                          </div>
                        ) : (
                          categoriesCount
                        )}
                      </CardTitle>
                      <Link to="/admin/Categories">
                        <p className="viewmoreclass">
                          View More <span>{">>"}</span>
                        </p>
                      </Link>
                    </div>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default Dashboard;
