import React, { useEffect, useState } from "react";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import {
  Button,
  Col,
  Container,
  Input,
  InputGroup,
  InputGroupText,
  Row,
} from "reactstrap";
import { Space, Table, Select, Popconfirm, Form } from "antd";

import "../../App.css";
import { Drawer } from "antd";
import { html } from "gridjs";
// import { Form } from "reactstrap";

const { Column } = Table;
const { Option } = Select;
function LinkPosts() {
  const [link, setLink] = useState("");
  const handleVerify = () => {
    if (link) {
      let a = link.split("/");
      console.log(a[5], "asdsadsad");
    }
  };
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Link posts" pageTitle="Link Posts" />
          <Form>
            <Input value={link} onChange={(e) => setLink(e.target.value)} />
            <Button onClick={handleVerify}>xac nhan</Button>
          </Form>
        </Container>
      </div>
    </React.Fragment>
  );
}

export default LinkPosts;
