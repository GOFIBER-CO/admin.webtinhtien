import React, { useEffect, useState } from "react";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import {
  Button,
  Col,
  Container,
  Input,
  InputGroup,
  InputGroupText,
  Row,
} from "reactstrap";
import {
  Form,
  Space,
  Table,
  Select,
  Popconfirm,
  notification,
  Drawer,
  Tooltip,
  message,
  Pagination,
} from "antd";
import Column from "antd/lib/table/Column";
import {
  createTeam,
  getAllBrands,
  getPagingTeams,
  updateTeam,
  deleteTeam,
} from "./../../helpers/helper";
import * as XLSX from "xlsx";
import * as FileSaver from "file-saver";
const { Option } = Select;
const Teams = () => {
  const [form] = Form.useForm();
  const [visibleForm, setVisibleForm] = useState(false);
  const [drawerTitle, setDrawerTitle] = useState("");
  const [dataBrands, setDataBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [count, setCount] = useState(1);
  const [data, setData] = useState([]);
  const [idEdit, setIdEdit] = useState("");
  const [search, setSearch] = useState("");

  const onClose = () => {
    setVisibleForm(false);
  };
  const showDrawer = () => {
    setVisibleForm(true);
  };
  const handleRefreshCreate = async () => {
    form.resetFields();
  };
  const getDataTeams = () => {
    getPagingTeams(pageSize, pageIndex, search, selectedBrand?.key || "").then((res) => {
      setCount(res.count);
      setData(res.data);
    });
  };
  const getDataBrands = () => {
    getAllBrands().then((res) => {
      setDataBrands(res.data);
    });
  };
  useEffect(() => {
    getDataBrands();
    getDataTeams();
  }, [pageSize, pageIndex]);

  const onFinishFailed = () => {
    // message.error("Save failed!");
  };
  const onFinish = async (data) => {
    // return ;
    const dataTeams = {
      name: data.name,
      total: 0,
      brand: data.brand,
    };
    if (!data._id) {
      await createTeam(dataTeams)
        .then((res) => {
          getDataTeams();
          setVisibleForm(false);
          if (res.success === true) {
            return message.success(`Create Success! `);
          }
        })
        .catch((e) => {
          message.error(`Create Failed!`);
        });
    } else {
      await updateTeam(data._id, dataTeams).then((res) => {
        getDataTeams();
        setVisibleForm(false);
        if (res.success === true) {
          return message.success(`Save Success! `);
        }
      });
    }
  };

  const onSearch = (e) => {
    e.preventDefault();
    getDataTeams();
  };

  const handleSelectBrand = (e) => {
    setSelectedBrand(e);
  };

  const onEdit = (id) => {
    const dataEdit = data.filter((item) => item._id === id);
    setIdEdit(dataEdit[0]._id);
    form.setFieldsValue({
      name: dataEdit[0].name,
      _id: dataEdit[0]._id,
      brand: dataEdit[0].brand?.map((item) => item._id),
    });
    showDrawer();
    setDrawerTitle("Chỉnh Sửa Teams");
  };
  const exportExcel = async () => {
    const dataReq = {
      pageSize: 10000,
      pageIndex: 1,
      search: "",
    };
    const listTeams = await getPagingTeams(10000, 1, "","");
    const fileType =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const fileExtension = ".xlsx";
    const whitelistExcel = listTeams?.data?.map((item, index) => {
      return {
        STT: index + 1,
        "Tên Team": item?.name,
        "Tổng tiền":
          item?.total
          // ?.toLocaleString("it-IT", {
          //   style: "currency",
          //   currency: "VND",
          // }) 
          
          || 0,
      };
    });

    const ws = XLSX.utils.json_to_sheet(whitelistExcel, {
      header: ["QUẢN LÝ TEAMS"],
    });
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, "Teams" + fileExtension);
  };
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Teams" pageTitle="Quản lý Teams"></BreadCrumb>
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
                <Col sm={4} hidden={true}>
                  <Form.Item name="_id" label="Id">
                    <Input name="_id" />
                  </Form.Item>
                </Col>
                <Col>
                  <Form.Item
                    name="name"
                    label="Tên"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập tên team!",
                      },
                      {
                        type: "string",
                        min: 1,
                      },
                    ]}
                  >
                    <Input
                      placeholder="Tên teams"
                      name="name"
                      allowClear={true}
                      onChange={(e) =>
                        form.setFieldsValue({
                          host: e.target.value,
                        })
                      }
                    />
                  </Form.Item>
                </Col>
                <Col>
                  <Form.Item
                    name="brand"
                    label="Thương hiệu"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập Thương hiệu!",
                      },
                      {
                        type: "brand",
                      },
                      {
                        type: "array",
                        min: 1,
                      },
                    ]}
                  >
                    <Select
                      mode="multiple"
                      showSearch
                      placeholder="Thương hiệu"
                      optionFilterProp="children"
                      style={{ width: "100%" }}
                      value={selectedBrand}
                      onChange={(e) => handleSelectBrand(e)}
                    >
                      {dataBrands &&
                        dataBrands.map((item, index) => {
                          return (
                            <Option
                              key={item?._id}
                              value={item?._id}
                              label={item?.name}
                            >
                              {item?.name}
                            </Option>
                          );
                        })}
                    </Select>
                  </Form.Item>
                </Col>
                <Form.Item>
                  <Space>
                    {idEdit ? (
                      <Button type="primary" htmlType="submit">
                        Save
                      </Button>
                    ) : (
                      <>
                        <Button type="primary" htmlType="submit">
                          Create
                        </Button>

                        <Button
                          type="primary"
                          htmlType="button"
                          onClick={() => handleRefreshCreate()}
                        >
                          Refresh
                        </Button>
                      </>
                    )}
                  </Space>
                </Form.Item>
              </Form>
            </Drawer>
            <Col lg="2">
              <p className="custom-label">Thương hiệu</p>
              <Select
                showSearch
                style={{ width: "100%" }}
                placeholder="Search to Select"
                value={selectedBrand}
                onSelect={(key, value) => handleSelectBrand(value)}
                // options={domainList}
                
                allowClear
                onClear={() => setSelectedBrand({})}
              >
                {dataBrands &&
                  dataBrands?.map((item, index) => {
                    return (
                      <Option value={item._id} key={item._id}>
                        {item.name}
                      </Option>
                    );
                  })}
              </Select>
            </Col>
            <Col lg="5">
              <div style={{marginTop:'24px'}}>
                <InputGroup>
                  <Input
                    // value={searchText}
                    onChange={(e) => {
                      // onInputChange(e);
                      setSearch(e.target.value);
                    }}
                    placeholder="Tìm kiếm..."
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        setSearch(e.target.value);
                        getDataTeams();
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
              </div>
            </Col>

            <Col lg="5">
              <div className="text-right">
                <Button
                  style={
                    data?.length !== 0
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
                  disabled={data?.length === 0}
                >
                  Xuất excel
                </Button>
                <Button
                  onClick={() => {
                    setDrawerTitle("Thêm Teams Mới");
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
                dataSource={data}
                pagination={false}
                // pagination={{
                //   total: totalPage,
                //   pageSize: pageSize,
                //   current: pageIndex,
                // }}
                // onChange={(e) => handleOnChangeTable(e)}
              >
                <Column
                  title="#"
                  render={(val, rec, index) => {
                    return index + 1;
                  }}
                />
                <Column title="Teams" dataIndex="name" key="name" sorter={(a,b)=> a?.name.localeCompare(b?.name)} />

                <Column
                  title="Thương hiệu"
                  dataIndex="brand"
                  key="brand"
                  render={(val, record) =>
                    val?.map((item, index) => {
                      return <span key={index}>{item?.name} , </span>;
                    })
                  }                
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
                        title="Are you sure to delete this user?"
                        onConfirm={() => {
                          deleteTeam(val._id)
                            .then((res) => {
                              getDataTeams();
                              if (res.success === true) {
                                return message.success(`Delete Success! `);
                              }
                            })
                            .catch((error) =>
                              message.error(
                                "Team này còn domain nên bạn không thể xóa!"
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
                style={{ marginTop: "30px" }}
                current={pageIndex}
                defaultCurrent={pageIndex}
                total={count}
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
    </React.Fragment>
  );
};

export default Teams;
