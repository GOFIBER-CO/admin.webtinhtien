import { Col, Row } from "antd";
import React, { useEffect, useState } from "react";
import { Container } from "reactstrap";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import { getListOrderPosts } from "../../helpers/helper";
import SearchConponent from "./SearchConponent";
import TableData from "./TableConponent";

export default function OrderPostsOfYou() {
  let user = sessionStorage.getItem("authUser");
  console.log(JSON.parse(user), "truong yes");
  const [pageSize, setPageSize] = useState(10);
  const [pageIndex, setPageIndex] = useState(1);
  const [totalDocs, setTotalDocs] = useState(0);
  const [data, setData] = useState([]);
  const [search, setSearch] = useState({
    ctv: JSON.parse(user)?.id || "",
  });
  const handleSearch = async (values) => {
    console.log("vsadfadsalues: ", values);
    setSearch({
      ...values,
      ctv: JSON.parse(user)?.id || "",
    });
    await getData();
    // console.log(new URLSearchParams(values).toString(), "searchValye");
  };
  const getData = async () => {
    // const getListPost = await getListOrderPosts(pageSize, pageIndex, search);
    const getListPost = await getListOrderPosts(pageSize, pageIndex, search);
    console.log("getListPost: ", getListPost);
    setTotalDocs(getListPost?.totalItem);
    setData(getListPost.data);
  };
  useEffect(() => {
    getData();
  }, []);
  return (
    <React.Fragment>
      <div className="post-not-received-container">
        <div className="page-content">
          <Container fluid>
            <BreadCrumb
              title="Danh sách bài viết của bạn"
              pageTitle="Quản lý OrderPost"
            />
            <Row gutter={[20, 20]}>
              <Col md={24}>
                <SearchConponent handleSearch={() => handleSearch} />
              </Col>
              <Col md={24}>
                <TableData
                  pageSize={pageSize}
                  pageIndex={pageIndex}
                  totalDocs={totalDocs}
                  setPageSize={setPageSize}
                  setPageIndex={setPageIndex}
                  data={data}
                />
              </Col>
            </Row>
          </Container>
        </div>
      </div>
    </React.Fragment>
  );
}
