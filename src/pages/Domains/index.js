import React, { createRef, useEffect, useState } from "react";
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
  deleteDomains,
  getAllBrands,
  getPagingBrands,
  getPagingDomains,
  getTeamAll,
  getTeamByBrand,
  insertDomains,
  updateDomains,
} from "./../../helpers/helper";
import * as XLSX from "xlsx";
import * as FileSaver from "file-saver";
const { Option } = Select;
const Domains = () => {
  const [form] = Form.useForm();
  const [visibleForm, setVisibleForm] = useState(false);
  const [drawerTitle, setDrawerTitle] = useState("");
  const [dataTeam, setDataTeam] = useState([]);
  const [dataBrand, setDataBrand] = useState([]);
  const [selectedCate, setSelectedCate] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [count, setCount] = useState(1);
  const [data, setData] = useState([]);
  const [idEdit, setIdEdit] = useState("");
  const [search, setSearch] = useState("");
  const [brandAll, setBrandAll] = useState([]);
  const [teamList, setTeamList] = useState([]);
  const [team, setTeam] = useState("");
  const ref = createRef();

  const onClose = () => {
    setVisibleForm(false);
  };
  const showDrawer = () => {
    setVisibleForm(true);
  };
  const handleRefreshCreate = async () => {
    form.resetFields();
  };

  const getDataDomains = () => {
    getPagingDomains(
      pageSize,
      pageIndex,
      search,
      team?.key || "",
      selectedBrand?.key || "",
      []
    ).then((res) => {
      setPageIndex(res.pageIndex);
      setPageSize(res.pageSize);
      setCount(res.count);
      setData(res.data);
    });
  };
  const getDataTeams = () => {
    getTeamAll().then((res) => {
      setDataTeam(res.data);
      // setTeamList(res.data)
    });
  };

  const dataAllBrand = () => {
    getAllBrands().then((res) => {
      setBrandAll(res.data);
    });
  };
  useEffect(() => {
    getDataTeams();
    getDataDomains();
    dataAllBrand();
  }, [pageSize, pageIndex, selectedBrand]);

  const onFinishFailed = () => {
    // message.error("Save failed!");
  };
  const onFinish = async (data) => {
    // console.log(data, 'dsadsad');
    // return
    const dataDomains = {
      name: data.host,
      total: 0,
      team: data.team_id,
      brand: data.brand,
      manager: data?.manager,
    };
    if (!data._id) {
      await insertDomains(dataDomains)
        .then((res) => {
          getDataDomains();
          setVisibleForm(false);
          if (res.success === true) {
            return message.success(`Create Success! `);
          }
        })
        .catch((e) => {
          message.error(`Create Failed!`);
        });
    } else {
      await updateDomains(data._id, dataDomains).then((res) => {
        getDataDomains();
        setVisibleForm(false);
        if (res.success === true) {
          return message.success(`Save Success! `);
        }
      });
    }
  };

  const onSearch = (event) => {
    event.preventDefault();
    getDataDomains();
  };
  const onInputChange = (e) => {};

  const handleSelectCate = (e) => {
    setSelectedCate(e);
    setDataBrand([]);
    form.setFieldValue("brand", "");
    setDataBrand(dataTeam?.filter((a) => a._id === e)?.[0]?.brand);
  };

  const handleSelectBrand = (e) => {
    setSelectedBrand(e);
  };

  const handleSelectTeam = (e) => {
    setTeam(e);
  };

  const onEdit = (id) => {
    const dataEdit = data.filter((item) => item._id === id);
    setIdEdit(dataEdit[0]._id);
    form.setFieldsValue({
      host: dataEdit[0].name,
      _id: dataEdit[0]._id,
      team_id: dataEdit[0]?.team?._id,
      brand: dataEdit[0]?.brand?._id,
    });
    setDataBrand(
      dataTeam?.filter((a) => a._id === dataEdit[0]?.team?._id)?.[0]?.brand
    );

    setSelectedBrand(dataEdit[0]?.brand?._id);
    showDrawer();
    setDrawerTitle("Chỉnh Sửa Domains");
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
      return {
        STT: index + 1,
        "Tên Domains": item?.name,
        "Quản lý": item?.manager,
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
      header: ["QUẢN LÝ DOMAINS"],
    });
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, "Domains" + fileExtension);
  };

  const getTeamListByBrand = async () => {
    if (selectedBrand?.key) {
      const listTeam = await getTeamByBrand(selectedBrand?.key);
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

      setTeamList(teamList1);
    }
  };

  useEffect(() => {
    getTeamListByBrand();
  }, [selectedBrand?.key]);

  const onClearBrand = () => {
    setSelectedBrand({});
    setTeamList([]);
    setTeam({});
  };
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Domains" pageTitle="Quản lý domains"></BreadCrumb>
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
                    name="host"
                    label="Domains"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập Domains!",
                      },
                      {
                        type: "Doamins",
                      },
                      {
                        type: "string",
                        min: 1,
                      },
                    ]}
                  >
                    <Input
                      placeholder="Domains"
                      name="host"
                      allowClear={true}
                      onChange={(e) =>
                        form.setFieldsValue({
                          host: e.target.value,
                        })
                      }
                      // value={dataEdit}
                      // defaultValue={dataEdit}
                    />
                  </Form.Item>
                </Col>
                <Col>
                  <Form.Item
                    name="team_id"
                    label="Teams"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập Thương hiệu!",
                      },
                      {
                        type: "team_id",
                      },
                      {
                        type: "string",
                        min: 1,
                      },
                    ]}
                  >
                    <Select
                      showSearch
                      placeholder="Teams"
                      optionFilterProp="children"
                      style={{ width: "100%" }}
                      value={selectedCate}
                      onChange={handleSelectCate}
                    >
                      {dataTeam &&
                        dataTeam.map((item, index) => {
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
                <Col>
                  <Form.Item
                    name="brand"
                    label="Brands"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập brands!",
                      },
                      {
                        type: "Brands",
                      },
                      {
                        type: "string",
                        min: 1,
                      },
                    ]}
                  >
                    <Select
                      showSearch
                      placeholder="Brands"
                      optionFilterProp="children"
                      style={{ width: "100%" }}
                      value={selectedBrand}
                      onChange={(e) => handleSelectBrand(e)}
                    >
                      {dataBrand &&
                        dataBrand?.map((item, index) => {
                          return (
                            <Option key={item?._id} value={item?._id}>
                              {item?.name}
                            </Option>
                          );
                        })}
                    </Select>
                  </Form.Item>
                </Col>
                <Col>
                  <Form.Item name="manager" label="Người quản lý">
                    <Input
                      placeholder="Người quản lý"
                      name="manager"
                      allowClear={true}
                      onChange={(e) =>
                        form.setFieldsValue({
                          manager: e.target.value,
                        })
                      }
                      // value={dataEdit}
                      // defaultValue={dataEdit}
                    />
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
                onClear={() => onClearBrand()}
              >
                {brandAll &&
                  brandAll?.map((item, index) => {
                    return (
                      <Option value={item._id} key={item._id}>
                        {item.name}
                      </Option>
                    );
                  })}
              </Select>
            </Col>
            <Col lg="2">
              <p className="custom-label">Teams</p>
              <Select
                showSearch
                style={{ width: "100%" }}
                placeholder="Search to Select"
                value={team}
                onSelect={(key, value) => handleSelectTeam(value)}
                options={teamList}
                allowClear
                onClear={() => setTeam({})}
              >
                {/* {teamList &&
                  teamList?.map((item, index) => {
                    return (
                      <Option value={item._id} key={item._id}>
                        {item.name}
                      </Option>
                    );
                  })} */}
              </Select>
            </Col>
            <Col lg="4">
              <div style={{ marginTop: "24px" }}>
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
                        getDataDomains();
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

            <Col lg="4">
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
                    setDrawerTitle("Thêm Domains Mới");
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
                <Column
                  title="Domains"
                  dataIndex="name"
                  key="name"
                  sorter={(a, b) => a?.name.localeCompare(b?.name)}
                />
                <Column
                  title="Người quản lý"
                  dataIndex="manager"
                  key="manager"
                  sorter={(a, b) => a?.manager?.localeCompare(b?.manager)}
                />

                <Column
                  title="Teams"
                  dataIndex="team"
                  key="team"
                  render={(val, record) => {
                    return <>{val?.name}</>;
                  }}
                  sorter={(a, b) => a?.team?.name.localeCompare(b?.team?.name)}
                />
                <Column
                  title="Brands"
                  dataIndex="brand"
                  key="brand"
                  render={(val, record) => {
                    return <>{val?.name}</>;
                  }}
                  sorter={(a, b) => a?.brand?.name.localeCompare(b?.brand.name)}
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
                          deleteDomains(val._id)
                            .then((res) => {
                              getDataDomains();
                              if (res.success === true) {
                                return message.success(`Delete Success! `);
                              }
                            })
                            .catch((err) =>
                              message.error(
                                "Domain này còn các cộng tác viên nên không thể xóa!"
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

export default Domains;
