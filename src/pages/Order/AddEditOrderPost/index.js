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
  Rate,
  Space,
  Switch,
} from "antd";
import TextArea from "antd/es/input/TextArea";

import { React, useEffect, useState } from "react";
import {
  handleArrayToString,
  handleKeyWord,
} from "../../../helpers/convertKeyword";
import { createOrderPost, updateOrderPost } from "../../../helpers/helper";
import moment from "moment/moment";
import dayjs from "dayjs";
import { IoOpenOutline } from "react-icons/io5";
import Banking from "../Banking";

const AddEditOrderPost = ({ dataDrawer, close, getListData }) => {
  const desc = ["Quá tệ", "Tạm được", "Bình thường", "Tốt", "Tuyệt vời"];
  const [valueStar, setValueStar] = useState(0);
  const [isAccept, setIsAccept] = useState(false);
  //Không cho phép chọn ngày trong quá khứ
  const disabledDate = (current) => {
    return current && current < moment().endOf("day").subtract(1, "day");
  };
  //
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
        note: dataDrawer?.note,
        star: dataDrawer?.star,
        link: dataDrawer?.link,
      });
    }
  }, [dataDrawer]);
  const onHandleChange = (value) => {
    console.log("value:", value);
    setIsAccept(true);
  };
  const openWebsite = () => {
    window.open(dataDrawer?.link, "_blank");
  };
  const onFinish = async (value) => {
    value["keyword"] = handleKeyWord(value?.keyword);
    value["star"] = valueStar;
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
        disabled={
          dataDrawer["statusOrderPost"] !== -1 &&
          Object.keys(dataDrawer).length > 0
            ? true
            : false
        }
      >
        <Row gutter={16}>
          <Col span={12}>
            <Row>
              <Col span={24} style={{ display: "none" }}>
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
                  label={`Từ khóa chính (Mỗi từ khóa cách nhau bởi "Enter")`}
                  name="keyword"
                  rules={[
                    { required: true, message: "Vui lòng nhập từ khóa !" },
                  ]}
                >
                  <TextArea rows={4} />
                </Form.Item>
              </Col>
            </Row>
          </Col>
          <Col span={12}>
            <Row>
              <Col span={24}>
                <Form.Item
                  label="Số tiền mỗi từ"
                  name="moneyPerWord"
                  rules={[
                    { required: true, message: "Vui lòng nhập số tiền!" },
                  ]}
                >
                  <InputNumber
                    min={1}
                    controls={false}
                    style={{ width: "100%" }}
                  />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  label="Số từ tối thiểu"
                  name="minWord"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập số từ tối thiểu!",
                    },
                  ]}
                >
                  <InputNumber
                    min={1}
                    controls={false}
                    style={{ width: "100%" }}
                  />
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
                  label="Trạng thái bài viết"
                  name="status"
                  initialValue="1"
                  hidden={
                    dataDrawer["statusOrderPost"] !== -1 &&
                    dataDrawer["statusOrderPost"] !== undefined
                      ? true
                      : false
                  }
                >
                  <Select>
                    <Select.Option value="0">Ẩn</Select.Option>
                    <Select.Option value="1">Đăng</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item
                  label="Đường dẫn bài viết"
                  name="link"
                  hidden={dataDrawer["statusOrderPost"] !== 1}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-evenly",
                      gap: "1rem",
                    }}
                  >
                    <Input value={dataDrawer?.link} />
                    <IoOpenOutline
                      size={25}
                      style={{ cursor: "pointer" }}
                      onClick={openWebsite}
                    />
                  </div>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label="Chấp nhận bài viết"
                  name="accept"
                  hidden={dataDrawer["statusOrderPost"] === 1 ? false : true}
                  rules={[
                    {
                      required: true,
                      message: "Không được bỏ trống",
                    },
                  ]}
                >
                  <Select disabled={false} onChange={onHandleChange}>
                    <Select.Option value="0">Chấp nhận</Select.Option>
                    <Select.Option value="1">Từ chối</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={24} style={{ display: isAccept ? "block" : "none" }}>
                <Form.Item
                  label="Đánh giá"
                  name="star"
                  hidden={dataDrawer["statusOrderPost"] === 1 ? false : true}
                  // hidden={true}
                >
                  <Rate
                    tooltips={desc}
                    onChange={setValueStar}
                    value={valueStar}
                  />
                  {valueStar ? (
                    <span className="ant-rate-text">{desc[valueStar - 1]}</span>
                  ) : (
                    ""
                  )}
                </Form.Item>
              </Col>
              <Col span={24} style={{ display: isAccept ? "block" : "none" }}>
                <Form.Item
                  label="Nội dung đánh giá"
                  name="note"
                  hidden={dataDrawer["statusOrderPost"] === 1 ? false : true}
                >
                  <TextArea rows={4} disabled={false} />
                </Form.Item>
              </Col>
            </Row>
          </Col>
          <Col span={24}>
            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit" disabled={false}>
                  {Object.keys(dataDrawer)?.length > 0
                    ? "Cập nhật"
                    : "Thêm mới"}
                </Button>

                <Banking
                  dataDrawer={dataDrawer}
                  onclose={close}
                  getListData={getListData}
                />
              </Space>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </>
  );
};
export default AddEditOrderPost;
