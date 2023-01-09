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
  notification,
  Spin,
  Pagination,
} from "antd";
import { Container, Row, Col } from "reactstrap";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import "./style.css";
import { Select } from "antd";
import {
  getPaymentByDomains,
  getPagingBrands,
  getDomainsByBrand,
  getLinkPostByColab,
  updateLinkManagement,
  deleteLinkManagement,
} from "../../helpers/helper";
import { createLinkManagement } from "../../helpers/helper";
import { useHistory } from "react-router-dom";
import { AiFillEdit } from "react-icons/ai";
import { ImBin2 } from "react-icons/im";
const { Option } = Select;
const { Search } = Input;

//sample data

const LinkManagement = (props) => {
  const history = useHistory();
  const [api, contextHolder] = notification.useNotification();
  const [domainList, setDomainList] = useState([]);
  const [brandList, setBrandList] = useState([]);
  const [colabList, setColabList] = useState([]);
  const [colab, setColab] = useState({});
  const [brand, setBrand] = useState({});
  const [domain, setDomain] = useState({});
  const [data, setData] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [form] = Form.useForm();
  const [pageSize, setPageSize] = useState(10);
  const [pageIndex, setPageIndex] = useState(1);
  const [search, setSearch] = useState("");
  const [edit, setEdit] = useState("");
  const [total, setTotal] = useState(0);
  const [error, setError] = useState("");
  const [loading, setIsLoading] = useState(false);
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
      title: "Số từ",
      key: "number_words",
      dataIndex: "number_words",
      render: (value) => <>{value}</>,
    },
    {
      title: "Số ảnh",
      key: "number_images",
      dataIndex: "number_images",
      render: (value) => <>{value}</>,
    },
    {
      title: "Số tiền",
      key: "total",
      dataIndex: "total",
      render: (value) => (
        <>
          {value?.toLocaleString("it-IT", {
            style: "currency",
            currency: "VND",
          })}
        </>
      ),
    },
    {
      title: "Trạng thái",
      key: "status",
      dataIndex: "status",
      render: (value) => <>{value === 1 ? <>Đã đăng</> : <>Nháp</>}</>,
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <AiFillEdit
            style={{ color: "#00adff", cursor: "pointer" }}
            onClick={() => handleEdit(record)}
          />
          <ImBin2
            style={{ color: "red", cursor: "pointer" }}
            onClick={() => handleDelete(record)}
          />
        </Space>
      ),
    },
  ];
  const handleDelete = async (record) => {
    await deleteLinkManagement(record._id)
      .then((res) => {
        api["success"]({
          message: `Xóa thành công`,
          placement: "top",
          duration: 2,
        });
        getColapsByDomain(colab?.key);
        handleGetLinkPostByColaps();
      })
      .catch((error) => {
        api["error"]({
          message: `Có lỗi xảy ra`,
          description: error,
          placement: "top",
          duration: 3,
        });
      });
  };
  const getDomainByBrand = async () => {
    const listDomains = await getDomainsByBrand(
      brand?.key || brandList[0]?.key
    );
    let domainListTemp = [];
    listDomains?.data?.map((item) => {
      let a = {
        key: item?._id,
        value: item?.name,
      };
      domainListTemp.push(a);
    });

    const domainsList = domainListTemp;
    domain?.key === undefined && setDomain(domainsList[0]);
    setDomainList(domainsList);
  };

  const getListBrand = async () => {
    if (!brand?.key) {
      const listBrand = await getPagingBrands(10000, 1, "");
      let brandList = [];
      listBrand?.data?.map((item) => {
        let a = {
          key: item?._id,
          value: item?.name,
        };
        brandList.push(a);
      });
      props?.location?.state
        ? setBrand(props?.location?.state[2])
        : brand?.key === undefined && setBrand(brandList[0]);
      setBrandList(brandList);
    }
  };

  const getColapsByDomain = async (key) => {
    setSearch("");
    if (domain?.key) {
      const listColaps = await getPaymentByDomains(
        domain?.key || domainList[0]?.key,
        10000,
        1,
        ""
      );
      let colabList = [];
      listColaps?.data?.map((item) => {
        let a = {
          key: item?._id,
          value: item?.name,
          total: item?.total,
        };
        colabList.push(a);
      });
      if (listColaps?.data?.length !== 0) {
        setColabList(colabList);
        if (props?.location?.state) {
          setColab(props?.location?.state?.[0]);
        } else {
          if (!key) {
            setColab(colabList[0]);
          } else {
            const colab1 = colabList.find((item) => item?.key === key);
            setColab(colab1);
          }
        }
      }
    }
  };

  useEffect(() => {
    getListBrand();
    getDomainByBrand();
    getColapsByDomain();
    handleGetLinkPostByColaps();
  }, []);
  useEffect(() => {
    getDomainByBrand();
    getColapsByDomain();
    handleGetLinkPostByColaps();
  }, [brand?.key]);

  useEffect(() => {
    getColapsByDomain();
    handleGetLinkPostByColaps();
  }, [domain?.key]);
  useEffect(() => {
    handleGetLinkPostByColaps();
  }, [colab?.key, pageSize, pageIndex]);

  const handleSelectBrand = (value) => {
    history.replace("/postsLink");
    setData([]);
    setSearch("");
    setBrand(value);
    setDomain({});
    setColabList([]);
    setColab({});
  };
  const handleSelectDomain = (value) => {
    setSearch("");
    setData([]);

    setDomain(value);
    setColabList([]);
    setColab({});
  };
  const handleSelectColaps = (value) => {
    setData([]);

    setSearch("");
    setColab(value);
  };
  const onSearch = (value) => {
    if (value) {
      setSearch(value);
    }
    handleGetLinkPostByColaps();
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };
  const handleCloseModal = () => {
    setEdit("");
    form.resetFields();
    setOpenModal(false);
  };
  const handleGetLinkPostByColaps = async () => {
    if (colab?.key) {
      const linkPost = await getLinkPostByColab(
        colab?.key || colabList?.[0]?.key,
        pageSize,
        pageIndex,
        search
      );
      console.log(linkPost);
      setTotal(linkPost?.count);
      setData(linkPost?.data);
    }
  };
  const onFinish = async (values) => {
    setIsLoading(true);
    const dataReq = {
      link_post: values?.link_post,
      link_posted: values?.link_posted,
      keyword: values?.keyword,
      category: values?.category,
      status: values?.status || 1,
      collaboratorId: colab?.key || "",
    };
    if (!edit) {
      const res = await createLinkManagement(dataReq).catch((error) => {
        api["error"]({
          message: `Có lỗi xảy ra`,
          description: error?.message,
          placement: "top",
          duration: 3,
        });
      });
      if (res?.success) {
        getColapsByDomain(colab?.key);
        handleGetLinkPostByColaps();
        handleCloseModal();

        api["success"]({
          message: `Thêm thành công`,
          placement: "top",
          duration: 2,
        });
      }
      setIsLoading(false);
    } else {
      let dataUpdate = {
        link_posted: values?.link_posted || "",
        keyword: values?.keyword || "",
        category: values?.category || "",
        status: values?.status || 1,
      };
      const res = await updateLinkManagement(edit, dataUpdate).catch(
        (error) => {
          api["error"]({
            message: `Có lỗi xảy ra`,
            description: error,
            placement: "top",
            duration: 3,
          });
        }
      );
      if (res?.success) {
        handleGetLinkPostByColaps(colab?.key);
        handleCloseModal();

        api["success"]({
          message: `Chỉnh sửa thành công`,
          placement: "top",
          duration: 2,
        });
      }
      setIsLoading(false);
    }
  };
  const handleEdit = (value) => {
    form.setFieldValue("keyword", value?.keyword);
    form.setFieldValue("category", value?.category);
    setEdit(value?._id);
    handleOpenModal();
  };
  return (
    <>
      {contextHolder}

      <React.Fragment>
        <div className="page-content">
          <Container fluid>
            <BreadCrumb
              title="Cộng tác viên"
              pageTitle="Domains"
              slug="domains"
            />
            <Row>
              <Col lg={2}>
                <p className="custom-label">Tên thương hiệu</p>
                <Select
                  showSearch
                  style={{ width: "100%" }}
                  placeholder="Search to Select"
                  value={brand}
                  onSelect={(key, value) => handleSelectBrand(value)}
                  options={brandList}
                >
                  {/* {brandList &&
                    brandList?.map((item, index) => {
                      return (
                        <Option key={item?.key} label={item?.value}>
                          {item?.value}
                        </Option>
                      );
                    })} */}
                </Select>
              </Col>
              <Col lg={2}>
                <p className="custom-label">Đường dẫn</p>
                <Select
                  showSearch
                  style={{ width: "100%" }}
                  placeholder="Search to Select"
                  value={domain}
                  onSelect={(key, value) => handleSelectDomain(value)}
                  options={domainList}
                >
                  {/* {domainList &&
                    domainList.map((item) => {
                      return (
                        <Option key={item?.key} label={item?.value}>
                          {item?.value}
                        </Option>
                      );
                    })} */}
                </Select>
              </Col>
              <Col lg={2}>
                <p className="custom-label">Cộng tác viên</p>
                <Select
                  showSearch
                  style={{ width: "100%" }}
                  placeholder="Search to Select"
                  value={colab}
                  onSelect={(key, value) => handleSelectColaps(value)}
                  options={colabList}
                />
              </Col>
              {/* <Col lg="1">
                <br />
                <Button
                  style={{ height: 36, margin: "5px" }}
                  type="primary"
                  onClick={handleGetLinkPostByColaps}
                >
                  Lọc
                </Button>
              </Col> */}
            </Row>
            <Row>
              <Col lg="3">
                <p className="custom-label">Tìm kiếm theo bài viết</p>
                <Search
                  placeholder="input search text"
                  enterButton="Search"
                  size="medium"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
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
                  disabled={!colab?.key}
                >
                  Thêm bài viết
                </Button>
              </Col>
              <Col lg="2">
                <p className="custom-label">
                  Tổng số tiền :{" "}
                  {colab
                    ? colab?.total?.toLocaleString("it-IT", {
                        style: "currency",
                        currency: "VND",
                      })
                    : 0}
                </p>
              </Col>
            </Row>
            <Row>
              <Table columns={columns} dataSource={data} pagination={false} />
            </Row>
            <Row style={{ display: "flex", float: "right" }}>
              <Pagination
                pageSize={pageSize}
                onChange={(page, pageSize) => {
                  setPageIndex(page !== 0 ? page : 1);
                  setPageSize(pageSize);
                }}
                showTotal={(total) => `Tổng ${total} bài viết`}
                total={total}
                showSizeChanger
              />
            </Row>
          </Container>
        </div>
      </React.Fragment>
      <Modal
        title={edit ? "Sửa bài viết" : "Thêm bài viết"}
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
            onLoad={<Spin delay={500}></Spin>}
            autoComplete="off"
          >
            {!edit && (
              <Form.Item
                label="Link bài viết"
                name="link_post"
                rules={[{ required: true, message: "Nhập link bài viết" }]}
              >
                <Input />
              </Form.Item>
            )}
            <Form.Item label="Link đã đăng" name="link_posted">
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
              <Button type="primary" htmlType="submit" disabled={loading}>
                <span>
                  {loading ? <Spin /> : edit ? "Chỉnh sửa" : <>Thêm</>}
                </span>
              </Button>
            </Form.Item>
          </Form>
        </Row>
      </Modal>
    </>
  );
};
export default LinkManagement;
