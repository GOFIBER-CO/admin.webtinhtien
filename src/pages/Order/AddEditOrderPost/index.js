import { Col, Input, InputNumber, Row, Form, Button, message } from "antd";
import TextArea from "antd/es/input/TextArea";
import { React, useEffect } from "react";
import {
  handleArrayToString,
  handleKeyWord,
} from "../../../helpers/convertKeyword";
import { createOrderPost, updateOrderPost } from "../../../helpers/helper";

const AddEditOrderPost = ({ dataDrawer, close, getListData }) => {
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
        minWord: dataDrawer?.minWord,
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
      minWord: value?.minWord,
      moneyPerWord: value?.moneyPerWord,
      keyword: newKeyword,
    };
    if (value?.id) {
      const result = await updateOrderPost(data);
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
            <Form.Item label="" name="id" hidden>
              <Input type="hidden" name="id" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label="Title"
              name="title"
              rules={[
                { required: true, message: "Vui lòng nhập tên bài viết!" },
              ]}
            >
              <Input placeholder="Tên bài viết" name="title" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item label="Mô tả" name="desc">
              <TextArea rows={4} />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label="Số tiền mỗi từ"
              name="moneyPerWord"
              rules={[{ required: true, message: "Vui lòng nhập số tiền!" }]}
            >
              <InputNumber min={1} controls={false} />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label="Số từ tối thiểu"
              name="minWord"
              rules={[
                { required: true, message: "Vui lòng nhập số từ tối thiểu!" },
              ]}
            >
              <InputNumber min={1} controls={false} />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label={`Keyword (Mỗi keyword cách nhau bởi "Enter")`}
              name="keyword"
              rules={[{ required: true, message: "Vui lòng nhập từ khóa !" }]}
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
