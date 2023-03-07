import { Col, Input, InputNumber, Row, Form, Button, message } from "antd";
import TextArea from "antd/es/input/TextArea";
import { React, useEffect } from "react";
import {
  handleArrayToString,
  handleKeyWord,
} from "../../../helpers/convertKeyword";
import { createOrderPost, updateRecord } from "../../../helpers/helper";

const AddEditOrderPost = ({ dataDrawer, close, getListData }) => {
  console.log("dataDrawer: ", dataDrawer);
  const [form] = Form.useForm();
  useEffect(() => {
    if (Object.keys(dataDrawer)?.length === 0) {
      form.resetFields();
    } else {
      form.setFieldsValue({
        id: dataDrawer?._id,
        title: dataDrawer?.title,
        desc: dataDrawer?.desc,
        moneyPerWord: dataDrawer?.moneyPerWord,
        keyword: handleArrayToString(dataDrawer?.keyword),
      });
    }
  }, [dataDrawer]);

  const onFinish = async (value) => {
    const newKeyword = await handleKeyWord(value?.keyword);
    const data = {
      id: value?.id,
      title: value?.title,
      desc: value?.desc,
      moneyPerWord: value?.moneyPerWord,
      keyword: newKeyword,
    };
    if (value?.id) {
      const result = await updateRecord(data);
      if (result?.status === 200) {
        close();

        message.success(`Update Success! `);
      }
    } else {
      const result = await createOrderPost(data);
      if (result?.status === 200) {
        close();

        message.success(`Create Success! `);
      }
    }
    getListData();
  };
  return (
    <>
      <Form onFinish={onFinish} layout="vertical" form={form}>
        <Row>
          <Col span={24}>
            <Form.Item label="" name="id">
              <Input type="hidden" name="id" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label="Title" name="title">
              <Input placeholder="..." name="title" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label="Mô tả" name="desc">
              <TextArea rows={4} />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label="Số tiền mỗi từ" name="moneyPerWord">
              <InputNumber min={1} controls={false} />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label={`Keyword (Mỗi keyword cách nhau bởi "Enter")`}
              name="keyword"
            >
              <TextArea rows={4} />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                {Object.keys(dataDrawer)?.length > 0 ? "Chỉnh sửa" : "Thêm mới"}
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </>
  );
};
export default AddEditOrderPost;
