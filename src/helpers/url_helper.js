//permission

export const GET_ALL_PERMISSION = "/api/permission/getPermissions";

//Roles
export const GET_ALL_ROLES = "/api/role/getPaging";
export const EDIT_ROLE_PERMISSION = "/api/role/editRolePermission";
export const ADD_NEW_ROLES = "/api/role/insert";
export const DELETE_ROLES = "/api/role/delete";
export const UPDATE_ROLES = "/api/role/editRole";

//REGISTER
export const POST_FAKE_REGISTER = "/api/users/signup";

//LOGIN
export const POST_FAKE_LOGIN = "/auth/signin";
export const POST_FAKE_JWT_LOGIN = "/post-jwt-login";
export const POST_FAKE_PASSWORD_FORGET = "/auth/forgot-password";
export const POST_FAKE_JWT_PASSWORD_FORGET = "/jwt-forget-pwd";
export const SOCIAL_LOGIN = "/social-login";
export const API_USER_LOGIN = "/api/user/login";

//login
export const POST_AUTHENTICATE = "/api/users/authenticate";

//BUNNY
export const URL_IMAGE_BUNNY = "https://agency88.b-cdn.net/";

//PROFILE
export const POST_EDIT_JWT_PROFILE = "/post-jwt-profile";
export const POST_EDIT_PROFILE = "/api/user";

//user
export const GET_USERS = "/api/user";
// export const ADD_USERS = "/signup";
// export const DELETE_USER = "/api/users/delete";
export const SEARCH_USER = "/api/user/searchUser";

export const GET_USER_PERMISSION = "/api/users/user/permission";
// faqs
export const GET_FAQS = "/api/faqs";

export const GET_POSTS = "/api/post/getPaging";
export const GET_POST_BY_SLUG = "/api/post/getBySlug";
export const GET_POST_BY_ID = "/api/post/getById";
export const GET_SCHEMAS = "/api/schema";
export const GET_TAXONOMYS = "/api/taxonomy";
export const GET_TAGS = "/api/tag";
export const GET_PAGES = "/api/pages";
// export const GET_CATE = "/api/tag";

export const GET_TAXANOMY = "/api/taxanomy";

//Links
export const GET_LINKS = "/api/linkFooters";

//Google index
export const GOOGLEINDEX = "api/google/index"; //param
export const GOOGLEBATCHINDEX = "api/google/batchIndex"; // body

//Banner
export const BANNER = "api/banners";

//Bing index
export const BINGINDEX = "api/bing/index";

//Google Analytics
export const GGANALYTICS = "api/ggAnalytics";

//Action
export const API_ACTION_INSERT = "/api/action/insert";
export const API_ACTION_UPDATE = "/api/action/update";
export const API_ACTION_DELETE = "/api/action/delete";
export const API_ACTION_GETALL = "/api/action/getAll";
export const API_ACTION_GET_PAGING = "/api/action/getPaging";
export const API_ACTION_GET_PAGING_BY_ID = "/api/action/getById";

//POSTS
export const API_POST_INSERT = "/api/post/insert";
export const API_POST_UPDATE = "/api/post/update";
export const API_POST_DELETE = "/api/post/delete";

//Category
export const GET_CATES = "/api/category";
export const API_CATE = "/api/category";

//redirect
export const API_REDIRECT = "/api/redirect";

//payment contributors
export const API_PAYMENT = "/api/collaborators";

//link management

export const API_LINK_MANAGEMENT = "/api/link-managements";
//Domains

export const API_DOMAINS = "/api/domains";

//Brand

export const API_BRANDS = "/api/brands";

//quản lý users
export const API_USERS = "/api/users";
export const GET_ALL_ROLE = "/api/roles";
export const API_TEAMS = "/api/teams";
export const API_ORDER_POST = "/api/order-post";
