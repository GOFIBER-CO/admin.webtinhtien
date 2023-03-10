import React from "react";
import { Link, Redirect } from "react-router-dom";

//pages
import DashboardAnalytics from "../pages/DashboardAnalytics";
// import Starter from "../pages/Pages/Starter/Starter";

//login
import Login from "../pages/Authentication/Login";
import Register from "../pages/Authentication/Register";
import Logout from "../pages/Authentication/Logout";

//users management
import UsersManagement from "../pages/Users/UsersManagement";
import UsersPermission from "../pages/Users/UsersPermission";
import UserDetail from "../pages/Users/UserDetail";
import AddUser from "../pages/Users/AddUser";
import UserProfile from "../pages/Authentication/user-profile";
import Roles from "../pages/Roles/Roles";
import PaymentOfContributors from "../pages/PaymentOfContributors";
import linkManagement from "../pages/linkManagement";
import Brands from "../pages/Brands";
import Domains from "../pages/Domains";
import Teams from "../pages/Teams";
import TeamDashboard from "../Components/Dashboard/TeamDashboard";
import DomainDashboard from "../Components/Dashboard/DomainDashboard";
import CtvDashboard from "../Components/Dashboard/CTVDashboard";
import Orders from "../pages/Order/index";
import OrderPostNotReceived from "../pages/OrderPostNotReceived";
import OrderPostOfYou from "../pages/OrderPostsOfYou";
import OrderPostApproved from "../pages/OrderPostApproved";

// import OrderManagement from "./../pages/Brands";

const authProtectedRoutes = [
  // { path: "/pages-starter", component: Starter },
  { path: "/dashboard-analytics", component: DashboardAnalytics },
  { path: "/team-analytics", component: TeamDashboard },
  { path: "/domain-analytics", component: DomainDashboard },
  { path: "/ctv-analytics", component: CtvDashboard },
  { path: "/users", component: UsersManagement },
  { path: "/permission", component: UsersPermission },
  { path: "/user/add/:id", component: AddUser },
  { path: "/users/:id", component: UserDetail },
  { path: "/profile", component: UserProfile },
  { path: "/payment", component: PaymentOfContributors },
  { path: "/postsNotReceived", component: OrderPostNotReceived },
  { path: "/postOfYou", component: OrderPostOfYou },
  { path: "/approved", component: OrderPostApproved },

  {
    path: "/teams",
    component: Teams,
  },
  { path: "/domains", component: Domains },
  { path: "/brand", component: Brands },

  {
    path: "/roles",
    component: Roles,
  },
  {
    path: "/postsLink",
    component: linkManagement,
  },
  {
    path: "/",
    exact: true,
    component: () => <Redirect to="/dashboard-analytics" />,
  },
  {
    path: "/postsOrder",
    component: Orders,
  },
];

const publicRoutes = [
  // Authentication Page
  { path: "/login", component: Login },
  { path: "/register", component: Register },
  { path: "/logout", component: Logout },

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
