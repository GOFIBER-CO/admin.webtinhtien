import moment from "moment/moment";
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

const Banking = ({ dataDrawer, onclose, getListData }) => {
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
      bank_name: dataDrawer?.ctv?.bank_name,
      stk: dataDrawer?.ctv?.stk,
      fullName: dataDrawer?.ctv?.fullName,
      money: (
        Number(dataDrawer?.moneyPerWord) * Number(dataDrawer?.currentWord)
      ).toLocaleString("vi-VN", {
        style: "currency",
        currency: "VND",
      }),
      withdrawnDate: moment(dataDrawer?.withdrawnDate).format("DD-MM-YYYY"),
    });
  }, [dataDrawer]);
  const onFinish = async (value) => {
    const rs = await updateBankingOrderPost(value);
    try {
      if (rs?.status === 200) {
        setIsModalOpen(false);
        message.success(`Thành công`);
      } else if (rs?.status === 409) {
        message.success(`Bài viết này đã được thanh toán`);
      } else {
        //
      }
      getListData();
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
              <Form.Item label="Tên ngân hàng" name="bank_name">
                <Input />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="Số tài khoản" name="stk">
                <Input />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="Chủ tài khoản" name="fullName">
                <Input />
              </Form.Item>
            </Col>

            <Col span={24}>
              <Form.Item label="Nhuận bút" name="money">
                <InputNumber />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item
                label="Đã thanh toán"
                name="withdrawnDate"
                hidden={dataDrawer?.withdrawnDate ? false : true}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Space>
                <Button
                  type="primary"
                  htmlType="submit"
                  disabled={dataDrawer?.withdrawnDate ? true : false}
                >
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
