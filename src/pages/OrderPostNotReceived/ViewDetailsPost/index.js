import {
  Button,
  DatePicker,
  Drawer,
  Form,
  Input,
  InputNumber,
  Tag,
} from "antd";
import { useEffect, useState } from "react";
import { HiEye } from "react-icons/hi";

const ViewDetailsPost = ({ record }) => {
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };
  useEffect(() => {
    form.setFieldsValue(record);
  }, []);

  return (
    <>
      <HiEye
        onClick={showDrawer}
        size={20}
        color={"blue"}
        style={{ cursor: "pointer" }}
      />
      <Drawer
        title="Chi tiết bài viết"
        placement="right"
        style={{ marginTop: "70px" }}
        onClose={onClose}
        open={open}
      >
        <Form
          name="basic"
          form={form}
          autoComplete="off"
          layout="vertical"
          disabled
        >
          <Form.Item label="Tên bài viết" name="title">
            <Input />
          </Form.Item>

          <Form.Item label="Mô tả" name="desc">
            <Input.TextArea />
          </Form.Item>
          <Form.Item label="Tiền cho mỗi từ" name="moneyPerWord">
            <InputNumber
              style={{ width: "100%" }}
              formatter={(value) =>
                `${value} VND`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
            />
          </Form.Item>
          <Form.Item name="minWord" label="Số từ tối thiểu">
            <Input />
          </Form.Item>
          <Form.Item label="Từ khóa" name="keyword">
            {record?.keyword?.map((item) => (
              <Tag key={item} color={"cyan"}>
                {item}
              </Tag>
            ))}
          </Form.Item>
        </Form>
      </Drawer>
    </>
  );
};
export default ViewDetailsPost;
