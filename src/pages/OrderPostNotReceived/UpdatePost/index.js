import { Button, Drawer } from "antd";
import { useState } from "react";
import { GrDocumentUpdate } from "react-icons/gr";
const UpdatePost = ({ record }) => {
  const [open, setOpen] = useState(false);
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };
  return (
    <>
      <GrDocumentUpdate
        onClick={showDrawer}
        color={"blue"}
        size={20}
        style={{ color: "blue", cursor: "pointer" }}
      />
      <Drawer
        title="Cập nhật bài viết"
        style={{ marginTop: "70px" }}
        placement="right"s
        onClose={onClose}
        open={open}
      >
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Drawer>
    </>
  );
};
export default UpdatePost;
