import React, { useEffect, useState } from "react";
import "antd/es/style/index";
import {
  Button,
  Form,
  Input,
  InputNumber,
  Popconfirm,
  Table,
  Typography,
  Space,
  Tag,
  Modal,
  Checkbox,
} from "antd";
import { Container, Row, Col } from "reactstrap";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import "./style.css";
import { Select } from "antd";
import { createLinkManagement } from "../../helpers/helper";
const { Option } = Select;
const { Search } = Input;

//sample data
const columns = [
  {
    title: "Tiêu đề",
    dataIndex: "title",
    key: "title",
  },
  {
    title: "Từ khóa",
    dataIndex: "keyword",
    key: "keyword",
    render: (text) => <a>{text}</a>,
  },
  {
    title: "Chuyên mục",
    dataIndex: "category",
    key: "address",
  },
  {
    title: "Link bài viết",
    key: "link_post",
    dataIndex: "link_post",
    render: (value) => (
      <>
        <a href={value}>{value}</a>
      </>
    ),
  },
  {
    title: "Link bài đăng",
    key: "link_posted",
    dataIndex: "link_posted",
    render: (value) => (
      <>
        <a href={value}>{value}</a>
      </>
    ),
  },
  {
    title: "Trạng thái",
    key: "status",
    dataIndex: "link_posted",
    render: (value) => (
      <>
        <a href={value}>{value}</a>
      </>
    ),
  },
  {
    title: "Action",
    key: "action",
    render: (_, record) => (
      <Space size="middle">
        <a>Chỉnh sửa</a>
        <a>Xóa</a>
      </Space>
    ),
  },
];
const data = [
  {
    key: "1",
    name: "John Brown",
    age: 32,
    address: "New York No. 1 Lake Park",
    tags: ["nice", "developer"],
  },
  {
    key: "2",
    name: "Jim Green",
    age: 42,
    address: "London No. 1 Lake Park",
    tags: ["loser"],
  },
  {
    key: "3",
    name: "Joe Black",
    age: 32,
    address: "Sidney No. 1 Lake Park",
    tags: ["cool", "teacher"],
  },
];

const LinkManagement = (props) => {
  // console.log(props?.location?.state, "asdsadsad");
  const [domainList, setDomainList] = useState([]);
  const [brandList, setBrandList] = useState([]);
  const [colabList, setColabList] = useState([]);
  const [colab, setColab] = useState({});
  const [brand, setBrand] = useState({});
  const [domain, setDomain] = useState({});
  const [postsList, setPostList] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [form] = Form.useForm();
  const getListDomains = () => {
    const domainsList = [
      {
        key: "1",
        value: "domains 1",
      },
      {
        key: "2",
        value: "domains 2",
      },
      {
        key: "3",
        value: "domains 3",
      },
    ];
    setDomain(domainsList[0]);
    setDomainList(domainsList);
  };
  const getListBrand = () => {
    const brandList = [
      {
        key: "1",
        value: "brand 1",
      },
      {
        key: "2",
        value: "brand 2",
      },
      {
        key: "3",
        value: "brand 3",
      },
    ];
    setBrand(brandList[0]);
    setBrandList(brandList);
  };
  const getColapsByDomain = () => {
    const colabs = [
      {
        key: "1",
        value: "colab 1",
      },
      {
        key: "2",
        value: "colab 2",
      },
      {
        key: "3",
        value: "colab 3",
      },
    ];
    setColab(colabs[0]);
    setColabList(colabs);
  };

  useEffect(() => {
    getListDomains();
    getColapsByDomain();
    getListBrand();
  }, []);
  const handleSelectBrand = (value) => {
    setBrand(value);
  };
  const handleSelectDomain = (value) => {
    setDomain(value);
  };
  const handleSelectColaps = (value) => {
    setColab(value);
  };
  const onSearch = (value) => console.log(value);

  const handleOpenModal = () => {
    setOpenModal(true);
  };
  const handleCloseModal = () => {
    form.resetFields();
    setOpenModal(false);
  };

  const onFinish = (values) => {
    let dataReq = {};
  };

  return (
    <>
      <React.Fragment>
        <div className="page-content">
          <Container fluid>
            <BreadCrumb
              title="Cộng tác viên"
              pageTitle="Domains"
              slug="domains"
            />
            <Row>
              <Col lg="2">
                <p className="custom-label">Tên thương hiệu</p>
                <Select
                  showSearch
                  style={{ width: 200 }}
                  placeholder="Search to Select"
                  value={brand}
                  onSelect={(key, value) => handleSelectBrand(value)}
                  options={brandList}
                />
              </Col>
              <Col lg="2">
                <p className="custom-label">Đường dẫn</p>
                <Select
                  showSearch
                  style={{ width: 200 }}
                  placeholder="Search to Select"
                  value={domain}
                  onSelect={(key, value) => handleSelectDomain(value)}
                  options={domainList}
                />
              </Col>
              <Col lg="2">
                <p className="custom-label">Cộng tác viên</p>
                <Select
                  showSearch
                  style={{ width: 200 }}
                  placeholder="Search to Select"
                  value={colab}
                  onSelect={(key, value) => handleSelectColaps(value)}
                  options={colabList}
                />
              </Col>
              <Col lg="1">
                <br />
                <Button style={{ height: 36, margin: "5px" }} type="primary">
                  Lọc
                </Button>
              </Col>
            </Row>
            <Row>
              <Col lg="2">
                <p className="custom-label">Tìm kiếm theo bài viết</p>
                <Search
                  placeholder="input search text"
                  allowClear
                  enterButton="Search"
                  size="medium"
                  onSearch={onSearch}
                />
              </Col>
            </Row>
            <Row style={{ marginTop: "10px" }}>
              <Col lg="2">
                <Button
                  type="primary"
                  style={{
                    marginBottom: 16,
                  }}
                  onClick={handleOpenModal}
                >
                  Thêm bài viết
                </Button>
              </Col>
              <Col lg="2">
                <p className="custom-label">
                  Tổng số tiền : {domain ? domain?.total || 0 : 0}
                </p>
              </Col>
            </Row>
            <Row>
              <Table columns={columns} dataSource={data} />
            </Row>
          </Container>
        </div>
      </React.Fragment>
      <Modal
        title="Thêm bài viết"
        open={openModal}
        onOk={handleCloseModal}
        onCancel={handleCloseModal}
        footer={false}
      >
        <Row style={{ margin: 0 }}>
          <Form
            name="basic"
            layout="vertical"
            form={form}
            onFinish={onFinish}
            // onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item
              label="Link bài viết"
              name="link_post"
              rules={[{ required: true, message: "Nhập link bài viết" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item label="Từ khóa" name="keyword">
              <Input />
            </Form.Item>

            <Form.Item
              label="Chuyên mục"
              name="category"
              rules={[{ required: true, message: "Nhập chuyên mục !" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item label="Trạng thái" name="status">
              <Select defaultValue={1}>
                <Option key="Đã đăng" value={1}>
                  Đã đăng
                </Option>
                <Option key="Nháp" value={2}>
                  Nháp
                </Option>
              </Select>
            </Form.Item>

            <Form.Item style={{ float: "right" }}>
              <Button
                style={{ marginRight: "10px" }}
                onClick={handleCloseModal}
              >
                Quay về
              </Button>
              <Button type="primary" htmlType="submit">
                Thêm
              </Button>
            </Form.Item>
          </Form>
        </Row>
      </Modal>
    </>
  );
};
export default LinkManagement;
