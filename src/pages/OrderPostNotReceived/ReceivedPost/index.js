import { Button, message, Modal, Tooltip } from "antd";
import { useState } from "react";
import { BsFillBagPlusFill } from "react-icons/bs";
import { receivedPost, updateRecord } from "../../../helpers/helper";
const ReceivedPost = ({ record, getData }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = async () => {
    const received = await receivedPost(record?._id);
    // console.log(received.data);
    if (received.status === 200) {
      message.success("Nhận bài viết thành công!");
      getData();
      setIsModalOpen(false);
    } else {
      message.error(received?.message);
    }
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  return (
    <>
      <BsFillBagPlusFill
        onClick={showModal}
        size={20}
        color={"green"}
        style={{ cursor: "pointer" }}
      />

      <Modal
        title="Nhận bài viết"
        open={isModalOpen}
        onOk={handleOk}
        okText="Nhận"
        cancelText="Từ chối"
        onCancel={handleCancel}
      >
        <p>Bạn có chắc chắn muốn nhận bài viết?</p>
      </Modal>
    </>
  );
};
export default ReceivedPost;
