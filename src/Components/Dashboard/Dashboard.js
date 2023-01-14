import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { Select, Table, Input, Row, Col, Button, DatePicker } from "antd";
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
  },
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
    const whitelistExcel = listColab?.data?.map((item, index) => {
      return {
        STT: index + 1,
        "Tên thương hiệu": item?.name,
        "Tổng tiền":
          item?.total?.toLocaleString("it-IT", {
            style: "currency",
            currency: "VND",
          }) || 0,
      };
    });

    const ws = XLSX.utils.json_to_sheet(whitelistExcel);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, "Link" + fileExtension);
  };
  const onDateRangeChange = (dates, dateStrings) => {
    const date = [dates[0].toISOString(), dates[1].toISOString()];
    setDateRange(date);
  };
  const handleChangeDateRange = () => {
    getStatistic();
  };
  return (
    <div className={classes.root}>
      <Row>
        <Col lg="3">
          <p style={{ fontSize: "16px", fontWeight: "bold" }}>Tìm kiếm theo</p>
          <div style={{ display: "flex" }}>
            <Search
              placeholder="input search text"
              enterButton="Search"
              size="medium"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onSearch={onSearch}
            />
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
          </div>
          <Row>
            <RangePicker
              defaultValue={dateRange}
              allowClear={false}
              onChange={onDateRangeChange}
            />
            <Button type="primary" onClick={handleChangeDateRange}>
              Lọc
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
