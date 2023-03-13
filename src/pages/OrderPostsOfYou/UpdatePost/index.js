import { Button, Drawer, Form, Input, InputNumber, Tag, message } from "antd";
import { useEffect, useState } from "react";
import { GrDocumentUpdate } from "react-icons/gr";
import { countWord } from "../../../helpers/helper";
import { IoOpenOutline } from "react-icons/io5";

const UpdatePost = ({ record }) => {
  const [form] = Form.useForm();
  const [isLink, setIsLink] = useState(false);
  const [link, setLink] = useState("");
  console.log('link:', link)
  const [open, setOpen] = useState(false);
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };
  const onLinkChange = (value) => {
    const rs = value?.target?.value?.length > 0 ? true : false;
    setIsLink(rs);
    setLink(value?.target?.value);
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
  const openWebsite = () => {
    window.open(link, "_blank");
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
        title="Cập nhật bài viết"
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
          <Form.Item label="id" name="_id" hidden>
            <Input disabled />
          </Form.Item>
          <Form.Item label="Tên bài viết" name="title">
            <Input disabled />
          </Form.Item>

          <Form.Item label="Mô tả" name="desc">
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
          <Form.Item label="Từ khóa" name="keyword">
            {record?.keyword?.map((item) => (
              <Tag key={item} color={"cyan"}>
                {item}
              </Tag>
            ))}
          </Form.Item>
          <Form.Item label="Đường dẫn bài viết" name="link">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "1rem",
              }}
            >
              <Input
                style={{ width: "87%" }}
                disabled={record?.paymentStatus}
                onChange={onLinkChange}
              />
              <IoOpenOutline
                size={25}
                style={{
                  cursor: "pointer",
                  display: isLink ? "block" : " none",
                }}
                onClick={openWebsite}
              />
            </div>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              disabled={record?.paymentStatus}
            >
              Gửi
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
    </>
  );
};
export default UpdatePost;
