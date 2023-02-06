import React, { useEffect, useState } from "react";
import {
  Button,
  Col,
  Container,
  Form,
  FormFeedback,
  FormGroup,
  Input,
  Label,
  Row,
} from "reactstrap";

import { message, Select, Table } from "antd";
import { Link, useHistory, useParams } from "react-router-dom";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import {
  getAllRoles,
  getTeamAll,
  getUserId,
  newUser,
  updateUsers,
} from "../../helpers/helper";
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
    team: "",
    // avatar:"",
  });
  const [teamList, setTeamList] = useState([]);
  const getRole = async () => {
    let roleList = await getAllRoles();
    setRoleList(roleList.roles);
  };

  const getTeamAlls = async () => {
    const data = await getTeamAll();
    setTeamList(data?.data);
  };
  useEffect(() => {
    if (id && id !== "new") {
      getUserId(id).then((res) => {
        setUser(res);
        console.log(res, "aaa");
        setFormVal(res);
      });
    }
    getRole();
    getTeamAlls();
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
    setFormVal({
      ...formVal,
      role: roleList.filter((item) => item?._id === e)?.[0].name,
    });
  };

  const onTeamChange = (e) => {
    setFormVal({
      ...formVal,
      team: teamList.filter((item) => item?._id === e)?.[0]._id,
    });
  };

  const onStatusChange = (e) => {
    setFormVal({ ...formVal, status: e });
  };

  const addNewUser = async () => {
    setSubmitted(true);

    if (formVal.password?.length < 6) {
      return;
    }
    if (user?.id) {
      await updateUsers(id, formVal)
        .then((res) => {
          reset();
          success();
          history.push("/users");
        })
        .catch((err) => {
          error();
        });
    } else {
      await newUser(formVal)
        .then((res) => {
          reset();
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
                          disabled={id !== "new" ? true : false}
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
                        <Label className="mb-1" for="firstName">
                          Tên
                        </Label>
                        <Input
                          id="firstName"
                          name="firstName"
                          placeholder="First name"
                          value={formVal.firstName}
                          onChange={onInputChange}
                          type="text"
                        />
                      </FormGroup>
                    </Col>
                    {user.id ? (
                      <></>
                    ) : (
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
                            value={formVal.passwordHash}
                            onChange={onInputChange}
                            // disabled
                            type="password"
                            invalid={
                              submitted
                                ? formVal.passwordHash?.length >= 6
                                  ? false
                                  : true
                                : false
                            }
                          />
                          <FormFeedback
                            invalid={
                              submitted
                                ? formVal.passwordHash?.length >= 6
                                  ? false
                                  : true
                                : false
                            }
                          >
                            Mật khẩu chứa ít nhất có 6 kí tự
                          </FormFeedback>
                        </FormGroup>
                      </Col>
                    )}

                    <Col lg={6}>
                      <FormGroup>
                        <Label className="mb-1" for="name">
                          Họ
                        </Label>
                        <Input
                          id="name"
                          name="lastName"
                          placeholder="last name"
                          value={formVal.lastName}
                          onChange={onInputChange}
                          type="text"
                        />
                      </FormGroup>
                    </Col>
                    <Col lg={6}>
                      <FormGroup>
                        <Label className="mb-1" for="team">
                          Team
                        </Label>
                        <Select
                          size="large"
                          name="team"
                          id="team"
                          value={formVal.team}
                          onChange={(e) => onTeamChange(e)}
                          placeholder="Team"
                          style={{ width: "100%" }}
                        >
                          {teamList &&
                            teamList?.map((item, index) => {
                              return (
                                <Option value={item._id} key={item._id}>
                                  {item.name}
                                </Option>
                              );
                            })}
                        </Select>
                      </FormGroup>
                    </Col>

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
                          onChange={(e) => onRoleChange(e)}
                          placeholder="Role"
                          style={{ width: "100%" }}
                        >
                          {roleList &&
                            roleList?.map((item, index) => {
                              return (
                                <Option value={item._id} key={item._id}>
                                  {item.name}
                                </Option>
                              );
                            })}
                          {/* <Option value="Admin">Admin</Option>
                          <Option value="Leader">Leader </Option>
                          <Option value="Member">Member</Option> */}
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
                          value={formVal.status}
                          onChange={onStatusChange}
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
                    {/* <Col lg={6}>
                      <FormGroup>
                        <Label className="mb-1" for="status">
                        avatar
                        </Label>
                        <Input  value={formVal.avatar}
                          onChange={onInputChange}  name="avatar"/>
                      </FormGroup>
                    </Col> */}
                  </Row>
                </Form>
              </div>
              <div className="text-center mt-4">
                <Link to="/users">
                  <Button outline size="large" className="mr-3">
                    Quay lại
                  </Button>
                </Link>
                <Button size="large" onClick={addNewUser}>
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
