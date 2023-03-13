import {
  Button,
  Col,
  Input,
  Row,
  DatePicker,
  InputNumber,
  Space,
  Form,
} from "antd";
import "./styles.css";
import moment from "moment/moment";
import React from "react";
import { BiSearchAlt } from "react-icons/bi";
const { RangePicker } = DatePicker;
export default function SearchConponent({ handleSearch }) {
  return (
    <>
      <Form
        style={{ display: "flex" }}
        layout="vertical"
        onFinish={handleSearch}
      >
        <Row gutter={10} className={"order-post-not-received-search"}>
          <Col md={6}>
            <Form.Item label="Tên bài viết" name={"title"}>
              <Input />
            </Form.Item>
          </Col>
          <Col md={6}>
            <Form.Item label="Từ khóa" name={"keyword"}>
              <Input />
            </Form.Item>
          </Col>

          <Col md={6}>
            <Form.Item label="Thời gian tạo" name={"createdAt"}>
              <RangePicker size="small" />
            </Form.Item>
          </Col>
          <Col md={6}>
            <Form.Item label="Giá tiền cho mỗi từ" name={"moneyPerWord"}>
              <InputNumber
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>
          <Col md={8}>
            <Button icon={<BiSearchAlt />} htmlType="submit" type="primary">
              Tìm kiếm
            </Button>
          </Col>
        </Row>
      </Form>
    </>
  );
}
