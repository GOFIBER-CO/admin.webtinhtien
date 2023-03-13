import { Popover, Space, Table, Tag, Tooltip } from "antd";
import moment from "moment/moment";
import { BsCheckCircle } from "react-icons/bs";
import { MdPendingActions } from "react-icons/md";
import RefundPost from "../RefundPost";
import UpdatePost from "../UpdatePost";
const TableData = ({
  pageSize,
  pageIndex,
  setPageSize,
  setPageIndex,
  data,
  getData,
}) => {
  const columns = [
    {
      title: "Tên bài viêt",
      dataIndex: "title",
      key: "name",
    },

    {
      title: "Số tiền cho mỗi từ",
      dataIndex: "moneyPerWord",
      key: "moneyPerWord",
    },
    // {
    //   title: "Status",
    //   dataIndex: "status",
    //   key: "status",
    //   render: (_) => {
    //     const rs = { "-1": "Chưa nhận", 0: "Đã nhận", 1: "Hoàn thành" }[_];
    //     return <>{rs}</>;
    //   },
    // },
    {
      title: "Trạng thái thanh toán",
      dataIndex: "paymentStatus",
      key: "paymentStatus",

      render: (_) =>
        _ ? (
          <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
            <BsCheckCircle color="green" />
            <span>Đã duyệt</span>
          </div>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
            <MdPendingActions color="red" size={18} />
            <span>Đang chờ thanh toán</span>
          </div>
        ),
    },
    {
      title: "Từ khóa",
      key: "keyword",
      dataIndex: "keyword",
      render: (_, { keyword }) => (
        <>
          {keyword.map((tag) => {
            let color = tag.length > 5 ? "geekblue" : "green";
            if (tag === "loser") {
              color = "volcano";
            }
            return (
              <Tag color={color} key={tag}>
                {tag.toUpperCase()}
              </Tag>
            );
          })}
        </>
      ),
    },
    {
      title: "Hoàn thành trước",
      dataIndex: "expired",
      key: "expired",
      render: (_) => (
        <>
          <span style={{ fontWeight: "500", fontStyle: "italic" }}>
            23h:59p:59s
          </span>{" "}
          {moment(_).format("DD-MM-YYYY")}
        </>
      ),
    },

    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <RefundPost record={record} getData={getData} />
          <UpdatePost record={record} />
        </Space>
      ),
    },
  ];
  return (
    <Table
      columns={columns}
      dataSource={data}
      pagination={{
        showSizeChanger: true,
        pageSize,
        current: pageIndex,
        onChange: (newIndex, newSize) => {
          if (newSize !== pageSize) {
            setPageSize(newSize);
            setPageIndex(1);
          } else {
            pageIndex(newIndex);
          }
        },
      }}
    />
  );
};
export default TableData;
