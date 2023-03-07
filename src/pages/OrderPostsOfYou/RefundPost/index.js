import { Button, Modal, Tooltip } from "antd";
import { useState } from "react";
import { HiReceiptRefund } from "react-icons/hi";
const RefundPost = ({ record }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  return (
    <>
      <HiReceiptRefund
        onClick={showModal}
        size={20}
        color={"green"}
        style={{ cursor: "pointer" }}
      />

      <Modal
        title="Refund Post"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <p>
          Bài viết sẽ được trả về trạng thái chưa có người nhận và bạn sẽ bị hạ
          số sao hiện tại để đảm bảo công bằng giữa các CTV.
        </p>
        <p>Bạn có chắc chắn muốn hoàn trả bài viết?</p>
      </Modal>
    </>
  );
};
export default RefundPost;
