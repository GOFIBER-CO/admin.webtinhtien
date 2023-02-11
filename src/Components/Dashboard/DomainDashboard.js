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
import { Form, Space, Table, Select, Pagination, DatePicker } from "antd";
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
import dayjs from "dayjs";
const { RangePicker } = DatePicker;
const { Option } = Select;
const DomainDashboard = () => {
  const [form] = Form.useForm();
  const [dataTeam, setDataTeam] = useState([]);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [count, setCount] = useState(1);
  const [data, setData] = useState([]);
  const [idEdit, setIdEdit] = useState("");
  const [search, setSearch] = useState("");
  const [brandAll, setBrandAll] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("")
  const [teamList, setTeamList] = useState([])
  const [team, setTeam] = useState("")

  const getDataDomains = () => {
    getPagingDomains(pageSize, pageIndex, search, team?.key, selectedBrand?.key || "", [
      dateRange[0].toISOString(),
      dateRange[1].toISOString(),
    ]).then((res) => {
      setPageIndex(res.pageIndex);
      setPageSize(res.pageSize);
      setCount(res.count);
      setData(res.data);
    });
  };
  const getDataTeams = () => {
    getTeamAll().then((res) => {
      setDataTeam(res.data);
    });
  };

  const dataAllBrand = () => {
    getAllBrands().then((res) => {
      setBrandAll(res.data);
    });
  };

  const getTeamListByBrand = async()=>{
    if(selectedBrand?.key){
      const listTeam = await getTeamByBrand(selectedBrand?.key)
      let teamListTemp = []
      listTeam?.data?.map((item) => {
        let a = {
          key: item?._id,
          value: item?.name,
          total: item?.total,
        };
        teamListTemp.push(a);
      });
      const teamList1 = teamListTemp;
      setTeamList(teamList1)
    }
  }

  useEffect(()=>{
    getTeamListByBrand()
  },[selectedBrand?.key])

  const handleSelectTeam = (e) =>{
    setTeam(e)
  }
  useEffect(() => {
    getDataTeams();
    getDataDomains();
    dataAllBrand();
  }, [pageSize, pageIndex]);

  const onSearch = () => {
    getDataDomains();
  };

  const handleSelectBrand = (e) =>{
    setSelectedBrand(e)
  }

  const exportExcel = async () => {
    const dataReq = {
      pageSize: 10000,
      pageIndex: 1,
      search: "",
    };
    const listColab = await getPagingDomains(10000, 1, "");
    const fileType =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const fileExtension = ".xlsx";
    const whitelistExcel = listColab?.data?.map((item, index) => {
      return {
        STT: index + 1,
        "Tên Domains": item?.name,
        "Tên Team": item?.team?.name,
        "Tên thương hiệu": item?.brand?.name,
        "Tổng tiền":
          item?.total?.toLocaleString("it-IT", {
            style: "currency",
            currency: "VND",
          }) || 0,
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
  const [dateRange, setDateRange] = useState([
    dayjs().subtract(30, "days"),
    dayjs(),
  ]);
  const onDateRangeChange = (dates, dateStrings) => {
    const date = [dates[0].toISOString(), dates[1].toISOString()];
    setDateRange(dates);
  };
  const handleChangeDateRange = () => {
    getDataDomains();
  };
  const handleReset = async () => {
    setDateRange([dayjs().subtract(30, "days"), dayjs()]);
    const res = await getPagingDomains(pageSize, pageIndex, search, team?.key || "", selectedBrand?.key || "", []);
    let dataTemp = res?.data?.map((item, index) => {
      return { ...item, key: index };
    });
    setData(dataTemp);
  };

  const onClearBrand = () =>{
    setSelectedBrand({});
    setTeam({});
    setTeamList([])
  }
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Domains" pageTitle="Quản lý domains"></BreadCrumb>
          <Row className="mb-3">
            <Col lg={2}>
              <p className="custom-label">Thương hiệu</p>
              <Select
                showSearch
                style={{ width: "100%" }}
                placeholder="Search to Select"
                value={selectedBrand}
                onSelect={(key, value) => handleSelectBrand(value)}
                // options={teamList}

                allowClear
                onClear={() => onClearBrand()}
              >
                {
                  brandAll && 
                  brandAll.map((item, index)=>{
                    return (
                      <Option
                              key={item?._id}
                              value={item?._id}
                              label={item?.name}
                            >
                              {item?.name}
                            </Option>
                    )
                  })
                }
              </Select>
            </Col>
            <Col lg={2}>
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
              />
            </Col>
            <Col lg="5" style={{ marginTop: "24px" }}>
              <div>
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

            <Col lg="3">
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
              </div>
            </Col>
          </Row>
          <Row
            className="mb-3"
            style={{
              marginBottom: "10px",
              display: "flex",
            }}
          >
            <Col lg={5}>
              {" "}
              <Space size={15}>
                <RangePicker
                  defaultValue={dateRange}
                  value={dateRange}
                  allowClear={false}
                  onChange={onDateRangeChange}
                />
                <Button
                  type="primary"
                  onClick={handleChangeDateRange}
                  style={{ marginLeft: "10px" }}
                >
                  Lọc
                </Button>
                <Button
                  type="primary"
                  onClick={handleReset}
                  style={{ marginLeft: "10px" }}
                >
                  Reset
                </Button>
              </Space>
            </Col>
          </Row>
          <Row>
            <Col lg={12}>
              <Table rowKey="_id" dataSource={data} pagination={false}>
                <Column
                  title="#"
                  render={(val, rec, index) => {
                    return index + 1;
                  }}
                />
                <Column title="Domains" dataIndex="name" key="name" sorter={(a,b)=> a?.name.localeCompare(b?.name)} />

                <Column
                  title="Teams"
                  dataIndex="team"
                  key="team"
                  render={(val, record) => {
                    return <>{val?.name}</>;
                  }}
                  sorter={(a,b)=> a?.team?.name.localeCompare(b?.team?.name)}
                />
                <Column
                  title="Brands"
                  dataIndex="brand"
                  key="brand"
                  render={(val, record) => {
                    return <>{val?.name}</>;
                  }}
                  sorter={(a,b)=> a?.brand?.name.localeCompare(b?.brand?.name)}
                />
                <Column
                  title="Tổng tiền"
                  dataIndex="total"
                  key="total"
                  render={(val, record) => {
                    return (
                      <>
                        {val.toLocaleString("it-IT", {
                          style: "currency",
                          currency: "VND",
                        })}
                      </>
                    );
                  }}
                  sorter={(a,b)=> a?.total - b?.total}
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

export default DomainDashboard;
