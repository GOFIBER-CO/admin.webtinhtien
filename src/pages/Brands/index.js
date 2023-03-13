import { Drawer, Pagination, Popconfirm, Space, Table } from "antd";
import React, { useEffect, useState } from "react";
import {
  Button,
  Col,
  Container,
  Input,
  InputGroup,
  InputGroupText,
  Row,
} from "reactstrap";
import "../../App.css";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import {
  checkPermissionScreen,
  deleteBrands,
  insertBrands,
} from "../../helpers/helper";
// import { Form } from "reactstrap";
import { Form, message, Tooltip } from "antd";
import { getPagingBrands, updateBrands } from "./../../helpers/helper";
import * as XLSX from "xlsx";
import * as FileSaver from "file-saver";
import { useLocation } from "react-router-dom";
import Page403 from "../403";
const { Column } = Table;
const Brands = () => {
  const [form] = Form.useForm();
  const [drawerTitle, setDrawerTitle] = useState("");
  const [visibleForm, setVisibleForm] = useState(false);
  const [dataBrands, setDataBrands] = useState([]);
  const [idEdit, setIdEdit] = useState("");
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItem, setTotalItem] = useState(1);
  const [search, setSearch] = useState("");
  const [sum, setSum] = useState(0);
  const [checkRole, setCheckRole] = useState(true);
  const location = useLocation();
  const checkScreen = async () => {
    const permission = await checkPermissionScreen(location.pathname);
    setCheckRole(permission.status);
  };
  useEffect(() => {
    checkScreen();
  }, []);
  const onClose = () => {
    setVisibleForm(false);
  };

  const getdata = () => {
    getPagingBrands(pageSize, pageIndex, search).then((data) => {
      setDataBrands(data.data);
      setPageIndex(data.pageIndex);
      setPageSize(data.pageSize);
      setTotalItem(data.count);
    });
  };
  useEffect(() => {
    getdata();
  }, [pageSize, pageIndex]);
  const onFinish = async (data) => {
    // console.log(data,'da');
    const dataBrands = {
      name: data.name,
      // total:0
    };
    if (!data.id) {
      await insertBrands(dataBrands)
        .then((res) => {
          getdata();
          setVisibleForm(false);
          if (res.success === true) {
            return message.success(`Create Success! `);
          }
        })
        .catch((err) => {
          // console.log(err,'ee');
          message.error("Create feild!");
        });
    } else {
      //update
      await updateBrands(data.id, dataBrands)
        .then((res) => {
          getdata();
          setVisibleForm(false);
          if (res.success === true) {
            return message.success(`Save Success! `);
          }
        })
        .catch((err) => {
          message.error("save feild!");
        });
    }
  };
  const onFinishFailed = () => {};

  const handleRefreshCreate = async () => {
    form.resetFields();
  };

  const onSearch = () => {
    getdata();
  };

  const showDrawer = () => {
    setVisibleForm(true);
  };
  const onEdit = (key) => {
    const dataEdit = dataBrands.filter((item) => item._id === key);
    // console.log(dataEdit,'data');
    setIdEdit(dataEdit[0]._id);
    form.setFieldsValue({
      name: dataEdit[0].name,
      id: dataEdit[0]._id,
    });
    showDrawer();
    setDrawerTitle("Chỉnh Sửa Redirect");
  };

  const exportExcel = async () => {
    const dataReq = {
      pageSize: 10000,
      pageIndex: 1,
      search: "",
    };
    const listColab = await getPagingBrands(10000, 1, "");
    const fileType =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const fileExtension = ".xlsx";
    const whitelistExcel = listColab?.data?.map((item, index) => {
      const tong = item?.total;
      setSum(item?.total);
      return {
        STT: index + 1,
        "Tên thương hiệu": item?.name,
        "Tổng tiền":
          item?.total ||
          // ?.toLocaleString("it-IT", {
          //   style: "currency",
          //   currency: "VND",
          // })

          0,
      };
    });

    const ws = XLSX.utils.json_to_sheet(whitelistExcel, {
      header: ["QUẢN LÝ THƯƠNG HIỆU"],
    });
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, "Brands" + fileExtension);
  };
  return (
    <React.Fragment>
      {checkRole === true ? (
        <div className="page-content">
          <Container fluid>
            <BreadCrumb title="Thương hiệu" pageTitle="Quản lí Thương hiệu" />
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
              >
                <Form
                  form={form}
                  layout="vertical"
                  onFinish={onFinish}
                  onFinishFailed={onFinishFailed}
                  autoComplete="off"
                >
                  <Row>
                    <Col sm={4} hidden={true}>
                      <Form.Item name="id" label="Id">
                        <Input name="id" />
                      </Form.Item>
                    </Col>
                    <Col>
                      <Form.Item
                        name="name"
                        label="Thương hiệu"
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng nhập thương hiệu!",
                          },
                          {
                            type: "name",
                          },
                          {
                            type: "string",
                            min: 1,
                          },
                        ]}
                      >
                        <Input
                          placeholder="Thương hiệu"
                          name="name"
                          allowClear={true}
                          onChange={(e) =>
                            form.setFieldsValue({
                              name: e.target.value,
                            })
                          }
                          // onChange={(e) => handleChangeTitle(e.target.value)}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Form.Item>
                    <Space>
                      {idEdit ? (
                        <Button type="primary" htmlType="submit">
                          Save
                        </Button>
                      ) : (
                        <>
                          {" "}
                          <Button type="primary" htmlType="submit">
                            Create
                          </Button>{" "}
                          <Button
                            type="primary"
                            htmlType="button"
                            onClick={() => handleRefreshCreate()}
                          >
                            Refresh
                          </Button>{" "}
                        </>
                      )}
                    </Space>
                  </Form.Item>
                </Form>
              </Drawer>
              <Col lg="5">
                <div>
                  <InputGroup>
                    <Input
                      // value={searchText}
                      onChange={(e) => {
                        setSearch(e.target.value);
                      }}
                      placeholder="Tìm kiếm..."
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          // console.log(e.target.value);
                          setSearch(e.target.value);
                          getdata();
                        }
                      }}
                    />
                    <InputGroupText
                      onClick={onSearch}
                      style={{ cursor: "pointer" }}
                    >
                      <i className="ri-search-line"></i>
                    </InputGroupText>
                  </InputGroup>
                  <div></div>
                </div>
              </Col>

              <Col lg="7">
                <div className="text-right">
                  <Button
                    style={
                      dataBrands?.length !== 0
                        ? {
                            backgroundColor: "#026e39",
                            border: "none",
                            color: "white",
                            marginRight: "10px",
                          }
                        : {
                            backgroundColor: "gray",
                            border: "none",
                            color: "black",
                            marginRight: "10px",
                          }
                    }
                    onClick={() => exportExcel()}
                    disabled={dataBrands?.length === 0}
                  >
                    Xuất excel
                  </Button>
                  <Button
                    onClick={() => {
                      setDrawerTitle("Thêm Thương hiệu Mới");
                      showDrawer();
                      // console.log(visibleForm);
                      form.resetFields();
                    }}
                  >
                    Thêm mới
                  </Button>
                </div>
              </Col>
            </Row>
            <Row>
              <Col lg={12}>
                <Table
                  rowKey="_id"
                  dataSource={dataBrands}
                  // pagination={{
                  //   total: totalPage,
                  //   pageSize: pageSize,
                  //   current: pageIndex,
                  // }}
                  // onChange={(e) => handleOnChangeTable(e)}
                  pagination={false}
                >
                  <Column
                    title="#"
                    render={(val, rec, index) => {
                      return index + 1;
                    }}
                  />

                  <Column
                    title="Thương hiệu"
                    dataIndex="name"
                    key="name"
                    sorter={(a, b) => a?.name.localeCompare(b?.name)}
                  />
                  <Column
                    title="Hoạt động"
                    key="action"
                    render={(val, record) => (
                      <Space size="middle">
                        <Tooltip title="Edit">
                          <i
                            className="ri-pencil-line action-icon"
                            style={{ color: "blue" }}
                            onClick={() => onEdit(val._id)}
                          ></i>
                        </Tooltip>

                        <Popconfirm
                          title="Bạn có chắc chắn muốn xóa brand này?"
                          onConfirm={() => {
                            deleteBrands(val._id)
                              .then((res) => {
                                // console.log(res,'res');
                                // return ;
                                getdata();
                                if (res.success === true) {
                                  return message.success(`Delete Success! `);
                                }
                              })
                              .catch((err) =>
                                message.error(
                                  "Brand còn team nên không thể xóa!"
                                )
                              );
                          }}
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
                  // showTotal={showTotal}
                  style={{ marginTop: "30px" }}
                  current={pageIndex}
                  defaultCurrent={pageIndex}
                  total={totalItem}
                  pageSize={pageSize}
                  showSizeChanger
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

export default Brands;
