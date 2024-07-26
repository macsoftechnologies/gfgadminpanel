import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardBody, CardTitle, Row, Col, CardLink, Button, Table } from "reactstrap";
import { getProducts } from "service/service";

function Icons() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsData = await getProducts();
        setProducts(productsData);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchProducts();
  }, []);

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
                  <Col className="text-right">
                    <CardTitle><Button onClick={""}>Add Product</Button></CardTitle>
                  </Col>
                </Row>
              </CardHeader>

              <CardBody>
                <Table responsive>
                  <thead className="text-primary">
                    <tr>
                      <th>Product</th>
                      <th>UserName</th>
                      <th>Image</th>

                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product._id}>
                        <td>{product.productName}</td>
                        <td>{product.userId.userName}</td>
                        <td><img
                          src={`https://gfg.org.in/${product.productImage}`}
                          alt={product.productName}
                          width="150"
                        /></td>


                        <td><Button onClick={""} color="warning" style={{ marginRight: '10px' }}>Edit</Button>
                          <Button onClick={""} color="warning">Delete</Button></td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default Icons;
