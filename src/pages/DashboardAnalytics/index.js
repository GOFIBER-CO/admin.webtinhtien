import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Col, Container, Row } from "reactstrap";

//import COmponents
import BreadCrumb from "../../Components/Common/BreadCrumb";
import Dashboard from "../../Components/Dashboard/Dashboard";
import { checkPermissionScreen } from "../../helpers/helper";
import Page403 from "../403";

const DashboardAnalytics = () => {
  const [checkRole, setCheckRole] = useState(true);
  const location = useLocation();
  const checkScreen = async () => {
    const permission = await checkPermissionScreen(location.pathname);
    setCheckRole(permission.status);
  };
  useEffect(() => {
    checkScreen();
  }, []);
  document.title = "Analytics | Velzon - React Admin & Dashboard Template";
  return (
    <React.Fragment>
      {checkRole === true ? (
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
      ) : (
        <Page403 />
      )}
    </React.Fragment>
  );
};

export default DashboardAnalytics;
