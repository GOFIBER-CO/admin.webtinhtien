import {
  Button,
  Col,
  Input,
  Row,
  DatePicker,
  InputNumber,
  Space,
  Form,
  Select,
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
          <Col md={5}>
            <Form.Item label="Tên bài viết" name={"title"}>
              <Input placeholder="Vui lòng nhập tên" />
            </Form.Item>
          </Col>
          <Col md={5}>
            <Form.Item label="Keyword" name={"keyword"}>
              <Input placeholder="Keyword" />
            </Form.Item>
          </Col>

          <Col md={5}>
            <Form.Item label="Thời gian tạo" name={"createdAt"}>
              <RangePicker size="small" />
            </Form.Item>
          </Col>
          <Col md={5}>
            <Form.Item label="Giá tiền cho mỗi từ" name={"moneyPerWord"}>
              <InputNumber
                placeholder="Giá tiền cho mỗi từ"
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>
          <Col md={4}>
            <Form.Item label="Trạng thái" name={"status"}>
              <Select
                placeholder="Trạng thái bài viết"
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
