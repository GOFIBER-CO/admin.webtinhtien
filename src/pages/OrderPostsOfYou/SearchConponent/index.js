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
        id="form-search-post-of-you"
      >
        <Row gutter={[10, 10]} className={"order-post-not-received-search"}>
          <Col span={5}>
            <Form.Item label="Tên bài viết" name={"title"}>
              <Input  />
            </Form.Item>
          </Col>
          <Col span={5}>
            <Form.Item label="Từ khóa" name={"keyword"}>
              <Input style={{ width: "100%" }} />
            </Form.Item>
          </Col>

          <Col span={5}>
            <Form.Item label="Thời gian tạo" name={"createdAt"}>
              <RangePicker size="small" />
            </Form.Item>
          </Col>

          <Col span={4}>
            <div className="selected">
              <Form.Item
                label="Trạng thái thanh toán"
                name={"paymentStatus"}
                initialValue="2"
              >
                <Select>
                  <Select.Option value="2">Tất cả</Select.Option>
                  <Select.Option value="1">Đã thanh toán</Select.Option>
                  <Select.Option value="0">Chưa thanh toán</Select.Option>
                </Select>
              </Form.Item>
            </div>
          </Col>
          <Col span={8}>
            <Button icon={<BiSearchAlt />} htmlType="submit" type="primary">
              Tìm kiếm
            </Button>
          </Col>
        </Row>
      </Form>
    </>
  );
}
