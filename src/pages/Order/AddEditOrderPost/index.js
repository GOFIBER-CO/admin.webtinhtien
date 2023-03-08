import {
  Col,
  Input,
  InputNumber,
  Row,
  Form,
  Button,
  message,
  DatePicker,
  Select,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import { React, useEffect } from "react";
import {
  handleArrayToString,
  handleKeyWord,
} from "../../../helpers/convertKeyword";
import { createOrderPost, updateOrderPost } from "../../../helpers/helper";
import moment from "moment/moment";
import dayjs from "dayjs";

const AddEditOrderPost = ({ dataDrawer, close, getListData }) => {
  console.log("dataDrawer: ", dataDrawer);
  const disabledDate = (current) => {
    // Không cho phép chọn ngày trong quá khứ
    return current && current < moment().endOf("day").subtract(1, "day");
  };
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
        status: dataDrawer?.status.toString(),
        expired: dayjs(dataDrawer?.expired),
      });
    }
  }, [dataDrawer]);

  const onFinish = async (value) => {
    value["keyword"] = handleKeyWord(value?.keyword);
    if (value?.id) {
      const result = await updateOrderPost(value);
      if (result?.status === 200) {
        close();
        message.success(`Update Success! `);
      }
    } else {
      const result = await createOrderPost(value);
      if (result?.status === 200) {
        close();

        message.success(`Create Success! `);
      }
    }
    getListData();
  };
  return (
    <>
      <Form
        onFinish={onFinish}
        layout="vertical"
        form={form}
        disabled={dataDrawer?.ctv == null ? false : true}
      >
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
              <InputNumber min={1} controls={false} style={{ width: "100%" }} />
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
              <InputNumber min={1} controls={false} style={{ width: "100%" }} />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item
              label="Thời gian hoàn thành"
              name="expired"
              rules={[
                {
                  required: true,
                  message: "Vui lòng thêm  thời gian hoàn thành!",
                },
              ]}
            >
              {/* {Object.keys(dataDrawer).length === 0 ? (
                <DatePicker disabledDate={disabledDate} format="DD/MM/YYYY" />
              ) : ( */}

              <DatePicker
                disabledDate={disabledDate}
                format="DD/MM/YYYY"

                // defaultValue={"10/3/2023"}
              />
              {/* // )} */}
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
            <Form.Item
              label="Trạng thái bài viết"
              name="status"
              initialValue="1"
              hidden={dataDrawer["statusOrderPost"] !== -1}
            >
              <Select>
                <Select.Option value="0">Ẩn</Select.Option>
                <Select.Option value="1">Đăng</Select.Option>
              </Select>
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
