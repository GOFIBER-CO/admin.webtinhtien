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
import moment from "moment/moment";
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
    getPagingTeams(pageSize, pageIndex, search, selectedBrand?.key || "", [
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

    exportMulti(listTeams?.data, value);
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
  const exportMulti = async (list, item) => {
    const workbook = new ExcelJS.Workbook();
    if (!item) {
      list?.map((dataSet, index) => {
        if (data?.find((x) => x?._id === dataSet?._id)) {
          const sheet = workbook.addWorksheet(`${dataSet?.name}`);
          sheet.properties.defaultRowHeight = 20;
          let optionBorder = {
            top: { color: { argb: "000000" }, style: "thin" },
            left: { color: { argb: "000000" }, style: "thin" },
            bottom: { color: { argb: "000000" }, style: "thin" },
            right: { color: { argb: "000000" }, style: "thin" },
          };
          let optionbold = {
            name: "Time New Romans",
            family: 4,
            size: 12,
            bold: true,
          };
          sheet.mergeCells("A1", "S2");
          sheet.getCell("A1").value = "Quản lý team";
          sheet.getCell("A1", "S2").font = {
            name: "Time New Romans",
            family: 4,
            size: 16,
            bold: true,
          };
          sheet.getRow(1).alignment = {
            vertical: "middle",
            horizontal: "center",
          };
          sheet.getCell("A1", "S2").border = optionBorder;
          sheet.getCell("A1", "S2").fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "ffffcc00" },
          };

          sheet.getRow(3).values = [
            "STT",
            "Team",
            "Hậu đài",
            "CTV",
            "Website",
            "Quản lý",
            "Key",
            "Chuyên mục",
            "Link docs",
            "Số từ",
            "Link đăng",
            "Giá tiền",
            "Tổng tiền theo bài",
            "Trạng thái",
            "Ngày đăng", //
            "Tổng tiền theo website",
            "STK",
            "Ngân hàng",
            "Tên TK ngân hàng",
          ];
          //BOlD HEADER
          for (let i = 1; i <= 19; i++) {
            sheet.getCell(3, Number(i)).border = optionBorder;
            sheet.getCell(3, Number(i)).font = optionbold;
          }

          sheet.getRow(3).alignment = {
            vertical: "middle",
            horizontal: "center",
          };

          sheet.columns = [
            { key: "stt" },
            {
              key: "team",
              width: 15,
              border: optionBorder,
            },
            {
              key: "brand",
              width: 20,
              border: optionBorder,
            },
            { key: "ctv", width: 15, border: optionBorder },
            { key: "domains", width: 15, border: optionBorder },
            { key: "domain_manager", width: 15, border: optionBorder },
            { key: "key", width: 20, border: optionBorder },
            { key: "category", width: 20, border: optionBorder },
            { key: "link_post", width: 20, border: optionBorder },
            { key: "number_words", border: optionBorder },
            { key: "link_posted", width: 20, border: optionBorder },
            { key: "price_per_word", border: optionBorder },
            { key: "total", width: 20, border: optionBorder },
            { key: "status", width: 20, border: optionBorder },
            { key: "updatedAt", width: 20, border: optionBorder }, //
            { key: "total_domains", width: 30, border: optionBorder },

            { key: "stk", width: 20, border: optionBorder },
            { key: "bank_name", width: 20, border: optionBorder },
            { key: "account_holder", width: 20, border: optionBorder },
          ];
          //Add dataSet
          let dataSetExport = [];
          let count = 1;
          let total = 0;
          let countCTV = 0;
          let mergeDomains = [];
          dataSet?.domains?.map((itemDomain, indexDomain) => {
            let countTotalDomains = 0;
            itemDomain?.collaborators?.map((itemColab, indexColab) => {
              countCTV = 0;
              itemColab?.linkmanagements?.map((itemLink, indexLink) => {
                countTotalDomains = countTotalDomains + itemLink?.total;
                let a = {
                  stt: count,
                  team: dataSet?.name || "",
                  brand: itemDomain?.brand?.name || "",
                  ctv: itemColab?.name || "",
                  domains: itemLink?.domains?.name || "",
                  domain_manager: itemLink?.domains?.manager || "",
                  key: itemLink?.keyword || "",
                  category: itemLink?.category || "",
                  link_post: itemLink?.link_post || "",
                  link_posted: itemLink?.link_posted || "",
                  number_words: itemLink?.number_words || "",
                  price_per_word: itemLink?.price_per_word || "",
                  total: itemLink?.total || 0,
                  status: itemLink?.status === 1 ? "Đã đăng" : "Chưa đăng",
                  updatedAt: moment(itemLink?.updatedAt).format("DD/MM/YYYY"),
                  stk: itemColab?.stk || "",
                  bank_name: itemColab?.bank_name || "",
                  account_holder: itemColab?.account_holder || "",
                  total_domains: countTotalDomains,
                };
                total = total + itemLink.total;
                dataSetExport.push(a);
                sheet.addRow(a);
                countCTV++;
                count++;
                if (
                  itemLink?.domains?._id !==
                  itemColab?.linkmanagements[indexLink + 1]?.domains?._id
                ) {
                  mergeDomains.push({
                    domain: itemLink?.domains?.name,
                    value: countTotalDomains,
                    cutoff: [
                      mergeDomains?.[mergeDomains.length - 1]?.cutoff?.[1] +
                        1 || 4,
                      count + 2,
                    ],
                  });
                  countTotalDomains = 0;
                }
                
              });
              if (itemColab?.linkmanagements.length !== 0) {
                //merge colab Name
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
                //merge colab stk
                sheet.mergeCells(
                  `Q${count + 3 - itemColab?.linkmanagements.length}:Q${
                    count + 3 - 1
                  }`
                );
                sheet.getCell(
                  `Q${count + 3 - itemColab?.linkmanagements.length}:Q${
                    count + 3 - 1
                  }`
                ).alignment = {
                  vertical: "middle",
                  horizontal: "center",
                };
                //merge colab bank
                sheet.mergeCells(
                  `R${count + 3 - itemColab?.linkmanagements.length}:R${
                    count + 3 - 1
                  }`
                );
                sheet.getCell(
                  `R${count + 3 - itemColab?.linkmanagements.length}:R${
                    count + 3 - 1
                  }`
                ).alignment = {
                  vertical: "middle",
                  horizontal: "center",
                };

                //merge colab account_holder
                sheet.mergeCells(
                  `S${count + 3 - itemColab?.linkmanagements.length}:S${
                    count + 3 - 1
                  }`
                );
                sheet.getCell(
                  `S${count + 3 - itemColab?.linkmanagements.length}:S${
                    count + 3 - 1
                  }`
                ).alignment = {
                  vertical: "middle",
                  horizontal: "center",
                };
              }  
            });
            
          });

          // for (let i = 4; i < count + 4; i++) {
          //   if (
          //     sheet.getCell(`C${i}`).value === sheet.getCell(`C${i - 1}`).value
          //   ) {
          //     yBrand++;
          //   } else {
          //     if (yBrand > xBrand) {
          //       sheet.mergeCells(`C${xBrand}:C${yBrand}`);
          //       sheet.getCell(`C${xBrand}:C${yBrand}`).alignment = {
          //         vertical: "middle",
          //         horizontal: "center",
          //       };
          //       xBrand = yBrand + 1;
          //       yBrand++;
          //     }
          //   }
          // }
          // merge brand
          let a = 4;
          let b = 4;

          for( let i = a; i < count + 3; i++){
            if(sheet.getCell(`C${i}`).value !== sheet.getCell(`C${i + 1}`).value){
              if(b !== i ){
                sheet.mergeCells(`C${b}:C${i}`);
                sheet.getCell(`C${b}:C${i}`).alignment = {
                  vertical: "middle",
                  horizontal: "center",
                };
              }else{
                  sheet.getCell(`C${b}:C${i}`).alignment = {
                    vertical: "middle",
                    horizontal: "center",
                  };
              }
              b = i + 1;
            }          
          }


          sheet.getCell(`M${count + 3}`).value =
            total.toLocaleString("it-IT", {
              style: "currency",
              currency: "VND",
            }) || 0;
          sheet.mergeCells(`B4:B${count + 2}`);
          sheet.getCell(`B4:B${count + 2}`).alignment = {
            vertical: "middle",
            horizontal: "center",
          };

          // merge domains
          mergeDomains?.map((item) => {
            if (item?.cutoff[0] < item?.cutoff[1]) {
              //merge total domains
              sheet.mergeCells(`P${item.cutoff[0]}:P${item.cutoff[1]}`);
              sheet.getCell(`P${item.cutoff[0]}:P${item.cutoff[1]}`).value =
                item?.value;
              sheet.getCell(`P${item.cutoff[0]}:P${item.cutoff[1]}`).alignment =
                {
                  vertical: "middle",
                  horizontal: "center",
                };
              //merge domains
              sheet.mergeCells(`E${item.cutoff[0]}:E${item.cutoff[1]}`);

              sheet.getCell(`E${item.cutoff[0]}:E${item.cutoff[1]}`).alignment =
                {
                  vertical: "middle",
                  horizontal: "center",
                };
              //merge manager
              sheet.mergeCells(`F${item.cutoff[0]}:F${item.cutoff[1]}`);

              sheet.getCell(`F${item.cutoff[0]}:F${item.cutoff[1]}`).alignment =
                {
                  vertical: "middle",
                  horizontal: "center",
                };
            } else {
              sheet.getCell(`P${item.cutoff[0]}`).alignment = {
                vertical: "middle",
                horizontal: "center",
              };
              sheet.getCell(`E${item.cutoff[0]}`).alignment = {
                vertical: "middle",
                horizontal: "center",
              };
              sheet.getCell(`F${item.cutoff[0]}`).alignment = {
                vertical: "middle",
                horizontal: "center",
              };
            }
          });
        }
      });
    } else {
      let dataSet = list?.find((x) => x?._id === item?._id);
      if (data?.find((x) => x?._id === dataSet?._id)) {
        const sheet = workbook.addWorksheet(`${dataSet?.name}`);
        sheet.properties.defaultRowHeight = 20;

        let optionBorder = {
          top: { color: { argb: "000000" }, style: "thin" },
          left: { color: { argb: "000000" }, style: "thin" },
          bottom: { color: { argb: "000000" }, style: "thin" },
          right: { color: { argb: "000000" }, style: "thin" },
        };
        let optionbold = {
          name: "Time New Romans",
          family: 4,
          size: 12,
          bold: true,
        };
        sheet.mergeCells("A1", "S2");
        sheet.getCell("A1").value = "Quản lý team";
        sheet.getCell("A1", "S2").font = {
          name: "Time New Romans",
          family: 4,
          size: 16,
          bold: true,
        };
        sheet.getRow(1).alignment = {
          vertical: "middle",
          horizontal: "center",
        };
        sheet.getCell("A1", "S2").border = optionBorder;
        sheet.getCell("A1", "S2").fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "ffffcc00" },
        };

        sheet.getRow(3).values = [
          "STT",
          "Team",
          "Hậu đài",
          "CTV",
          "Website",
          "Quản lý Website",
          "Key",
          "Chuyên mục",
          "Link docs",
          "Số từ",
          "Link đăng",
          "Giá tiền",
          "Tổng tiền theo bài",
          "Trạng thái",
          "Ngày đăng", //
          "Tổng tiền theo website",

          "STK",
          "Ngân hàng",
          "Tên TK ngân hàng",
        ];
        for (let i = 1; i <= 19; i++) {
          sheet.getCell(3, Number(i)).border = optionBorder;
          sheet.getCell(3, Number(i)).font = optionbold;
        }

        sheet.getRow(3).alignment = {
          vertical: "middle",
          horizontal: "center",
        };

        sheet.columns = [
          { key: "stt" },
          {
            key: "team",
            width: 15,
            border: optionBorder,
          },
          {
            key: "brand",
            width: 20,
            border: optionBorder,
          },

          { key: "ctv", width: 15, border: optionBorder },
          { key: "domains", width: 15, border: optionBorder },
          { key: "domain_manager", width: 15, border: optionBorder },
          { key: "key", width: 20, border: optionBorder },
          { key: "category", width: 20, border: optionBorder },
          { key: "link_post", width: 20, border: optionBorder },
          { key: "number_words", border: optionBorder },
          { key: "link_posted", width: 20, border: optionBorder },
          { key: "price_per_word", border: optionBorder },
          { key: "total", width: 20, border: optionBorder },
          { key: "status", width: 20, border: optionBorder },
          { key: "updatedAt", width: 20, border: optionBorder }, //
          { key: "total_domains", width: 20, border: optionBorder },

          { key: "stk", width: 20, border: optionBorder },
          { key: "bank_name", width: 20, border: optionBorder },
          { key: "account_holder", width: 20, border: optionBorder },
        ];
        //Add dataSet
        let dataSetExport = [];
        let count = 1;
        let total = 0;
        let countCTV = 0;
        let xBrand = 4;
        let yBrand = 4;
        let mergeDomains = [];

        dataSet?.domains?.map((itemDomain, indexDomain) => {
          let countTotalDomains = 0;
          itemDomain?.collaborators?.map((itemColab, indexColab) => {
            countCTV = 0;
            itemColab?.linkmanagements?.map((itemLink, indexLink) => {
              //check neu khong phai domain nay

              countTotalDomains = countTotalDomains + itemLink?.total;
              let a = {
                stt: count,
                team: dataSet?.name || "",
                brand: itemDomain?.brand?.name || "",
                ctv: itemColab?.name || "",
                domains: itemLink?.domains?.name || "",
                domain_manager: itemLink?.domains?.manager || "",
                key: itemLink?.keyword || "",
                category: itemLink?.category || "",
                link_post: itemLink?.link_post || "",
                link_posted: itemLink?.link_posted || "",
                number_words: itemLink?.number_words || "",
                price_per_word: itemLink?.price_per_word || "",
                total: itemLink?.total || 0,
                status: itemLink?.status === 1 ? "Đã đăng" : "Chưa đăng",
                updatedAt: moment(itemLink?.updatedAt).format("DD/MM/YYYY"),
                stk: itemColab?.stk || "",
                bank_name: itemColab?.bank_name || "",
                account_holder: itemColab?.account_holder || "",
                total_domains: countTotalDomains,
              };
              total = total + itemLink.total;
              dataSetExport.push(a);
              sheet.addRow(a);
              countCTV++;
              count++;
              if (
                itemLink?.domains?._id !==
                itemColab?.linkmanagements[indexLink + 1]?.domains?._id
              ) {
                mergeDomains.push({
                  domain: itemLink?.domains?.name,
                  value: countTotalDomains,
                  cutoff: [
                    mergeDomains?.[mergeDomains.length - 1]?.cutoff?.[1] + 1 ||
                      4,
                    count + 2,
                  ],
                });
                countTotalDomains = 0;
              }
            });
            if (itemColab?.linkmanagements.length !== 0) {
              //merge colab Name
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
              //merge colab stk
              sheet.mergeCells(
                `Q${count + 3 - itemColab?.linkmanagements.length}:Q${
                  count + 3 - 1
                }`
              );
              sheet.getCell(
                `Q${count + 3 - itemColab?.linkmanagements.length}:Q${
                  count + 3 - 1
                }`
              ).alignment = {
                vertical: "middle",
                horizontal: "center",
              };
              //merge colab bank
              sheet.mergeCells(
                `R${count + 3 - itemColab?.linkmanagements.length}:R${
                  count + 3 - 1
                }`
              );
              sheet.getCell(
                `R${count + 3 - itemColab?.linkmanagements.length}:R${
                  count + 3 - 1
                }`
              ).alignment = {
                vertical: "middle",
                horizontal: "center",
              };

              //merge colab account_holder
              sheet.mergeCells(
                `S${count + 3 - itemColab?.linkmanagements.length}:S${
                  count + 3 - 1
                }`
              );
              sheet.getCell(
                `S${count + 3 - itemColab?.linkmanagements.length}:S${
                  count + 3 - 1
                }`
              ).alignment = {
                vertical: "middle",
                horizontal: "center",
              };
            }
          });
        });
        // for (let i = 4; i < count + 4; i++) {
        //   if (
        //     sheet.getCell(`C${i}`).value === sheet.getCell(`C${i - 1}`).value
        //   ) {
        //     yBrand++;
        //   } else {
        //     if (yBrand > xBrand) {
        //       sheet.mergeCells(`C${xBrand}:C${yBrand}`);
        //       sheet.getCell(`C${xBrand}:C${yBrand}`).alignment = {
        //         vertical: "middle",
        //         horizontal: "center",
        //       };
        //       xBrand = yBrand + 1;
        //       yBrand++;
        //     }
        //   }
        // }
        let a = 4;
          let b = 4;

          for( let i = a; i < count + 3; i++){
            if(sheet.getCell(`C${i}`).value !== sheet.getCell(`C${i + 1}`).value){
              if(b !== i ){
                sheet.mergeCells(`C${b}:C${i}`);
                sheet.getCell(`C${b}:C${i}`).alignment = {
                  vertical: "middle",
                  horizontal: "center",
                };
              }else{
                sheet.getCell(`C${b}:C${i}`).alignment = {
                  vertical: "middle",
                  horizontal: "center",
                };
              }
              b = i + 1;
            }          
          }
        sheet.getCell(`M${count + 3}`).value =
          total.toLocaleString("it-IT", {
            style: "currency",
            currency: "VND",
          }) || 0;
        sheet.mergeCells(`B4:B${count + 2}`);
        sheet.getCell(`B4:B${count + 2}`).alignment = {
          vertical: "middle",
          horizontal: "center",
        };
        // merge domains
        mergeDomains?.map((item) => {
          if (item?.cutoff[0] < item?.cutoff[1]) {
            //merge total domains
            sheet.mergeCells(`P${item.cutoff[0]}:P${item.cutoff[1]}`);
            sheet.getCell(`P${item.cutoff[0]}:P${item.cutoff[1]}`).value =
              item?.value;
            sheet.getCell(`P${item.cutoff[0]}:P${item.cutoff[1]}`).alignment = {
              vertical: "middle",
              horizontal: "center",
            };
            //merge domains
            sheet.mergeCells(`E${item.cutoff[0]}:E${item.cutoff[1]}`);

            sheet.getCell(`E${item.cutoff[0]}:E${item.cutoff[1]}`).alignment = {
              vertical: "middle",
              horizontal: "center",
            };
            //merge manager
            sheet.mergeCells(`F${item.cutoff[0]}:F${item.cutoff[1]}`);

            sheet.getCell(`F${item.cutoff[0]}:F${item.cutoff[1]}`).alignment = {
              vertical: "middle",
              horizontal: "center",
            };
          } else {
            sheet.getCell(`P${item.cutoff[0]}`).alignment = {
              vertical: "middle",
              horizontal: "center",
            };
            sheet.getCell(`E${item.cutoff[0]}`).alignment = {
              vertical: "middle",
              horizontal: "center",
            };
            sheet.getCell(`F${item.cutoff[0]}`).alignment = {
              vertical: "middle",
              horizontal: "center",
            };
          }
        });
      }
    }

    //saver
    workbook.xlsx.writeBuffer().then(function (dataSet) {
      const blob = new Blob([dataSet], {
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
                  onClick={() => exportExcelMulti()}
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
                <Column
                  title="Teams"
                  dataIndex="name"
                  key="name"
                  sorter={(a, b) => a?.name.localeCompare(b?.name)}
                />

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
                  sorter={(a, b) => a?.total - b?.total}
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
