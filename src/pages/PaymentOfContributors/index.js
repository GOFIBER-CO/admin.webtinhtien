// import { withRouter, Link } from "react-router-dom";
// import "./PaymentOfContributors.css";

// import { DownOutlined, UpOutlined } from "@ant-design/icons";
// import { Button, Col, Form, Input, Row, Select, Modal,Checkbox,message } from "antd";
// import { useState, useEffect, useRef } from "react";
// import { insertPaymentContributors } from "../../helpers/helper";
// const PaymentOfContributors = () => {
//   const [form] = Form.useForm();

//   const onFinish = async (data ) => {
    
//     const dataReq = {
//       name: data.name,
//       stk: data.stk,
//       account_holder: data.name_holber,
//       category: data.category,
//       number_words: data.number_word,
//       total: total,
//       domain_id: data.domain_id,
//       owner_confirm:data.owner_confirm,
//       link_management_ids: 'jkhskjahdk'
//     };
//     // console.log(dataReq,'dataReq');
//      let dataPayment = await insertPaymentContributors(dataReq)
//      if(dataPayment.success === true){
//         return message.success(`Save success! `)
//      }
     
//   };

//   const [inputValue, setInputValue] = useState("");
//   const previousInputValue = useRef("");

//   useEffect(() => {
//     previousInputValue.current = inputValue;
//   }, [inputValue]);

//   const total = inputValue * 2000

//   return (
//     <div style={{ padding: "94px 12px 60px" }}>

//       <div className="Payment_container">
//         <div className="Payment_title">Thanh toán tiền CTV</div>
//         <br />
//         <div className="Payment_form">
//           <Form
//             form={form}
//             name="basic"
//             onFinish={onFinish}
//             initialValues={{ remember: true }}
//             defaultValue
//             autoComplete="off"
//           >
//             <Row>
//               <Col sm={11}>
//                 <Form.Item
//                   label="CTV"
//                   name="name"
//                   rules={[
//                     { required: true, message: "Please input your CTV!" },
//                   ]}
//                 >
//                   <Input />
//                 </Form.Item>
//               </Col>
//               <Col sm={2} />
//               <Col sm={11}>
//                 <Form.Item
//                   label="Domain"
//                   name="domain_id"
//                   rules={[
//                     { required: true, message: "Please input your Domain!" },
//                   ]}
//                 >
//                   <Select
//                     defaultValue="lucy"
//                     //   style={{ width: 120 }}
//                     //   onChange={handleChange}
//                     options={[
//                       {
//                         value: "jack",
//                         label: "Jack",
//                       },
//                     ]}
//                   />
//                 </Form.Item>
//               </Col>
//             </Row>
//             <Row>
//               <Col sm={11}>
//                 <Form.Item
//                   label="Ngân hàng"
//                   name="bank"
//                   rules={[
//                     { required: true, message: "Please input your Ngân hàng!" },
//                   ]}
//                 >
//                   <Input />
//                 </Form.Item>
//               </Col>
//               <Col sm={2} />
//               <Col sm={11}>
//                 <Form.Item
//                   label="STK"
//                   name="stk"
//                   rules={[
//                     { required: true, message: "Please input your STK!" },
//                   ]}
//                 >
//                   <Input />
//                 </Form.Item>
//               </Col>
//             </Row>
//             <Row>
//               <Col sm={11}>
//                 <Form.Item
//                   label="Số bài 500 từ"
//                   name="number_word"
//                   rules={[
//                     {
//                       required: true,
//                       message: "Please input your Số bài 500 từ!",
//                     },
//                   ]}
//                 >
//                   <Input type="number"
//                     value={inputValue}
//                     onChange={(e) => setInputValue(e.target.value)} />
//                 </Form.Item>
//               </Col>
//               <Col sm={2} />
//               <Col sm={11}>
//                 <Form.Item
//                   label="Chủ TK"
//                   name="name_holber"
//                   rules={[
//                     { required: true, message: "Please input your Chủ TK!" },
//                   ]}
//                 >
//                   <Input />
//                 </Form.Item>
//               </Col>
//             </Row>
//             <Row>
//               <Col sm={24}>
//                 <Form.Item
//                   label="Chuyên mục"
//                   name="category"
//                   rules={[
//                     {
//                       required: true,
//                       message: "Please input your Chuyên mục!",
//                     },
//                   ]}
//                 >
//                   <Input />
//                 </Form.Item>
//               </Col>
//               <Col sm={11}>
//                 <Form.Item
//                   label="Trạng thái"
//                   name="owner_confirm"
//                   rules={[
//                     { required: true, message: "Please input your trạng thái!" },
//                   ]}
//                 >
//                   <Select
//                     defaultValue="Trạng thái"
//                     //   style={{ width: 120 }}
//                     //   onChange={handleChange}
//                     options={[
//                       {
//                         value: "0",
//                         label: "Cộng tác viên",
//                       },
//                       {
//                         value: "1",
//                         label: "Chưa phải cộng tác viên",
//                       },
//                     ]}
//                   />
//                 </Form.Item>
//               </Col>
//             </Row>

//             <Row style={{ padding: "10px 0px" }}>
//               <Col sm={16} style={{ color: "red", fontWeight: "bold", fontSize: "20px" }}>

//                 Tổng tiền thanh toán: {total} VNĐ

//               </Col>
//               <Col sm={8}>
//                 <Button type="primary" htmlType="submit">
//                   Save
//                 </Button>
//               </Col>
//             </Row>
//           </Form>
//         </div>
//       </div>

//     </div>
//   );
// };

// export default PaymentOfContributors;

import React, { useState } from 'react';
import { Button, Form, Input, InputNumber, Popconfirm, Table, Typography } from 'antd';
import { Select } from 'antd';
const originData = [];
for (let i = 0; i < 4; i++) {
  originData.push({
    key: i.toString(),
    name: `Edrward ${i}`,
    age: 32,
    address: `London Park no. ${i}`,
  });
}
const EditableCell = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0,
          }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};
const PaymentOfContributors = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState(originData);
  const [editingKey, setEditingKey] = useState('');
  const isEditing = (record) => record.key === editingKey;
  const edit = (record) => {
    // console.log('edit', record);
    form.setFieldsValue({
      name: '',
      age: '',
      address: '',
      ...record,
    });
    setEditingKey(record.key);
  };
  const cancel = () => {
    setEditingKey('');
  };
  const save = async (key) => {
    try {
      const row = await form.validateFields();
      const newData = [...data];
      const index = newData.findIndex((item) => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        setData(newData);
        setEditingKey('');
      } else {
        newData.push(row);
        setData(newData);
        setEditingKey('');
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  const handleDelete = (key) => {
    const newData = data.filter((item) => item.key !== key);
    setData(newData);
  };
  const columns = [
    {
      title: 'name',
      dataIndex: 'name',
      width: '25%',
      editable: true,
    },
    {
      title: 'age',
      dataIndex: 'age',
      width: '15%',
      editable: true,
    },
    {
      title: 'address',
      dataIndex: 'address',
      width: '40%',
      editable: true,
    },
    {
      title: 'operation',
      dataIndex: 'operation',
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <Typography.Link
              onClick={() => save(record.key)}
              style={{
                marginRight: 8,
              }}
            >
              Save
            </Typography.Link>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <a>Cancel</a>
            </Popconfirm>
          </span>
        ) : (
          <>
          <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
            Edit
          </Typography.Link>
          <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.key)}>
            <a>Delete</a>
          </Popconfirm>
        </>
        );
      },
    },
  ];
  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.dataIndex === 'age' ? 'number' : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });
 
  const [count, setCount] = useState(2);
  const handleAdd = () => {
    const newData = {
      key: count,
      name: ``,
      age: '',
      address: ``,
    };
    setData([...data, newData]);
    setCount(count + 1);
  };
  return (
    <div style={{ padding: "94px 12px 60px"}}>
    <Button
        onClick={handleAdd}
        type="primary"
        style={{
          marginBottom: 16,
        }}
      >
        Add a row
      </Button>
    
    <Form form={form} component={false}>
      <Table
        components={{
          body: {
            cell: EditableCell,
          },
        }}
        bordered
        dataSource={data}
        columns={mergedColumns}
        rowClassName="editable-row"
        pagination={{
          onChange: cancel,
        }}
      />
    </Form>
    </div>
  );
};
export default PaymentOfContributors;
