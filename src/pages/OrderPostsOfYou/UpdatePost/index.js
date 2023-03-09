import { Button, Drawer, Form, Input, InputNumber, Tag, message } from "antd";
import { useEffect, useState } from "react";
import { GrDocumentUpdate } from "react-icons/gr";
import { countWord, updateOrderPost } from "../../../helpers/helper";

const UpdatePost = ({ record }) => {
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };
  useEffect(() => {
    form.setFieldsValue(record);
  }, []);
  const onFinish = async (value) => {
    const rs = await countWord(value);
    if (Object.keys(rs?.data)?.length > 0) {
      message.success(`Thành công`);
      setOpen(false);
    } else {
      message.warning("Số từ chưa đạt điều kiện " + rs?.message + " từ");
    }
  };
  return (
    <>
      <GrDocumentUpdate
        onClick={showDrawer}
        color={"blue"}
        size={20}
        style={{ color: "blue", cursor: "pointer" }}
      />
      <Drawer
        title="Update Post"
        style={{ marginTop: "70px" }}
        placement="right"
        onClose={onClose}
        open={open}
      >
        <Form
          name="basic"
          form={form}
          autoComplete="off"
          layout="vertical"
          onFinish={onFinish}
        >
          <Form.Item label="Title" name="_id" hidden>
            <Input disabled />
          </Form.Item>
          <Form.Item label="Title" name="title">
            <Input disabled />
          </Form.Item>

          <Form.Item label="Descriptions" name="desc">
            <Input.TextArea disabled />
          </Form.Item>
          <Form.Item label="Money Per Word" name="moneyPerWord">
            <InputNumber
              style={{ width: "100%" }}
              formatter={(value) =>
                `${value} VND`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              disabled
            />
          </Form.Item>
          <Form.Item label="Số từ tối thiểu" name="minWord">
            <InputNumber disabled />
          </Form.Item>
          <Form.Item label="Keyword" name="keyword">
            {record?.keyword?.map((item) => (
              <Tag key={item} color={"cyan"}>
                {item}
              </Tag>
            ))}
          </Form.Item>
          <Form.Item label="Đường dẫn bài viết" name="link">
            <Input style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Gửi
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
    </>
  );
};
export default UpdatePost;
