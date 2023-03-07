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
} from "antd";

import { getListOrderPosts, deleteRecord } from "./../../helpers/helper";
import { Container } from "reactstrap";
import moment from "moment/moment";
import AddEditOrderPost from "./AddEditOrderPost";

const Orders = () => {
  const { RangePicker } = DatePicker;

  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [orderPostData, setOrderPostData] = useState([]);
  console.log("orderPostData: ", orderPostData);
  const [open, setOpen] = useState(false);
  const [titleDrawer, setTitleDrawer] = useState("");
  const [dataDrawer, setDataDrawer] = useState({});
  const [totalDocs, setTotalDocs] = useState(0);
  const [search, setSearch] = useState({});
  console.log("search: ", search);

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
      title: "Tên bài viết",
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
      title: "Từ khóa",
      dataIndex: "keyword",
      key: "keyword",
      render: (text, value) => {
        return text?.map((item) => {
          return (
            <>
              <Tag color="green">{item}</Tag>
            </>
          );
        });
      },
    },
    {
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
            <i
              className="ri-pencil-line action-icon"
              onClick={() => onEditOrderPost(text)}
            ></i>
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
      status: value?.status,
      keyword: value?.keyword,
      createdAt: value?.["range-picker"],
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
                  <Form.Item label="Trạng thái" name="status" initialValue="2">
                    <Select>
                      <Select.Option value="2">Tất cả</Select.Option>
                      <Select.Option value="-1">Chưa nhận</Select.Option>
                      <Select.Option value="0">CTV đã nhận</Select.Option>
                      <Select.Option value="1">Đã hoàn thành</Select.Option>
                    </Select>
                  </Form.Item>
                </div>
              </Col>
              <Col span={4}>
                <Form.Item label="Từ khóa" name="keyword">
                  <Input placeholder="Tìm kiếm theo từ khóa" />
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
              closable={false}
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
