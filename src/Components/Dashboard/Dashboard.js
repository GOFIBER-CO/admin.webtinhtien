import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import { Select, Table, Input, Row, Col } from "antd";
import {
  getPagingBrands,
  getColabByBrand,
  getPagingDomains,
} from "../../helpers/helper";
const { Search } = Input;
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
  const getColabByBrandId = async () => {
    const res = await getColabByBrand("");
    let dataTemp = res?.data?.map((item, index) => {
      return { ...item, key: index };
    });
    console.log(dataTemp);
    setData(dataTemp);
  };

  useEffect(() => {
    getColabByBrandId();
  }, []);

  const expandedRowRender = (data) => {
    const dataTemp = data?.domains?.map((item, index) => {
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
        title: "Tên domain",
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
  return (
    <div className={classes.root}>
      <Row>
        <Col lg="3">
          <p style={{ fontSize: "16px", fontWeight: "bold" }}>Tìm kiếm theo</p>
          <Search
            placeholder="input search text"
            enterButton="Search"
            size="medium"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onSearch={onSearch}
          />
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
