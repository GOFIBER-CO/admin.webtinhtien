import React, { useEffect, useState, useRef } from "react";
import {
  Container,
  InputGroup,
  Row,
  Col,
  Input,
  InputGroupText,
  Form,
  FormGroup,
  Label,
} from "reactstrap";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import {
  Select,
  notification,
  Input as InputAntd,
  Button,
  Spin,
  Modal,
  Checkbox,
} from "antd";
import { useHistory, useParams, useLocation } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  getAllSchemas,
  getAllTaxonomies,
  createPost,
  getPostById,
  editPost,
  addSchema,
  getAllPosts,
  deleteSchema,
  searchPost,
  getPostXML,
  getPostBySlug,
  getPagingCate,
  getAllCate,
  getAllTag,
  addTag,
} from "../../helpers/helper";

import toSlug from "../../common/function";
import { Editor } from "@tinymce/tinymce-react";
import { error, success } from "../../Components/Common/message";
import TagComp from "./tag";
import { formatCountdown } from "antd/lib/statistic/utils";
import { uploadFileToBunny } from "../../helpers/api_bunny";
const { Option } = Select;
const initialData = {
  _id: "",
  title: "",
  categories: [],
  tags: [],
  views: 0,
  likes: 0,
  status: "",
  user: "",
  thumb: "",
  content: "",
  keyword: [],
  slug: "",
  description: "",
  post_schemaid: [],
  isNoIndex: false,
  isNoFollow: false,
  isTOC: false,
};

function CreateEditPost() {
  const [isLoading, setIsLoading] = useState(false);
  const [schemaList, setSchemaList] = useState([]);
  const [schemas, setSchemas] = useState([]);
  const [posts, setPosts] = useState([]);
  const [cateList, setCateList] = useState([]);
  const [tagList, setTagList] = useState([]);
  const [keyword, setFocusKeyword] = useState([]);
  const [formTax, setFormTax] = useState([]);
  const [formAdd, setFormAdd] = useState(initialData);
  const [isNoIndex, setIsNoIndex] = useState(false);
  const [isNoFollow, setIsNoFollow] = useState(false);
  const [isTOC, setIsTOC] = useState(false);
  const editorDescriptionRef = useRef(null);
  const editorContentRef = useRef(null);
  const [isModalAddSchemaVisible, setIsModalVisible] = useState(false);
  const [isConfirmModalVisible, setConfirmModalVisible] = useState(false);
  // const { id } = useParams();
  const location = useLocation();
  const id = location?.state?.id || "";
  const authUser = sessionStorage.getItem("authUser")
    ? JSON.parse(sessionStorage.getItem("authUser"))
    : null;
  const { slug } = useParams();
  const history = useHistory();

  const [formSchema, setFormSchema] = useState({
    schema_type: "",
    schema_script: "",
    post_id: [],
    page_id: [],
  });

  const handleChangeEditorDescription = async (value, editor) => {
    const p = document.createElement("p");
    p.innerHTML = value;
    const description = p.innerText;
    formAdd.description = description;
  };
  const handleChangeEditorContent = async (value, editor) => {
    const p = document.createElement("p");
    p.innerHTML = value;
    const content = p.innerText;
    formAdd.content = content;
  };
  const getSchemas = () => {
    getAllSchemas().then((res) => {
      setSchemas(res);
    });
  };
  const convertHtmlText = (htmlText) => {
    if (htmlText && htmlText.length > 0) {
      let strText =
        new DOMParser().parseFromString(htmlText, "text/html").documentElement
          .textContent || "";
      return strText;
    }
    return "";
  };
  useEffect(() => {
    setIsLoading(true);
    if (!authUser) {
      notification["error"]({
        message: "System error",
        description: "Vui lòng đăng nhập lại",
      });
      setIsLoading(false);
    }
    if (slug) {
      getPostBySlug(slug)
        .then((res) => {
          // console.log('res:', res.thumb);
          setFormAdd({
            ...res,
            id: res?._id,
            thumb: res.thumb,
            status: res.status,
            categories: res.categories?.map((i) => i._id),
            tags: res.tags?.map((i) => i._id),
            keyword: res.keyword,
            isNoFollow: res?.isNoFollow,
            isNoIndex: res?.isNoIndex,
            isTOC: res?.isTOC,
            post_schemaid: res.post_schemaid?.map((i) => i._id),
          });
          setFocusKeyword("");
          setIsNoIndex(res?.isNoIndex);
          setIsNoFollow(res?.isNoFollow);
          setIsTOC(res?.isTOC);
          const KeyFocus = res?.keyword?.map((item, i) => ({
            id: new Date().getTime() + i,
            text: item,
          }));
          setFocusKeyword(KeyFocus);
          setIsLoading(false);
          console.log(formAdd);
        })
        .catch((error) => {
          notification["error"]({
            message: "System error",
            description: error,
          });
          setIsLoading(false);
        });
    }
    // getPostXML().then((res) => {
    //   if (res && res.length > 0) {
    //     setPosts(res);
    //   }
    // });
    // getAllSchemas()
    //   .then((res) => {
    //     const formatRes = res.map((item) => {
    //       item.schema_script = convertHtmlText(item.schema_script);
    //       return item;
    //     });
    //     setSchemaList(formatRes);
    //     setIsLoading(false);
    //     //return getAllTaxonomies();
    //   })
    //   // .then((res) => {
    //   //   setTaxList(res);
    //   //   //setIsLoading(false);
    //   // })
    //   .catch((error) => {
    //     setIsLoading(false);
    //     notification["error"]({
    //       message: "System error",
    //       description: error,
    //     });
    //   });
    getCate();
    getTags();
  }, []);
  const getCate = () => {
    getAllCate().then((cateList) => {
      setCateList(cateList);
      setIsLoading(false);
    });
  };
  const getTags = () => {
    getAllTag().then((tagList) => {
      setTagList(tagList);
      setIsLoading(false);
    });
  };
  const handleAddNewTag = async (listTagForm) => {
    let newTagList = await Promise.all(
      listTagForm &&
        listTagForm.map(async (item) => {
          if (!tagList.find((a) => a._id === item)) {
            let dataReq = {
              name: item,
              slug: toSlug(item),
              id: Math.random(),
            };
            await addTag(dataReq).then((tag) => {
              item = tag.data._id;
            });
            return item;
          } else {
            return item;
          }
        })
    );
    return newTagList;
  };
  const onSave = async () => {
    let newTagList = await handleAddNewTag(formAdd.tags);
    setIsLoading(true);
    let des = "";
    let data = {
      title: formAdd.title,
      slug: formAdd.slug,
      thumb: formAdd.thumb,
      guid: "",
      status: formAdd.status,
      type: "post",
      commentStatus: false,
      categories: formAdd.categories,
      tags: newTagList,
      views: formAdd.views,
      likes: formAdd.likes,
      description: formAdd.description,
      content: formAdd.content,
      keyword: formAdd.keyword,
      isNoFollow: formAdd.isNoFollow,
      isNoIndex: formAdd.isNoIndex,
      isTOC: formAdd.isTOC,
    };
    if (id) {
      editPost(id, data)
        .then((res) => {
          notification["success"]({
            message: "Notification",
            description: "Edit Post successfully!",
          });
          setIsLoading(false);
          history.push("/posts");
        })
        .catch((error) => {
          setIsLoading(false);
          notification["error"]({
            message: "System error",
            description: error,
          });
        });
    } else {
      setIsLoading(true);
      createPost(data)
        .then((res) => {
          if (res.status === -2) {
            throw new Error(res.error);
          }
          setIsLoading(false);
          notification["success"]({
            message: "Notification",
            description: "Create post successfully!",
          });
          history.push("/posts");
        })
        .catch((error) => {
          setIsLoading(false);
          notification["error"]({
            message: "System error",
            description: error,
          });
        });
    }
  };
  const onBack = () => {
    history.goBack();
  };
  const onInputChange = async (e) => {
    formAdd[e.target.name] = e.target.value;
    setFormAdd(formAdd);
    if (e.target.name === "title") {
      setFormAdd({
        ...formAdd,
        slug: toSlug(e.target.value),
      });
    }

    let file = e.target.files ? e.target.files[0] : null;

    if (file) {
      uploadFileToBunny(file).then((res) => {
        if (res.HttpCode === 201) {
          setFormAdd({
            ...formAdd,
            [e.target.name]: "https://cdn.baovietnam.com/" + file.name,
          });
        }
      });
    }
  };
  const onCheckboxChange = async (e) => {
    formAdd[e.target.name] = !formAdd[e.target.name];
    if (e.target.name === "isNoIndex") setIsNoIndex(!isNoIndex);
    if (e.target.name === "isNoFollow") setIsNoFollow(!isNoFollow);
    if (e.target.name === "isTOC") setIsTOC(!isTOC);

    // setIsNoIndex(!isNoIndex);
    console.log(formAdd);
    // console.log(e.target.checked);
  };
  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = () => resolve(reader.result);

      reader.onerror = (error) => reject(error);
    });
  const onSchemaInputChange = (e) => {
    setFormSchema({
      ...formSchema,
      [e.target.name]: e.target.value,
    });
  };
  const onChangeStatus = (e) => {
    setFormAdd({
      ...formAdd,
      status: e,
    });
  };

  const onDescriptionChange = (value) => {
    setFormAdd({
      ...formAdd,
      description: value,
    });
  };

  const onSchemaChange = (value) => {
    // console.log("schema value: ", value);
    setFormAdd({
      ...formAdd,
      post_schemaid: value,
    });
  };
  const onTaxChange = (value) => {
    // console.log("onTaxChange value: ", value);
    setFormAdd({
      ...formAdd,
      categories: value,
    });
  };
  const onTagChange = (value) => {
    setFormAdd({
      ...formAdd,
      tags: value,
    });
  };
  const onPostChange = (e) => {
    // console.log(e);
    setFormSchema({
      ...formSchema,
      _id: e,
    });
  };
  const addNewSchema = () => {
    addSchema({ ...formSchema, post_id: formSchema.post_id.join(",") })
      .then((res) => {
        success();
        setIsModalVisible(false);
        getSchemas();
        setFormSchema({
          schema_type: "",
          schema_script: "",
          post_id: [],
        });
      })
      .catch((err) => {
        error();
      });
  };

  const removeSchema = () => {
    // console.log('formSchema.post_schemaid: ', formAdd.post_schemaid);
    if (formAdd.post_schemaid && formAdd.post_schemaid.length) {
      formAdd.post_schemaid.split(",").forEach((id) => {
        deleteSchema(id)
          .then((res) => {
            getSchemas();
            success();
          })
          .catch((er) => {
            error();
          });
      });
      setTimeout(() => {
        setFormAdd({
          ...formAdd,
          post_schemaid: "",
        });
      }, 1000);
      setConfirmModalVisible(false);
    }
  };
  const handleSubmitKeyword = (e) => {
    console.log(e);
  };
  const onPressKeyfocus = (e) => {
    if (e.key === "Enter" && e.target.value) {
      setFocusKeyword([
        ...keyword,
        { id: new Date().getTime(), text: e.target.value },
      ]);
      const txtValues = keyword.map((item) => item.text);
      setFormAdd({
        ...formAdd,
        keyword: [...txtValues, e.target.value],
      });
      e.target.value = "";
      console.log(formAdd.keyword);
    }
  };
  const onRemoveKeyfocus = (id) => {
    const rates = keyword.filter((item) => item.id !== id);
    setFocusKeyword(rates);
    const txtValues = rates.map((item) => item.text);
    setFormAdd({
      ...formAdd,
      keyword: txtValues,
    });
  };

  const breadCrumbTitle = id ? "Sửa" : "Thêm mới";

  return (
    <>
      <Spin spinning={isLoading}>
        <div className="page-content">
          <BreadCrumb
            title={breadCrumbTitle}
            pageTitle="Bài viết"
            slug="posts"
          />
          <div style={{ marginLeft: "10px" }}>
            <Form onSubmit={onSave}>
              <Row>
                <Col lg={12}>
                  <FormGroup>
                    <Label className="mb-1" for="title">
                      Tiêu đề
                    </Label>
                    <Input
                      id="title"
                      name="title"
                      placeholder="Title"
                      type="title"
                      defaultValue={formAdd.title || ""}
                      onChange={onInputChange}
                    />
                  </FormGroup>
                </Col>
                <Col lg={12}>
                  <FormGroup>
                    <Label className="mb-1" for="slug">
                      Đường dẫn tĩnh
                    </Label>
                    <Input
                      id="slug"
                      name="slug"
                      placeholder="Slug"
                      type="slug"
                      defaultValue={formAdd.slug || ""}
                      onChange={onInputChange}
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col lg={3}>
                  <FormGroup>
                    <Label className="mb-1" for="views">
                      Views
                    </Label>
                    <Input
                      id="views"
                      name="views"
                      placeholder="Views"
                      type="number"
                      defaultValue={formAdd.views || ""}
                      onChange={onInputChange}
                    />
                  </FormGroup>
                </Col>
                <Col lg={3}>
                  <FormGroup>
                    <Label className="mb-1" for="likes">
                      Likes
                    </Label>
                    <Input
                      id="likes"
                      name="likes"
                      placeholder="Likes"
                      type="number"
                      defaultValue={formAdd.likes || ""}
                      onChange={onInputChange}
                    />
                  </FormGroup>
                </Col>
                <Col lg={2}>
                  <FormGroup>
                    <Label className="mb-1" for="isNoIndex">
                      No Index{" "}
                    </Label>
                    <div>
                      <Checkbox
                        id="isNoIndex"
                        name="isNoIndex"
                        // defaultChecked={formAdd.isNoIndex}
                        checked={isNoIndex}
                        onChange={onCheckboxChange}
                      />
                    </div>
                  </FormGroup>
                </Col>
                <Col lg={2}>
                  <FormGroup>
                    <Label className="mb-1" for="isNoFollow">
                      No Follow{" "}
                    </Label>
                    <div>
                      <Checkbox
                        id="isNoFollow"
                        name="isNoFollow"
                        type="checkbox"
                        checked={isNoFollow}
                        onChange={onCheckboxChange}
                      />
                    </div>
                  </FormGroup>
                </Col>
                {/* <Col lg={2}>
                  <FormGroup>
                    <Label className="mb-1" for="isTOC">
                      TOC{" "}
                    </Label>
                    <div>
                      <Checkbox
                        id="isTOC"
                        name="isTOC"
                        type="checkbox"
                        checked={isTOC}
                        onChange={onCheckboxChange}
                      />
                    </div>
                  </FormGroup>
                </Col> */}
              </Row>

              <Row>
                {/* <Col lg={12}>
                  <FormGroup>
                    <Label className="mb-1">Schema:</Label>
                    <div className="flex items-center">
                      <Select
                        size="large"
                        mode="multiple"
                        style={{ width: "100%" }}
                        placeholder="Please select"
                        onChange={onSchemaChange}
                        value={formAdd.post_schemaid || []}
                        // defaultValue={formAdd.post_schemaid || []}
                      >
                        {schemaList?.map((item, index) => (
                          <Option key={index} value={item._id}>
                            {item?.schema_type}
                          </Option>
                        ))}
                      </Select>
                      <Button
                        onClick={() => setIsModalVisible(true)}
                        className="ml-3"
                        size="large"
                        type="primary"
                      >
                        Add Schema
                      </Button>
                      <Button
                        className="ml-3"
                        size="large"
                        danger
                        onClick={() => setConfirmModalVisible(true)}
                      >
                        Delete Schema{" "}
                      </Button>
                    </div>
                  </FormGroup>
                </Col> */}
                <Col lg={12}>
                  <FormGroup>
                    <Label className="mb-1" for="description">
                      Mô tả
                    </Label>
                    {/* <ReactQuill
                      defaultValue={formVal.description}
                      onChange={(onDescriptionChange)}
                    /> */}
                    <Editor
                      apiKey={
                        "w17lpon88s3owkb87t8wnmyrb7dnvziqf3mrghzfk7ft8cpl"
                      }
                      onInit={(evt, editor) =>
                        (editorDescriptionRef.current = editor)
                      }
                      onEditorChange={handleChangeEditorDescription}
                      initialValue={formAdd?.description || ""}
                      // value={formVal?.description}
                      init={{
                        height: 200,
                        menubar: false,
                        file_picker_callback: function (cb, value, meta) {
                          var input = document.createElement("input");
                          input.setAttribute("type", "file");
                          input.setAttribute("accept", "image/*");
                          input.onchange = function () {
                            var file = this.files[0];

                            var reader = new FileReader();
                            reader.onload = function () {
                              var id = "blobid1" + new Date().getTime();
                              var blobCache =
                                editorDescriptionRef.current.editorUpload
                                  .blobCache;
                              var base64 = reader.result.split(",")[1];
                              var blobInfo = blobCache.create(id, file, base64);
                              blobCache.add(blobInfo);

                              /* call the callback and populate the Title field with the file name */
                              cb(blobInfo.blobUri(), { title: file.name });
                            };
                            reader.readAsDataURL(file);
                          };
                          input.click();
                        },
                        paste_data_images: true,
                        image_title: true,
                        automatic_uploads: true,
                        file_picker_types: "image",
                        plugins: [
                          "advlist",
                          "autolink",
                          "lists",
                          "link",
                          "image",
                          "charmap",
                          "preview",
                          "anchor",
                          "searchreplace",
                          "visualblocks",
                          "code",
                          "fullscreen",
                          "insertdatetime",
                          "media",
                          "table",
                          "code",
                          "help",
                          "wordcount",
                          "image",
                        ],
                        toolbar:
                          "undo redo | blocks | " +
                          "bold italic forecolor | alignleft aligncenter " +
                          "alignright alignjustify | bullist numlist outdent indent | " +
                          "removeformat | link image | code",
                        content_style:
                          "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                      }}
                    />
                  </FormGroup>
                </Col>
                <Col lg={12}>
                  <FormGroup>
                    <Label className="mb-1" for="content">
                      Nội dung
                    </Label>
                    <Editor
                      apiKey={
                        "w17lpon88s3owkb87t8wnmyrb7dnvziqf3mrghzfk7ft8cpl"
                      }
                      onInit={(evt, editor) =>
                        (editorContentRef.current = editor)
                      }
                      onEditorChange={handleChangeEditorContent}
                      initialValue={formAdd?.content || ""}
                      // value={formVal?.description}
                      init={{
                        height: 200,
                        menubar: false,
                        file_picker_callback: function (cb, value, meta) {
                          var input = document.createElement("input");
                          input.setAttribute("type", "file");
                          input.setAttribute("accept", "image/*");
                          input.onchange = function () {
                            var file = this.files[0];

                            var reader = new FileReader();
                            reader.onload = function () {
                              var id = "blobid" + new Date().getTime();
                              var blobCache =
                                editorContentRef.current.editorUpload.blobCache;
                              var base64 = reader.result.split(",")[1];
                              var blobInfo = blobCache.create(id, file, base64);
                              blobCache.add(blobInfo);

                              /* call the callback and populate the Title field with the file name */
                              cb(blobInfo.blobUri(), { title: file.name });
                            };
                            reader.readAsDataURL(file);
                          };
                          input.click();
                        },
                        paste_data_images: true,
                        image_title: true,
                        automatic_uploads: true,
                        file_picker_types: "image",
                        plugins: [
                          "advlist",
                          "autolink",
                          "lists",
                          "link",
                          "image",
                          "charmap",
                          "preview",
                          "anchor",
                          "searchreplace",
                          "visualblocks",
                          "code",
                          "fullscreen",
                          "insertdatetime",
                          "media",
                          "table",
                          "code",
                          "help",
                          "wordcount",
                          "image",
                        ],
                        toolbar:
                          "undo redo | blocks | " +
                          "bold italic forecolor | alignleft aligncenter " +
                          "alignright alignjustify | bullist numlist outdent indent | " +
                          "removeformat | link image | code",
                        content_style:
                          "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                      }}
                    />
                    {/* <Input
                      id="content"
                      name="content"
                      placeholder="Content"
                      type="textarea"
                      defaultValue={formAdd.content || ""}
                      onChange={onInputChange}
                    /> */}
                  </FormGroup>
                </Col>
                <Col lg={12}>
                  <FormGroup>
                    <Label className="mb-1" for="status">
                      Trạng thái
                    </Label>
                    <Select
                      value={formAdd.status}
                      // key={formAdd.status}
                      style={{ width: "100%" }}
                      onChange={onChangeStatus}
                    >
                      <Option label="Đăng ngay" key={1} value={1}>
                        Đăng ngay
                      </Option>
                      <Option label="Nháp" key={-1} value={-1}>
                        Nháp
                      </Option>
                      <Option label="Chờ xét duyệt" key={0} value={0}>
                        Chờ xét duyệt
                      </Option>
                    </Select>
                    {/* <Input
                      id="status"
                      name="status"
                      placeholder="Status"
                      type="text"
                      defaultValue={formAdd.status || ""}
                      onChange={onInputChange}
                    /> */}
                  </FormGroup>
                </Col>
                <Col lg={12}>
                  <Label className="mb-1">Chuyên mục:</Label>
                  <FormGroup>
                    <Select
                      mode="multiple"
                      style={{ width: "100%" }}
                      placeholder="Please select"
                      onChange={onTaxChange}
                      value={formAdd.categories || []}
                    >
                      {cateList &&
                        cateList?.map((item) => (
                          <Option key={item._id}>
                            {item?.name}{" "}
                            {item.parent ? <>({item.parent.name})</> : null}{" "}
                          </Option>
                        ))}
                    </Select>
                  </FormGroup>
                </Col>
                <Col lg={12}>
                  <Label className="mb-1">Thẻ:</Label>
                  <FormGroup>
                    <Select
                      mode="tags"
                      style={{ width: "100%" }}
                      placeholder="Please select"
                      onChange={onTagChange}
                      value={formAdd.tags || []}
                    >
                      {tagList &&
                        tagList?.map((item) => (
                          <Option key={item._id}>{item?.name} </Option>
                        ))}
                    </Select>
                  </FormGroup>
                </Col>
                <Col lg={12}>
                  <FormGroup>
                    <Label className="mb-1" for="dealer_link">
                      Focus keyword
                    </Label>
                    <Input
                      id="keyword"
                      name="keyword"
                      placeholder="Nhập xong nhấp enter"
                      type="keyword"
                      onKeyPress={onPressKeyfocus}
                    />
                  </FormGroup>

                  {keyword.map((item, i) => (
                    <TagComp
                      key={i}
                      content={item}
                      onRemove={onRemoveKeyfocus}
                      id={item.id}
                    />
                  ))}
                </Col>

                {/* <Col lg={12}>
                  <FormGroup>
                    <Label className="mb-1">Chuyên mục:</Label>
                    <Select
                      mode="multiple"
                      style={{ width: "100%" }}
                      placeholder="Please select"
                      onChange={onTaxChange}
                      value={formAdd.categories || []}
                    >
                      {tagList &&
                        tagList?.map((item) => (
                          <Option key={item._id}>{item?.name} </Option>
                        ))}
                    </Select>
                  </FormGroup>
                </Col> */}
                {/* <Col lg={12}>
                </Col> */}
                <Col lg={12}>
                  <FormGroup>
                    <Label className="mb-1" for="thumb">
                      Hình ảnh
                    </Label>
                    <div>
                      <label className="custom-file-upload">
                        <Input
                          id="thumb"
                          name="thumb"
                          placeholder="Image"
                          accept="image/*"
                          type="file"
                          defaultValue={formAdd.thumb || ""}
                          onChange={onInputChange}
                        />
                        Thêm hình ảnh
                      </label>
                    </div>
                    {formAdd.thumb && formAdd.thumb !== "" && (
                      <Col lg={2}>
                        <img
                          src={formAdd.thumb}
                          alt={formAdd.thumb}
                          style={{ width: "100%" }}
                        />
                      </Col>
                    )}
                  </FormGroup>
                </Col>
              </Row>
            </Form>
          </div>
          <Row>
            <Col style={{ marginLeft: "10px", marginTop: "10px" }}>
              <Button style={{ marginRight: "10px" }} onClick={onBack}>
                {" "}
                Quay lại
              </Button>
              <Button type="primary" onClick={onSave}>
                Lưu
              </Button>
            </Col>
          </Row>
        </div>
      </Spin>

      <Modal
        title="Thêm mới schema"
        okText="Save"
        visible={isModalAddSchemaVisible}
        onOk={addNewSchema}
        onCancel={() => setIsModalVisible(false)}
        width="680px"
      >
        <div>
          <Form>
            <Row>
              <Col lg={6}>
                <FormGroup>
                  <Label className="mb-1" for="schema_type">
                    Loại
                  </Label>
                  <Input
                    id="schema_type"
                    name="schema_type"
                    placeholder="Schema type"
                    type="text"
                    value={formSchema.schema_type}
                    onChange={onSchemaInputChange}
                  />
                </FormGroup>
              </Col>
              <Col lg={6}>
                <FormGroup>
                  <Label className="mb-1" for="schema_script">
                    Đoạn mã
                  </Label>
                  <Input
                    id="schema_script"
                    name="schema_script"
                    placeholder="Schema script"
                    type="text"
                    value={formSchema.schema_script}
                    onChange={onSchemaInputChange}
                  />
                </FormGroup>
              </Col>
              <Col lg={12}>
                <FormGroup>
                  <Label className="mb-1" for="post_id">
                    Bài viết
                  </Label>
                  <Select
                    mode="multiple"
                    size="large"
                    name="post_id"
                    id="post_id"
                    value={formSchema.post_id}
                    onChange={onPostChange}
                    placeholder="Posts"
                    style={{ width: "100%" }}
                  >
                    {posts &&
                      posts.length > 0 &&
                      posts?.map((post) => {
                        return (
                          <Option key={post._id} value={post._id}>
                            {post.title}
                          </Option>
                        );
                      })}
                  </Select>
                </FormGroup>
              </Col>
            </Row>
          </Form>
        </div>
      </Modal>

      <Modal
        title="Confirm to delete"
        visible={isConfirmModalVisible}
        onOk={removeSchema}
        onCancel={() => setConfirmModalVisible(false)}
      >
        <p>Are you sure to delete this faq?</p>
      </Modal>
    </>
  );
}

export default CreateEditPost;
