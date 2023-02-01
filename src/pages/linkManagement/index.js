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
  Tooltip,
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
  getTeamByBrand,
  getDomainByTeam,
  getAllBrand,
  getColabByDomainId,
  getLinkManagementsByTeamUser,
  getColabById,
  getAllDomain,
} from "../../helpers/helper";
import * as XLSX from "xlsx";
import * as FileSaver from "file-saver";
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
  const [teamList, setTeamList] = useState([]);
  const [colab, setColab] = useState({});
  const [brand, setBrand] = useState({});
  const [domain, setDomain] = useState({});
  const [team, setTeam] = useState({});
  const [data, setData] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [form] = Form.useForm();
  const [pageSize, setPageSize] = useState(10);
  const [pageIndex, setPageIndex] = useState(1);
  const [search, setSearch] = useState("");
  const [edit, setEdit] = useState("");
  const [total, setTotal] = useState(0);

  const [loading, setIsLoading] = useState(false);
  const [linkByTeam, setLinkByTeam] = useState([]);
  const [sum, setSum] = useState(0);
  const [sumKey, setSumKey] = useState("");

  const columns = [
    {
      title: "Domains",
      dataIndex: "domain",
      key: "domain",
      render: (value) => {
        return (
          <Tooltip placement="Top" title={value?.name}>
            {value?.name}
          </Tooltip>
        );
      },
      width: "10%",
    },
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
      render: (value) => {
        return (
          <Tooltip placement="Top" title={value}>
            {value}
          </Tooltip>
        );
      },
      width: "10%",
    },
    {
      title: "Từ khóa",
      dataIndex: "keyword",
      key: "keyword",
      render: (value) => (
        <a>
          <Tooltip placement="Top" title={value}>
            {value}
          </Tooltip>
        </a>
      ),
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
      ellipsis: true,
      render: (value) => (
        <>
          <a href={value}>{value}</a>
        </>
      ),
    },
    {
      title: "Link bài đăng",
      key: "link_posted",
      ellipsis: true,

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
      width: "7%",
    },
    {
      title: "Số ảnh",
      key: "number_images",
      dataIndex: "number_images",
      render: (value) => <>{value}</>,
      width: "7%",
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
      ellipsis: true,
    },
    {
      title: "Trạng thái",
      key: "status",
      dataIndex: "status",
      render: (value) => <>{value === 1 ? <>Đã đăng</> : <>Nháp</>}</>,
    },
    {
      title: "Hành động",
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
  const getDomainListByTeam = async () => {
    if (team?.key || teamList[0]?.key) {
      const listDomains = await getDomainByTeam(
        team?.key || teamList[0]?.key,
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
      // setDomain(domainsList[0]);
      setDomainList(domainsList);
    }
  };
  const getTeamListByBrand = async () => {
    if (brand?.key || brandList[0]?.key) {
      const listTeam = await getTeamByBrand(brand?.key || brandList[0]?.key);
      let teamListTemp = [];
      listTeam?.data?.map((item) => {
        let a = {
          key: item?._id,
          value: item?.name,
          total: item?.total,
        };
        teamListTemp.push(a);
      });
      const teamList1 = teamListTemp;
      // setTeam(teamList1[0]);
      setTeamList(teamList1);
    }
  };
  const getListBrand = async () => {
    // if (!brand?.key) {
    //   const listBrand = await getPagingBrands(10000, 1, "");
    //   let brandList = [];
    //   listBrand?.data?.map((item) => {
    //     let a = {
    //       key: item?._id,
    //       value: item?.name,
    //     };
    //     brandList.push(a);
    //   });
    //   props?.location?.state
    //     ? setBrand(props?.location?.state[2])
    //     : brand?.key === undefined && setBrand(brandList[0]);
    //   setBrandList(brandList);
    // }
    const listBrand = await getAllBrand();
    let brandList = [];
    listBrand?.data?.map((item) => {
      let a = {
        key: item?._id,
        value: item?.name,
        label: item?.name,
        total: item?.total,
      };
      brandList.push(a);
    });
    brand?.key === undefined && setBrand(brandList[0]);
    setBrandList(brandList);
  };

  const getColapsByDomain = async (key) => {
    if (domain?.key || domainList[0]?.key) {
      const listColaps = await getColabByDomainId(domain?.key);
      let colabList = [];
      listColaps?.data?.map((item) => {
        let a = {
          key: item?._id,
          value: item?.name,
          total: item?.total,
        };
        colabList.push(a);
      });
      setColabList(colabList);
    }
    // if (domain?.key || domainList[0]?.key) {
    //   const listColaps = await getPaymentByDomains(
    //     domain?.key || domainList[0]?.key,
    //     10000,
    //     1,
    //     ""
    //   );
    //   let colabList = [];
    //   listColaps?.data?.map((item) => {
    //     let a = {
    //       key: item?._id,
    //       value: item?.name,
    //       total: item?.total,
    //     };
    //     colabList.push(a);
    //   });
    //   setColabList(colabList);
    //   if (props?.location?.state) {
    //     setColab(props?.location?.state?.[0]);
    //   } else {
    //     if (!key) {
    //       setColab(colabList[0]);
    //     } else {
    //       const colab1 = colabList.find((item) => item?.key === key);
    //       setColab(colab1);
    //     }
    //   }
    // }
  };

  const getLinkManagementByTeam = async () => {
    const listColadsTeam = await getLinkManagementsByTeamUser(team?.key);
    let listColadTeam = [];
    listColadsTeam?.map((item) => {
      let a = {
        key: item?._id,
        value: item?.name,
        label: item?.name,
        total: item?.total,
      };
      listColadTeam.push(a);
    });
    setLinkByTeam(listColadTeam);
    setSum(listColadTeam);
  };

  useEffect(() => {
    getListBrand();
  }, []);
  useEffect(() => {
    getTeamListByBrand();
  }, [brand?.key]);

  useEffect(() => {
    getDomainListByTeam();
    getLinkManagementByTeam();
  }, [team?.key, colab?.key]);

  useEffect(() => {
    getColapsByDomain();
  }, [domain?.key]);

  useEffect(() => {
    handleGetLinkPostByColaps();
  }, [pageSize, pageIndex, brand?.key]);

  const handleSelectBrand = (value) => {
    if (value?.key !== brand?.key) {
      history.replace("/postsLink");
      setDomain({});
      setDomainList([]);
      setTeam({});
      setTeamList([]);
      setColab({});
      setColabList([]);
      setData([]);
      setBrand(value);
    }
  };
  const handleSelectTeam = (value) => {
    if (value?.key !== team?.key) {
      setDomain({});
      setDomainList([]);
      setColab({});
      setColabList([]);
      // setData([]);
      setTeam(value);
    }
  };

  const handleSelectDomain = (value) => {
    if (value?.key !== domain?.key) {
      setColab({});
      // setData([]);
      setColabList([]);
      setLinkByTeam([]);
      setDomain(value);
    }
  };
  const handleSelectColaps = async (value) => {
    // console.log(value, 'sadsada');
    if (value?.key !== colab?.key) {
      // setData([]);
      setSearch("");
      setColab(value);
      setSumKey(value?.key);
    }
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
    const linkPost = await getLinkPostByColab(
      // colab?.key || colabList?.[0]?.key,
      pageSize || 10,
      pageIndex || 1,
      search || "",
      brand?.key || "",
      team?.key || "",
      domain?.key || "",
      colab?.key || ""
    );
    setTotal(linkPost?.count);
    setData(linkPost?.data);
  };
  const onFinish = async (values) => {
    // console.log(values, 'values');
    // return ;
    setIsLoading(true);
    const dataReq = {
      link_post: values?.link_post,
      link_posted: values?.link_posted,
      keyword: values?.keyword,
      category: values?.category,
      status: values?.status || 1,
      collaboratorId: values?.collaboratorId || "",
      domain: values?.domain || "",
      price_per_word: values?.price_per_word,
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
        price_per_word: values?.price_per_word,
        collaboratorId: colab?.key || "",
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
        getLinkManagementByTeam();
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
    form.setFieldValue("price_per_word", value?.price_per_word);
    setEdit(value?._id);
    handleOpenModal();
  };

  const exportExcel = async () => {
    const dataReq = {
      pageSize: 10000,
      pageIndex: 1,
      search: "",
    };
    const listColab = await getLinkPostByColab(colab?.key, 10000, 1, "");
    const fileType =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const fileExtension = ".xlsx";
    const whitelistExcel = listColab?.data?.map((item, index) => {
      return {
        STT: index + 1,
        "Tiêu đề": item?.title,
        "Từ khóa": item?.keyword,
        "Chuyên mục": item?.category,
        "Link bài viết": item?.link_post,
        "Link bài đăng": item?.link_posted,
        "Số lượng từ": item?.number_words,
        "Số lượng ảnh": item?.number_images,

        "Tổng tiền": item?.total?.toLocaleString("it-IT", {
          style: "currency",
          currency: "VND",
        }),
        "Xác nhận": item?.status,
      };
    });
    const ws = XLSX.utils.json_to_sheet(whitelistExcel, {
      header: ["QUẢN LÝ CỘNG TÁC VIÊN"],
    });
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, "Link" + fileExtension);
  };
  const [domainAdd, setDomainAdd] = useState([]);
  const [selectedDomainAdd, setSelectedDomainAdd] = useState("");
  const [colabAdd, setColabAdd] = useState([]);
  const handleGetDomainAdd = async () => {
    const res = await getAllDomain();
    setDomainAdd(res?.data);
  };
  const handleGetColabAdd = async () => {
    form.setFieldValue("collaboratorId", "");
    const res = await getColabByDomainId(
      selectedDomainAdd || domainAdd[0]?._id
    );
    setColabAdd(res?.data);
  };
  useEffect(() => {
    handleGetDomainAdd();
    handleGetColabAdd();
  }, []);
  useEffect(() => {
    setColab();
    handleGetColabAdd();
  }, [selectedDomainAdd]);

  const ShowEditLink = () => {
    if (!edit) {
      return (
        <>
          {" "}
          <Form.Item
            label="Domain"
            name="domain"
            rules={[{ required: true, message: "Vui lòng chọn domain!" }]}
          >
            <Select
              onChange={(e) => setSelectedDomainAdd(e)}
              value={selectedDomainAdd}
            >
              {domainAdd?.map((item) => {
                return (
                  <>
                    <Option value={item?._id}>{item?.name}</Option>
                  </>
                );
              })}
            </Select>
          </Form.Item>
          <Form.Item
            label="Cộng tác viên"
            name="collaboratorId"
            rules={[
              { required: true, message: "Vui lòng chọn cộng tác viên!" },
            ]}
          >
            <Select>
              {colabAdd?.map((item) => {
                return (
                  <>
                    <Option value={item?._id}>{item?.name}</Option>
                  </>
                );
              })}
            </Select>
          </Form.Item>
          <Form.Item
            label="Link bài viết"
            name="link_post"
            rules={[{ required: true, message: "Nhập link bài viết" }]}
          >
            <Input />
          </Form.Item>
          <p style={{ color: "orange" }}>
            Lưu ý: bài viết phải chuẩn định dạng google document. Nếu vẫn có lỗi
            bạn hãy copy nội dung qua một google document khác và thử lại.
          </p>
          <Form.Item
            label="Số tiền mỗi từ"
            name="price_per_word"
            rules={[{ required: true, message: "Nhập số tiền mỗi từ" }]}
          >
            <InputNumber type="number" />
          </Form.Item>
        </>
      );
    }
    if (edit) {
      return (
        <>
          <Form.Item
            label="Số tiền mỗi từ"
            name="price_per_word"
            rules={[{ required: true, message: "Nhập số tiền mỗi từ" }]}
          >
            <InputNumber type="number" />
          </Form.Item>
        </>
      );
    }
  };

  const Total = () => {
    return sum?.map((item) => item?.key === sumKey);
  };
  // console.log(Total, 'taaaa');

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
                  // showSearch
                  style={{ width: "100%" }}
                  placeholder="Search to Select"
                  value={brand}
                  onSelect={(key, value) => handleSelectBrand(value)}
                  options={brandList}
                ></Select>
              </Col>
              <Col lg={2}>
                <p className="custom-label">Team</p>
                <Select
                  // showSearch
                  style={{ width: "100%" }}
                  placeholder="Search to Select"
                  value={team}
                  onSelect={(key, value) => handleSelectTeam(value)}
                  options={teamList}
                  allowClear
                  onClear={() => setTeam({})}
                ></Select>
              </Col>
              <Col lg={2}>
                <p className="custom-label">Domains</p>
                <Select
                  // showSearch
                  style={{ width: "100%" }}
                  placeholder="Search to Select"
                  value={domain}
                  onSelect={(key, value) => handleSelectDomain(value)}
                  options={domainList}
                  allowClear
                  onClear={() => setDomain({})}
                ></Select>
              </Col>
              <Col lg={2}>
                <p className="custom-label">Cộng tác viên</p>
                <Select
                  // showSearch
                  style={{ width: "100%" }}
                  placeholder="Search to Select"
                  value={colab}
                  onSelect={(key, value) => handleSelectColaps(value)}
                  options={domain?.key ? colabList : linkByTeam}
                  allowClear
                  onClear={() => setColab({})}
                />
              </Col>
              <Col lg="1">
                <br />
                <Button
                  style={{ height: 36, margin: "5px" }}
                  type="primary"
                  onClick={handleGetLinkPostByColaps}
                >
                  Lọc
                </Button>
              </Col>
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
                >
                  Thêm bài viết
                </Button>
              </Col>
              <Col lg="2">
                <p className="custom-label">
                  Tổng số tiền :{" "}
                  {/* {colab
                    ? colab?.total?.toLocaleString("it-IT", {
                        style: "currency",
                        currency: "VND",
                      })
                    : null} */}
                  {(colab
                    ? colab?.total || 0
                    : domain
                    ? domain?.total || 0
                    : team
                    ? team?.total || 0
                    : brand
                    ? brand?.total || 0
                    : 0
                  ).toLocaleString("it-IT", {
                    style: "currency",
                    currency: "VND",
                  })}
                </p>
              </Col>
              <Col style={{ width: "130px" }} lg="2">
                <div>
                  <Button
                    style={
                      data?.length !== 0
                        ? {
                            backgroundColor: "#026e39",
                            border: "none",
                            color: "white",
                          }
                        : {
                            backgroundColor: "gray",
                            border: "none",
                            color: "black",
                          }
                    }
                    onClick={() => exportExcel()}
                    disabled={data?.length === 0}
                  >
                    Xuất excel
                  </Button>
                </div>
              </Col>
            </Row>
            <Row>
              <Table
                columns={columns}
                dataSource={data}
                pagination={false}
                scroll={{ x: 1300, y: 600 }}
              />
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
            {
              ShowEditLink()
              // !edit && (
              //   <>
              //     <Form.Item
              //       label="Link bài viết"
              //       name="link_post"
              //       rules={[{ required: true, message: "Nhập link bài viết" }]}
              //     >
              //       <Input />
              //     </Form.Item>
              //     <p style={{ color: "orange" }}>
              //       Lưu ý: bài viết phải chuẩn định dạng google document. Nếu vẫn
              //       có lỗi bạn hãy copy nội dung qua một google document khác và
              //       thử lại.
              //     </p>
              //     <Form.Item
              //       label="Số tiền mỗi từ"
              //       name="price_per_word"
              //       rules={[{ required: true, message: "Nhập số tiền mỗi từ" }]}
              //     >
              //       <InputNumber type="number" />
              //     </Form.Item>
              //   </>
              // )
            }

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
