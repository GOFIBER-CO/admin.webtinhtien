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
import { Space, Table, Select, Popconfirm, notification } from "antd";
import { Link } from "react-router-dom";
import { error, success } from "../../Components/Common/message";
import {
  addTag,
  deleteTag,
  deleteTaxonomy,
  getPagingTags,
  searchtag,
  searchTaxonomy,
  updateTag,
} from "../../helpers/helper";
import "../../App.css";
import { Drawer } from "antd";
// import { Form } from "reactstrap";
import { message } from "antd";
import { Form } from "antd";
import { Tooltip } from "antd";
import { EditOutlined } from "@ant-design/icons";
import toSlug from "../../common/function";
const { Column } = Table;
const { Option } = Select;
function TagsList() {
  const [taxonomies, setTaxonomies] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [pageIndex, setPageIndex] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [drawerTitle, setDrawerTitle] = useState("");
  const [form] = Form.useForm();
  const [visibleForm, setVisibleForm] = useState(false);
  const [isNoIndex, setIsNoIndex] = useState(false);
  const [isNoFlow, setIsNoFlow] = useState(false);
  const getTaxonomies = (size, index) => {
    getPagingTags(size, index).then((res) => {
      console.log(res);
      setTaxonomies(res.docs);
      setTotalPage(res.totalDocs);
    });
  };

  useEffect(() => {
    getTaxonomies(10, 1);
    setPageIndex(1);
  }, []);
  const handleChangeNoIndex = () => {
    setIsNoIndex(!isNoIndex);
  };
  const handleChangeNoFlow = () => {
    setIsNoFlow(!isNoFlow);
  };
  const onClose = () => {
    setVisibleForm(false);
  };
  const onFinish = async (data) => {
    const dataReq = {
      name: data.tagName,
      slug: data.tagSlug,
      isNoFlow: isNoFlow,
      isNoIndex: isNoIndex,
    };

    if (!data.id) {
      //Save
      dataReq.id = Math.floor(Math.random() * 10000) + 10000;
      const dataRes = await addTag(dataReq);
      dataRes.status === 1
        ? message.success(`Save Success! ${dataRes.message}`)
        : message.error(`Save Failed! ${dataRes.message}`);
      if (dataRes.status === 1) {
        onClose();
      }
    } else {
      //Update
      const dataRes = await updateTag(data.id, dataReq);
      dataRes.status === 1
        ? message.success(`Update Success! ${dataRes.message}`)
        : message.error(`Update Failed! ${dataRes.message}`);
      if (dataRes.status === 1) {
        onClose();
      }
    }

    form.resetFields();
    getTaxonomies(pageSize, pageIndex);
    // setListTag(dataRes);
  };
  const handleRefreshCreate = async () => {
    form.resetFields();
  };
  const onEdit = (key) => {
    const dataEdit = taxonomies.filter((item) => item._id === key);
    form.setFieldsValue({
      tagName: dataEdit[0].name,
      tagSlug: dataEdit[0].slug,
      id: dataEdit[0]._id,
    });
    setIsNoFlow(dataEdit[0].isNoFlow);
    setIsNoIndex(dataEdit[0].isNoIndex);
    showDrawer();
    setDrawerTitle("Chỉnh Sửa Tag");
  };
  const showDrawer = () => {
    setVisibleForm(true);
  };
  const onInputChange = (e) => {
    setSearchText(e.target.value);
    searchtag(e.target.value)
      .then((res) => {
        setTaxonomies(res.docs);
        setTotalPage(res.totalDocs);
      })
      .catch((error) => {
        notification["error"]({
          message: "System error",
          description: error,
        });
      });
  };
  const onSearch = () => {
    if (!searchText) {
      getTaxonomies(pageSize, pageIndex);
    }
    searchtag(searchText)
      .then((res) => {
        const formatRes = res.map((tax) => ({
          ...tax,
          key: tax._id,
        }));
        setTaxonomies(formatRes);
      })
      .catch((error) => {
        notification["error"]({
          message: "System error",
          description: error,
        });
      });
  };
  const onFinishFailed = () => {
    // message.error("Save failed!");
  };
  const handleOnChangeTable = ({ current, pageSize, total }) => {
    setPageIndex(current);
    setPageSize(pageSize);
    getTaxonomies(pageSize, current);
    // setTotalPage(total);
  };
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Thẻ" pageTitle="Chuyên mục" />
          <Row className="mb-3">
            <Drawer
              title={drawerTitle}
              placement={"right"}
              width={"30%"}
              onClose={onClose}
              visible={visibleForm}
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
                      name="tagName"
                      label="Tên Tag"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập tên tag!",
                        },
                        {
                          type: "tagName",
                        },
                        {
                          type: "string",
                          min: 1,
                        },
                      ]}
                    >
                      <Input
                        placeholder="Nhập tên tag"
                        name="tagName"
                        allowClear={true}
                        onChange={(e) =>
                          form.setFieldsValue({
                            tagSlug: toSlug(e.target.value),
                          })
                        }
                        // onChange={(e) => handleChangeTitle(e.target.value)}
                      />
                    </Form.Item>

                    <Form.Item
                      name="tagSlug"
                      label="Tag Slug"
                      rules={[
                        {
                          required: true,
                          message: "Please input tag slug!",
                        },
                        {
                          type: "tagSlug",
                        },
                        {
                          type: "string",
                          min: 1,
                        },
                      ]}
                    >
                      <Input
                        placeholder="Enter tag slug"
                        name="tagSlug"
                        allowClear={true}
                      />
                    </Form.Item>
                  </Col>
                  <Row>
                    <Form.Item
                      name="isNoIndex"
                      label="is No Index"
                      rules={[
                        {
                          required: false,
                          // message: "Please menu is Show!",
                        },
                        {
                          type: "isNoIndex",
                        },
                      ]}
                      className="item-checkbox"
                    >
                      <Input
                        type="checkbox"
                        checked={isNoIndex}
                        onChange={handleChangeNoIndex}
                        allowClear={true}
                      />
                    </Form.Item>
                  </Row>
                  <Row>
                    <Form.Item
                      name="isNoFlow"
                      label="is No Flow"
                      rules={[
                        {
                          required: false,
                          // message: "Please menu is Show!",
                        },
                        {
                          type: "isNoFlow",
                        },
                      ]}
                      className="item-checkbox"
                    >
                      <Input
                        type="checkbox"
                        checked={isNoFlow}
                        onChange={handleChangeNoFlow}
                        allowClear={true}
                      />
                    </Form.Item>
                  </Row>
                </Row>
                <Form.Item>
                  <Space>
                    <Button type="primary" htmlType="submit">
                      Save
                    </Button>

                    <Button
                      type="primary"
                      htmlType="button"
                      onClick={() => handleRefreshCreate()}
                    >
                      Refresh
                    </Button>
                  </Space>
                </Form.Item>
              </Form>
            </Drawer>
            <Col lg="5">
              <div>
                <InputGroup>
                  <Input
                    value={searchText}
                    onChange={(e) => {
                      onInputChange(e);
                    }}
                    placeholder="Tìm kiếm..."
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        console.log(e.target.value);
                      }
                    }}
                  />
                  <InputGroupText>
                    <i className="ri-search-line" onClick={onSearch}></i>
                  </InputGroupText>
                </InputGroup>
              </div>
            </Col>

            <Col lg="7">
              <div className="text-right">
                <Button
                  onClick={() => {
                    setDrawerTitle("Thêm Tag Mới");
                    showDrawer();
                    console.log(visibleForm);
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
                dataSource={taxonomies}
                pagination={{
                  total: totalPage,
                  pageSize: pageSize,
                  current: pageIndex,
                }}
                onChange={(e) => handleOnChangeTable(e)}
              >
                <Column
                  title="#"
                  render={(val, rec, index) => {
                    return index + 1;
                  }}
                />
                <Column title="Tên" dataIndex="name" key="name" />
                {/* <Column
                  title="Mô tả"
                  dataIndex="tax_description"
                  key="tax_description"
                  render={(val) => {
                    return (
                      <div>
                        <span dangerouslySetInnerHTML={{ __html: val }}></span>
                      </div>
                    );
                  }}
                /> */}
                {/* <Column title="Loại" dataIndex="tax_type" key="tax_type" /> */}
                <Column title="Đường dẫn tĩnh" dataIndex="slug" key="slug" />
                <Column
                  title="Hoạt động"
                  key="action"
                  render={(val, record) => (
                    <Space size="middle">
                      {/* <Link to={{ pathname: "/taxonomy/" + val.tax_slug }}>View</Link> */}
                      {/* <Tooltip title="View">
                        <i
                          className="ri-eye-line action-icon"
                          style={{ color: "blue" }}
                          onClick={() => onEdit(val._id)}
                        ></i>
                      </Tooltip> */}

                      {/* <Link to={{ pathname: "/taxonomy/add/" + val.tax_slug}}>Edit</Link> */}
                      <Tooltip title="Edit">
                        <i
                          className="ri-pencil-line action-icon"
                          style={{ color: "blue" }}
                          onClick={() => onEdit(val._id)}
                        ></i>
                      </Tooltip>
                      {/* <Tooltip title="Edit">
                        <Button
                          type="primary"
                          shape="circle"
                          icon={<EditOutlined />}
                          size="small"
                          onClick={() => onEdit(val._id)}
                        />
                      </Tooltip> */}
                      <Popconfirm
                        title="Are you sure to delete this user?"
                        onConfirm={() => {
                          deleteTag(val._id).then(() => {
                            getTaxonomies(pageSize, pageIndex);
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
            </Col>
          </Row>
        </Container>
      </div>

      {/* <Modal
        title="Add Taxonomy"
        okText="Save"
        visible={isModalAddTaxonomyVisible}
        onOk={addNewTaxonomy}
        onCancel={() => setIsModalVisible(false)}
        width="680px"
      >
        <div>
          <Form>
            <Row>
              <Col lg={6}>
                <FormGroup>
                  <Label className="mb-1" for="Taxonomy_type">
                    Taxonomy type
                  </Label>
                  <Input
                    id="Taxonomy_type"
                    name="Taxonomy_type"
                    placeholder="Taxonomy type"
                    type="text"
                    value={formVal.Taxonomy_type}
                    onChange={onInputChange}
                  />
                </FormGroup>
              </Col>
              <Col lg={6}>
                <FormGroup>
                  <Label className="mb-1" for="Taxonomy_script">
                    Taxonomy script
                  </Label>
                  <Input
                    id="Taxonomy_script"
                    name="Taxonomy_script"
                    placeholder="Taxonomy script"
                    type="text"
                    value={formVal.Taxonomy_script}
                    onChange={onInputChange}
                  />
                </FormGroup>
              </Col>
              <Col lg={12}>
                <FormGroup>
                  <Label className="mb-1" for="post_id">
                    Posts
                  </Label>
                  <Select
                    mode="multiple"
                    size="large"
                    name="post_id"
                    id="post_id"
                    value={formVal.post_id}
                    onChange={onPostChange}
                    placeholder="Posts"
                    style={{ width: "100%" }}
                  >
                    {posts.map((post) => {
                      return (
                        <Option key={post._id} value={post._id}>{post.post_title}</Option>
                      );
                    })}
                  </Select>
                </FormGroup>
              </Col>
            </Row>
          </Form>
        </div>
      </Modal> */}
    </React.Fragment>
  );
}

export default TagsList;
