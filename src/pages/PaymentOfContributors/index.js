import { withRouter, Link } from "react-router-dom";
import "./PaymentOfContributors.css";
import React, { useState } from "react";
import { DownOutlined, UpOutlined } from "@ant-design/icons";
import { Button, Col, Form, Input, Row, Select, Modal } from "antd";
const PaymentOfContributors = () => {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    console.log("Received values of form: ", values);
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    console.log('dsadas');
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  
  return (
    <div>
       
      <div className="Payment_container">
        <div className="Payment_title">Thanh toán tiền CTV</div>
        <br />
        <div className="Payment_form">
          <Form
            form={form}
            name="basic"
            onFinish={onFinish}
            initialValues={{ remember: true }}
            defaultValue
            autoComplete="off"
          >
            <Row>
              <Col sm={11}>
                <Form.Item
                  label="Brand"
                  name="Brand"
                  rules={[
                    { required: true, message: "Please input your Brand!" },
                  ]}
                >
                  <Select
                    defaultValue="lucy"
                    //   style={{ width: 120 }}
                    //   onChange={handleChange}
                    options={[
                      {
                        value: "jack",
                        label: "Jack",
                      },
                    ]}
                  />
                </Form.Item>
              </Col>
              <Col sm={2} />
              <Col sm={11}>
                <Form.Item
                  label="Domain"
                  name="Domain"
                  rules={[
                    { required: true, message: "Please input your Domain!" },
                  ]}
                >
                  <Select
                    defaultValue="lucy"
                    //   style={{ width: 120 }}
                    //   onChange={handleChange}
                    options={[
                      {
                        value: "jack",
                        label: "Jack",
                      },
                    ]}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col sm={11}>
                <Form.Item
                  label="CTV"
                  name="CTV"
                  rules={[
                    { required: true, message: "Please input your CTV!" },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col sm={2} />
              <Col sm={11}>
                <Form.Item
                  label="STK"
                  name="STK"
                  rules={[
                    { required: true, message: "Please input your STK!" },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col sm={11}>
                <Form.Item
                  label="Ngân hàng"
                  name="Ngân hàng"
                  rules={[
                    { required: true, message: "Please input your Ngân hàng!" },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col sm={2} />
              <Col sm={11}>
                <Form.Item
                  label="Chủ TK"
                  name="Chủ TK"
                  rules={[
                    { required: true, message: "Please input your Chủ TK!" },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col sm={24}>
                <Form.Item
                  label="Chuyên mục"
                  name="Chuyên mục"
                  rules={[
                    {
                      required: true,
                      message: "Please input your Chuyên mục!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col sm={11}>
                <Form.Item
                  label="Số bài 500 từ"
                  name="Số bài 500 từ"
                  rules={[
                    {
                      required: true,
                      message: "Please input your Số bài 500 từ!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col sm={2} />
              <Col sm={11}>
                <Form.Item
                  label="Số tiền"
                  name="Số tiền"
                  rules={[
                    { required: true, message: "Please input your Số tiền!" },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <div style={{ marginBottom: "20px" }}>
              <span style={{ color: "red", fontWeight: "bold" }}>
                Tiền thanh toán : 100.000 VNĐ
              </span>
            </div>
            <Row>
              <Col sm={11}>
                <Form.Item
                  label="Số bài 700 từ"
                  name="Số bài 700 từ"
                  rules={[
                    {
                      required: true,
                      message: "Please input your Số bài 700 từ!",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col sm={2} />
              <Col sm={11}>
                <Form.Item
                  label="Số tiền"
                  name="Số tiền"
                  rules={[
                    { required: true, message: "Please input your Số tiền!" },
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <div style={{ marginBottom: "20px" }}>
              <span style={{ color: "red", fontWeight: "bold" }}>
                Tiền thanh toán : 100.000 VNĐ
              </span>
            </div>
          </Form>
        </div>
      </div>
      <Row style={{ padding: "10px 150px" }}>
        <Col sm={12}>
          <div style={{ color: "red", fontWeight: "bold", fontSize: "20px" }}>
            Tổng tiền thanh toán: 200.000 VNĐ
          </div>
        </Col>
        <Col sm={12}>
            <Button type="primary" onClick={showModal}>
                Open Modal
            </Button>
        </Col>
      </Row>
      
      <Modal
        title="Basic Modal"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p> 
      </Modal>
    </div>
  );
};

export default PaymentOfContributors;
