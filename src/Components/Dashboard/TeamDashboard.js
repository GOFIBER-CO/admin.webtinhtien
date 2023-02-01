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
import { Form, Space, Table, Select, Pagination, DatePicker } from "antd";
import Column from "antd/lib/table/Column";
import {
  createTeam,
  getAllBrands,
  getPagingTeams,
  updateTeam,
  deleteTeam,
  getTeamByBrand,
} from "./../../helpers/helper";
import * as XLSX from "xlsx";
import * as FileSaver from "file-saver";
import dayjs from "dayjs";
const { RangePicker } = DatePicker;
const { Option } = Select;
const TeamDashboard = () => {
  const [dataBrands, setDataBrands] = useState([]);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [count, setCount] = useState(1);
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [dateRange, setDateRange] = useState([
    dayjs().subtract(30, "days"),
    dayjs(),
  ]);
  const getDataTeams = () => {
    getPagingTeams(pageSize, pageIndex, search, [
      dateRange[0].toISOString(),
      dateRange[1].toISOString(),
    ]).then((res) => {
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

  const onSearch = () => {
    getDataTeams();
  };
  const getByBrand = async () => {
    if (selectedBrand) {
      const res = await getTeamByBrand(
        selectedBrand || "",
        pageSize,
        pageIndex,
        [dateRange[0].toISOString(), dateRange[1].toISOString()]
      );
      setData(res?.data);
    } else {
      getDataTeams();
    }
  };
  useEffect(() => {
    getByBrand();
  }, [selectedBrand]);
  const exportExcel = async () => {
    const dataReq = {
      pageSize: 10000,
      pageIndex: 1,
      search: "",
    };
    const listTeams = await getPagingTeams(10000, 1, "");
    const fileType =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const fileExtension = ".xlsx";
    const whitelistExcel = listTeams?.data?.map((item, index) => {
      let brandList = item?.brand.map((brand) => {
        return brand.name;
      });
      return {
        STT: index + 1,
        "Tên Team": item?.name,
        "Tên thương hiệu": item?.brand.map((brand) => brand?.name).toString(),
        "Tổng tiền":
          item?.total?.toLocaleString("it-IT", {
            style: "currency",
            currency: "VND",
          }) || 0,
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

  const onDateRangeChange = (dates, dateStrings) => {
    const date = [dates[0].toISOString(), dates[1].toISOString()];
    setDateRange(dates);
  };
  const handleChangeDateRange = () => {
    getDataTeams();
  };
  const handleReset = async () => {
    setDateRange([dayjs().subtract(30, "days"), dayjs()]);
    const res = await getPagingTeams(pageSize, pageIndex, search, []);
    let dataTemp = res?.data?.map((item, index) => {
      return { ...item, key: index };
    });
    setData(dataTemp);
  };
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb title="Teams" pageTitle="Quản lý Teams"></BreadCrumb>
          {console.log(selectedBrand)}
          <Row className="mb-3" style={{ alignItems: "end" }}>
            <Col lg="2" style={{ flexFlow: "column", display: "flex" }}>
              Tìm theo brand
              <Select
                allowClear
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e)}
              >
                {dataBrands?.map((item) => {
                  return (
                    <>
                      <Option value={item?._id}>{item?.name}</Option>
                    </>
                  );
                })}
              </Select>
            </Col>

            <Col lg="4">
              <div style={{ display: "flex", alignItems: "center" }}>
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
            <Col lg={4}>
              {" "}
              <Space size={15}>
                <RangePicker
                  defaultValue={dateRange}
                  value={dateRange}
                  allowClear={false}
                  onChange={onDateRangeChange}
                />
              </Space>
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
                <Column title="Teams" dataIndex="name" key="name" />

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

export default TeamDashboard;
