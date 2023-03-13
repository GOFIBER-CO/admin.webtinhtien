import { data } from "autoprefixer";
import { APIClient } from "./api_helper";
import * as url from "./url_helper";
import axios from "axios";

const api = new APIClient();

const user = sessionStorage.getItem("authUser");
const teamId = user?.role !== "Admin" ? user?.team?._id : "";
export const getLoggedInUser = () => {
  const user = sessionStorage.getItem("authUser");
  if (user) return JSON.parse(user);
  return null;
};

export const isUserAuthenticated = () => {
  return getLoggedInUser() !== null;
};
//permission\
export const getAllPermissions = () => api.get(url.GET_ALL_PERMISSION);
//roles
export const getAllRole = () => api.get(url.GET_ALL_ROLES);
export const editRolePermission = (permission, roleId) =>
  axios.patch(url.EDIT_ROLE_PERMISSION, {
    permission: permission,
    roleId: roleId,
  });
export const addNewRole = (roleName) =>
  axios.post(`${url.ADD_NEW_ROLES}`, { roleName: roleName });
export const deleteRole = (roleId) =>
  axios.delete(`${url.DELETE_ROLES}/${roleId}`);
//login
export const postLogin = (data) => api.create(url.API_USER_LOGIN, data);

// get all faqs
export const getAllFaqs = () => api.get(url.GET_FAQS);
export const getFaqByID = (id) => api.get(url.GET_FAQS + "/" + id);
export const addFaq = (body) => api.create(`${url.GET_FAQS}`, body);
export const updateFaq = (id, body) =>
  api.update(`${url.GET_FAQS}/${id}`, body);
export const deleteFaqs = (id) => api.delete(`${url.GET_FAQS}/remove/${id}`);
export const searchFAQ = (q) => api.get(`${url.GET_FAQS}/faq/search/?q=${q}`);
export const formatFaqData = (data) => {
  if (data) {
    return data.map((item) => ({ ...item, key: item._id }));
  }
  return [];
};

export const getAllUsers = (data) =>
  api.get(
    `${url.GET_USERS}/getPaging?pageSize=${data.pageSize}&pageIndex=${data.pageIndex}&search=${data.search}`
  );
export const getUser = (id) => api.get(`${url.GET_USERS}/getById/${id}`);
export const addUser = (body) => api.create(`${url.GET_USERS}/insert`, body);
export const updateUser = (id, body) =>
  api.update(`${url.GET_USERS}/update/${id}`, body);
export const deleteUser = (id) => api.delete(`${url.GET_USERS}/delete/${id}`);
export const searchUser = (search) =>
  api.get(`${url.SEARCH_USER}?search=${search}`);

export const createUserPermission = (body) =>
  api.create(url.GET_USER_PERMISSION, body);
export const getUserPermission = (id) =>
  api.get(`${url.GET_USER_PERMISSION}/${id}`);
export const updateUserPermission = (id, body) =>
  api.update(`${url.GET_USER_PERMISSION}/${id}`, body);
export const deleteUserPermission = (id) =>
  api.delete(`${url.GET_USER_PERMISSION}/delete/${id}`);
// schema
export const getAllSchemas = () => api.get(`${url.GET_SCHEMAS}/getAll`);
export const getSchema = (id) => api.get(`${url.GET_SCHEMAS}/${id}`);
export const addSchema = (body) =>
  api.create(`${url.GET_SCHEMAS}/insert`, body);
export const updateSchema = (id, body) =>
  api.update(`${url.GET_SCHEMAS}/update/${id}`, body);
export const deleteSchema = (id) =>
  api.delete(`${url.GET_SCHEMAS}/delete/${id}`);
export const searchSchema = (q) =>
  api.get(`${url.GET_SCHEMAS}/getPaging/search?q=${q}`);

// Taxonomy
export const getAllTaxonomies = () => api.get(url.GET_TAXONOMYS);
export const getTaxonomy = (id) => api.get(`${url.GET_TAXONOMYS}/${id}`);
export const addTaxonomy = (body) =>
  api.createWithFormData(`${url.GET_TAXONOMYS}`, body);
export const updateTaxonomy = (id, body) =>
  api.updateWithFormData(`${url.GET_TAXONOMYS}/${id}`, body);
export const deleteTaxonomy = (slug) =>
  api.delete(`${url.GET_TAXONOMYS}/remove/${slug}`);
export const deleteAllChildTaxonomy = (slug) =>
  api.delete(`${url.GET_TAXONOMYS}/removeTax/${slug}`);
export const searchTaxonomy = (q) =>
  api.get(`${url.GET_TAXONOMYS}/tax/search?q=${q}`);
export const getByType = (type) =>
  api.get(`${url.GET_TAXONOMYS}/getByType/${type}`);
// Tags
export const getPagingTags = (pageSize = 10, pageIndex = 1) =>
  api.get(
    `${url.GET_TAGS}/getPaging?pageSize=${pageSize}&pageIndex=${pageIndex}`
  );
export const getAllTag = () => api.get(`${url.GET_TAGS}/getAllTag`);

export const getTag = (id) => api.get(`${url.GET_TAGS}/${id}`);
export const addTag = (body) => api.create(`${url.GET_TAGS}/insert`, body);
export const updateTag = (id, body) =>
  api.update(`${url.GET_TAGS}/update/${id}`, body);
export const deleteTag = (slug) => api.delete(`${url.GET_TAGS}/delete/${slug}`);
export const deleteAllChildTag = (slug) =>
  api.delete(`${url.GET_TAGS}/removeTax/${slug}`);
export const searchtag = (q, pageSize = 10, pageIndex = 1) =>
  api.get(
    `${url.GET_TAGS}/getPaging?search=${q}&pageSize=${pageSize}&pageIndex=${pageIndex}`
  );
// Categories
export const getAllCategory = (pageSize = 10, pageIndex = 1) =>
  api.get(
    `${url.GET_CATES}/getPaging?pageSize=${pageSize}&pageIndex=${pageIndex}`
  );
export const getAllCateParent = () => api.get(`${url.GET_CATES}/getAllCate`);
export const getCategory = (id) => api.get(`${url.GET_CATES}/${id}`);
export const addCategory = (body) =>
  api.create(`${url.GET_CATES}/insert`, body);
export const updateCategory = (id, body) =>
  api.update(`${url.GET_CATES}/update/${id}`, body);
export const deleteCategory = (slug) =>
  api.delete(`${url.GET_CATES}/delete/${slug}`);
export const deleteCategoryChild = (slug) =>
  api.delete(`${url.GET_CATES}/removeTax/${slug}`);
export const searchCategory = (q, pageSize = 10, pageIndex = 1) =>
  api.get(
    `${url.GET_CATES}/getPaging?search=${q}&pageSize=${pageSize}&pageIndex=${pageIndex}`
  );
// posts
export const getAllPosts = (
  pageSize,
  pageIndex,
  search,
  cate = "",
  status = ""
) =>
  api.get(
    `${url.GET_POSTS}?pageSize=${pageSize}&pageIndex=${pageIndex}&search=${search}&cate=${cate}&status=${status}`
  );
export const getPostOnlyName = () => api.get(`/api/post/getOnlyName`);
export const getPostById = (id) => api.get(`${url.GET_POST_BY_ID}/${id}`);
export const getPostByStatus = (data) =>
  api.get(`${url.GET_POSTS}/getByStatus`, data);
export const getPostByStatusSlug = (data) =>
  api.get(`${url.GET_POSTS}/getBy/StatusAndSlug`, data);
export const getPostByTax = (data) =>
  api.get(`${url.GET_POSTS}/getPostByTax`, data);
export const getPostBySlug = (slug, data) =>
  api.get(`${url.GET_POST_BY_SLUG}/${slug}`, data);
export const searchPost = (limit, skip, q) =>
  api.get(`${url.GET_POSTS}/post/search?q=${q}&limit=${limit}&skip=${skip}`);
export const getRelatedPosts = () => api.get(`${url.GET_POSTS}/related`);
export const createPost = (data) => api.create(`${url.API_POST_INSERT}`, data);
export const editPost = (id, data) =>
  api.update(`${url.API_POST_UPDATE}/${id}`, data);
export const deletePost = (id) => api.delete(`${url.API_POST_DELETE}/${id}`);
export const getAllByTax = (id, limit, skip) =>
  api.get(`${url.GET_POSTS}/getAllByTax?limit=${limit}&skip=${skip}&tax=${id}`);
export const getPostXML = () => api.get(`${url.GET_POSTS}/getPosts/sitemap`);
// pages
export const getAllPages = () => api.get(`${url.GET_PAGES}`);
export const searchPages = (data) =>
  api.get(`${url.GET_PAGES}/page/search`, data);
export const getPageById = (id) => api.get(`${url.GET_PAGES}/${id}`);
export const createPage = (data) => api.create(`${url.GET_PAGES}`, data);
export const updatePage = (data) =>
  api.update(`${url.GET_PAGES}/${data.get("id")}`, data);
export const deletePage = (id) => api.delete(`${url.GET_PAGES}/remove/${id}`);

//links
export const getAllLinks = () => api.get(`${url.GET_LINKS}/getAll`);
export const getLinkSearch = (text) =>
  api.get(`${url.GET_LINKS}/search/?q=${text}`);
export const getLinkByName = (name) =>
  api.get(`${url.GET_LINKS}/getByName/${name}`);
export const getLinkById = (id) => api.get(`${url.GET_LINKS}/getById/${id}`);
export const createLink = (data) => api.create(`${url.GET_LINKS}`, data);
export const updateLink = (id, data) =>
  api.update(`${url.GET_LINKS}/${id}`, data);
export const removeLink = (id) => api.delete(`${url.GET_LINKS}/remove/${id}`);

//google index
export const googleIndex = (link) => api.create(`${url.GOOGLEINDEX}/${link}`);
export const googleBatchIndex = (data) =>
  api.create(`${url.GOOGLEBATCHINDEX}`, data);

//banners
export const getAllBanner = (limit, skip, slug) =>
  api.get(`${url.BANNER}?limit=${limit}&skip=${skip}&slug=${slug}`);
export const getById = (id) => api.get(`${url.BANNER}/getById/${id}`);
export const getByPosition = (position) =>
  api.get(`${api.BANNER}/getByPosition/${position}`);
export const createBanner = (data) => api.create(`${url.BANNER}`, data);
export const updateBanner = (id, data) =>
  api.update(`${url.BANNER}/${id}`, data);
export const removeBanner = (id) => api.delete(`${url.BANNER}/remove/${id}`);
export const getByPage = (slug) => api.get(`${url.BANNER}/getByPage/${slug}`);

// bing index
export const bingIndex = (data) => api.create(`${url.BINGINDEX}`, data);

//statistics
export const getAllByTaxDate = (id, start, end) =>
  api.get(
    `${url.GET_POSTS}/getAllByTaxDate?tax=${id}&start=${start}&end=${end}`
  );
export const getAllByDate = (start, end, limit, skip) =>
  api.get(
    `${url.GET_POSTS}/getAllByDate?start=${start}&end=${end}&limit=${limit}&skip=${skip}`
  );
export const getMaxPosts = () => api.get(`${url.GET_POSTS}/getMax`);
export const getMinPosts = () => api.get(`${url.GET_POSTS}/getMin`);
export const getMaxUsers = () => api.get(`${url.GET_POSTS}/getMax/user`);
export const getMinUsers = () => api.get(`${url.GET_POSTS}/getMin/user`);
export const userStatistics = (start, end, limit, skip, q) =>
  api.get(
    `${url.GET_POSTS}/getStatictis/staff?start=${start}&end=${end}&limit=${limit}&skip=${skip}&q=${q}`
  );

//google analytics
export const ggAnalytics = (metrics, startDate, endDate, dimensions) =>
  api.get(
    `${url.GGANALYTICS}?metrics=${metrics}&startDate=${startDate}&endDate=${endDate}&dimensions=${dimensions}`
  );
export const ggAnalyticsGraph = (metric) =>
  api.get(`${url.GGANALYTICS}/graph?metric=${metric}`);

//Category

export const getPagingCate = (data) =>
  api.get(
    `${url.API_CATE}/getPaging?pageSize=${data.pageSize}&pageIndex=${data.pageIndex}&search=${data.search}`
  );
export const getAllCate = () => api.get(`${url.API_CATE}/getAllCate`);

export const getCateParent = () => api.get(`${url.API_CATE}/getCateParent`);
export const getCateById = (id) => {
  api.get(`${url.API_CATE}/getById/${id}`);
};
export const updateCate = (id, data) => {
  api.update(`${url.API_CATE}/update/${id}`, data);
};
export const deleteCate = (id) => {
  api.delete(`${url.API_CATE}/delete/${id}`);
};
export const insertCate = (data) => {
  api.create(`${url.API_CATE}/insert`, data);
};
//Action
//Action
export const insertAction = (data) => api.create(url.API_ACTION_INSERT, data);
export const updateAction = (id, data) =>
  api.update(`${url.API_ACTION_UPDATE}/${id}`, data);
export const deleteAction = (id, data) =>
  api.delete(`${url.API_ACTION_DELETE}/${id}`, data);
export const getAllAction = (data) => api.get(url.API_ACTION_GETALL, data);
export const getPagingAction = (data) =>
  api.get(url.API_ACTION_GET_PAGING, data);
export const getActionById = (id, data) =>
  api.get(`${url.API_ACTION_GET_PAGING_BY_ID}/${id}`, data);

//Redirect
export const insertRedirect = (data) =>
  api.create(`${url.API_REDIRECT}/create`, data);
export const updateRedirect = (id, data) =>
  api.update(`${url.API_REDIRECT}/update/${id}`, data);
export const deleteRedirect = (id, data) =>
  api.delete(`${url.API_REDIRECT}/remove/${id}`, data);
// export const getAllAction = (data) => api.get(url.API_ACTION_GETALL, data);
export const getPagingRedirect = (data) =>
  api.get(
    `${url.API_REDIRECT}/getPaging?pageSize=${data.pageSize}&pageIndex=${data.pageIndex}&search=${data.search}`
  );

//Payment of Contributors
export const createPayment = (data) => api.create(`${url.API_PAYMENT}`, data);
// export const getPaymentByDomains = (id, pageSize, pageIndex, search ,brand, team
//   ,domain) =>
//   api.get(
//     `${url.API_PAYMENT}/getCollaboratorsByDomainId?id=${id}&pageSize=${pageSize}&pageIndex=${pageIndex}&search=${search}&brand=${brand}&team=${team}&domainId=${domain}`
//   );

export const getPaymentByDomains = (
  pageSize,
  pageIndex,
  search,
  brand = "",
  team = "",
  domain = "",
  dateRange
) =>
  api.get(
    `${url.API_PAYMENT}/getCollaboratorsByDomainId?pageIndex=${pageIndex}&pageSize=${pageSize}&search=${search}&brand=${brand}&team=${team}&domainId=${domain}&dateFrom=${dateRange?.[0]}&dateTo=${dateRange?.[1]}`
  );
export const getColabByBrand = (
  brandId = "",
  dateFrom = new Date(Date.now()).toLocaleDateString(),
  dateTo = new Date(Date.now()).toLocaleDateString()
) =>
  api.get(
    `${url.API_PAYMENT}/getCollaboratorsByBrand?brandId=${brandId}&pageSize=10000&pageIndex=1&dateFrom=${dateFrom}&dateTo=${dateTo}`
  );

export const updatePayment = (id, data) =>
  api.update(`${url.API_PAYMENT}/${id}`, data);
export const deletePayment = (id) =>
  api.delete(`${url.API_PAYMENT}/remove/${id}`);

//Domains
export const insertDomains = (data) => api.create(`${url.API_DOMAINS}`, data);
export const getPagingDomains = (
  pageSize,
  pageIndex,
  search,
  team,
  brand,
  dateRange = []
) =>
  api.get(
    `${url.API_DOMAINS}?pageSize=${pageSize}&pageIndex=${pageIndex}&search=${search}&dateFrom=${dateRange?.[0]}&dateTo=${dateRange?.[1]}&team=${team}&brand=${brand}`
  );
export const deleteDomains = (id) =>
  api.delete(`${url.API_DOMAINS}/remove/${id}`);
export const updateDomains = (id, data) =>
  api.update(`${url.API_DOMAINS}/${id}`, data);
export const getDomainsByBrand = (id) =>
  api.get(`${url.API_DOMAINS}/getAllDomainsByBrandId/${id}`);
export const getDomainByTeam = (id, brand) =>
  api.get(`${url.API_DOMAINS}/getByTeamId/${id}?brand=${brand}`);
export const getAllDomains = () => api.get(`${url.API_DOMAINS}/getAll`);
//Brands

export const insertBrands = (data) => api.create(`${url.API_BRANDS}`, data);
export const getPagingBrands = (pageSize, pageIndex, search) =>
  api.get(
    `${url.API_BRANDS}?pageSize=${pageSize}&pageIndex=${pageIndex}&search=${search}`
  );
export const deleteBrands = (id) =>
  api.delete(`${url.API_BRANDS}/remove/${id}`);
export const updateBrands = (id, data) =>
  api.update(`${url.API_BRANDS}/${id}`, data);
export const getAllBrands = () => api.get(`${url.API_BRANDS}/getAll`);

//link management

export const createLinkManagement = (data) =>
  api.create(`${url.API_LINK_MANAGEMENT}`, data);

export const createLinkManagementExcel = (data) =>
  api.create(`${url.API_LINK_MANAGEMENT}-excel`, data);

export const updateLinkManagement = (id, data) =>
  api.update(`${url.API_LINK_MANAGEMENT}/${id}`, data);
export const deleteLinkManagement = (id) =>
  api.delete(`${url.API_LINK_MANAGEMENT}/remove/${id}`);
export const getStatisticByBrand = (id, dateRange = ["", ""]) =>
  api.get(
    `${url.API_LINK_MANAGEMENT}/getStatisticByBrand?brandId=${id}&dateFrom=${dateRange?.[0]}&dateTo=${dateRange?.[1]}`
  );

// export const getLinkPostByColab = (colabId, pageSize, pageIndex, search) =>
//   api.get(
//     `${url.API_LINK_MANAGEMENT}/getLinkManagementsByCollaboratorId?collaboratorId=${colabId}&pageIndex=${pageIndex}&pageSize=${pageSize}&search=${search}`
//   );

export const getLinkPostByColab = (
  pageSize,
  pageIndex,
  search,
  brand,
  team,
  domain,
  colab,
  dateRange
) =>
  api.get(
    `${url.API_LINK_MANAGEMENT}/getLinkManagementsByCollaboratorId?pageIndex=${pageIndex}&pageSize=${pageSize}&search=${search}&brand=${brand}&team=${team}&domainId=${domain}&coladId=${colab}&dateFrom=${dateRange?.[0]}&dateTo=${dateRange?.[1]}`
  );

//Quản lý users
export const getPagingUsers = (search, pageIndex, pageSize) =>
  api.get(
    `${url.API_USERS}?search=${search}&pageIndex=${pageIndex}&pageSize=${pageSize}`
  );
export const getAllRoles = () => api.get(`${url.GET_ALL_ROLE}/getRoles`);
export const newUser = (body) => api.create(`${url.API_USERS}/signup`, body);
export const deleteUsers = (id) => api.delete(`${url.API_USERS}/delete/${id}`);
export const getUserId = (id) => api.get(`${url.API_USERS}/${id}`);
export const updateUsers = (id, body) => {
  return api.update(`${url.API_USERS}/${id}`, body);
};

//Teams

export const getPagingTeams = (
  pageSize,
  pageIndex,
  search,
  brand,
  dateRange = []
) =>
  api.get(
    `${url.API_TEAMS}?search=${search}&pageSize=${pageSize}&pageIndex=${pageIndex}&dateFrom=${dateRange?.[0]}&dateTo=${dateRange?.[1]}&brand=${brand}`
  );

export const getTeamById = (id) => api.get(`${url.API_TEAMS}/getById/${id}`);
export const getTeamByBrand = (
  brandid,
  pageSize = 10,
  pageIndex = 1,
  dateRange = []
) =>
  api.get(
    `${url.API_TEAMS}/getTeamByBrand/${brandid}?pageSize=${pageSize}&pageIndex=${pageIndex}&dateFrom=${dateRange?.[0]}&dateTo=${dateRange?.[1]}`
  );

export const getAllDomain = () => api.get(`${url.API_DOMAINS}/getAll`);

export const getAllBrand = () =>
  api.get(`${url.API_BRANDS}/getAll?teamId=${teamId}`);

export const createTeam = (data) => api.create(`${url.API_TEAMS}`, data);

export const updateTeam = (id, data) =>
  api.update(`${url.API_TEAMS}/${id}`, data);

export const deleteTeam = (id) => api.delete(`${url.API_TEAMS}/${id}`);

export const getTeamAll = () => api.get(`${url.API_TEAMS}/all`);

export const getColabByDomainId = (domain) =>
  api.get(`${url.API_PAYMENT}/getCollaboratorsByDomain?domain=${domain}`);
export const getColabById = (id) => api.get(`${url.API_PAYMENT}/getById/${id}`);
export const getLinkManagementsByTeamUser = (teamId) =>
  api.get(
    `${url.API_LINK_MANAGEMENT}/getLinkManagementsByTeamUser?teamId=${teamId}`
  );

export const exportDataTeams = (brand, team) =>
  api.get(`${url.API_LINK_MANAGEMENT}-excel-teams?brand=${brand}&team=${team}`);
export const getStatisticTeam = (teamId) =>
  api.get(`${url.API_TEAMS}/getStatisticTeam?teamId=${teamId}`);

//
export const getListOrderPosts = (pageSize, pageIndex, data) => {
  return api.create(
    `${url.API_ORDER_POST}/list?pageSize=${pageSize}&pageIndex=${pageIndex}`,
    data
  );
};
export const deleteRecord = (id) => {
  return api.delete(`${url.API_ORDER_POST}/delete/${id}`);
};
export const createOrderPost = (data) => {
  return axios.post(`${url.API_ORDER_POST}/insert`, data);
};
export const updateBankingOrderPost = (data) => {
  return axios.patch(`${url.API_ORDER_POST}/update/banking`, data);
};
export const updateOrderPost = (data) => {
  return axios.patch(`${url.API_ORDER_POST}/update`, data);
};

export const receivedPost = (id) => {
  return axios.put(`${url.API_ORDER_POST}/received-post/${id}`);
};

export const refundPost = (id) => {
  return axios.get(`${url.API_ORDER_POST}/refund/${id}`);
};

export const checkPermissionScreen = (screen) => {
  return axios.post(`${url.API_USERS}/user/permissionScreen`, { screen });
};

export const getCTV = () => {
  return axios.get(`${url.API_USERS}/user/getCTV`);
};
//COUNT WORD
export const countWord = (data) => {
  return axios.post(`${url.API_COUNT_WORD_GG_DOCS}`, data);
};
//SCHEDULE
export const schedule = () => {
  return axios.get(`${url.API_NOTIFICATION}/getPaging`);
};
export const updateStatusOfRead = () => {
  return axios.patch(`${url.API_NOTIFICATION}/update-read-status`);
};
