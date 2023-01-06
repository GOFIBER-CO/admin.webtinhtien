import React from "react";
import { Link, Redirect } from "react-router-dom";

//pages
import DashboardAnalytics from "../pages/DashboardAnalytics";
// import Starter from "../pages/Pages/Starter/Starter";

//login
import Login from "../pages/Authentication/Login";
import Logout from "../pages/Authentication/Logout";

//users management
import UsersManagement from "../pages/Users/UsersManagement";
import UsersPermission from "../pages/Users/UsersPermission";
import FaqsList from "../pages/Faqs/FaqsList";
import FooterList from "../pages/Footer/index";
import FaqsDetail from "../pages/Faqs/FaqsDetail";
import UserDetail from "../pages/Users/UserDetail";
import SchemaList from "../pages/Schema/SchemaList";
import PageList from "../pages/pagesManagement/PageList";
import PageDetail from "../pages/pagesManagement/PageDetail";
import CreateEditPage from "../pages/pagesManagement/CreateEditPage";
import SchemaDetail from "../pages/Schema/SchemaDetail";
import AddUser from "../pages/Users/AddUser";
import TaxonomyList from "../pages/Taxanomy/TaxonomyList";
import TagsList from "../pages/Taxanomy/TagsList";
import CategoriesList from "../pages/Taxanomy/CategoriesList";
import TaxonomyDetail from "../pages/Taxanomy/TaxonomyDetail";
import AddTaxonomy from "../pages/Taxanomy/AddTaxonomy";
import PostList from "../pages/Posts/PostList";
import CreateEditPost from "../pages/Posts/CreateEditPost";
import PostDetail from "../pages/Posts/PostDetail";
import LinksList from "../pages/Links/LinksList";
import LinksDetail from "../pages/Links/LinksDetail";
import MediaList from "../pages/Media/MediaList";
import BannersList from "../pages/Banners/BannersList";
import PostStatisitcs from "../pages/Statistics/PostStatistics";
import UserStatistics from "../pages/Statistics/UserStatistics";
import UserProfile from "../pages/Authentication/user-profile";
import CategoryController from "../pages/CategoryController";
import Roles from "../pages/Roles/Roles";
import RedirectList from "../pages/Redirects";
import PaymentOfContributors from "../pages/PaymentOfContributors";
import LinkPosts from "../pages/LinkPosts";
const authProtectedRoutes = [
  // { path: "/pages-starter", component: Starter },
  { path: "/dashboard-analytics", component: DashboardAnalytics },
  { path: "/users", component: UsersManagement },
  { path: "/permission", component: UsersPermission },
  { path: "/user/add/:id", component: AddUser },
  { path: "/users/:id", component: UserDetail },
  { path: "/profile", component: UserProfile },
  { path: "/footer", component: FooterList },
  {
    path: "/cate-management",
    component: CategoryController,
  },
  {
    path: "/roles",
    component: Roles,
  },
  {
    path: "/linkposts",
    component: LinkPosts,
  },
  {
    path: "/",
    exact: true,
    component: () => <Redirect to="/dashboard" />,
  },
];

const publicRoutes = [
  // Authentication Page
  { path: "/login", component: Login },
  { path: "/logout", component: Logout },
  { path: "/payment", component: PaymentOfContributors },
  // {
  //   path: "/pages-management",
  //   component: PageList
  // },
  // {
  //   path: "/pages-management/create",
  //   component: CreateEditPage
  // },
  // {
  //   path: "/pages-management/edit/:id",
  //   component: CreateEditPage
  // },
  // {
  //   path: "/pages-management/:id",
  //   component: PageDetail
  // },
  // Users management
];

export { authProtectedRoutes, publicRoutes };
