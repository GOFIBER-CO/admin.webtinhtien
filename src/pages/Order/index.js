import "./style.css";
import React, { createRef, useEffect, useState } from "react";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import { AiOutlineDelete } from "react-icons/ai";
import {
  Select,
  Drawer,
  Row,
  Col,
  Input,
  Button,
  Table,
  Space,
  Popconfirm,
  Tag,
  Form,
  DatePicker,
  InputNumber,
  message,
} from "antd";

import {
  getListOrderPosts,
  deleteRecord,
  checkPermissionScreen,
} from "./../../helpers/helper";
import { Container } from "reactstrap";
import moment from "moment/moment";
import AddEditOrderPost from "./AddEditOrderPost";
import { useLocation, useParams } from "react-router-dom";
import Page403 from "../403";

const Orders = () => {
  const { RangePicker } = DatePicker;
  const location = useLocation();
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [orderPostData, setOrderPostData] = useState([]);
  const [open, setOpen] = useState(false);
  const [titleDrawer, setTitleDrawer] = useState("");
  const [dataDrawer, setDataDrawer] = useState({});
  const [totalDocs, setTotalDocs] = useState(0);
  const [search, setSearch] = useState({});
  const [checkRole, setCheckRole] = useState(true);
  const checkScreen = async () => {
    const permission = await checkPermissionScreen(location.pathname);
    setCheckRole(permission.status);
  };
  useEffect(() => {
    checkScreen();
  }, []);

  const showDrawer = () => {
    setDataDrawer({});
    setTitleDrawer("Tạo mới");
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
    setDataDrawer({});
  };
  const onEditOrderPost = (id, value) => {
    if (value["ctv"] == null) {
      const resData = orderPostData.filter((item) => item?._id === id);
      setDataDrawer(resData[0]);
      setTitleDrawer("Chỉnh sửa");
      setOpen(true);
    }
  };
  const columns = [
    {
      align: "center",
      title: "Tên bài viết",
      dataIndex: "title",
      key: "title",
      render: (text, value) => {
        return (
          <>
            <p style={{ textAlign: "left" }}>{text}</p>
          </>
        );
      },
    },
    {
      align: "center",
      title: "Mô tả",
      dataIndex: "desc",
      width: "15%",
      key: "desc",
      render: (text, value) => {
        return (
          <>
            <p style={{ textAlign: "left" }}>{text}</p>
          </>
        );
      },
    },
    {
      align: "center",
      title: "Trạng thái bài viết",
      dataIndex: "status",
      key: "status",
      render: (text, result) => {
        let rs = { 0: "Ẩn", 1: "Đã đăng" }[text];
        return <>{rs}</>;
      },
    },
    {
      align: "center",
      title: "Trạng thái cộng tác viên",
      dataIndex: "statusOrderPost",
      key: "statusOrderPost",
      render: (text, result) => {
        let rs = { "-1": "Đang chờ", 0: "Đã nhận", 1: "Hoàn thành" }[text];
        return <>{rs}</>;
      },
    },
    {
      align: "center",
      title: "Từ khóa",
      dataIndex: "keyword",
      key: "keyword",
      width: "15%",
      render: (text, value) => {
        return text?.map((item) => {
          return (
            <>
              <Tag color="green" style={{ marginBottom: "7px" }}>
                {item}
              </Tag>
            </>
          );
        });
      },
    },
    {
      align: "center",
      title: "Số tiền mỗi từ",
      dataIndex: "moneyPerWord",
      key: "moneyPerWord",
      render: (text, value) => {
        return (
          <>
            {Number(text).toLocaleString("vi-VN", {
              style: "currency",
              currency: "VND",
            })}
          </>
        );
      },
    },
    {
      align: "center",
      title: "Trạng thái thanh toán",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
      render: (text, value) => {
        return <>{text ? "Đã thanh toán" : "Chưa thanh toán"}</>;
      },
    },
    {
      align: "center",
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text, result) => {
        return <>{moment(text).format("DD/MM/YYYY")}</>;
      },
    },
    {
      align: "center",
      title: "Hành động",
      dataIndex: "_id",
      key: "_id",
      render: (text, value) => {
        return (
          <Space size="middle">
            <i
              className="ri-pencil-line action-icon"
              onClick={() => onEditOrderPost(text, value)}
            ></i>
            <Popconfirm
              disabled={value["ctv"]?.length > 0 ? true : false}
              title="Are you sure to delete this user?"
              onConfirm={() => confirm(text)}
              // onCancel={cancel}
              okText="Yes"
              cancelText="No"
            >
              <i
                className="ri-delete-bin-line action-icon"
                // style={{ cursor: "not-allowed" }}
              ></i>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];
  const getListData = async () => {
    const result = await getListOrderPosts(pageSize, pageIndex, search);
    setOrderPostData(result?.data);
    setTotalDocs(result?.totalItem);
  };
  useEffect(() => {
    getListData();
  }, [pageIndex, pageSize]);

  const confirm = async (id) => {
    const rs = await deleteRecord(id);
    if (rs?.status === 200) {
      getListData();
    }
  };
  const onFinish = async (value) => {
    setPageIndex(1);
    const data = {
      title: value?.title,
      statusOrderPost: value?.statusOrderPost,
      paymentStatus: value?.paymentStatus,
      keyword: value?.keyword,
      moneyPerWord: value?.moneyPerWord,
      createdAt: value?.["range-picker"],
      status: value?.status,
      // dateForm: new Date(value?.["range-picker"]?.[0]?.$d).getTime(),
      // dateTo: new Date(value?.["range-picker"]?.[1]?.$d).getTime(),
    };
    setSearch(data);
    const result = await getListOrderPosts(pageSize, pageIndex, data);
    setOrderPostData(result?.data);
    setTotalDocs(result?.totalItem);
  };
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb
            title="Bài viết"
            pageTitle="Quản lý bài viết"
          ></BreadCrumb>
          <Form layout="vertical" onFinish={onFinish}>
            <Row gutter={[16, 16]} style={{ marginBottom: "1rem" }}>
              <Col span={4}>
                <Form.Item label="Tên bài viết" name="title">
                  <Input size="middle" placeholder="Tìm kiếm theo tiêu đề" />
                </Form.Item>
              </Col>
              <Col span={3}>
                <div className="selected">
                  <Form.Item
                    label="Trạng thái công tác viên"
                    name="statusOrderPost"
                    initialValue="2"
                  >
                    <Select>
                      <Select.Option value="2">Tất cả</Select.Option>
                      <Select.Option value="-1">Đang chờ</Select.Option>
                      <Select.Option value="0">CTV đã nhận</Select.Option>
                      <Select.Option value="1">Đã hoàn thành</Select.Option>
                    </Select>
                  </Form.Item>
                </div>
              </Col>
              <Col span={3}>
                <div className="selected">
                  <Form.Item
                    label="Trạng thái thanh toán"
                    name="paymentStatus"
                    initialValue="2"
                  >
                    <Select>
                      <Select.Option value="2">Tất cả</Select.Option>
                      <Select.Option value="0">Chưa thanh toán</Select.Option>
                      <Select.Option value="1">Đã thanh toán</Select.Option>
                    </Select>
                  </Form.Item>
                </div>
              </Col>
              <Col span={3}>
                <div className="selected">
                  <Form.Item
                    label="Trạng thái bài viết"
                    name="status"
                    initialValue="2"
                  >
                    <Select>
                      <Select.Option value="2">Tất cả</Select.Option>
                      <Select.Option value="0">Ẩn</Select.Option>
                      <Select.Option value="1">Hiện</Select.Option>
                      {/* <Select.Option value="3">Hết hạn</Select.Option> */}
                    </Select>
                  </Form.Item>
                </div>
              </Col>
              <Col span={4}>
                <Form.Item label="Từ khóa" name="keyword">
                  <Input placeholder="Tìm kiếm theo từ khóa" />
                </Form.Item>
              </Col>
              <Col span={2}>
                <Form.Item
                  label="Số tiền mỗi từ"
                  name="moneyPerWord"
                  style={{ width: "100%" }}
                >
                  <div style={{ width: "100%" }}>
                    <InputNumber min={1} controls={false} />
                  </div>
                </Form.Item>
              </Col>
              <Col span={3}>
                <div className="selected">
                  <Form.Item
                    label="Trạng thái thanh toán"
                    name="paymentStatus"
                    initialValue="2"
                  >
                    <Select>
                      <Select.Option value="2">Tất cả</Select.Option>
                      <Select.Option value="0">Chưa thanh toán</Select.Option>
                      <Select.Option value="1">Đã thanh toán</Select.Option>
                    </Select>
                  </Form.Item>
                </div>
              </Col>
              <Col span={4}>
                <Form.Item label="Từ khóa" name="keyword">
                  <Input placeholder="Tìm kiếm theo từ khóa" />
                </Form.Item>
              </Col>
              <Col span={2}>
                <Form.Item
                  label="Số tiền mỗi từ"
                  name="moneyPerWord"
                  style={{ width: "100%" }}
                >
                  <div style={{ width: "100%" }}>
                    <InputNumber min={1} controls={false} />
                  </div>
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item
                  name="range-picker"
                  label="Thời gian"
                  // {...rangeConfig}
                >
                  <RangePicker />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[16, 16]} style={{ marginBottom: "3rem" }}>
              <Col span={3}>
                <Button type="primary" htmlType="submit">
                  Tìm kiếm
                </Button>
              </Col>
              <Col span={21} style={{ textAlign: "right" }}>
                <Button type="primary" onClick={showDrawer}>
                  Tạo mới
                </Button>
              </Col>
            </Row>
          </Form>

          <Table
            dataSource={orderPostData}
            columns={columns}
            pagination={{
              total: totalDocs,
              showSizeChanger: true,
              pageSizeOptions: [5, 10, 20, 30, 40, 50],
              pageSize: pageSize,
              current: pageIndex,
              onChange: (newIndex, newPageSize) => {
                setPageIndex(newIndex);
                setPageSize(newPageSize);
              },
            }}
            rowKey="_id"
          />
          <Row>
            <Drawer
              // closable={false}
              title={titleDrawer}
              placement="right"
              onClose={onClose}
              open={open}
              style={{ marginTop: "70px" }}
            >
              <AddEditOrderPost
                dataDrawer={dataDrawer}
                close={onClose}
                getListData={getListData}
              />
            </Drawer>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};
export default Orders;
