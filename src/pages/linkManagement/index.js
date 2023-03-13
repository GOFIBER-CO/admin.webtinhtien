import {
  Button,
  Checkbox,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  notification,
  Pagination,
  Select,
  Space,
  Spin,
  Switch,
  Table,
  Tooltip,
  DatePicker,
} from "antd";
import "antd/es/style/index";
import dayjs from "dayjs";
import * as FileSaver from "file-saver";
import React, { useEffect, useState } from "react";
import { AiFillEdit } from "react-icons/ai";
import { ImBin2 } from "react-icons/im";
import { useHistory, useLocation } from "react-router-dom";
import { Col, Container, Row } from "reactstrap";
import * as XLSX from "xlsx";
import { read, utils } from "xlsx";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import {
  checkPermissionScreen,
  createLinkManagement,
  createLinkManagementExcel,
  deleteLinkManagement,
  exportDataTeams,
  getAllBrand,
  getAllDomain,
  getColabByDomainId,
  getDomainByTeam,
  getLinkManagementsByTeamUser,
  getLinkPostByColab,
  getLoggedInUser,
  getTeamByBrand,
  updateLinkManagement,
} from "../../helpers/helper";
import Page403 from "../403";
import ModalLinkDocs from "./ModalLinkDocs";
import "./style.css";
const { Option } = Select;
const { Search } = Input;
const { RangePicker } = DatePicker;

//sample data

const LinkManagement = (props) => {
  const history = useHistory();
  const [user, setUser] = useState({});
  const [api, contextHolder] = notification.useNotification();
  const [domainList, setDomainList] = useState([]);
  const [brandList, setBrandList] = useState([]);
  const [colabList, setColabList] = useState([]);
  const [teamList, setTeamList] = useState([]);
  const [colab, setColab] = useState({});
  const [brand, setBrand] = useState({});
  const [domain, setDomain] = useState({});
  const [team, setTeam] = useState({});
  const [data, setData] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [form] = Form.useForm();
  const [pageSize, setPageSize] = useState(10);
  const [pageIndex, setPageIndex] = useState(1);
  const [search, setSearch] = useState("");
  const [edit, setEdit] = useState("");
  const [total, setTotal] = useState(0);

  const [loading, setIsLoading] = useState(false);
  const [linkByTeam, setLinkByTeam] = useState([]);
  const [sum, setSum] = useState(0);
  const [sumKey, setSumKey] = useState("");
  const [brandListExcel, setBrandListExcel] = useState([]);
  const [teamListExcel, setTeamListExcel] = useState([]);
  const [brandExcel, setBrandExcel] = useState("");
  const [teamExcel, setTeamExcel] = useState("");

  const [isModalOpenLinkDocs, setIsModalOpenLinkDocs] = useState(false);
  const [checkRole, setCheckRole] = useState(true);
  const location = useLocation();
  const checkScreen = async () => {
    const permission = await checkPermissionScreen(location.pathname);
    setCheckRole(permission.status);
  };
  useEffect(() => {
    checkScreen();
  }, []);

  const handleOkLinkDocs = () => {
    setIsModalOpenLinkDocs(false);
  };

  const handleCancelLinkDocs = () => {
    setIsModalOpenLinkDocs(false);
  };

  const columns = [
    {
      title: "Domains",
      dataIndex: "domain",
      key: "domain",
      render: (value) => {
        return (
          <Tooltip placement="Top" title={value?.name}>
            {value?.name}
          </Tooltip>
        );
      },
      sorter: (a, b) => a.domain.name.localeCompare(b.domain.name),
      width: "10%",
    },
    {
      title: "Quản lý",
      dataIndex: "domains",
      // width: "10%",
      render: (_, record) => {
        console.log(record, "asdasd");
        return record?.domain?.manager?.toString();
      },
      sorter: (a, b) =>
        a?.domain[0]?.manager?.localeCompare(b?.domain[0]?.manager),
    },
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
      render: (value) => {
        return (
          <Tooltip placement="Top" title={value}>
            {value}
          </Tooltip>
        );
      },
      sorter: (a, b) => a.title.localeCompare(b.title),
      width: "10%",
    },
    {
      title: "Từ khóa",
      dataIndex: "keyword",
      key: "keyword",
      render: (value) => (
        <a>
          <Tooltip placement="Top" title={value}>
            {value}
          </Tooltip>
        </a>
      ),
      sorter: (a, b) => a.keyword.localeCompare(b.keyword),
    },
    {
      title: "Chuyên mục",
      dataIndex: "category",
      key: "address",
      sorter: (a, b) => a.category.localeCompare(b.category),
    },
    {
      title: "Link bài viết",
      key: "link_post",
      dataIndex: "link_post",
      ellipsis: true,
      render: (value) => (
        <>
          <a href={value}>{value}</a>
        </>
      ),
    },
    {
      title: "Link bài đăng",
      key: "link_posted",
      ellipsis: true,

      dataIndex: "link_posted",
      render: (value) => (
        <>
          <a href={value}>{value}</a>
        </>
      ),
    },
    {
      title: "Số từ",
      key: "number_words",
      dataIndex: "number_words",
      render: (value) => <>{value}</>,
      width: "7%",
      sorter: (a, b) => a.number_words - b.number_words,
    },
    {
      title: "Số ảnh",
      key: "number_images",
      dataIndex: "number_images",
      render: (value) => <>{value}</>,
      width: "7%",
      sorter: (a, b) => a.number_images - b.number_images,
    },
    {
      title: "Số tiền",
      key: "total",
      dataIndex: "total",
      render: (value) => (
        <>
          {value?.toLocaleString("it-IT", {
            style: "currency",
            currency: "VND",
          })}
        </>
      ),
      sorter: (a, b) => a.total - b.total,
      ellipsis: true,
    },
    {
      title: "Trạng thái",
      key: "status",
      dataIndex: "status",
      render: (value) => <>{value === 1 ? <>Đã đăng</> : <>Nháp</>}</>,
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <AiFillEdit
            style={{ color: "#00adff", cursor: "pointer" }}
            onClick={() => handleEdit(record)}
          />
          <ImBin2
            style={{ color: "red", cursor: "pointer" }}
            onClick={() => handleDelete(record)}
          />
        </Space>
      ),
    },
  ];
  const handleDelete = async (record) => {
    await deleteLinkManagement(record._id)
      .then((res) => {
        api["success"]({
          message: `Xóa thành công`,
          placement: "top",
          duration: 2,
        });
        getColapsByDomain(colab?.key);
        handleGetLinkPostByColaps();
      })
      .catch((error) => {
        api["error"]({
          message: error?.message || "Có lỗi xảy ra",

          description: error,
          placement: "top",
          duration: 3,
        });
      });
  };
  const getDomainListByTeam = async () => {
    if (team?.key || teamList[0]?.key) {
      const listDomains = await getDomainByTeam(
        team?.key || teamList[0]?.key,
        brand?.key || brandList[0]?.key
      );
      let domainListTemp = [];
      listDomains?.data?.map((item) => {
        let a = {
          key: item?._id,
          value: item?.name,
        };
        domainListTemp.push(a);
      });

      const domainsList = domainListTemp;
      // setDomain(domainsList[0]);
      setDomainList(domainsList);
    }
  };
  const getTeamListByBrand = async () => {
    if (brand?.key || brandList[0]?.key) {
      const listTeam = await getTeamByBrand(brand?.key || brandList[0]?.key);
      let teamListTemp = [];
      listTeam?.data?.map((item) => {
        let a = {
          key: item?._id,
          value: item?.name,
          total: item?.total,
        };
        teamListTemp.push(a);
      });
      const teamList1 = teamListTemp;
      // setTeam(teamList1[0]);
      setTeamList(teamList1);
    }
  };

  const getTeamListByBrandExcel = async () => {
    if (brandExcel?.key || brandListExcel[0]?.key) {
      const listTeam = await getTeamByBrand(
        brandExcel?.key || brandListExcel[0]?.key
      );
      let teamListTemp = [];
      listTeam?.data?.map((item) => {
        let a = {
          key: item?._id,
          value: item?.name,
          total: item?.total,
        };
        teamListTemp.push(a);
      });
      const teamList1 = teamListTemp;
      // setTeam(teamList1[0]);
      setTeamListExcel(teamList1);
    }
  };

  const getListBrand = async () => {
    const listBrand = await getAllBrand();
    let user = await getLoggedInUser();
    let brandList = [];
    listBrand?.data?.map((item) => {
      if (
        user?.role !== "Admin" &&
        user?.team?.brand?.find((x) => x === item?._id)
      ) {
        let a = {
          key: item?._id,
          value: item?.name,
          label: item?.name,
          total: item?.total,
        };
        brandList.push(a);
      } else if (user?.role === "Admin") {
        let a = {
          key: item?._id,
          value: item?.name,
          label: item?.name,
          total: item?.total,
        };
        brandList.push(a);
      }
    });
    brand?.key === undefined && setBrand(brandList[0]);
    setBrandList(brandList);
    // console.log(brandList,'brandList');
    setBrandListExcel(brandList);
  };

  const getColapsByDomain = async (key) => {
    if (domain?.key || domainList[0]?.key) {
      const listColaps = await getColabByDomainId(domain?.key);
      let colabList = [];
      listColaps?.data?.map((item) => {
        let a = {
          key: item?._id,
          value: item?.name,
          total: item?.total,
        };
        colabList.push(a);
      });
      setColabList(colabList);
    }
    // if (domain?.key || domainList[0]?.key) {
    //   const listColaps = await getPaymentByDomains(
    //     domain?.key || domainList[0]?.key,
    //     10000,
    //     1,
    //     ""
    //   );
    //   let colabList = [];
    //   listColaps?.data?.map((item) => {
    //     let a = {
    //       key: item?._id,
    //       value: item?.name,
    //       total: item?.total,
    //     };
    //     colabList.push(a);
    //   });
    //   setColabList(colabList);
    //   if (props?.location?.state) {
    //     setColab(props?.location?.state?.[0]);
    //   } else {
    //     if (!key) {
    //       setColab(colabList[0]);
    //     } else {
    //       const colab1 = colabList.find((item) => item?.key === key);
    //       setColab(colab1);
    //     }
    //   }
    // }
  };

  const getLinkManagementByTeam = async () => {
    const listColadsTeam = await getLinkManagementsByTeamUser(team?.key);
    let listColadTeam = [];
    listColadsTeam?.map((item) => {
      let a = {
        key: item?._id,
        value: item?.name,
        label: item?.name,
        total: item?.total,
      };
      listColadTeam.push(a);
    });
    setLinkByTeam(listColadTeam);
    setSum(listColadTeam);
  };

  useEffect(() => {
    getTeamListByBrand();
  }, [brand?.key]);

  useEffect(() => {
    if (brandExcel?.key) {
      getTeamListByBrandExcel();
    }
  }, [brandExcel?.key]);

  useEffect(() => {
    getDomainListByTeam();
    getLinkManagementByTeam();
  }, [team?.key, colab?.key]);

  useEffect(() => {
    getColapsByDomain();
  }, [domain?.key]);

  useEffect(() => {
    if (user?.role !== "Admin") {
      getDomainListByTeam();
      getLinkManagementByTeam();
    }
  }, [brand?.key]);

  useEffect(() => {
    handleGetLinkPostByColaps();
  }, [pageSize, pageIndex, brand?.key]);

  const handleSelectBrand = (value) => {
    if (value?.key !== brand?.key) {
      history.replace("/postsLink");
      setDomain({});
      setDomainList([]);
      if (user?.role === "Admin") {
        setTeam({});
        setTeamList([]);
      }

      setColab({});
      setColabList([]);
      setData([]);
      setBrand(value);
    }
  };
  const handleSelectTeam = (value) => {
    if (value?.key !== team?.key) {
      setDomain({});
      setDomainList([]);
      setColab({});
      setColabList([]);
      // setData([]);
      setTeam(value);
    }
  };

  const handleSelectDomain = (value) => {
    if (value?.key !== domain?.key) {
      setColab({});
      // setData([]);
      setColabList([]);
      setLinkByTeam([]);
      setDomain(value);
    }
  };
  const handleSelectColaps = async (value) => {
    // console.log(value, 'sadsada');
    if (value?.key !== colab?.key) {
      // setData([]);
      setSearch("");
      setColab(value);
      setSumKey(value?.key);
    }
  };

  const onSearch = (value) => {
    if (value) {
      setSearch(value);
    }
    handleGetLinkPostByColaps();
  };

  const handleOpenModal = () => {
    setIsLoading(false);
    setOpenModal(true);
  };
  const handleCloseModal = () => {
    setEdit("");
    form.resetFields();
    setOpenModal(false);
  };
  const handleGetLinkPostByColaps = async () => {
    const linkPost = await getLinkPostByColab(
      // colab?.key || colabList?.[0]?.key,
      pageSize || 10,
      pageIndex || 1,
      search || "",
      brand?.key || "",
      team?.key || "",
      domain?.key || "",
      colab?.key || "",
      [dateRange[0].toISOString(), dateRange[1].toISOString()]
    );
    setTotal(linkPost?.count);
    setData(linkPost?.data);
  };
  const onFinish = async (values) => {
    setIsLoading(true);
    const dataReq = {
      link_post: values?.link_post,
      link_posted: values?.link_posted,
      keyword: values?.keyword,
      category: values?.category,
      status: values?.status || 1,
      collaboratorId: values?.collaboratorId || "",
      domain: values?.domain || "",
      price_per_word: values?.price_per_word,
      total: values?.total,
      isPosted: values?.isPosted || false,
      isDesign: values?.isDesign || false,
    };
    if (!edit) {
      const res = await createLinkManagement(dataReq)
        .then((result) => {
          if (result?.success) {
            getColapsByDomain(colab?.key);
            handleGetLinkPostByColaps();
            handleCloseModal();

            api["success"]({
              message: `Thêm thành công`,
              placement: "top",
              duration: 2,
            });
          } else {
            api["error"]({
              message: result?.message,
              placement: "top",
              duration: 3,
            });
          }
        })
        .catch((error) => {
          api["error"]({
            message: error?.message,
            description: error?.message,
            placement: "top",
            duration: 3,
          });
        });

      setIsLoading(false);
    } else {
      let dataUpdate = {
        link_posted: values?.link_posted || "",
        keyword: values?.keyword || "",
        category: values?.category || "",
        status: values?.status || 1,
        price_per_word: values?.price_per_word,
        total: values?.total,
        isTotal: switchAdd,
        collaboratorId: values?.collaboratorId || "",
      };
      const res = await updateLinkManagement(edit, dataUpdate).catch(
        (error) => {
          api["error"]({
            message: error?.message || "Có lỗi xảy ra",

            description: error,
            placement: "top",
            duration: 3,
          });
        }
      );
      if (res?.success) {
        getLinkManagementByTeam();
        handleGetLinkPostByColaps(colab?.key);
        handleCloseModal();
        api["success"]({
          message: `Chỉnh sửa thành công`,
          placement: "top",
          duration: 2,
        });
      }
      setIsLoading(false);
    }
  };
  const [editByTotal, setEditByTotal] = useState(false);
  const handleEdit = (value) => {
    form.setFieldValue("keyword", value?.keyword);
    form.setFieldValue("category", value?.category);
    form.setFieldValue("link_posted", value?.link_posted);
    form.setFieldValue("status", value?.status);
    form.setFieldValue("collaboratorId", value?.collaborators[0]?._id);
    form.setFieldValue("price_per_word", value?.price_per_word);
    form.setFieldValue("total", value?.total);
    value?.price_per_word ? setSwitchAdd(false) : setSwitchAdd(true);
    setEdit(value?._id);
    handleOpenModal();
  };

  const exportExcel = async () => {
    const dataReq = {
      pageSize: 10000,
      pageIndex: 1,
      search: "",
    };
    const listColab = await getLinkPostByColab(colab?.key, 10000, 1, "");
    const fileType =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const fileExtension = ".xlsx";
    const whitelistExcel = data?.map((item, index) => {
      // console.log(item, 'data');
      // return
      return {
        STT: index + 1,
        "Thương hiệu": item?.collaborators[0]?.domain[0]?.brand[0]?.name,
        Team: item?.collaborators[0]?.domain[0]?.team[0]?.name,
        "Tiêu đề": item?.title,
        "Từ khóa": item?.keyword,
        "Chuyên mục": item?.category,
        "Link bài viết": item?.link_post,
        "Link bài đăng": item?.link_posted,
        "Số lượng từ": item?.number_words,
        "Số lượng ảnh": item?.number_images,

        "Tổng tiền": item?.total,
        // ?.toLocaleString("it-IT", {
        //   style: "currency",
        //   currency: "VND",
        // }),
        "Xác nhận": item?.status,
      };
    });
    const ws = XLSX.utils.json_to_sheet(whitelistExcel, {
      header: ["QUẢN LÝ CỘNG TÁC VIÊN"],
    });
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const exportData = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(exportData, "Link" + fileExtension);
  };

  const exportExcelMau = async () => {
    const fileType =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const fileExtension = ".xlsx";
    const whitelistExcel = data?.map((item, index) => {
      return {
        // STT: index + 1,
        // "Tiêu đề": item?.title,
        keyword: item?.keyword,
        category: item?.category,
        link_post: item?.link_post,
        link_posted: item?.link_posted,
        status: item?.status,
        total: "",
        isPosted: 1,
        isDesign: 1,
      };
    });
    whitelistExcel[0]["Chú thích"] =
      "isPosted = 1 là bài tự đăng (1 là tự đăng(Cộng thêm 5k)), isDesign là tự thiết kế hình ảnh( 1 là tự thiết kế hình ảnh Cộng thêm 20k)";
    const ws = XLSX.utils.json_to_sheet(whitelistExcel, {
      header: [
        "QUẢN LÝ CỘNG TÁC VIÊN",
        "Chú thích status = 1 là trạng thái đăng, status = 2 là trạng thái nháp",
      ],
    });
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const exportData = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(exportData, "SampleLink" + fileExtension);
  };

  const [domainAdd, setDomainAdd] = useState([]);
  const [selectedDomainAdd, setSelectedDomainAdd] = useState("");
  const [colabAdd, setColabAdd] = useState([]);
  const handleGetDomainAdd = async () => {
    const res = await getAllDomain();
    setDomainAdd(res?.data);
  };
  const handleGetColabAdd = async () => {
    form.setFieldValue("collaboratorId", "");
    const res = await getColabByDomainId(
      selectedDomainAdd || domainAdd[0]?._id
    );
    setColabAdd(res?.data);
  };
  useEffect(() => {
    handleGetDomainAdd();
    handleGetColabAdd();
  }, []);
  useEffect(() => {
    setColab();
    handleGetColabAdd();
  }, [selectedDomainAdd]);

  const [switchAdd, setSwitchAdd] = useState(false);

  const handleSwitchAdd = () => {
    setSwitchAdd(!switchAdd);
    if (!edit) {
      form.setFieldValue("price_per_word", "");
      form.setFieldValue("total", "");
    }
  };
  const ShowEditLink = () => {
    if (!edit) {
      return (
        <>
          <Form.Item
            label="Domain"
            name="domain"
            rules={[{ required: true, message: "Vui lòng chọn domain!" }]}
          >
            <Select
              onChange={(e) => setSelectedDomainAdd(e)}
              value={selectedDomainAdd}
              showSearch
              optionFilterProp="label"
            >
              {domainAdd?.map((item) => {
                return (
                  <>
                    <Option
                      value={item?._id}
                      key={item?.name}
                      label={item?.name}
                    >
                      {item?.name}
                    </Option>
                  </>
                );
              })}
            </Select>
          </Form.Item>
          <Form.Item
            label="Cộng tác viên"
            name="collaboratorId"
            rules={[
              { required: true, message: "Vui lòng chọn cộng tác viên!" },
            ]}
          >
            <Select>
              {colabAdd?.map((item) => {
                return (
                  <>
                    <Option value={item?._id}>{item?.name}</Option>
                  </>
                );
              })}
            </Select>
          </Form.Item>
          <Form.Item
            label="Link bài viết"
            name="link_post"
            rules={[{ required: true, message: "Nhập link bài viết" }]}
          >
            <Input />
          </Form.Item>
          <p style={{ color: "orange" }}>
            Lưu ý: bài viết phải chuẩn định dạng google document. Nếu vẫn có lỗi
            bạn hãy copy nội dung qua một google document khác và thử lại.
          </p>
          <Form.Item name="isPosted" valuePropName="checked">
            <Checkbox name="isPosted">Đăng bài (+5000)</Checkbox>
          </Form.Item>
          <Form.Item name="isDesign" valuePropName="checked">
            <Checkbox name="isDesign">Thiết kế hình ảnh (+20000)</Checkbox>
          </Form.Item>
          <Form.Item label="Thêm theo tổng tiền bài viết">
            <Switch onChange={handleSwitchAdd} checked={switchAdd}></Switch>
          </Form.Item>
          {!switchAdd && (
            <Form.Item
              label="Số tiền mỗi từ"
              name="price_per_word"
              rules={[{ required: true, message: "Nhập số tiền mỗi từ" }]}
            >
              <InputNumber type="number" />
            </Form.Item>
          )}
          {switchAdd && (
            <Form.Item
              label="Tổng tiền bài viết"
              name="total"
              rules={[{ required: true, message: "Nhập số tiền bài viết" }]}
            >
              <InputNumber type="number" />
            </Form.Item>
          )}
        </>
      );
    }
    if (edit) {
      return (
        <>
          <Form.Item name="collaboratorId" hidden></Form.Item>
          <Form.Item name="link_posted" hidden></Form.Item>

          {/* {!editByTotal && (
            <Form.Item
              label="Số tiền mỗi từ"
              name="price_per_word"
              rules={[{ required: true, message: "Nhập số tiền mỗi từ" }]}
            >
              <InputNumber type="number" />
            </Form.Item>
          )}

          {editByTotal && (
            <Form.Item
              label="Tổng tiền bài viết"
              name="total"
              rules={[{ required: true, message: "Nhập tổng tiền bài viết" }]}
            >
              <InputNumber type="number" />
            </Form.Item>
          )} */}
          <Form.Item label="Sửa theo tổng tiền bài viết">
            <Switch onChange={handleSwitchAdd} checked={switchAdd}></Switch>
          </Form.Item>
          {!switchAdd && (
            <Form.Item
              label="Số tiền mỗi từ"
              name="price_per_word"
              rules={[{ required: true, message: "Nhập số tiền mỗi từ" }]}
            >
              <InputNumber type="number" />
            </Form.Item>
          )}
          {switchAdd && (
            <Form.Item
              label="Tổng tiền bài viết"
              name="total"
              rules={[{ required: true, message: "Nhập số tiền bài viết" }]}
            >
              <InputNumber type="number" name="total" />
            </Form.Item>
          )}
        </>
      );
    }
  };

  const Total = () => {
    return sum?.map((item) => item?.key === sumKey);
  };
  // console.log(Total, 'taaaa');
  const getUser = async () => {
    const user = await getLoggedInUser();
    if (user?.role !== "Admin") {
      setTeam({ key: user?.team?._id, value: user?.team?.name });
    }
    setUser(user);
  };
  useEffect(() => {
    getUser();
    getListBrand();
  }, []);

  //File.extension
  //File.Filel.extension
  const [movies, setMovies] = useState([]);
  const [isModalOpenExcelMau, setIsModalOpenExcelMau] = useState(false);
  const [isModalOpenExcelTeams, setIsModalOpenExcelTeams] = useState(false);
  const [required, setRequired] = useState(false);
  const [requireds, setRequireds] = useState(true);
  const [file, setFile] = useState("");

  const showModal = () => {
    setIsModalOpenExcelMau(true);
  };

  const handleOk = () => {
    setIsModalOpenExcelMau(false);
  };

  const handleCancel = () => {
    setFile("");
    setRequireds(true);
    setRequired(false);
    setMovies([]);
    setIsModalOpenExcelMau(false);
    form.resetFields();
  };

  const showModalExcelTeams = () => {
    setIsModalOpenExcelTeams(true);
  };

  const handleOkExcelTeams = () => {
    // setIsModalOpenExcelTeams(false);
    exportDataTeam();
  };

  const handleCancelExcelTeams = () => {
    setIsModalOpenExcelTeams(false);
    form.resetFields();
  };
  const onFinishExcelMau = async (values) => {
    let listData = [];
    movies?.map((item) => {
      let a = {
        link_post: item?.link_post,
        link_posted: item?.link_posted,
        status: item?.status,
        category: item?.category,
        keyword: item?.keyword,
        collaboratorId: values?.collaboratorId,
        domain: values?.domain,
        price_per_word: item?.total ? null : values?.price_per_word,
        total: item?.total,
        isPosted: item?.isPosted || 0,
        isDesign: item?.isDesign || 0,
      };

      listData.push(a);
    });
    const addImportExcel = await createLinkManagementExcel(listData);
    addImportExcel.status === 1
      ? message.success(
          `Lưu thành công ${addImportExcel?.countSuccess} và có ${addImportExcel?.countMatch} link bị trùng!`
        )
      : message.error("không thành công !");
    setFile();
    setMovies();
    setIsModalOpenExcelMau(false);
  };

  const handleImport = ($event) => {
    const files = $event.target.files;
    setFile(files[0].name);
    if (files.length) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const wb = read(event.target.result);
        const sheets = wb.SheetNames;
        if (sheets.length) {
          const rows = utils.sheet_to_json(wb.Sheets[sheets[0]]);
          rows.map((item, index) => {
            if (!item?.category) {
              return message.error(
                `File excel Category hàng thứ ${index + 2} không được để trống`
              );
            }
            if (!item?.keyword) {
              return message.error(
                `File excel keyword hàng thứ ${index + 2} không được để trống`
              );
            }
            if (!item?.link_post) {
              return message.error(
                `File excel link_post hàng thứ ${index + 2} không được để trống`
              );
            }

            if (item.total) {
              setRequired(true);
              setRequireds(false);
            } else {
              setRequired(false);
              setRequireds(true);
            }
          });

          setMovies(rows);
        }
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const handleSelectBrandExcel = (value) => {
    setBrandExcel(value);
  };

  const handleSelectTeamExcel = (value) => {
    setTeamExcel(value);
  };
  const onClearBrandExcel = () => {
    setBrandExcel({});
    setTeamListExcel([]);
    setTeamExcel({});
  };

  const exportDataTeam = async () => {
    await exportDataTeams(brandExcel?.key, teamExcel?.key);
  };

  useEffect(() => {
    exportDataTeam();
  }, []);

  const [dateRange, setDateRange] = useState([
    dayjs().subtract(30, "days"),
    dayjs(),
  ]);
  const onDateRangeChange = (dates, dateStrings) => {
    const date = [dates[0].toISOString(), dates[1].toISOString()];
    setDateRange(dates);
  };

  return (
    <>
      {checkRole === true ? (
        <>
          {contextHolder}

          <React.Fragment>
            <div className="page-content">
              <Container fluid>
                <BreadCrumb
                  title="Cộng tác viên"
                  pageTitle="Domains"
                  slug="domains"
                />
                <Row>
                  <>
                    <Col lg={2}>
                      <p className="custom-label">Tên thương hiệu</p>
                      <Select
                        // showSearch
                        style={{ width: "100%" }}
                        placeholder="Search to Select"
                        value={brand}
                        onSelect={(key, value) => handleSelectBrand(value)}
                        options={brandList}
                      ></Select>
                    </Col>
                  </>
                  <Col lg={2}>
                    <p className="custom-label">Team</p>
                    <Select
                      // showSearch
                      style={{ width: "100%" }}
                      placeholder="Search to Select"
                      value={team}
                      onSelect={(key, value) => handleSelectTeam(value)}
                      options={teamList}
                      allowClear
                      onClear={() => setTeam({})}
                      disabled={user?.role !== "Admin"}
                    ></Select>
                  </Col>
                  <Col lg={2}>
                    <p className="custom-label">Domains</p>
                    <Select
                      // showSearch
                      style={{ width: "100%" }}
                      placeholder="Search to Select"
                      value={domain}
                      onSelect={(key, value) => handleSelectDomain(value)}
                      options={domainList}
                      allowClear
                      onClear={() => setDomain({})}
                    ></Select>
                  </Col>
                  <Col lg={2}>
                    <p className="custom-label">Cộng tác viên</p>
                    <Select
                      // showSearch
                      style={{ width: "100%" }}
                      placeholder="Search to Select"
                      value={colab}
                      onSelect={(key, value) => handleSelectColaps(value)}
                      options={domain?.key ? colabList : linkByTeam}
                      allowClear
                      onClear={() => setColab({})}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col lg="3">
                    <p className="custom-label">Tìm kiếm theo bài viết</p>
                    <Search
                      placeholder="input search text"
                      enterButton="Search"
                      size="medium"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      onSearch={onSearch}
                    />
                  </Col>
                  <Col lg="2">
                    <p className="custom-label">Lọc theo ngày</p>
                    <Space size={15}>
                      <RangePicker
                        style={{ height: "40px" }}
                        defaultValue={dateRange}
                        value={dateRange}
                        allowClear={false}
                        onChange={onDateRangeChange}
                      />
                    </Space>
                  </Col>
                  <Col>
                    <br />
                    <Button
                      style={{ height: 36, margin: "5px" }}
                      type="primary"
                      onClick={handleGetLinkPostByColaps}
                    >
                      Lọc
                    </Button>
                  </Col>
                </Row>
                <Row style={{ marginTop: "10px" }}>
                  <Col lg="2">
                    <Button
                      type="primary"
                      style={{
                        marginBottom: 16,
                      }}
                      onClick={handleOpenModal}
                    >
                      Thêm bài viết
                    </Button>
                  </Col>
                  <Col lg="2">
                    <p className="custom-label">
                      Tổng số tiền :{" "}
                      {/* {colab
                    ? colab?.total?.toLocaleString("it-IT", {
                        style: "currency",
                        currency: "VND",
                      })
                    : null} */}
                      {(colab
                        ? colab?.total || 0
                        : domain
                        ? domain?.total || 0
                        : team
                        ? team?.total || 0
                        : brand
                        ? brand?.total || 0
                        : 0
                      ).toLocaleString("it-IT", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </p>
                  </Col>
                  <Col style={{ width: "130px" }} lg="6">
                    <div style={{ display: "flex" }}>
                      <Space>
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

                        {/* <Button onClick={showModalExcelTeams} style={{backgroundColor:"rgb(135 137 15)", color:'white', border:'none'}} >Xuất excel theo teams</Button> */}
                        <Button onClick={showModal}>Import excel mẫu</Button>
                      </Space>
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Table
                    columns={columns}
                    dataSource={data}
                    pagination={false}
                    scroll={{ x: 1400, y: 600 }}
                  />
                </Row>
                <Row style={{ display: "flex", float: "right" }}>
                  <Pagination
                    pageSize={pageSize}
                    onChange={(page, pageSize) => {
                      setPageIndex(page !== 0 ? page : 1);
                      setPageSize(pageSize);
                    }}
                    showTotal={(total) => `Tổng ${total} bài viết`}
                    total={total}
                    showSizeChanger
                  />
                </Row>
              </Container>
            </div>
          </React.Fragment>
          <Modal
            title={edit ? "Sửa bài viết" : "Thêm bài viết"}
            open={openModal}
            onOk={handleCloseModal}
            onCancel={handleCloseModal}
            footer={false}
          >
            <Row style={{ margin: 0 }}>
              <Form
                name="basic"
                layout="vertical"
                form={form}
                onFinish={onFinish}
                // onFinishFailed={onFinishFailed}
                onLoad={<Spin delay={500} key="1"></Spin>}
                autoComplete="off"
              >
                {
                  ShowEditLink()
                  // !edit && (
                  //   <>
                  //     <Form.Item
                  //       label="Link bài viết"
                  //       name="link_post"
                  //       rules={[{ required: true, message: "Nhập link bài viết" }]}
                  //     >
                  //       <Input />
                  //     </Form.Item>
                  //     <p style={{ color: "orange" }}>
                  //       Lưu ý: bài viết phải chuẩn định dạng google document. Nếu vẫn
                  //       có lỗi bạn hãy copy nội dung qua một google document khác và
                  //       thử lại.
                  //     </p>
                  //     <Form.Item
                  //       label="Số tiền mỗi từ"
                  //       name="price_per_word"
                  //       rules={[{ required: true, message: "Nhập số tiền mỗi từ" }]}
                  //     >
                  //       <InputNumber type="number" />
                  //     </Form.Item>
                  //   </>
                  // )
                }

                <Form.Item label="Link đã đăng" name="link_posted">
                  <Input />
                </Form.Item>
                <Form.Item
                  label="Từ khóa"
                  name="keyword"
                  rules={[{ required: true, message: "Nhập từ khóa " }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label="Chuyên mục"
                  name="category"
                  rules={[{ required: true, message: "Nhập chuyên mục !" }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item label="Trạng thái" name="status">
                  <Select defaultValue={1}>
                    <Option key="Đã đăng" value={1}>
                      Đã đăng
                    </Option>
                    <Option key="Nháp" value={2}>
                      Nháp
                    </Option>
                  </Select>
                </Form.Item>
                <Form.Item style={{ float: "right" }}>
                  <Button
                    style={{ marginRight: "10px" }}
                    onClick={handleCloseModal}
                  >
                    Quay về
                  </Button>
                  <Button type="primary" htmlType="submit" disabled={loading}>
                    <span>
                      {loading ? <Spin key="1"/> : edit ? "Chỉnh sửa" : <>Thêm</>}
                    </span>
                  </Button>
                </Form.Item>
              </Form>
            </Row>
          </Modal>
          <ModalLinkDocs
            isModalOpen={isModalOpenLinkDocs}
            handleOk={handleOkLinkDocs}
            handleCancel={handleCancelLinkDocs}
          />
          <Modal
            title="Import file excel"
            open={isModalOpenExcelMau}
            footer={false}
            onOk={handleOk}
            onCancel={handleCancel}
            bodyStyle={{ minHeight: "200px" }}
          >
            <Form
              name="basic"
              onFinish={onFinishExcelMau}
              form={form}
              initialValues={{ remember: true }}
              autoComplete="off"
            >
              <Form.Item
                label="Domain"
                name="domain"
                rules={[{ required: true, message: "Vui lòng chọn domain!" }]}
              >
                <Select
                  onChange={(e) => setSelectedDomainAdd(e)}
                  value={selectedDomainAdd}
                  showSearch
                  optionFilterProp="label"
                >
                  {domainAdd?.map((item) => {
                    return (
                      <>
                        <Option
                          value={item?._id}
                          key={item?.name}
                          label={item?.name}
                        >
                          {item?.name}
                        </Option>
                      </>
                    );
                  })}
                </Select>
              </Form.Item>
              <Form.Item
                label="Cộng tác viên"
                name="collaboratorId"
                rules={[
                  { required: true, message: "Vui lòng chọn cộng tác viên!" },
                ]}
              >
                <Select>
                  {colabAdd?.map((item) => {
                    return (
                      <>
                        <Option value={item?._id}>{item?.name}</Option>
                      </>
                    );
                  })}
                </Select>
              </Form.Item>
              <Form.Item
                label="Số tiền mỗi từ"
                name="price_per_word"
                rules={[
                  { required: requireds, message: "Nhập số tiền mỗi từ" },
                ]}
              >
                <InputNumber type="number" disabled={required} />
              </Form.Item>
              <Form.Item>
                <div style={{ height: "20px", display: "flex" }}>
                  <div style={{ width: "50%" }}>
                    <span
                      style={{
                        width: "150px",
                        textAlign: "center",
                        borderRadius: "6px",
                        background: "orange",
                        cursor: "pointer",
                        marginLeft: "10px",
                        display: "block",
                      }}
                    >
                      <input
                        style={{ display: "none" }}
                        type="file"
                        name="file"
                        className="custom-file-input"
                        id="inputGroupFile"
                        required
                        onChange={(e) => handleImport(e)}
                        accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                      />
                      <label
                        style={{
                          width: "150px",
                          marginTop: "7px",
                          cursor: "pointer",
                        }}
                        className="custom-file-label"
                        htmlFor="inputGroupFile"
                      >
                        Import file excel
                      </label>
                    </span>
                    {file ? (
                      <span style={{ marginLeft: "10px" }}>{file}</span>
                    ) : (
                      ""
                    )}
                  </div>
                  <Button
                    style={{ height: "37px" }}
                    type="primary"
                    onClick={() => exportExcelMau()}
                  >
                    Xuất file excel mẫu
                  </Button>
                </div>
              </Form.Item>
              <Form.Item className="mt-5" style={{ textAlign: "right" }}>
                <Button type="primary" htmlType="submit">
                  Lưu
                </Button>
              </Form.Item>
            </Form>
          </Modal>
          <Modal
            title="Xuất excel theo teams"
            open={isModalOpenExcelTeams}
            onOk={handleOkExcelTeams}
            onCancel={handleCancelExcelTeams}
          >
            <Col lg={12}>
              <p className="custom-label">Tên thương hiệu</p>
              <Select
                // showSearch
                style={{ width: "100%" }}
                placeholder="Search to Select"
                value={brandExcel}
                onSelect={(key, value) => handleSelectBrandExcel(value)}
                options={brandListExcel}
                onClear={onClearBrandExcel}
                allowClear
              ></Select>
            </Col>
            <Col lg={12}>
              <p className="custom-label">Team</p>
              <Select
                // showSearch
                style={{ width: "100%" }}
                placeholder="Search to Select"
                value={teamExcel}
                onSelect={(key, value) => handleSelectTeamExcel(value)}
                options={teamListExcel}
                allowClear
                onClear={() => setTeamExcel({})}
                // disabled={user?.role !== "Admin"}
              ></Select>
            </Col>
          </Modal>
        </>
      ) : (
        <Page403 />
      )}
    </>
  );
};
export default LinkManagement;
