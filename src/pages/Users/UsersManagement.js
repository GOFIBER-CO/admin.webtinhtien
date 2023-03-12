import React, { useCallback, useEffect, useState } from "react";

//import Components
import BreadCrumb from "../../Components/Common/BreadCrumb";
import { Col, Container, Input, InputGroup, Row, Button } from "reactstrap";

// Formik validation
import * as Yup from "yup";
import { useFormik } from "formik";

import {
  Badge,
  message,
  Space,
  Table,
  Modal,
  Select,
  Popconfirm,
  Pagination,
} from "antd";
import { Link, useLocation } from "react-router-dom";
import {
  addUser,
  checkPermissionScreen,
  deleteUser,
  deleteUsers,
  getAllUsers,
  getPagingUsers,
} from "../../helpers/helper";
import Page403 from "../403";
const { Option } = Select;
const { Column } = Table;

const success = () => {
  message.success("Thành công");
};

const error = () => {
  message.error("Có lỗi xảy ra. Vui lòng thử lại!");
};
const UsersManagement = () => {
  document.title = "Users Management";
  const [isModalAddUserVisible, setIsModalVisible] = useState(false);
  const [users, setUsers] = useState([]);
  const [total, setTotals] = useState(0);
  const [searchInput, setSearchInput] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [pageIndex, setPageIndex] = useState(1);
  const [checkRole, setCheckRole] = useState(true);
  const location = useLocation();
  const checkScreen = async () => {
    const permission = await checkPermissionScreen(location.pathname);
    setCheckRole(permission.status);
  };
  useEffect(() => {
    checkScreen();
  }, []);
  const confirm = (user) => {
    // console.log(user, 'user');
    if (user?.id) {
      deleteUsers(user.id)
        .then((res) => {
          getUsers();
          success();
        })
        .catch((er) => {
          error();
        });
    }
  };

  const cancel = (e) => {
    console.log(e);
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  // const addNewUser = () => {
  //   console.log("form val: ", formVal);
  //   addUser(formVal).then((res) => {
  //     console.log("add user: ", res);
  //     setIsModalVisible(false);
  //   });
  // };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const onSearchUser = () => {
    // setSearchInput(e.target.value);

    // console.log(dataSearch);

    // .then((data) => setUsers(data));
    // console.log(a, "dasdasd");
    getUsers();
  };

  useEffect(() => {
    getUsers();
  }, [pageIndex, pageSize]);

  const getUsers = () => {
    let dataReq = {
      pageSize: pageSize,
      pageIndex: pageIndex,
      search: searchInput,
    };
    getPagingUsers(searchInput, pageIndex, pageSize).then((res) => {
      setUsers(res?.data);
      setPageIndex(res?.pageIndex);
      setPageSize(res?.pageSize);
      setTotals(res?.totalItem);
      // let userList = res.docs;
      // userList.map((item) => {
      //   item.role = item.role.roleName;
      // });
      // setUsers(userList);
      // setTotals(res.totalDocs);
    });
  };

  return (
    <React.Fragment>
      {checkRole ? (
        <div className="page-content">
          <Container fluid>
            <BreadCrumb title="Thành Viên" pageTitle="Quản lý thành viên" />
            <Row className="mb-3">
              <Col lg="5">
                <div>
                  <InputGroup>
                    <Input
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                      placeholder="Tìm kiếm thành viên..."
                    />
                    <Button onClick={() => onSearchUser()}>
                      <i className="ri-search-line"></i>
                    </Button>
                  </InputGroup>
                </div>
              </Col>

              <Col lg="7">
                <div className="text-right">
                  <Link to="/user/add/new">
                    <Button>Thêm mới</Button>
                  </Link>
                </div>
              </Col>
            </Row>
            <Row>
              <Col lg={12}>
                <Table pagination={false} dataSource={users}>
                  <Column
                    title="#"
                    render={(val, rec, index) => {
                      return index + 1;
                    }}
                  />
                  <Column
                    title="Tên"
                    dataIndex="lastName"
                    key="lastName"
                    sorter={(a, b) => a?.lastName.localeCompare(b?.lastName)}
                  />
                  <Column
                    title="Tên đăng nhập"
                    dataIndex="username"
                    key="username"
                    sorter={(a, b) => a?.username.localeCompare(b?.username)}
                  />
                  <Column
                    title="Phân quyền"
                    dataIndex="role"
                    key="role"
                    sorter={(a, b) => a?.role.localeCompare(b?.role)}
                  />
                  <Column
                    title="Tình trạng"
                    dataIndex="status"
                    key="status"
                    render={(_, record) => {
                      if (record?.status === 1) {
                        return (
                          <span>
                            <Badge status="success" />
                            Hoạt động
                          </span>
                        );
                      } else {
                        return (
                          <span>
                            <Badge status="error" />
                            không hoạt động
                          </span>
                        );
                      }
                    }}
                    sorter={(a, b) => a?.status - b?.status}
                  />
                  <Column
                    title="Hoạt động"
                    key="action"
                    render={(val, record) => (
                      <Space size="middle">
                        {/* <Link to={{ pathname: "/users/" + val.id }}>View</Link> */}
                        {/* <Link to={{ pathname: "/users/" + val.id }}>
                        <i className="ri-eye-line action-icon"></i>
                      </Link> */}
                        <Link to={{ pathname: "/user/add/" + val.id }}>
                          <i className="ri-pencil-line action-icon"></i>
                        </Link>

                        {/* <Link to={{ pathname: "/user/add/" + val.id }}>Edit</Link> */}
                        {/* <a>Add</a>
                      <a>Edit</a> */}
                        <Popconfirm
                          title="Are you sure to delete this user?"
                          onConfirm={() => confirm(val)}
                          onCancel={cancel}
                          okText="Yes"
                          cancelText="No"
                        >
                          <i className="ri-delete-bin-line action-icon"></i>
                        </Popconfirm>
                      </Space>
                    )}
                  />
                </Table>
                <Pagination
                  style={{ float: "right", marginTop: "10px" }}
                  total={total}
                  showTotal={(total) => `Total ${total} items`}
                  showSizeChanger
                  defaultPageSize={pageSize}
                  current={pageIndex}
                  onChange={(page, pageSize) => {
                    setPageIndex(page);
                    setPageSize(pageSize);
                  }}
                />
              </Col>
            </Row>
          </Container>
        </div>
      ) : (
        <Page403 />
      )}
    </React.Fragment>
  );
};

export default UsersManagement;
