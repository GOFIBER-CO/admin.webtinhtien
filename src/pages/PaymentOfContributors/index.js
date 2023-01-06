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
  Modal,
} from "antd";
import { Container, Row, Col } from "reactstrap";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import "./style.css";
import { Select } from "antd";
import { AiOutlineEdit } from "react-icons/ai";
import { ImBin2, ImEye } from "react-icons/im";
import { getPaymentByDomains } from "../../helpers/helper";
import { useHistory } from "react-router-dom";
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
      const index = newData.findIndex((item) => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
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

  const handleDelete = (key) => {
    const newData = data.filter((item) => item.key !== key);
    setData(newData);
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
              onClick={() => save(record?.key)}
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
              onClick={() => history.push(`/postsLink`, record?._id)}
            >
              <ImEye />
            </Typography.Link>
            <Typography.Link
              disabled={editingKey !== ""}
              onClick={() => edit(record)}
            >
              <AiOutlineEdit />
            </Typography.Link>
            <Popconfirm
              title="Sure to delete?"
              onConfirm={() => handleDelete(record.key)}
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

  const [count, setCount] = useState(2);
  const [addModal, setAddModal] = useState(false);
  const handleAdd = () => {
    // const newData = {
    //   key: count,
    //   name: ``,
    //   age: "",
    //   address: ``,
    // };
    // setData([...data, newData]);
    // setCount(count + 1);

    setAddModal(true);
  };

  const [domainList, setDomainList] = useState([]);
  const [brandList, setBrandList] = useState([]);
  const [brand, setBrand] = useState({});
  const [domain, setDomain] = useState({});
  const [pageSize, setPageSize] = useState(10);
  const [pageIndex, setPageIndex] = useState(1);
  const [search, setSearch] = useState("");

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
  const getColapsByDomain = async () => {
    const colaps = await getPaymentByDomains(
      domain?.value,
      pageSize,
      pageIndex,
      search
    );
    setData(colaps?.data);
  };
  useEffect(() => {
    getListDomains();
    getListBrand();
    getColapsByDomain();
  }, []);
  const handleSelectBrand = (value) => {
    setBrand(value);
  };
  const handleSelectDomain = (value) => {
    setDomain(value);
  };
  const onSearch = (value) => console.log(value);
  const handleCloseModal = () => {
    setAddModal(false);
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
            <Col lg="1">
              <br />
              <Button style={{ height: 36, margin: "5px" }} type="primary">
                Lọc
              </Button>
            </Col>
          </Row>
          <Row>
            <Col lg="2">
              <p className="custom-label">Tìm kiếm</p>
              <Search
                placeholder="input search text"
                allowClear
                enterButton="Search"
                size="medium"
                onSearch={onSearch}
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
              >
                Thêm CTV
              </Button>
            </Col>
            <Col lg="2">
              <p className="custom-label">
                Tổng số tiền : {domain ? domain?.total || 0 : 0}
              </p>
            </Col>
          </Row>

          <Form form={form} component={false}>
            <Table
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
                onChange: cancel,
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
            <Row style={{ margin: 0 }}></Row>
          </Modal>
        </Container>
      </div>
    </React.Fragment>
  );
};
export default PaymentOfContributors;
