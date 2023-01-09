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
  insertDomains,
  updateDomains,
} from "./../../helpers/helper";
const { Option } = Select;
const Domains = () => {
  const [form] = Form.useForm();
  const [visibleForm, setVisibleForm] = useState(false);
  const [drawerTitle, setDrawerTitle] = useState("");
  const [dataBrands, setDataBrands] = useState([]);
  const [selectedCate, setSelectedCate] = useState("");
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [count, setCount] = useState(1);
  const [data, setData] = useState([]);
  const [idEdit, setIdEdit] = useState("");
  const [search, setSearch] = useState("")
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
    getPagingDomains(pageSize,pageIndex,search).then((res) => {
      setPageIndex(res.pageIndex);
      setPageSize(res.pageSize);
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
    getDataDomains();
  }, [pageSize, pageIndex]);

  const onFinishFailed = () => {
    // message.error("Save failed!");
  };
  const onFinish = async (data) => {
    const dataDomains = {
      name: data.host,
      total: 0,
      brand_id: data.brand_id,
    };
    if (!data._id) {
      await insertDomains(dataDomains)
        .then((res) => {
          getDataDomains();
          setVisibleForm(false)
          if (res.success === true) {
            return message.success(`Create Success! `);
          }
          
        })
        .catch((e) => {
          message.error(`Create Failed!`);
        });
    }
     else {
      await updateDomains(data._id, dataDomains).then((res) => {
        getDataDomains();
        setVisibleForm(false)
        if (res.success === true) {
          return message.success(`Save Success! `);
        }
      });
    }
  };

  const onSearch = () => {
    getDataDomains()
  };
  const onInputChange = (e) => {};

  const handleSelectCate = (e) => {
    setSelectedCate(e);
  };

  const onEdit = (id) => {
    const dataEdit = data.filter((item) => item._id === id);
    setIdEdit(dataEdit[0]._id);
    form.setFieldsValue({
      host: dataEdit[0].name,
      _id: dataEdit[0]._id,
      brand_id: dataEdit[0].brand_id,
    });
    showDrawer();
    setDrawerTitle("Chỉnh Sửa Domains");
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
                    name="brand_id"
                    label="Thương hiệu"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập Thương hiệu!",
                      },
                      {
                        type: "brand_id",
                      },
                      {
                        type: "string",
                        min: 1,
                      },
                    ]}
                  >
                    <Select
                      showSearch
                      placeholder="Thương hiệu"
                      optionFilterProp="children"
                      style={{ width: "100%" }}
                      value={selectedCate}
                      onChange={(e) => handleSelectCate(e)}
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
            <Col lg="5">
              <div>
                <InputGroup>
                  <Input
                    // value={searchText}
                    onChange={(e) => {
                      // onInputChange(e);
                      setSearch(e.target.value)
                    }}
                    placeholder="Tìm kiếm..."
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        setSearch(e.target.value)
                        getDataDomains()
                      }
                    }}
                  />
                  <InputGroupText onClick={onSearch} style={{cursor:'pointer'}}>
                    <i className="ri-search-line" ></i>
                  </InputGroupText>
                </InputGroup>
              </div>
            </Col>

            <Col lg="7">
              <div className="text-right">
                <Button
                  onClick={() => {
                    setDrawerTitle("Thêm Redirect Mới");
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
                <Column title="Domains" dataIndex="name" key="name" />

                <Column
                  title="Thương hiệu"
                  dataIndex="_id"
                  key="_id"
                  render={(val, record) => {
                    const data = dataBrands.filter(
                      (item) => item._id === record.brand_id
                    );
                    return <>{data[0]?.name}</>;
                  }}
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
                          deleteDomains(val._id).then((res) => {
                            getDataDomains();
                            if(res.success === true){
                              return message.success(`Delete Success! `);
                            }
                            
                          });
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
