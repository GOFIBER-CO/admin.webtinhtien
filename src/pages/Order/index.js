import React, { createRef, useEffect, useState } from "react";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import { AiOutlineDelete } from "react-icons/ai";
// import { Col, Container, Row } from "reactstrap";
import {
  Select,
  Drawer,
  Row,
  Col,
  Input,
  Button,
  Table,
  Pagination,
  Space,
  Popconfirm,
} from "antd";
import { getListOrderPosts, deleteRecord } from "./../../helpers/helper";
import { Container } from "reactstrap";
import moment from "moment/moment";
// import { moment } from 'moment';
import { Link } from "react-router-dom";

const { Option } = Select;
const Orders = () => {
  const [pageIndex, setPageIndex] = useState();
  const [pageSize, setPageSize] = useState(5);
  const [visibleForm, setVisibleForm] = useState(false);
  const [drawerTitle, setDrawerTitle] = useState("");
  const [orderPostData, setOrderPostData] = useState([]);
  console.log("orderPostData: ", orderPostData);
  const onClose = () => {
    setVisibleForm(false);
  };
  const showDrawer = () => {
    setVisibleForm(true);
  };

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Mô tả",
      dataIndex: "desc",
      key: "desc",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (text, result) => {
        let rs = "";
        switch (text) {
          case -1:
            rs = "Đang chờ";
            break;
          case 0:
            rs = "Đã nhận";
            break;
          case 1:
            rs = "Hoàn thành";
            break;
          default:
            rs = "Đang chờ";
            break;
        }
        return <>{rs}</>;
      },
    },
    {
      title: "Số tiền mỗi từ",
      dataIndex: "moneyPerWord",
      key: "moneyPerWord",
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text, result) => {
        return <>{moment(text).format("DD/MM/YYYY")}</>;
      },
    },
    {
      title: "Hành động",
      dataIndex: "_id",
      key: "_id",
      render: (text, value) => {
        return (
          <Space size="middle">
            {/* <Link to={{ pathname: "/users/" + val.id }}>View</Link> */}
            {/* <Link to={{ pathname: "/users/" + val.id }}>
            <i className="ri-eye-line action-icon"></i>
          </Link> */}
            {/* <Link to={{ pathname: "/user/add/" + val.id }}> */}
            <i className="ri-pencil-line action-icon"></i>
            {/* </Link> */}

            {/* <Link to={{ pathname: "/user/add/" + val.id }}>Edit</Link> */}
            {/* <a>Add</a>
          <a>Edit</a> */}
            <Popconfirm
              title="Are you sure to delete this user?"
              onConfirm={() => confirm(text)}
              // onCancel={cancel}
              okText="Yes"
              cancelText="No"
            >
              <i className="ri-delete-bin-line action-icon"></i>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];
  const getListData = async () => {
    const resUserData = JSON.parse(sessionStorage.getItem("authUser"));
    const userId = resUserData?.id;
    const result = await getListOrderPosts(userId, pageSize, pageIndex, "", "");
    console.log("result: ", result);
    setOrderPostData(result?.data);
  };
  useEffect(() => {
    getListData();
  }, [pageIndex, pageSize]);
  //
  const confirm = async (id) => {
    console.log("id: ", id);
    const rs = await deleteRecord(id);
    if (rs?.status === 200) {
      getListData();
    }
    console.log("rs: ", rs);

    // console.log(user, 'user');
  };
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb
            title="Bài viết"
            pageTitle="Quản lý bài viết"
          ></BreadCrumb>
          <Row className="mb-3">
            <Drawer
              title={drawerTitle}
              placement={"right"}
              width={"30%"}
              onClose={onClose}
              open={visibleForm}
              bodyStyle={{
                paddingBottom: 80,
              }}
              style={{ marginTop: "70px" }}
            ></Drawer>
          </Row>
          <Row gutter={[16, 16]} style={{ marginBottom: "1rem" }}>
            <Col span={6}>
              <Input size="middle" />
            </Col>
            <Col span={6}>
              <Select
                style={{ width: 200 }}
                placeholder="Search to Select"
                options={[
                  {
                    value: "1",
                    label: "Not Identified",
                  },
                  {
                    value: "2",
                    label: "Closed",
                  },
                  {
                    value: "3",
                    label: "Communicated",
                  },
                  {
                    value: "4",
                    label: "Identified",
                  },
                  {
                    value: "5",
                    label: "Resolved",
                  },
                  {
                    value: "6",
                    label: "Cancelled",
                  },
                ]}
              />
            </Col>
          </Row>
          <Row gutter={[16, 16]} style={{ marginBottom: "3rem" }}>
            <Col span={3}>
              <Button type="primary">Tìm kiếm</Button>
            </Col>
            <Col span={21} style={{ textAlign: "right" }}>
              <Button type="primary">Tạo mới</Button>
            </Col>
          </Row>
          <Table
            dataSource={orderPostData}
            columns={columns}
            pagination={{
              showSizeChanger: true,
              pageSizeOptions: [5, 10, 20, 30, 40, 50],
              pageSize: pageSize,
              current: 1,
              onChange: (newIndex, newPageSize) => {
                setPageIndex(newIndex);
                setPageSize(newPageSize);
              },
            }}
            rowKey="_id"
          />
          {/* <Row style={{ textAlign: "right", marginTop: "2rem" }}>
            <Col span={24}>
              <Pagination
                showSizeChanger
                // onShowSizeChange={onShowSizeChange}
                current={1}
                total={orderPostData?.length}
              />
            </Col>
          </Row> */}
        </Container>
      </div>
    </React.Fragment>
  );
};
export default Orders;
