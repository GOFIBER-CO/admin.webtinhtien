/* eslint-disable react/jsx-no-undef */
import React, { useState } from "react";
import "antd/dist/antd.css";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import {
  Col,
  Container,
  Input,
  InputGroup,
  InputGroupText,
  Row,
  Button,
  Form,
  FormGroup,
  Label,
} from "reactstrap";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import {
  Table,
  Space,
  Popconfirm,
  notification,
  Pagination,
  PaginationProps,
  Spin,
  Select,
} from "antd";
import { Link, Switch } from "react-router-dom";
import { useEffect } from "react";
import {
  getAllPosts,
  searchPost,
  getPagingCate,
  deletePost,
  getByType,
  getAllByTax,
  googleBatchIndex,
  bingIndex,
  getAllCate,
} from "../../helpers/helper";
import { URL_IMAGE_BUNNY } from "../../helpers/url_helper";
import { Icon } from "@iconify/react";
import { string } from "prop-types";
const { Column } = Table;
function PostList() {
  const [posts, setPosts] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [current, setCurrent] = useState(0);
  const [res, setRes] = useState({});
  const [pageSize, setPageSize] = React.useState(10);
  const [pageIndex, setPageIndex] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [postSearch, setPostSearch] = useState([]);
  const [search, setSearch] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [valueCate, setValueCate] = useState("");
  const [valueStatus, setValueStatus] = useState("");
  const url = "https://baovietnam.com/";
  const getPosts = async (pageSize, pageIndex, searchInput, cate, status) => {
    setIsLoading(true);
    pageSize = typeof pageSize !== undefined ? pageSize : 10;
    pageIndex = typeof pageIndex !== undefined ? pageIndex : 1;

    await getAllPosts(pageSize, pageIndex, searchInput, cate, status).then(
      (res) => {
        if (res) {
          setRes(res);
          let posts = res.docs;
          posts.map((item) => {
            item.status =
              item.status === 1
                ? "Đã đăng"
                : item.status === 0
                ? "Đang xét duyệt"
                : "Nháp";
          });
          setPosts(posts);
        }
        setIsLoading(false);
      }
    );
  };
  const getCateList = async () => {
    setIsLoading(true);
    await getAllCate().then((data) => setCategories(data));
  };
  useEffect(() => {
    getPosts(pageSize, pageIndex, searchInput, valueCate, valueStatus);
    getCateList();
  }, [pageIndex, pageSize]);

  const confirm = (post) => {
    if (post.slug) {
      deletePost(post._id)
        .then((res) => {
          notification["success"]({
            message: "Notification",
            description: "Delete post successfully!",
          });
          getPosts(pageSize, pageSize, pageIndex, searchInput);
        })
        .catch((error) => {
          notification["error"]({
            message: "System error",
            description: error,
          });
        });
    }
  };
  const convertHtmlText = (htmlText) => {
    if (htmlText && htmlText.length > 0) {
      let strText =
        new DOMParser().parseFromString(htmlText, "text/html").documentElement
          .textContent || "";
      if (strText && strText.length > 50) {
        strText = strText.slice(0, 50) + "...";
      }
      return strText;
    }
    return "";
  };

  const onSearchPost = (e) => {
    setSearchInput(e.target.value);
  };

  const onChangeCategory = (value) => {
    setValueCate(value);
  };
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRows(selectedRowKeys);
    },
  };
  const indexGG = () => {
    setIsLoading(true);
    if (selectedRows.length > 0) {
      let listData = [];
      posts.filter((x) => {
        for (let index = 0; index < selectedRows.length; index++) {
          const element = selectedRows[index];
          if (x._id === element) {
            let urlSlug = url + x.slug;
            listData.push(urlSlug);
          }
        }
      });
      var data = {
        links: listData,
      };
      googleBatchIndex(data).then((res) => {
        if (res.code === 200) {
          notification["success"]({
            message: "Notification",
            description: res.message,
          });
          setSelectedRows([]);
          setIsLoading(false);
        } else {
          notification["error"]({
            message: "System error",
            description: res.message,
          });
          setIsLoading(false);
        }
      });
    } else {
      notification["error"]({
        message: "System error",
        description: "Vui lòng chọn dòng muốn sử dụng index Google",
      });
      setIsLoading(false);
    }
  };
  const indexBing = () => {
    setIsLoading(true);
    if (selectedRows.length > 0) {
      let listData = [];
      posts.filter((x) => {
        for (let index = 0; index < selectedRows.length; index++) {
          const element = selectedRows[index];
          if (x._id === element) {
            let urlSlug = url + x.slug;
            listData.push(urlSlug);
          }
        }
      });
      var data = {
        links: listData,
      };
      bingIndex(data).then((res) => {
        if (res.code === 200) {
          setSelectedRows([]);
          notification["success"]({
            message: "Notification",
            description: res.message,
          });
          setIsLoading(false);
        } else {
          notification["error"]({
            message: "System error",
            description: res.message,
          });
          setIsLoading(false);
        }
      });
    } else {
      notification["error"]({
        message: "System error",
        description: "Vui lòng chọn dòng muốn sử dụng index Bing",
      });
      setIsLoading(false);
    }
  };
  const searchPost = () => {
    getPosts(pageSize, pageIndex, searchInput, valueCate, valueStatus);
  };
  const exportExcel = () => {
    const fileType =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const fileExtension = ".xlsx";
    const posts_slug = posts.map((post, index) => {
      return {
        stt: index + 1,
        "Tiêu đề": post.title,
        "Trạng thái": post.status,
        "Đường dẫn tĩnh": post.slug,
        url: process.env.REACT_APP_DOMAIN + post.slug,
      };
    });
    const ws = XLSX.utils.json_to_sheet(posts_slug);
    console.log(ws);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, "posts" + fileExtension);
  };
  return (
    <React.Fragment>
      <Spin spinning={isLoading}>
        <div className="page-content">
          <Container fluid>
            <BreadCrumb title="Bài viết" pageTitle="Quản lý bài viết" />
            <Row className="mb-3">
              <Col lg="2">
                <div>
                  <InputGroup>
                    <Input
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                      placeholder="Tìm kiếm..."
                    />
                  </InputGroup>
                </div>
              </Col>
              <Col lg="2">
                <div>
                  <Select
                    allowClear={true}
                    style={{ width: "100%" }}
                    placeholder="Danh mục"
                    onChange={onChangeCategory}
                  >
                    {categories &&
                      categories?.map((item) => (
                        <Option label={item.name} key={item._id}>
                          {item?.name}{" "}
                          {/* {item.parent ? <>({item.parent.name})</> : null} */}
                        </Option>
                      ))}
                  </Select>
                </div>
              </Col>
              <Col lg="2">
                <div>
                  <Select
                    allowClear={true}
                    style={{ width: "100%" }}
                    onChange={(value) => setValueStatus(value)}
                    placeholder="Trạng thái"
                  >
                    <Option label="Đã đăng" key={1}>
                      Đã đăng
                    </Option>
                    <Option label="Nháp" key={-1}>
                      Nháp
                    </Option>
                    <Option label="Chờ xét duyệt" key={0}>
                      Chờ xét duyệt
                    </Option>
                  </Select>
                </div>
              </Col>
              <Col lg="3">
                <Row>
                  <Col style={{ width: "130px" }} lg="6">
                    <div>
                      <Button onClick={() => searchPost()}>Tìm kiếm</Button>
                    </div>
                  </Col>
                  <Col style={{ width: "130px" }} lg="6">
                    <div>
                      <Button
                        style={{ backgroundColor: "#026e39", border: "none" }}
                        onClick={() => exportExcel()}
                      >
                        Xuất excel
                      </Button>
                    </div>
                  </Col>
                </Row>
              </Col>
              <Col lg="2" style={{ width: "125px" }}>
                <div className="">
                  <Button
                    style={{ backgroundColor: "white" }}
                    onClick={() => indexGG()}
                  >
                    <i className="icons8-google"></i>
                  </Button>
                  <Button
                    style={{
                      backgroundColor: "white",
                      marginLeft: "2px",
                      height: "40px ",
                    }}
                    onClick={() => indexBing()}
                  >
                    <Icon
                      icon="mdi:microsoft-bing"
                      style={{ color: "black" }}
                    />
                  </Button>
                </div>
              </Col>
              <Col style={{ width: "130px" }} lg="2">
                <div className="">
                  <Link to="/posts/create">
                    <Button>Thêm mới</Button>
                  </Link>
                </div>
              </Col>
            </Row>

            <Row>
              <Col lg={12}>
                <Table
                  rowKey="_id"
                  dataSource={posts}
                  pagination={false}
                  rowSelection={{
                    type: "checkbox",
                    selectedRowKeys: selectedRows,
                    ...rowSelection,
                  }}
                >
                  <Column scope="col" style={{ width: "50px" }} />
                  <Column
                    title="#"
                    render={(val, rec, index) => {
                      return index + 1;
                    }}
                  />
                  <Column title="Tiêu đề" dataIndex="title" key="title" />
                  <Column title="Trạng thái" dataIndex="status" key="status" />
                  <Column title="Lượt xem" dataIndex="views" key="views" />
                  <Column
                    title="Mô tả"
                    dataIndex="description"
                    key="description"
                    render={(item) => <>{convertHtmlText(item)}</>}
                  />
                  <Column
                    title="Hình ảnh"
                    dataIndex="thumb"
                    key="thumb"
                    render={(image) => (
                      <img
                        src={image}
                        alt="pro_image"
                        style={{ width: "50%" }}
                      />
                    )}
                  />
                  <Column title="Đường dẫn tĩnh" dataIndex="slug" key="slug" />
                  <Column
                    title="Hoạt động"
                    key="action"
                    render={(val, record) => (
                      <Space size="middle">
                        {/* <Link to={{ pathname: "/posts/" + val.slug }}>
                        View
                      </Link> */}
                        <a
                          href={`https://baovietnam.com/${val.slug}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <i className="ri-eye-line action-icon"></i>
                        </a>

                        <Link
                          to={{
                            pathname: "/posts/edit/" + val.slug,
                            state: { id: val._id },
                          }}
                        >
                          <i className="ri-pencil-line action-icon"></i>
                        </Link>

                        {/* <Link to={{ pathname: "/posts/edit/" + val.slug, state: { id: val._id || val.id } }}>
                        Edit
                      </Link> */}
                        <Popconfirm
                          title="Are you sure to delete this post?"
                          onConfirm={() => confirm(val)}
                          okText="Yes"
                          cancelText="No"
                        >
                          <i className="ri-delete-bin-line action-icon"></i>
                        </Popconfirm>
                      </Space>
                    )}
                  />
                </Table>
                <div className="text-right">
                  {/* <Pagination
                    onChange={(page, newPageSize) => {
                      let pageTmp = page - 1;
                      setPageSize(newPageSize);
                      setPageIndex(page);
                      setCurrent(pageSie !== newPageSize ? 0 : pageTmp);
                    }}
                    showSizeChanger={true}
                    total={res.totalDocs}
                    current={current + 1}
                    pageSize={pageSize}
                    showTotal={(total) => `Tổng ${total} bài viết`}
                  /> */}

                  <Pagination
                    pageSize={pageSize}
                    onChange={(page, pageSize) => {
                      setPageIndex(page !== 0 ? page : 1);
                      setPageSize(pageSize);
                    }}
                    showTotal={(total) => `Tổng ${total} bài viết`}
                    total={res.totalDocs}
                    showSizeChanger
                  />
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      </Spin>
    </React.Fragment>
  );
}

export default PostList;
