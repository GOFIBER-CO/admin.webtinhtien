import React from "react";
import { Col, Container, Row } from "reactstrap";

//import COmponents
import BreadCrumb from "../../Components/Common/BreadCrumb";
import Dashboard from "../../Components/Dashboard/Dashboard";

const DashboardAnalytics = () => {
  document.title = "Analytics | Velzon - React Admin & Dashboard Template";
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Analytics" pageTitle="Dashboards" />
          {/* <Row>
            <LiveUsers />
          </Row> */}

          <Row>
            <div className="mt-4 mb-5">
              <Dashboard />
            </div>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default DashboardAnalytics;
