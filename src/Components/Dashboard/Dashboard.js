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
const headers = [{
  id: 'first',
  display: 'First column'
}, {
  id: 'second',
  display: 'Second column'
}];

const rows = [
  [
      "THANH TOÁN THEO CTV"
  ],
  [
      "STT",
      "TÊN ",
      "PHƯƠNG THỨC THANH TOÁN",
      "Số bài viết 1000 từ ",
      "CHI TIẾT ",
      null,
      "Mức giá 1000 từ ",
      "TỔNG NHUẬN",
      "TỔNG TIỀN THEO CTV"
  ],
  [
      1,
      "Phương",
      "21410003222360 \nNGUYỄN ĐỨC PHƯƠNG \nBIDV",
      11,
      "m888.mobi",
      "thể thao: 6",
      55000,
      605000,
      605000
  ],
  [
      null,
      null,
      null,
      null,
      "W888.mobi",
      "thể thao: 5"
  ],
  [
      2,
      "LINH",
      "19038001732011 \nNguyen Thu Ha \nTechcombank",
      34,
      "m888.mobi",
      "xổ sô: 14",
      50000,
      1700000
  ],
  [
      null,
      null,
      null,
      null,
      "W888.mobi",
      "xổ sô: 20"
  ],
  [
      null,
      null,
      null,
      "49",
      "6789bet.net",
      "Bài tổng hợp: 40",
      55000,
      2695000
  ],
  [
      null,
      null,
      null,
      null,
      null,
      "\nBài trang mục con: 9"
  ],
  [
      null,
      null,
      null,
      "11",
      "st6666.mobi",
      "10 bài GP",
      55000,
      605000
  ],
  [
      null,
      null,
      null,
      null,
      "6689bet.com",
      "bài meta: 1"
  ],
  [
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      "#REF!"
  ],
  [
      null,
      null,
      null,
      "3",
      null,
      "bài trang chủ: 3",
      55000,
      165000
  ],
  [
      3,
      "KEN",
      "108006122867\n Phan Quang Duong \nViettin",
      146,
      "W888.mobi",
      "game bài: 8",
      55000,
      8030000,
      22225000
  ],
  [
      null,
      null,
      null,
      null,
      null,
      "esport: 18"
  ],
  [
      null,
      null,
      null,
      null,
      null,
      "casino: 40"
  ],
  [
      null,
      null,
      null,
      null,
      "m888.mobi",
      "bắn cá: 13"
  ],
  [
      null,
      null,
      null,
      null,
      null,
      "đá gà: 4"
  ],
  [
      null,
      null,
      null,
      null,
      null,
      "xổ số: 10"
  ],
  [
      null,
      null,
      null,
      null,
      null,
      "game bài: 6"
  ],
  [
      null,
      null,
      null,
      null,
      null,
      "esport: 2"
  ],
  [
      null,
      null,
      null,
      null,
      null,
      "slot game: 16"
  ],
  [
      null,
      null,
      null,
      null,
      null,
      "casino: 29"
  ],
  [
      null,
      null,
      null,
      "5",
      "789b.win",
      "xổ số: 5",
      100000,
      500000
  ],
  [
      null,
      null,
      null,
      249,
      "bet3655.mobi",
      "bắn cá: 1",
      55000,
      13695000
  ],
  [
      null,
      null,
      null,
      null,
      null,
      "đá gà: 5"
  ],
  [
      null,
      null,
      null,
      null,
      null,
      "xổ số: 46"
  ],
  [
      null,
      null,
      null,
      null,
      null,
      "game bài: 1"
  ],
  [
      null,
      null,
      null,
      null,
      null,
      "esport: 4"
  ],
  [
      null,
      null,
      null,
      null,
      null,
      "thể thao: 2"
  ],
  [
      null,
      null,
      null,
      null,
      null,
      "casino: 9"
  ],
  [
      null,
      null,
      null,
      null,
      "kubet1.mobi",
      "xổ số: 44"
  ],
  [
      null,
      null,
      null,
      null,
      null,
      "esport: 10"
  ],
  [
      null,
      null,
      null,
      null,
      null,
      "casino: 3"
  ],
  [
      null,
      null,
      null,
      null,
      "122bet.mobi",
      "game bài: 1"
  ],
  [
      null,
      null,
      null,
      null,
      null,
      "bắn cá: 1"
  ],
  [
      null,
      null,
      null,
      null,
      null,
      "đá gà: 3"
  ],
  [
      null,
      null,
      null,
      null,
      null,
      "eport: 4"
  ],
  [
      null,
      null,
      null,
      null,
      null,
      "xổ số: 48"
  ],
  [
      null,
      null,
      null,
      null,
      null,
      "tin tức: 2"
  ],
  [
      null,
      null,
      null,
      null,
      null,
      "thể thao: 4"
  ],
  [
      null,
      null,
      null,
      null,
      null,
      "casino: 3"
  ],
  [
      null,
      null,
      null,
      null,
      "789bets.co",
      "Xổ Số: 55"
  ],
  [
      null,
      null,
      null,
      null,
      null,
      "Đá gà: 3"
  ],
  [
      4,
      "trang",
      "04301015956383 \nMSB \nMai Thùy Trang",
      21,
      null,
      null,
      65000,
      "#REF!",
      "#REF!"
  ],
  [
      null,
      null,
      null,
      null,
      "789b.win",
      "GP: 20"
  ]
]

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
    const exportList = []
    let count = 0;
    const whitelistExcel = data?.map((itemBrand) => {
      return itemBrand?.team?.map(itemTeam => {
        return itemTeam?.domains?.map(itemDomain =>{
          return itemDomain?.collaborators?.map(itemColab =>{
            count +=1;
            let a =  {
              STT: count,
              "Thương hiệu": itemBrand?.name,
              "Team":itemTeam?.name,
              "Domain":itemDomain?.name,
              "CTV":itemColab?.name,
              "Tổng tiền":itemColab?.total?.toLocaleString("it-IT", {
                  style: "currency",
                  currency: "VND",
                }) || 0,
      
            };
            exportList.push(a)
          })
        })
      })

    });
    const ws = XLSX.utils.json_to_sheet(exportList);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const dataSave = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(dataSave, "Link" + fileExtension);
  };
  const onDateRangeChange = (dates, dateStrings) => {
    const date = [dates[0].toISOString(), dates[1].toISOString()];
    setDateRange(date);
  };
  const handleChangeDateRange = () => {
    getStatistic();
  };
  const  myJsonString = JSON.stringify(data)
 
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
