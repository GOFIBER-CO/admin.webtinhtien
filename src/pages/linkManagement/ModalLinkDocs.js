import { Button, Form, Input, Modal, Spin } from "antd";
import { useEffect, useState } from "react";

const ModalLinkDocs = ({ isModalOpen, handleOk, handleCancel }) => {
  const [linkDocs, setLinkDocs] = useState("");

  const getData = async () => {
    try {
      const res = await fetch(
        "https://sheet.best/api/sheets/59a8f2d1-c71f-4fd9-833f-d180a7cb41e2"
      );
      // console.log(res, 'res');
      const data = await res.json();
      // console.log(data, 'data');
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getData();
  }, [linkDocs]);
  const onFinish = (values) => {
    setLinkDocs(values);
  };

  return (
    <Modal
      title="Import link google docs"
      footer={false}
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <Form
        name="basic"
        layout="vertical"
        // form={form}
        onFinish={onFinish}
        // onFinishFailed={onFinishFailed}
        onLoad={<Spin delay={500} key="1"></Spin>}
        autoComplete="off"
      >
        <Form.Item
          label="Link google docs"
          name="link"
          rules={[{ required: true, message: "không được bỏ trống" }]}
        >
          <Input />
        </Form.Item>
        <p style={{ color: "orange" }}>
          Lưu ý: Link google docs phải chuẩn định dạng google document. Nếu vẫn
          có lỗi bạn hãy copy nội dung qua một google document khác và thử lại.
        </p>
        <Button type="primary" htmlType="submit">
          Xác nhận
        </Button>
      </Form>
    </Modal>
  );
};

export default ModalLinkDocs;
