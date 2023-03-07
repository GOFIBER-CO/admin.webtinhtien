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
}) => {
  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "name",
    },

    {
      title: "Money Per Word",
      dataIndex: "moneyPerWord",
      key: "moneyPerWord",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Payment Status",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
      render: (_) =>
        _ ? (
          <BsCheckCircle color="green" />
        ) : (
          <Popover content="Đang chờ thanh toán">
            <MdPendingActions color="red" size={20} />
          </Popover>
        ),
    },
    {
      title: "Keyword",
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
      title: "CreatedAt",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (_) => moment(_).format("DD-MM-YYYY"),
    },
    {
      title: "UpdatedAt",
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: (_) => moment(_).format("DD-MM-YYYY"),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <RefundPost record={record} />
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