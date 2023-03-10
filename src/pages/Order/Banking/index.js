import React, { useEffect, useState } from "react";
import {
  Button,
  Modal,
  Form,
  Col,
  Row,
  Input,
  Space,
  InputNumber,
  message,
} from "antd";
import { updateBankingOrderPost } from "../../../helpers/helper";

const Banking = ({ dataDrawer, onclose }) => {
  console.log("dataDrawer: ", dataDrawer);
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
    onclose(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  useEffect(() => {
    form.setFieldsValue({
      id: dataDrawer?._id,
      title: dataDrawer?.title,
      ctv: `${dataDrawer?.ctv?.firstName} ${dataDrawer?.ctv?.lastName}`,
      money: (
        Number(dataDrawer?.moneyPerWord) * Number(dataDrawer?.currentWord)
      ).toLocaleString("vi-VN", {
        style: "currency",
        currency: "VND",
      }),
    });
  }, [dataDrawer]);
  const onFinish = async (value) => {
    const rs = await updateBankingOrderPost(value);
    try {
      if (rs?.status === 200) {
        setIsModalOpen(false);
        message.success(`Thành công`);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <Button
        type="primary"
        onClick={showModal}
        hidden={dataDrawer["statusOrderPost"] === 1 ? false : true}
        disabled={dataDrawer["statusOrderPost"] === 1 ? false : true}
      >
        Thanh toán
      </Button>
      <Modal
        title="Thông tin "
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
      >
        <Form layout="vertical" form={form} onFinish={onFinish}>
          <Row>
            <Col span={24}>
              <Form.Item label="Id" name="id" hidden>
                <Input />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="Bài viết" name="title">
                <Input />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="Công tác viên" name="ctv">
                <Input />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="Nhuận bút" name="money">
                <InputNumber />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Space>
                <Button type="primary" htmlType="submit" disabled={false}>
                  Thanh toán
                </Button>
              </Space>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
};

export default Banking;
