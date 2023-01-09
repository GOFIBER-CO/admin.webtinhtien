import React, { useEffect, useState } from "react";
import {
  Col,
  Container,
  Input,
  InputGroup,
  InputGroupText,
  Row,
  Button,
  Form,
  FormGroup,
  Label,
  FormFeedback,
} from "reactstrap";

import { message, Badge, Space, Table, Modal, Select } from "antd";
import { Link, useParams, useHistory } from "react-router-dom";
import { addUser, getUser, updateUser, getAllRoles } from "../../helpers/helper";
import BreadCrumb from "../../Components/Common/BreadCrumb";
const { Option } = Select;
const { Column } = Table;

const success = () => {
  message.success("Thành công");
};

const error = () => {
  message.error("Có lỗi xảy ra. Vui lòng thử lại!");
};

function AddUser() {
  const { id } = useParams();
  const [user, setUser] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [roleList, setRoleList] = useState([]);
  const history = useHistory();
  const [formVal, setFormVal] = useState({
    username: "",
    firstName: "",
    passwordHash: "",
    lastName: "",
    status: "",
    role: "",
  });
  const getRole = async () => {
    let roleList = await getAllRoles();
    console.log(roleList, "data");
    setRoleList(roleList);
  };
  useEffect(() => {
    if (id && id !== "new") {
      getUser(id).then((res) => {
        setUser(res);
        res.role = res.role._id;
        setFormVal(res);
      });
    }
    getRole();
  }, [id]);

  const reset = () => {
    setFormVal({
      username: "",
      firstName: "",
      lastName: "",
      password: "",
      role: "",
    });
  };

  const onInputChange = (e) => {
    setFormVal({
      ...formVal,
      [e.target.name]: e.target.value,
    });
  };

  const onRoleChange = (e) => {
    setFormVal({ ...formVal, role: e });
  };

  const addNewUser = () => {
    setSubmitted(true);
    if (formVal.password?.length < 6) {
      return;
    }
    if (user) {
      updateUser(id, formVal)
        .then((res) => {
          // reset();
          success();
          history.push("/users");
        })
        .catch((err) => {
          error();
        });
    } else {
      addUser(formVal)
        .then((res) => {
          // reset();
          history.push("/users");
          success();
        })
        .catch((err) => {
          error();
        });
    }
  };
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb
            title={user ? "Sửa thành viên" : "Thêm thành viên"}
            pageTitle="Quản lý thành viên"
            slug="users"
          />
          <Row className="mb-3">
            <div className="mb-3">
              <Link to="/users">
                <div className="d-flex align-items-center">
                  <i className="ri-arrow-left-line"></i>
                  <div style={{ marginLeft: "6px" }}>Quay lại</div>
                </div>
              </Link>
            </div>
            <div>
              <div>
                <Form>
                  <Row>
                    <Col lg={6}>
                      <FormGroup>
                        <Label className="mb-1" for="username">
                          Tên đăng nhập
                        </Label>
                        <Input
                          id="username"
                          name="username"
                          placeholder="Nhập tên đăng nhập"
                          type="text"
                          // disabled={id !== "new" ? true : false}
                          value={formVal.username}
                          onChange={onInputChange}
                          invalid={
                            submitted
                              ? formVal.username.length >= 6
                                ? false
                                : true
                              : false
                          }
                        />
                        <FormFeedback
                          invalid={
                            submitted
                              ? formVal.username?.length >= 6
                                ? false
                                : true
                              : false
                          }
                        >
                          Abc
                        </FormFeedback>
                      </FormGroup>
                    </Col>
                    <Col lg={6}>
                      <FormGroup>
                        <Label className="mb-1" for="name">
                          Tên
                        </Label>
                        <Input
                          id="name"
                          name="firstName"
                          placeholder="First name"
                          value={formVal.name}
                          onChange={onInputChange}
                          type="text"
                        />
                      </FormGroup>
                    </Col>
                    <Col lg={6}>
                      <FormGroup>
                        <Label className="mb-1" for="password">
                          {" "}
                          Mật khẩu
                        </Label>
                        <Input
                          id="password"
                          name="passwordHash"
                          placeholder="password"
                          value={formVal.password}
                          onChange={onInputChange}
                          type="password"
                          invalid={
                            submitted
                              ? formVal.password?.length >= 6
                                ? false
                                : true
                              : false
                          }
                        />
                        <FormFeedback
                          invalid={
                            submitted
                              ? formVal.password?.length >= 6
                                ? false
                                : true
                              : false
                          }
                        >
                          Mật khẩu chứa ít nhất có 6 kí tự
                        </FormFeedback>
                      </FormGroup>
                    </Col>
                    <Col lg={6}>
                      <FormGroup>
                        <Label className="mb-1" for="name">
                          Họ
                        </Label>
                        <Input
                          id="name"
                          name="lastName"
                          placeholder="last name"
                          value={formVal.name}
                          onChange={onInputChange}
                          type="text"
                        />
                      </FormGroup>
                    </Col >
                    <Col lg={6}>
                      <FormGroup>
                        <Label className="mb-1" for="role">
                          Phân quyền
                        </Label>
                        <Select
                          size="large"
                          name="role"
                          id="role"
                          value={formVal.role}
                          onChange={onRoleChange}
                          placeholder="Role"
                          style={{ width: "100%" }}
                        >
                          {/* {roleList &&
                            roleList.map((item, index) => {
                              return (
                                <Option value={item._id} key={item._id}>
                                  {item.roleName}
                                </Option>
                              );
                            })} */}
                          <Option value="Admin">Admin</Option>
                          <Option value="Leader">Leader </Option>
                          <Option value="Member">Member</Option>
                        </Select>
                      </FormGroup>
                    </Col>
                    <Col lg={6}>
                      <FormGroup>
                        <Label className="mb-1" for="status">
                          Trạng thái
                        </Label>
                        <Select
                          size="large"
                          name="status"
                          id="status"
                          value={formVal.role}
                          onChange={onRoleChange}
                          placeholder="Trạng thái"
                          style={{ width: "100%" }}
                        >
                          {/* {roleList &&
                            roleList.map((item, index) => {
                              return (
                                <Option value={item._id} key={item._id}>
                                  {item.roleName}
                                </Option>
                              );
                            })} */}
                          <Option value={1}>Hoạt động</Option>
                          <Option value={2}>không hoạt động</Option>
                          {/* <Option value="Collaborators">Cộng tác viên</Option> */}
                        </Select>
                      </FormGroup>
                    </Col>
                  </Row>
                </Form>
              </div>
              <div className="text-center mt-4">
                <Link to="/users">
                  <Button outline size="large" className="mr-3">
                    Quay lại
                  </Button>
                </Link>
                <Button size="large" onClick={() => addNewUser()}>
                  Lưu
                </Button>
              </div>
            </div>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
}

export default AddUser;
