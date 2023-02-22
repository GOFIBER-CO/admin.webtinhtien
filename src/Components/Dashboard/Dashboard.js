import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import {
  Select,
  Table,
  Input,
  Row,
  Col,
  Button,
  DatePicker,
  Space,
} from "antd";
import {
  getPagingBrands,
  getColabByBrand,
  getPagingDomains,
  getStatisticByBrand,
} from "../../helpers/helper";
import dayjs from "dayjs";
import * as XLSX from "xlsx";
import * as FileSaver from "file-saver";

const { Search } = Input;
const { RangePicker } = DatePicker;

const styles = () => ({
  root: {
    flexGrow: 1,
  },
});

const columns = [
  {
    title: "Tên thương hiệu",
    dataIndex: "name",
    key: "name",
    sorter: (a, b) => a?.name.localeCompare(b?.name),
  },
  {
    title: "Tổng tiền",
    dataIndex: "total",
    key: "total",
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
  // {
  //   title: <button onClick={(e)=> console.log(e)}>Xuất Excel chi tiết</button>
  // }
];

const Dashboard = (props) => {
  const { classes } = props;
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [dataSearch, setDataSearch] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [pageIndex, setPageIndex] = useState(1);
  const [dateRange, setDateRange] = useState([
    dayjs().subtract(30, "days"),
    dayjs(),
  ]);
  // const getColabByBrandId = async () => {
  //   const res = await getColabByBrand("");
  //   let dataTemp = res?.data?.map((item, index) => {
  //     return { ...item, key: index };
  //   });
  //   setData(dataTemp);
  // };
  const getStatistic = async () => {
    const res = await getStatisticByBrand("", dateRange);
    let dataTemp = res?.data?.map((item, index) => {
      return { ...item, key: index };
    });
    setData(dataTemp);
  };
  useEffect(() => {
    getStatistic();
  }, []);
  const handleReset = async () => {
    setDateRange([dayjs().subtract(30, "days"), dayjs()]);
    const res = await getStatisticByBrand("", []);
    let dataTemp = res?.data?.map((item, index) => {
      return { ...item, key: index };
    });
    setData(dataTemp);
  };
  const expandedRowRender = (data) => {
    const dataTemp = data?.team?.map((item, index) => {
      return { ...item, key: index };
    });
    const expandedRowRender = (dataTeam) => {
      const dataDomains = dataTeam?.domains?.map((item, index) => {
        return { ...item, key: index };
      });
      const expandedRowRender = (dataColab) => {
        const dataColabTemp = dataColab?.collaborators?.map((item, index) => {
          return { ...item, key: index };
        });
        const columns = [
          {
            title: "STT",
            dataIndex: "key",
          },
          {
            title: "Tên CTV",
            dataIndex: "name",
            key: "name",
          },
          {
            title: "Tổng số bài",
            dataIndex: "link_management_ids",
            key: "link_management_ids",
            render: (value) => {
              return <>{value.length}</>;
            },
          },
          {
            title: "Tổng số tiền",
            dataIndex: "total",
            key: "total",
            render: (value) => {
              return (
                value?.toLocaleString("it-IT", {
                  style: "currency",
                  currency: "VND",
                }) || 0
              );
            },
          },
        ];
        return (
          <div>
            <Table
              style={{ marginLeft: "50px" }}
              columns={columns}
              dataSource={dataColabTemp}
              pagination={false}
            />
          </div>
        );
      };
      const columns = [
        {
          title: "STT",
          dataIndex: "key",
        },
        {
          title: "Tên Domains",
          dataIndex: "name",
          key: "name",
          sorter: (a, b) => a?.name.localeCompare(b?.name),
        },
        {
          title: "Quản lý",
          dataIndex: "manager",
          key: "manager",
          sorter: (a, b) => a?.manager.localeCompare(b?.manager),
        },
        {
          title: "Tổng số tiền",
          dataIndex: "total",
          key: "total",
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
      ];
      return (
        <div>
          <Table
            style={{ marginLeft: "50px" }}
            columns={columns}
            expandable={{
              expandedRowRender,
            }}
            dataSource={dataDomains}
            pagination={false}
          />
        </div>
      );
    };

    const columns = [
      {
        title: "STT",
        dataIndex: "key",
      },
      {
        title: "Team",
        dataIndex: "name",
        key: "name",
        sorter: (a, b) => a?.name.localeCompare(b?.name),
      },
      {
        title: "Tổng số tiền",
        dataIndex: "total",
        key: "total",
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
    ];
    return (
      <div>
        <Table
          columns={columns}
          expandable={{
            expandedRowRender,
          }}
          dataSource={dataTemp}
          pagination={false}
        />
      </div>
    );
  };
  const onSearch = (value) => {
    setDataSearch([]);
    let searchList = [];
    data?.map((item) => {
      item?.domains?.map((itemDomain) => {
        itemDomain?.collaborators?.map((itemColab) => {
          if (itemColab?.name?.toLowerCase().includes(value?.toLowerCase())) {
            !searchList.includes(item) && searchList.push(item);
          }
        });
        if (itemDomain?.name?.toLowerCase().includes(value?.toLowerCase())) {
          !searchList.includes(item) && searchList.push(item);
        }
      });
      if (item?.name?.toLowerCase().includes(value?.toLowerCase())) {
        !searchList.includes(item) && searchList.push(item);
      }
    });
    if (searchList.length !== 0) {
      setDataSearch(searchList);
    }
  };
  const exportExcel = async () => {
    const dataReq = {
      pageSize: 10000,
      pageIndex: 1,
      search: "",
    };
    const listColab = await getColabByBrand("");
    const fileType =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const fileExtension = ".xlsx";
    const exportList = [];
    let count = 0;
    const whitelistExcel = data?.map((itemBrand) => {
      return itemBrand?.team?.map((itemTeam) => {
        return itemTeam?.domains?.map((itemDomain) => {
          return itemDomain?.collaborators?.map((itemColab) => {
            count += 1;
            let a = {
              STT: { t: "s", v: count, s: {} },
              "Thương hiệu": itemBrand?.name,
              Team: itemTeam?.name,
              Domain: itemDomain?.name,
              CTV: itemColab?.name,
              "Tổng tiền":
                itemColab?.total ||
                // ?.toLocaleString("it-IT", {
                //   style: "currency",
                //   currency: "VND",
                // })
                0,
            };
            exportList.push(a);
          });
        });
      });
    });
    const ws = XLSX.utils.json_to_sheet(exportList, {
      header: ["BẢNG THỐNG KÊ CHI TIẾT"],
    });
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const dataSave = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(dataSave, "Dashboard" + fileExtension);
  };
  const onDateRangeChange = (dates, dateStrings) => {
    const date = [dates[0].toISOString(), dates[1].toISOString()];
    setDateRange(dates);
  };
  const handleChangeDateRange = () => {
    getStatistic();
  };
  const myJsonString = JSON.stringify(data);

  return (
    <div className={classes.root}>
      <Row>
        <Col lg="3">
          <p style={{ fontSize: "16px", fontWeight: "bold" }}>Tìm kiếm theo</p>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Search
              placeholder="input search text"
              enterButton="Search"
              size="medium"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onSearch={onSearch}
            />

            <div style={{ marginLeft: "10px" }}>
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

              {/* <CsvCreator
                  filename='my_cool_csv'
                  headers={headers}
                  rows={rows}
                >
                  <p>Download CSV</p>
                </CsvCreator> */}
            </div>
          </div>
          <Row
            style={{ marginTop: "10px", display: "flex", alignItems: "center" }}
          >
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
          </Row>
        </Col>
      </Row>
      <Table
        style={{ marginTop: "10px" }}
        columns={columns}
        expandable={{
          expandedRowRender,
        }}
        dataSource={dataSearch.length !== 0 ? dataSearch : !search && data}
      />
    </div>
  );
};

Dashboard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Dashboard);
