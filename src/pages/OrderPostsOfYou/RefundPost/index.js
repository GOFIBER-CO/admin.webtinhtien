import { Button, message, Modal, Tooltip } from "antd";
import { useState } from "react";
import { HiReceiptRefund } from "react-icons/hi";
import { refundPost } from "../../../helpers/helper";
const RefundPost = ({ record, getData }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    if (!record?.paymentStatus) {
      setIsModalOpen(true);
    }
  };
  const handleOk = () => {
    refundPost(record?._id)
      .then((data) => {
        if (data.status === 200) message.success(data.message);
        else {
          message.error(data.message);
        }
        getData();
        setIsModalOpen(false);
      })
      .catch((err) => {
        message.error(err.message);
      });
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
        style={{ cursor: record?.paymentStatus ? "not-allowed" : "pointer" }}
      />

      <Modal
        title="Hoàn trả bài viết"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Đồng ý"
        cancelText="Hủy"
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
