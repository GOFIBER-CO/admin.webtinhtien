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
  Modal,
  Spin,
} from "antd";

import {
  getListOrderPosts,
  deleteRecord,
  checkPermissionScreen,
  getCTV,
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
  const [listCTV, setListCTV] = useState([]);
  const [checkRole, setCheckRole] = useState(true);
  const [loading, setLoading] = useState(true);
  const checkScreen = async () => {
    const permission = await checkPermissionScreen(location.pathname);
    setCheckRole(permission.status);
  };
  const onDeleteClick = (value) => {
    if (value["ctv"]) {
      if (Object.keys(value["ctv"])?.length > 0) {
        message.warning("Bài viết đã có người nhận, không thể xóa.");
      }
    }
  };
  const getListCTV = async () => {
    const ctvs = await getCTV();
    setListCTV(ctvs?.users);
  };
  useEffect(() => {
    checkScreen();
    getListCTV();
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
  const onEditOrderPost = (id) => {
    const resData = orderPostData.filter((item) => item?._id === id);
    setDataDrawer(resData[0]);
    setTitleDrawer("Chỉnh sửa");
    setOpen(true);
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
        let rs = { 0: "Ẩn", 1: "Đã đăng", 3: "Hết hạn" }[text];
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
        return <>{text ? "Đã duyệt" : "Đang xét duyệt"}</>;
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
              onClick={() => onEditOrderPost(text)}
            ></i>
            <Popconfirm
              disabled={value["statusOrderPost"] === -1 ? false : true}
              title="Are you sure to delete this user?"
              onConfirm={() => confirm(text)}
              // onCancel={cancel}
              okText="Yes"
              cancelText="No"
            >
              <i
                className="ri-delete-bin-line action-icon"
                onClick={() => onDeleteClick(value)}
              ></i>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];
  const getListData = async () => {
    setLoading(true);
    const result = await getListOrderPosts(pageSize, pageIndex, search);
    setOrderPostData(result?.data);
    setTotalDocs(result?.totalItem);
    setLoading(false);
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
      ctv: value?.ctv,
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
              <Col span={6}>
                <Form.Item label="Tên bài viết" name="title">
                  <Input
                    size="middle"
                    placeholder="Tìm kiếm theo tên bài viết"
                  />
                </Form.Item>
              </Col>
              <Col span={6}>
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
              <Col span={6}>
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
              <Col span={6}>
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
              <Col span={6}>
                <Form.Item label="Từ khóa" name="keyword">
                  <Input placeholder="Tìm kiếm theo từ khóa" />
                </Form.Item>
              </Col>
              <Col span={6}>
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
              <Col span={6}>
                <Form.Item name="range-picker" label="Thời gian">
                  <RangePicker style={{ width: "100%" }} />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item name="ctv" label="Cộng tác viên" initialValue={""}>
                  <Select className="select-ctv">
                    <Select.Option value={""} key={"all"} >
                      Tất cả
                    </Select.Option>
                    {listCTV?.map((item, index) => (
                      <Select.Option value={item?.id} key={index}>
                        {item?.fullName}
                      </Select.Option>
                    ))}
                  </Select>
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
          <Spin spinning={loading} key="1">
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
          </Spin>

          <Row>
            <Modal
              className="customDrawer"
              // closable={false}
              title={titleDrawer}
              placement="right"
              onCancel={onClose}
              open={open}
              width={1000}
              footer={null}
            >
              <AddEditOrderPost
                dataDrawer={dataDrawer}
                close={onClose}
                getListData={getListData}
              />
            </Modal>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};
export default Orders;
