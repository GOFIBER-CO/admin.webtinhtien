import React, { useEffect, useRef, useState } from "react";
import "antd/es/style/index";
import {
  Button,
  Form,
  Input,
  InputNumber,
  Popconfirm,
  Table,
  Typography,
  Modal,
  message,
} from "antd";
import { Container, Row, Col } from "reactstrap";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import "./style.css";
import { Select } from "antd";
import { AiOutlineEdit } from "react-icons/ai";
import { ImBin2, ImEye } from "react-icons/im";
import {
  getPaymentByDomains,
  getPagingBrands,
  getPagingDomains,
  getDomainsByBrand,
  updatePayment,
  createPayment,
  deletePayment,
} from "../../helpers/helper";
import { useHistory } from "react-router-dom";
import { format } from "echarts";
const { Search } = Input;
const originData = [];
for (let i = 0; i < 4; i++) {
  originData.push({
    key: i.toString(),
    name: "bach ",
    cardNumber: `3141000136371${i}`,
    bankName: "bach",
    address: `London Park no. ${i}`,
    customerName: "bach",
    wordCount: 0,
    postCount: 0,
    totalMoney: 0,
    note: "bach đẹp trai !",
    confirm: "Đã xác nhận",
  });
}
const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = <Input />;
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};
const PaymentOfContributors = () => {
  const history = useHistory();
  const [form] = Form.useForm();
  const [formAdd] = Form.useForm();
  const [data, setData] = useState(originData);
  const [editingKey, setEditingKey] = useState("");

  const isEditing = (record) => record._id === editingKey;

  const edit = (record) => {
    form.setFieldsValue({
      ...record,
    });
    setEditingKey(record._id);
  };
  const cancel = () => {
    setEditingKey("");
  };

  const save = async (key) => {
    try {
      const row = await form.validateFields();
      const newData = [...data];
      const index = newData.findIndex((item) => key === item._id);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        let newReq = {
          name: newData[index]?.name,
          stk: newData[index]?.stk,
          bank_name: newData[index]?.bank_name,
          account_holder: newData[index]?.account_holder,
          note: newData[index]?.note,
          owner_confirm: newData[index]?.owner_confirm,
        };
        await updatePayment(newData[index]?._id, newReq);
        setData(newData);
        setEditingKey("");
      } else {
        newData.push(row);
        setData(newData);
        setEditingKey("");
      }
    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };

  const handleDelete = async (key) => {
    await deletePayment(key._id).then((res) => {
      getColapsByDomain();
      if (res.success === true) {
        return message.success("Xóa thành công");
      }
    });
    // setData(newData);
  };

  const columns = [
    {
      title: "Tên CTV",
      dataIndex: "name",
      width: "10%",
      editable: true,
    },
    {
      title: "STK",
      dataIndex: "stk",
      width: "10%",
      editable: true,
    },
    {
      title: "Tên ngân hàng",
      dataIndex: "bank_name",
      width: "10%",
      editable: true,
    },
    {
      title: "Tên trên thẻ",
      dataIndex: "account_holder",
      width: "10%",
      editable: true,
    },
    {
      title: "Tổng số từ",
      dataIndex: "number_words",
      width: "5%",
      editable: false,
    },
    {
      title: "Tổng số bài viết",
      dataIndex: "link_management_ids",
      width: "5%",
      editable: false,
      render: (value) => {
        return <>{value?.length}</>;
      },
    },
    {
      title: "Thành tiền",
      dataIndex: "total",
      width: "10%",
      editable: false,
      render: (value) => {
        return (
          value?.toLocaleString("it-IT", {
            style: "currency",
            currency: "VND",
          }) || 0
        );
      },
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      width: "20%",
      editable: true,
    },
    {
      title: "Xác nhận",
      dataIndex: "owner_confirm",
      width: "5%",
      editable: true,
      render: (value) => {
        return <>{value}</>;
      },
    },
    {
      title: "Hành động",
      dataIndex: "operation",
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link
              onClick={() => save(record?._id)}
              style={{
                marginRight: 8,
              }}
            >
              Save
            </Typography.Link>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <a>Cancel</a>
            </Popconfirm>
          </span>
        ) : (
          <>
            <Typography.Link
              disabled={editingKey !== ""}
              onClick={() =>
                history.push(`/postsLink`, [
                  { key: record?._id, value: record?.name },
                  domain,
                  brand,
                ])
              }
            >
              <ImEye />
            </Typography.Link>
            <Typography.Link
              disabled={editingKey !== ""}
              onClick={() => edit(record)}
              style={{ marginRight: "7px", marginLeft: "7px" }}
            >
              <AiOutlineEdit />
            </Typography.Link>
            <Popconfirm
              title="Sure to delete?"
              onConfirm={() => handleDelete(record)}
            >
              <ImBin2
                style={{
                  color: "#e93600",
                  cursor: "pointer",
                  marginLeft: "5px",
                }}
              />
            </Popconfirm>
          </>
        );
      },
    },
  ];
  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.dataIndex,
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  const [addModal, setAddModal] = useState(false);
  const handleAdd = () => {
    setAddModal(true);
  };

  const [domainList, setDomainList] = useState([]);
  const [brandList, setBrandList] = useState([]);
  const [brand, setBrand] = useState({});
  const [domain, setDomain] = useState({});
  const [pageSize, setPageSize] = useState(10);
  const [pageIndex, setPageIndex] = useState(1);
  const [search, setSearch] = useState("");
  const [count, setCount] = useState(1);

  const getDomainByBrand = async () => {
    const listDomains = await getDomainsByBrand(
      brand?.key || brandList[0]?.key
    );
    let domainListTemp = [];
    listDomains?.data?.map((item) => {
      let a = {
        key: item?._id,
        value: item?.name,
        total: item?.total,
      };
      domainListTemp.push(a);
    });

    const domainsList = domainListTemp;
    domain?.key === undefined && setDomain(domainsList[0]);
    setDomainList(domainsList);
  };

  const getListBrand = async () => {
    const listBrand = await getPagingBrands(10000, 1, "");
    let brandList = [];
    listBrand?.data?.map((item) => {
      let a = {
        key: item?._id,
        value: item?.name,
      };
      brandList.push(a);
    });
    brand?.key === undefined && setBrand(brandList[0]);
    setBrandList(brandList);
  };

  const getColapsByDomain = async () => {
    const colaps = await getPaymentByDomains(
      domain?.key,
      pageSize,
      pageIndex,
      search
    );
    console.log(colaps, "data");
    setData(colaps?.data);
    setPageIndex(colaps?.pageIndex);
    setPageSize(colaps?.pageSize);
    setCount(colaps?.count);
  };

  useEffect(() => {
    getListBrand();
    getDomainByBrand();
    getColapsByDomain();
  }, [pageIndex, pageSize]);

  useEffect(() => {
    getDomainByBrand();
  }, [brand?.key]);

  const handleSelectBrand = (value) => {
    setBrand(value);
    setDomain({});
  };

  const handleSelectDomain = (value) => {
    setDomain(value);
  };

  const onSearch = (value) => {
    setSearch(value);
    getColapsByDomain();
  };

  const handleCloseModal = () => {
    formAdd.resetFields();
    setAddModal(false);
  };

  const handleFormAdd = async (value) => {
    let newColab = value;
    newColab.domain_id = domain?.key;
    const res = await createPayment(newColab);
    getColapsByDomain();
    if (res.success === true) {
      message.success("Thêm thành công!");
      handleCloseModal();
    } else {
      alert("Có lỗi kìa!");
    }
  };
  const ref = useRef();
  const handleKeyUp = (event) => {
    // console.log(event, 'event');
    if (event.keyCode === "Enter") {
      // console.log(ref,'re');
      ref.current.input();
    }
  };
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Quản lý CTV" pageTitle="CTV" slug="domains" />
          <Row>
            <Col lg="2">
              <p className="custom-label">Tên thương hiệu</p>
              <Select
                className="search-payment"
                showSearch
                style={{ width: "100%" }}
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
                style={{ width: "100%" }}
                placeholder="Search to Select"
                value={domain}
                onSelect={(key, value) => handleSelectDomain(value)}
                options={domainList}
              />
            </Col>
            <Col lg="1">
              <br />
              <Button
                style={{ height: 36, margin: "5px" }}
                type="primary"
                onClick={getColapsByDomain}
              >
                Lọc
              </Button>
            </Col>
          </Row>
          <Row>
            <Col lg="3">
              <p className="custom-label">Tìm kiếm</p>
              <Search
                placeholder="input search text"
                allowClear
                enterButton="Search"
                size="medium"
                onSearch={onSearch}
                onKeyDown={handleKeyUp}
                ref={ref}
              />
            </Col>

            {/* <Col lg="1">
              <br />
              <Button style={{ height: 36, margin: "5px" }} type="primary">
                Lọc
              </Button>
            </Col> */}
          </Row>
          <Row style={{ marginTop: "10px" }}>
            <Col lg="2">
              <Button
                onClick={handleAdd}
                type="primary"
                style={{
                  marginBottom: 16,
                }}
                disabled={!domain}
              >
                Thêm CTV
              </Button>
            </Col>
            <Col lg="2">
              <p className="custom-label">
                Tổng số tiền :{" "}
                {domain
                  ? domain?.total?.toLocaleString("it-IT", {
                      style: "currency",
                      currency: "VND",
                    }) || 0
                  : 0}
              </p>
            </Col>
          </Row>

          <Form form={form} component={false}>
            <Table
              scroll={{ x: 1300, y: 600 }}
              components={{
                body: {
                  cell: EditableCell,
                },
              }}
              bordered
              dataSource={data}
              columns={mergedColumns}
              rowClassName="editable-row"
              pagination={{
                current: pageIndex,
                total: count,
                defaultCurrent: pageIndex,
                pageSize: pageSize,
                showSizeChanger: true,
                onChange: (page, pageSize) => {
                  setPageIndex(page);
                  setPageSize(pageSize);
                },
              }}
            />
          </Form>
          <Modal
            title="Thêm Cộng tác viên"
            open={addModal}
            onOk={handleCloseModal}
            onCancel={handleCloseModal}
            footer={false}
          >
            <Row style={{ margin: 0 }}>
              <Form
                layout="vertical"
                form={formAdd}
                initialValues={{ layout: formAdd }}
                onFinish={handleFormAdd}
              >
                <Form.Item label="Tên" name="name" required>
                  <Input placeholder="Nhập tên CTV" />
                </Form.Item>
                <Form.Item label="Số tài khoản" name="stk" required>
                  <Input placeholder="Nhập số tài khoản" />
                </Form.Item>
                <Form.Item label="Tên trên thẻ" name="account_holder" required>
                  <Input placeholder="Nhập tên CTV" />
                </Form.Item>
                <Form.Item label="Tên ngân hàng" name="bank_name" required>
                  <Input placeholder="Nhập tên ngân hàng" />
                </Form.Item>
                <Form.Item label="Ghi chú" name="note" required>
                  <Input.TextArea />
                </Form.Item>
                <Form.Item label="Xác nhận" name="owner_confirm">
                  <Input placeholder="Xác nhận" />
                </Form.Item>

                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    Thêm
                  </Button>
                </Form.Item>
              </Form>
            </Row>
          </Modal>
        </Container>
      </div>
    </React.Fragment>
  );
};
export default PaymentOfContributors;
