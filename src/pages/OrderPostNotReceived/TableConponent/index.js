import { Popover, Space, Table, Tag, Tooltip } from "antd";
import moment from "moment/moment";
import { BsCheckCircle } from "react-icons/bs";
import { MdPendingActions } from "react-icons/md";
import ReceivedPost from "../ReceivedPost";
import ViewDetailsPost from "../ViewDetailsPost";
const TableData = ({
  pageSize,
  pageIndex,
  setPageSize,
  setPageIndex,
  data,
  getData,
  totalDocs,
}) => {
  const columns = [
    {
      title: "Tên bài viết",
      dataIndex: "title",
      key: "name",
    },

    {
      title: "Số tiền mỗi từ",
      dataIndex: "moneyPerWord",
      key: "moneyPerWord",
    },
    {
      title: "Số từ tối thiếu",
      dataIndex: "minWord",
      key: "minWord",
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
      render: (_) => moment(_).format("DD-MM-YYYY"),
    },
    // {
    //   title: "CreatedAt",
    //   dataIndex: "createdAt",
    //   key: "createdAt",
    //   render: (_) => moment(_).format("DD-MM-YYYY"),
    // },
    // {
    //   title: "UpdatedAt",
    //   dataIndex: "updatedAt",
    //   key: "updatedAt",
    //   render: (_) => moment(_).format("DD-MM-YYYY"),
    // },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <ReceivedPost record={record} getData={getData} />
          <ViewDetailsPost record={record} />
        </Space>
      ),
    },
  ];
  return (
    <Table
      columns={columns}
      dataSource={data}
      pagination={{
        total: totalDocs,
        showSizeChanger: true,
        pageSize,
        current: pageIndex,
        onChange: (newIndex, newSize) => {
          if (newSize !== pageSize) {
            setPageSize(newSize);
            setPageIndex(1);
          } else {
            setPageIndex(newIndex);
          }
        },
      }}
    />
  );
};
export default TableData;
