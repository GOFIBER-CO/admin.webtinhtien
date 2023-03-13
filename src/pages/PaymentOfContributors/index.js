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
  Tooltip,
} from "antd";
import { Container, Row, Col } from "reactstrap";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import "./style.css";
import { Select } from "antd";
import { AiFillFileExcel, AiOutlineEdit } from "react-icons/ai";
import { ImBin2, ImEye } from "react-icons/im";
import {
  getPaymentByDomains,
  getPagingBrands,
  getPagingDomains,
  getDomainsByBrand,
  updatePayment,
  createPayment,
  deletePayment,
  getTeamByBrand,
  getDomainByTeam,
  getAllBrand,
  getAllDomain,
  getAllDomains,
  getLoggedInUser,
} from "../../helpers/helper";
import { useHistory } from "react-router-dom";
import { format } from "echarts";
import * as XLSX from "xlsx";
import * as FileSaver from "file-saver";
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
        getColapsByDomain();
        setEditingKey("");
      } else {
        newData.push(row);
        setData(newData);
        setEditingKey("");
      }
    } catch (errInfo) {
      // console.log("Validate Failed:", errInfo);
    }
  };

  const handleDelete = async (key) => {
    await deletePayment(key._id)
      .then((res) => {
        getColapsByDomain();
        if (res.success === true) {
          return message.success("Xóa thành công");
        }
      })
      .catch((err) =>
        message.error("Cộng tác viên này còn các bài viết nên không thể xóa!")
      );
    // setData(newData);
  };

  const columns = [
    {
      title: "Domains",
      dataIndex: "domain",
      // width: "10%",
      render: (value) => {
        return value?.map((item) => item?.name)?.toString();
      },
      sorter: (a, b) => a?.domain[0]?.name.localeCompare(b?.domain[0]?.name),
    },
    {
      title: "Quản lý",
      dataIndex: "domains",
      // width: "10%",
      render: (_, record) => {
        return record?.domain?.map((item) => item?.manager)?.toString();
      },
      sorter: (a, b) =>
        a?.domain[0]?.manager?.localeCompare(b?.domain[0]?.manager),
    },
    {
      title: "Tên CTV",
      dataIndex: "name",
      // width: "10%",
      editable: true,
      sorter: (a, b) => a?.name.localeCompare(b?.name),
    },
    {
      title: "STK",
      dataIndex: "stk",
      // width: "10%",
      editable: true,
    },
    {
      title: "Tên ngân hàng",
      dataIndex: "bank_name",
      width: "10%",
      editable: true,
      sorter: (a, b) => a?.bank_name.localeCompare(b?.bank_name),
    },
    {
      title: "Tên trên thẻ",
      dataIndex: "account_holder",
      width: "10%",
      editable: true,
      sorter: (a, b) => a?.account_holder.localeCompare(b?.account_holder),
    },
    {
      title: "Số từ",
      dataIndex: "number_words",
      width: "7%",
      editable: false,
      sorter: (a, b) => a?.number_words - b?.number_words,
    },
    {
      title: "Số bài viết",
      dataIndex: "link_management_ids",
      width: "7%",
      editable: false,
      render: (value) => {
        return <>{value?.length}</>;
      },
      sorter: (a, b) =>
        a?.link_management_ids?.length - b?.link_management_ids?.length,
    },
    {
      title: "Thành tiền",
      dataIndex: "total",
      // width: "10%",
      editable: false,
      render: (value) => {
        return (
          value?.toLocaleString("it-IT", {
            style: "currency",
            currency: "VND",
          }) || 0
        );
      },
      sorter: (a, b) => a?.total - b?.total,
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      width: "10%",
      editable: true,
    },
    {
      title: "Xác nhận",
      dataIndex: "owner_confirm",
      width: "5%",
      editable: true,
      render: (value) => {
        return (
          <>
            <Tooltip placement="top" title="1 là đã xác nhận,0 là đang chờ">
              {value === 1 ? "Xác nhận" : "Đang chờ"}
            </Tooltip>
          </>
        );
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
            {/* <Typography.Link
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
            </Typography.Link> */}
            <Typography.Link
              style={{
                marginRight: 8,
              }}
              onClick={() => handleOpenModalExport(record)}
            >
              <Tooltip title="Xuất excel">
                <AiFillFileExcel />
              </Tooltip>
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
  const [teamList, setTeamList] = useState([]);
  const [brand, setBrand] = useState({});
  const [domain, setDomain] = useState({});
  const [team, setTeam] = useState({});
  const [pageSize, setPageSize] = useState(10);
  const [pageIndex, setPageIndex] = useState(1);
  const [search, setSearch] = useState("");
  const [count, setCount] = useState(1);
  const [status, setStatus] = useState("");
  const [statusTeam, setStatusTeam] = useState("");

  const getTeamListByBrand = async () => {
    if (brand?.key) {
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
      // team?.key === undefined && setTeam(teamList1[0]);
      setTeamList(teamList1);
    }
  };

  const getDomainListByTeam = async () => {
    // const listDomains = await getAllDomain();
    // let domainListTemp = [];
    //    listDomains?.data?.map((item) => {
    //     let a = {
    //       key: item?._id,
    //       value: item?.name,
    //       total: item?.total,
    //     };
    //     domainListTemp.push(a);
    //   });
    //   const domainList = domainListTemp
    //   // setDomain(domainList[0])
    //   setDomainList(domainList);

    if (team?.key) {
      const listDomains = await getDomainByTeam(
        team?.key || teamList[0]?.key,
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
      // domain?.key === undefined && setDomain(domainsList[0]);
      // data === originData && getColapsByDomain(domainsList[0]);
      setDomainList(domainsList);
    }
  };

  const getListBrand = async () => {
    const listBrand = await getAllBrand();
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

  const getColapsByDomain = async (value) => {
    const colaps = await getPaymentByDomains(
      // domain?.key || value?.key,
      pageSize || 10,
      pageIndex || 1,
      search || "",
      brand?.key || "",
      team?.key || "",
      domain?.key || ""
    );
    setData(colaps?.data);
    // setPageIndex(colaps?.pageIndex);
    // setPageSize(colaps?.pageSize);
    setCount(colaps?.count);
    //  await getPaymentByDomains(pageIndex,pageSize,search,brand?.key, team?.key
    //   , domain?.key
    //   ).then((res)=>{
    //     console.log(res, 'dadaadsa');
    //     return;
    //   setData(res?.data);
    //   setPageIndex(res?.pageIndex);
    //   setPageSize(res?.pageSize);
    //   setCount(res?.totalItem);
    //  })
  };

  useEffect(() => {
    getListBrand();
    getDomainListByTeam();
    getListDomainByTeam();
  }, []);
  useEffect(() => {
    getColapsByDomain();
  }, [pageIndex, pageSize, brand]);

  useEffect(() => {
    getTeamListByBrand();
  }, [brand?.key]);

  useEffect(() => {
    getDomainListByTeam();
  }, [team?.key]);

  const handleSelectBrand = (value) => {
    // console.log(value, 'valuesdasa');
    if (value?.key !== brand?.key) {
      setTeam({});
      setTeamList([]);
      setDomain({});
      setDomainList([]);
      setBrand(value);
    }
  };

  const handleSelectDomain = (value) => {
    if (value?.key !== domain?.key) {
      setDomain(value);
    }
    setStatus("");
  };
  const handleSelectTeam = (value) => {
    if (value?.key !== team?.key) {
      setDomain({});
      setDomainList([]);
      setTeam(value);
    }
    setStatusTeam("");
  };
  const onSearch = (value) => {
    setSearch(value);
    getColapsByDomain();
  };
  const filter = (value) => {
    getColapsByDomain();
  };

  const handleCloseModal = () => {
    formAdd.resetFields();
    setAddModal(false);
  };

  const handleFormAdd = async (value) => {
    // return ;
    let newColab = value;
    // if (!domain?.key) {
    //   setStatus("error");
    //   setStatusTeam("error");
    //   message.error("Bạn chưa chọn Team và Domains!");
    //   handleCloseModal();
    // }
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
    if (event.keyCode === "Enter") {
      ref.current.input();
    }
  };
  const exportExcel = async () => {
    const dataReq = {
      pageSize: 10000,
      pageIndex: 1,
      search: "",
    };
    // const listColab = await getPaymentByDomains(
    //   10000,
    //   1,
    //   "",
    //   brand?.key || "",
    //   team?.key || "",
    //   domain?.key || ""
    // );
    const fileType =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const fileExtension = ".xlsx";
    const whitelistExcel = data?.map((item, index) => {
      return {
        STT: index + 1,
        Domain: item?.domain?.map((item) => item.name).toString(),
        "Quản lý": item?.domain?.map((item) => item.manager).toString(),
        "Tên CTV": item?.name,
        "Số tài khoản": item?.stk,
        "Tên ngân hàng": item?.bank_name,
        "Tên trên thẻ": item?.account_holder,
        "Số lượng từ": item?.number_words,
        "Tổng số bài": item?.link_management_ids?.length || 0,
        "Tổng tiền":
          item?.total ||
          // ?.toLocaleString("it-IT", {
          //   style: "currency",
          //   currency: "VND",
          // })
          0,
        "Xác nhận": item?.owner_confirm,
      };
    });
    const ws = XLSX.utils.json_to_sheet(whitelistExcel, {
      header: ["QUẢN LÝ CỘNG TÁC VIÊN"],
    });
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const exportData = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(exportData, "CTV" + fileExtension);
  };
  const [listDomainAdd, setListDomainAdd] = useState([]);
  const getListDomainByTeam = async () => {
    const res = await getAllDomains();
    setListDomainAdd(res?.data);
  };
  const [modalExportOne, setModalExportOne] = useState(false);
  const [nameExport, setNameExport] = useState("");
  const [dataExport, setDataExport] = useState({});
  const [teamExport, setTeamExport] = useState([]);
  const [teamSelectedExport, setTeamSelectedExport] = useState({});
  const [domainExport, setDomainExport] = useState([]);
  const [domainSelectedExport, setDomainSelectedExport] = useState({});
  const [user, setUser] = useState({});
  const getUser = async () => {
    const user = await getLoggedInUser();
    if (user?.role !== "Admin") {
      setTeam({ key: user?.team?._id, value: user?.team?.name });
    }
    setUser(user);
  };
  useEffect(() => {
    getUser();
  }, []);

  const handleCloseModalExport = () => {
    setModalExportOne(false);
    setDataExport({});
  };
  const handleOpenModalExport = (data) => {
    setDataExport(data);
    setNameExport(data?.name);
    const list = data;
    let domain = data?.domain?.map((itemDomain) => {
      return {
        key: itemDomain?._id,
        value: itemDomain?.name,
        team: itemDomain?.team,
      };
    });
    let team = [];
    domain?.map((item) => {
      if (!team?.find((x) => x?.key === item?.team[0]._id)) {
        // console.log(item, "aaaa");
        team.push({ key: item?.team[0]._id, value: item?.team[0].name });
      }
    });
    setTeamSelectedExport(team?.[0]);
    setDomainExport(domain);
    setTeamExport(team);
    setModalExportOne(true);
  };
  const handleSelectExportTeam = (value) => {
    setTeamSelectedExport(value);
  };

  const exportExcelByOne = async () => {
    const fileType =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const fileExtension = ".xlsx";
    let init = {
      Team: "",
      "Tên CTV": dataExport?.name,
      "Số tài khoản": dataExport?.stk,
      "Tên ngân hàng": dataExport?.bank_name,
      "Tên trên thẻ": dataExport?.account_holder,
      "Số lượng từ": dataExport?.number_words,
      "Tổng số bài": dataExport?.link_management_ids?.length || 0,
      "Tổng tiền CTV": 0,
      // "Xác nhận": dataExport?.owner_confirm,
    };
    let linkList = [];
    if (teamSelectedExport?.key) {
      let domainList = dataExport?.domain?.filter(
        (item) => item?.team?.[0]._id === teamSelectedExport?.key
      );
      let link = dataExport?.link_management_ids?.map((item) => {
        if (domainList.find((x) => x._id === item.domain)) {
          return item;
        }
      });
      linkList = link;
      init["Team"] = teamSelectedExport?.value;
    } else {
      linkList = dataExport?.link_management_ids;
      init["Team"] = teamExport?.map((item) => item.name).toString();
    }
    let totalCTV = 0;
    let linkExportList = linkList?.map((item) => {
      totalCTV = totalCTV + item?.total;
      return {
        "Tiêu đề": item?.title,
        "Từ khóa": item?.keyword,
        "Chuyên mục": item?.category,
        "Link bài viết": item?.link_post,
        "Link bài đăng": item?.link_posted,
        "Số từ": item?.number_words,
        "Số ảnh": item?.number_images,
        "Tổng tiền":
          item?.total ||
          // ?.toLocaleString("it-IT", {
          //   style: "currency",
          //   currency: "VND",
          // })
          0,
        "Xác nhận": item?.status,
      };
    });
    init["Tổng Tiền CTV"] = totalCTV;
    // .toLocaleString("it-IT", {
    //   style: "currency",
    //   currency: "VND",
    // })
    let whitelistExcel = [init, ...linkExportList];
    const ws = XLSX.utils.json_to_sheet(whitelistExcel, {
      header: ["QUẢN LÝ CỘNG TÁC VIÊN"],
    });
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const exportData = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(exportData, "CTV" + fileExtension);
    handleCloseModalExport();
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
              <p className="custom-label">Team</p>
              <Select
                showSearch
                style={{ width: "100%" }}
                placeholder="Search to Select"
                value={team}
                onSelect={(key, value) => handleSelectTeam(value)}
                options={teamList}
                status={statusTeam}
                allowClear
                onClear={() => setTeam({})}
                disabled={user?.role !== "Admin"}
              />
            </Col>
            <Col lg="2">
              <p className="custom-label">Domains</p>
              <Select
                showSearch
                style={{ width: "100%" }}
                placeholder="Search to Select"
                value={domain}
                onSelect={(key, value) => handleSelectDomain(value)}
                options={domainList}
                status={status}
                allowClear
                onClear={() => setDomain({})}
              />
            </Col>
            <Col lg="1">
              <br />
              <Button
                style={{ height: 36, margin: "5px" }}
                type="primary"
                onClick={filter}
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
                enterButton="Search"
                size="medium"
                onSearch={onSearch}
                onKeyDown={handleKeyUp}
                ref={ref}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
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
                {domain?.total
                  ? domain?.total?.toLocaleString("it-IT", {
                      style: "currency",
                      currency: "VND",
                    }) || 0
                  : team?.total
                  ? team?.total?.toLocaleString("it-IT", {
                      style: "currency",
                      currency: "VND",
                    }) || 0
                  : brand?.total
                  ? brand?.total?.toLocaleString("it-IT", {
                      style: "currency",
                      currency: "VND",
                    }) || 0
                  : 0}
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

          <Form form={form} component={false}>
            <Table
              scroll={{ x: 1400, y: 600 }}
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
              initialValues={{
                remember: true,
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
                <Form.Item
                  label="Domain"
                  name="domain_id"
                  required
                  rules={[
                    {
                      required: true,
                      message: "không được bỏ trống Domain",
                    },
                  ]}
                >
                  <Select mode="multiple" showSearch optionFilterProp="label">
                    {listDomainAdd?.map((item) => {
                      return (
                        <>
                          <Select.Option value={item?._id} label={item?.name}>
                            {item?.name}
                          </Select.Option>
                        </>
                      );
                    })}
                  </Select>
                </Form.Item>
                <Form.Item
                  label="Tên"
                  name="name"
                  required
                  rules={[
                    {
                      required: true,
                      message: "không được bỏ trống tên!",
                    },
                  ]}
                >
                  <Input placeholder="Nhập tên CTV" />
                </Form.Item>

                <Form.Item
                  label="Số tài khoản"
                  name="stk"
                  required
                  rules={[
                    {
                      required: true,
                      message: "không được bỏ trống số tài khoản!",
                    },
                  ]}
                >
                  <Input placeholder="Nhập số tài khoản" />
                </Form.Item>
                <Form.Item
                  label="Tên trên thẻ"
                  name="account_holder"
                  required
                  rules={[
                    {
                      required: true,
                      message: "không được bỏ trống tên trên thẻ!",
                    },
                  ]}
                >
                  <Input placeholder="Nhập tên CTV" />
                </Form.Item>
                <Form.Item
                  label="Tên ngân hàng"
                  name="bank_name"
                  required
                  rules={[
                    {
                      required: true,
                      message: "không được bỏ trống tên ngân hàng!",
                    },
                  ]}
                >
                  <Input placeholder="Nhập tên ngân hàng" />
                </Form.Item>
                <Form.Item label="Ghi chú" name="note">
                  <Input.TextArea />
                </Form.Item>

                <Form.Item
                  label="Xác nhận"
                  name="owner_confirm"
                  rules={[
                    {
                      required: true,
                      message: "không được bỏ trống trạng thái!",
                    },
                  ]}
                >
                  {/* <Input placeholder="Xác nhận" /> */}
                  <Select
                    placeholder="chọn trạng thái"
                    options={[
                      {
                        value: 1,
                        label: "Xác nhận",
                      },
                      {
                        value: 2,
                        label: "Đang chờ",
                      },
                    ]}
                  />
                </Form.Item>

                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    Thêm
                  </Button>
                </Form.Item>
              </Form>
            </Row>
          </Modal>
          <Modal
            title={`Xuất excel theo cộng tác viên ${nameExport}`}
            open={modalExportOne}
            onCancel={handleCloseModalExport}
            onOk={exportExcelByOne}
          >
            Team
            <Select
              showSearch
              style={{ width: "100%" }}
              placeholder="Search to Select"
              value={teamSelectedExport}
              onSelect={(key, value) => handleSelectExportTeam(value)}
              options={teamExport}
              // status={statusTeam}
              allowClear
              onClear={() => setTeamSelectedExport({})}
            ></Select>
          </Modal>
        </Container>
      </div>
    </React.Fragment>
  );
};
export default PaymentOfContributors;
