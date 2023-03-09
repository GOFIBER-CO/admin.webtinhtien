import { Col, Row } from "antd";
import React, { useEffect, useState } from "react";
import { Container } from "reactstrap";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import { getListOrderPosts } from "../../helpers/helper";
import SearchConponent from "./SearchConponent";
import TableData from "./TableConponent";

export default function OrderPostNotReceived() {
  const [pageSize, setPageSize] = useState(10);
  const [pageIndex, setPageIndex] = useState(1);
  const [totalDocs, setTotalDocs] = useState(0);
  const [data, setData] = useState([]);
  const [search, setSearch] = useState({ statusOrderPost: -1 });
  const handleSearch = (values) => {
    values.statusOrderPost = -1;
    setSearch(values);
    getData(values);
  };
  const getData = async (data = search) => {
    const getListPost = await getListOrderPosts(pageSize, pageIndex, data);
    setTotalDocs(getListPost?.totalItem);
    setData(getListPost.data);
  };
  useEffect(() => {
    getData();
  }, [pageIndex, pageSize]);
  return (
    <React.Fragment>
      <div className="post-not-received-container">
        <div className="page-content">
          <Container fluid>
            <BreadCrumb
              title="Danh sách bài biết mới"
              pageTitle="Quản lý OrderPost"
            />
            <Row gutter={[20, 20]}>
              <Col md={16}>
                <SearchConponent
                  handleSearch={handleSearch}
                  getData={getData}
                />
              </Col>
              <Col md={24}>
                <TableData
                  pageSize={pageSize}
                  pageIndex={pageIndex}
                  totalDocs={totalDocs}
                  setPageSize={setPageSize}
                  setPageIndex={setPageIndex}
                  data={data}
                  getData={getData}
                />
              </Col>
            </Row>
          </Container>
        </div>
      </div>
    </React.Fragment>
  );
}
