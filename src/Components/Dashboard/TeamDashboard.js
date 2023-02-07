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
  Pagination,
  DatePicker,
  Typography,
  Tooltip,
} from "antd";
import Column from "antd/lib/table/Column";
import {
  createTeam,
  getAllBrands,
  getPagingTeams,
  updateTeam,
  deleteTeam,
  getTeamByBrand,
  getStatisticTeam,
} from "./../../helpers/helper";
import * as XLSX from "xlsx";
import * as FileSaver from "file-saver";
import dayjs from "dayjs";
import { AiFillFileExcel } from "react-icons/ai";
import { forEach } from "lodash";
import { list } from "postcss";
const ExcelJS = require("exceljs");
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
  const handleExportExcelOne = async (value) => {
    const dataReq = {
      pageSize: 10000,
      pageIndex: 1,
      search: "",
    };
    const listTeams = await getStatisticTeam(value?._id);
    // const fileType =
    //   "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    // const fileExtension = ".xlsx";
    // const whitelistExcel = listTeams?.data?.map((item, index) => {
    //   let brandList = item?.brand.map((brand) => {
    //     return brand.name;
    //   });
    //   return {
    //     STT: index + 1,
    //     "Tên Team": item?.name,
    //     "Tên thương hiệu": item?.brand.map((brand) => brand?.name).toString(),
    //     "Tổng tiền":
    //       item?.total?.toLocaleString("it-IT", {
    //         style: "currency",
    //         currency: "VND",
    //       }) || 0,
    //   };
    // });

    // const ws = XLSX.utils.json_to_sheet(whitelistExcel, {
    //   header: ["QUẢN LÝ TEAMS"],
    // });
    // const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    // const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    // const data = new Blob([excelBuffer], { type: fileType });
    // FileSaver.saveAs(data, "Teams" + fileExtension);
  };
  const exportExcelMulti = async (value) => {
    const listTeams = await getStatisticTeam(value?._id);
    // listTeams?.data?.map(async (item, index) => {
    //   await exportOne(item, index);
    // });
    exportMulti(listTeams?.data);
  };
  const exportOne = async (data, index) => {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Team");
    sheet.properties.defaultRowHeight = 20;

    let optionBorder = {
      top: { color: { argb: "000000" }, style: "thin" },
      left: { color: { argb: "000000" }, style: "thin" },
      bottom: { color: { argb: "000000" }, style: "thin" },
      right: { color: { argb: "000000" }, style: "thin" },
    };
    sheet.mergeCells("A1", "L2");
    sheet.getCell("A1").value = "Quản lý team";
    sheet.getCell("A1", "L2").font = {
      name: "Time New Romans",
      family: 4,
      size: 16,
      bold: true,
    };
    sheet.getRow(1).alignment = { vertical: "center", horizontal: "center" };
    sheet.getCell("A1", "L2").border = optionBorder;
    sheet.getCell("A1", "L2").fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "ffffcc00" },
    };
    sheet.getRow(3).values = [
      "STT",
      "Team",
      "Hậu đài",
      "CTV",
      "Key",
      "Chuyên mục",
      "Link docs",
      "Link đăng",
      "Số từ",
      "Giá tiền",
      "Tổng tiền theo bài",
      "Trạng thái",
    ];
    for (let i = 1; i <= 12; i++) {
      sheet.getCell(3, Number(i)).border = optionBorder;
    }

    sheet.getRow(3).alignment = { vertical: "center", horizontal: "center" };

    sheet.columns = [
      { key: "stt" },
      {
        key: "team",
        width: 10,
        border: optionBorder,
      },
      { key: "brand", width: 20, border: optionBorder },
      { key: "ctv", width: 20, border: optionBorder },
      { key: "key", width: 15, border: optionBorder },
      { key: "category", width: 20, border: optionBorder },
      { key: "link_post", width: 20, border: optionBorder },
      { key: "link_posted", width: 20, border: optionBorder },
      { key: "number_words", border: optionBorder },
      { key: "price_per_word", border: optionBorder },
      { key: "total", width: 20, border: optionBorder },
      { key: "status", width: 20, border: optionBorder },
    ];
    //Add data
    let dataExport = [];
    data?.domains?.map((itemDomain) => {
      itemDomain?.collaborators?.map((itemColab) => {
        itemColab?.linkmanagements?.map((itemLink) => {
          let a = {
            stt: index,
            team: data?.name || "",
            brand: itemDomain?.brand?.name || "",
            ctv: itemColab?.name || "",
            key: itemLink?.keyword || "",
            category: itemLink?.category || "",
            link_post: itemLink?.link_post || "",
            link_posted: itemLink?.link_posted || "",
            number_words: itemLink?.number_words || "",
            price_per_word: itemLink?.price_per_word || "",
            total: itemLink?.total || "",
            status: itemLink?.status === 1 ? "Đã đăng" : "Chưa đăng",
          };
          dataExport.push(a);
          sheet.addRow(a);
        });
      });
    });
    console.log(dataExport);

    //saver
    workbook.xlsx.writeBuffer().then(function (dataExport) {
      const blob = new Blob([dataExport], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = "download.xlsx";
      anchor.click();
      window.URL.revokeObjectURL(url);
    });
  };
  const exportMulti = async (list) => {
    const workbook = new ExcelJS.Workbook();
    list?.map((data, index) => {
      const sheet = workbook.addWorksheet(`${data?.name}`);
      sheet.properties.defaultRowHeight = 20;

      let optionBorder = {
        top: { color: { argb: "000000" }, style: "thin" },
        left: { color: { argb: "000000" }, style: "thin" },
        bottom: { color: { argb: "000000" }, style: "thin" },
        right: { color: { argb: "000000" }, style: "thin" },
      };
      sheet.mergeCells("A1", "L2");
      sheet.getCell("A1").value = "Quản lý team";
      sheet.getCell("A1", "L2").font = {
        name: "Time New Romans",
        family: 4,
        size: 16,
        bold: true,
      };
      sheet.getRow(1).alignment = { vertical: "middle", horizontal: "center" };
      sheet.getCell("A1", "L2").border = optionBorder;
      sheet.getCell("A1", "L2").fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "ffffcc00" },
      };

      sheet.getRow(3).values = [
        "STT",
        "Team",
        "Hậu đài",
        "CTV",
        "Key",
        "Chuyên mục",
        "Link docs",
        "Link đăng",
        "Số từ",
        "Giá tiền",
        "Tổng tiền theo bài",
        "Trạng thái",
      ];
      for (let i = 1; i <= 12; i++) {
        sheet.getCell(3, Number(i)).border = optionBorder;
      }

      sheet.getRow(3).alignment = { vertical: "middle", horizontal: "center" };

      sheet.columns = [
        { key: "stt" },
        {
          key: "team",
          width: 15,
          border: optionBorder,
        },
        { key: "brand", width: 20, border: optionBorder },
        { key: "ctv", width: 20, border: optionBorder },
        { key: "key", width: 20, border: optionBorder },
        { key: "category", width: 20, border: optionBorder },
        { key: "link_post", width: 20, border: optionBorder },
        { key: "link_posted", width: 20, border: optionBorder },
        { key: "number_words", border: optionBorder },
        { key: "price_per_word", border: optionBorder },
        { key: "total", width: 20, border: optionBorder },
        { key: "status", width: 20, border: optionBorder },
      ];
      //Add data
      let dataExport = [];
      let count = 1;
      let total = 0;
      let countCTV = 0;
      let xBrand = 4;
      let yBrand = 4;
      data?.domains?.map((itemDomain, indexDomain) => {
        itemDomain?.collaborators?.map((itemColab, indexColab) => {
          countCTV = 0;

          itemColab?.linkmanagements?.map((itemLink, indexLink) => {
            let a = {
              stt: count,
              team: data?.name || "",
              brand: itemDomain?.brand?.name || "",
              ctv: itemColab?.name || "",
              key: itemLink?.keyword || "",
              category: itemLink?.category || "",
              link_post: itemLink?.link_post || "",
              link_posted: itemLink?.link_posted || "",
              number_words: itemLink?.number_words || "",
              price_per_word: itemLink?.price_per_word || "",
              total:
                itemLink?.total.toLocaleString("it-IT", {
                  style: "currency",
                  currency: "VND",
                }) || 0,
              status: itemLink?.status === 1 ? "Đã đăng" : "Chưa đăng",
            };
            total = total + itemLink.total;
            dataExport.push(a);
            sheet.addRow(a);
            countCTV++;
            count++;
            if (
              itemDomain?.brand?._id ===
              data?.domains[indexDomain - 1]?.brand?._id
            ) {
              yBrand++;
              console.log(itemDomain, xBrand, yBrand);
            } else {
              if (yBrand > xBrand) {
                sheet.mergeCells(`C${xBrand}:C${yBrand}`);
                xBrand = yBrand + 1;
              }
            }
          });
          if (itemColab?.linkmanagements.length !== 0) {
            sheet.mergeCells(
              `D${count + 3 - itemColab?.linkmanagements.length}:D${
                count + 3 - 1
              }`
            );
            sheet.getCell(
              `D${count + 3 - itemColab?.linkmanagements.length}:D${
                count + 3 - 1
              }`
            ).alignment = {
              vertical: "middle",
              horizontal: "center",
            };
          }
        });
      });
      sheet.mergeCells(`B4:B${count + 2}`);
      sheet.getCell(`B4:B${count + 2}`).alignment = {
        vertical: "middle",
        horizontal: "center",
      };
    });
    //saver
    workbook.xlsx.writeBuffer().then(function (dataExport) {
      const blob = new Blob([dataExport], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = "team.xlsx";
      anchor.click();
      window.URL.revokeObjectURL(url);
    });
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
                          color: { argb: "000000" },
                          style: "thick",
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
                <Column
                  title="Hành động"
                  dataIndex="_id"
                  key="action"
                  render={(val, record) => {
                    return (
                      <Tooltip title="Xuất excel">
                        <AiFillFileExcel
                          style={{ color: "green", cursor: "pointer" }}
                          // onClick={() => handleExportExcelOne(record)}
                          onClick={() => exportExcelMulti(record)}
                        />
                      </Tooltip>
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
