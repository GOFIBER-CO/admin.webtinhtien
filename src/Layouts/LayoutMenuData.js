import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

const Navdata = () => {
  const history = useHistory();
  //state data
  const [isDashboard, setIsDashboard] = useState(false);
  const [isUsers, setIsUsers] = useState(false);
  const [isPayment, setIsPayment] = useState(false);
  const [isFAQs, setIsFAQs] = useState(false);
  const [isSchemas, setIsSchemas] = useState(false);
  const [isDomains, setIsDomains] = useState(false);
  const [isTaxonomy, setIsTaxonomy] = useState(false);
  const [isBrand, setIsBrand] = useState(false);
  const [isUser, setIsUser] = useState(false);
  const [isRoles, setIsRoles] = useState(false);
  const [isCates, setisCates] = useState(false);
  const [isPosts, setIsPosts] = useState(false);
  const [isLinks, setIsLinks] = useState(false);
  const [isMedia, setIsMedia] = useState(false);
  const [isTeam, setIsTeam] = useState(false);
  const [isOrder, setIsOrder] = useState(false);
  const [isRedirect, setIsRedirect] = useState(false);
  const [isBanners, setIsBanners] = useState(false);
  const [isStatistics, setIsStatistics] = useState(false);
  const [iscurrentState, setIscurrentState] = useState("Dashboard");
  const [isPostsLink, setIsPostsLink] = useState(false);
  const [user, setUser] = useState({});
  function updateIconSidebar(e) {
    if (e && e.target && e.target.getAttribute("subitems")) {
      const ul = document.getElementById("two-column-menu");
      const iconItems = ul.querySelectorAll(".nav-icon.active");
      let activeIconItems = [...iconItems];
      activeIconItems.forEach((item) => {
        item.classList.remove("active");
        var id = item.getAttribute("subitems");
        if (document.getElementById(id))
          document.getElementById(id).classList.remove("show");
      });
    }
  }
  const getUser = () => {
    let user = sessionStorage.getItem("authUser");
    if (user) {
      setUser(JSON.parse(user));
    } else {
      setUser({});
    }
  };
  useEffect(() => {
    getUser();
    document.body.classList.remove("twocolumn-panel");
    if (iscurrentState !== "Dashboard") {
      setIsDashboard(false);
    }
    if (iscurrentState !== "payments") {
      setIsPayment(false);
    }
    if (iscurrentState !== "FAQs") {
      setIsFAQs(false);
    }
    if (iscurrentState !== "Schemas") {
      setIsSchemas(false);
    }
    if (iscurrentState !== "Taxonomy") {
      setIsTaxonomy(false);
    }
    if (iscurrentState !== "Categorys") {
      setisCates(false);
    }
    if (iscurrentState !== "Posts") {
      setIsPosts(false);
    }
    if (iscurrentState !== "Links") {
      setIsLinks(false);
    }
    if (iscurrentState !== "Media") {
      setIsMedia(false);
    }
    if (iscurrentState !== "Banners") {
      setIsBanners(false);
    }
    if (iscurrentState !== "Statistics") {
      setIsStatistics(false);
    }
    if (iscurrentState !== "Redirects") {
      setIsRedirect(false);
    }
    if (iscurrentState !== "Domains") {
      setIsDomains(false);
    }
    if (iscurrentState !== "PostsLink") {
      setIsPostsLink(false);
    }
    if (iscurrentState !== "Brand") {
      setIsBrand(false);
    }
    if (iscurrentState !== "User") {
      setIsUser(false);
    }
    if (iscurrentState !== "Team") {
      setIsTeam(false);
    }
    if (iscurrentState !== "PostsOrder") {
      setIsOrder(false);
    }
  }, [
    history,
    iscurrentState,
    isDashboard,
    isPayment,
    isFAQs,
    isSchemas,
    isTaxonomy,
    isCates,
    isLinks,
    isMedia,
    isBanners,
    isStatistics,
    isRedirect,
    isDomains,
    isPostsLink,
    isBrand,
    isUser,
    isTeam,
    isOrder,
  ]);

  const menuItems = [
    {
      label: "Menu",
      isHeader: true,
    },
    {
      id: "dashboard",
      label: "BẢNG THỐNG KÊ",
      icon: "ri-dashboard-2-line",
      link: "/dashboard",
      stateVariables: isDashboard,
      disable: user?.role === "CTV" ? true : false,
      click: function (e) {
        e.preventDefault();
        setIsDashboard(!isDashboard);
        setIscurrentState("Dashboard");
        updateIconSidebar(e);
      },
      subItems: [
        {
          id: "brandAnalytics",
          label: "Thống kê thương hiệu",
          link: "/dashboard-analytics",
          parentId: "dashboard",
        },
        {
          id: "teamAnalytics",
          label: "Thống kê team",
          link: "/team-analytics",
          parentId: "dashboard",
        },
        {
          id: "domainAnalytics",
          label: "Thống kê Domain",
          link: "/domain-analytics",
          parentId: "dashboard",
        },
        {
          id: "ctvAnalytics",
          label: "Thống kê CTV",
          link: "/ctv-analytics",
          parentId: "dashboard",
        },
      ],
    },
    {
      id: "brand-management",
      label: "QUẢN LÝ THƯƠNG HIỆU",
      icon: "ri-bookmark-line",
      link: "/#",
      disable: user?.role === "Member" || user?.role === "CTV" ? true : false,

      stateVariables: isBrand,
      click: function (e) {
        e.preventDefault();
        setIsBrand(!isBrand);
        setIscurrentState("Brand");
        updateIconSidebar(e);
      },
      subItems: [
        {
          id: "brand",
          label: "Thương hiệu",
          link: "/brand",
          parentId: "brand-management",
        },
      ],
    },
    {
      id: "team-management",
      label: "QUẢN LÝ TEAMS",
      icon: "ri-bookmark-line",
      link: "/#",
      disable: user?.role === "Member" || user?.role === "CTV" ? true : false,

      stateVariables: isTeam,
      click: function (e) {
        e.preventDefault();
        setIsTeam(!isTeam);
        setIscurrentState("Team");
        updateIconSidebar(e);
      },
      subItems: [
        {
          id: "team",
          label: "Teams",
          link: "/teams",
          parentId: "team-management",
        },
      ],
    },
    {
      id: "domain-management",
      label: "QUẢN LÝ DOMAINS",
      icon: "ri-bookmark-line",
      link: "/#",
      disable: user?.role === "Member" || user?.role === "CTV" ? true : false,
      stateVariables: isDomains,
      click: function (e) {
        e.preventDefault();
        setIsDomains(!isDomains);
        setIscurrentState("Domains");
        updateIconSidebar(e);
      },
      subItems: [
        {
          id: "domains",
          label: "Domains",
          link: "/domains",
          parentId: "domain-management",
        },
      ],
    },
    {
      id: "payments",
      label: "QUẢN LÝ THANH TOÁN",
      icon: "ri-user-2-line",
      link: "/#",
      disable: user?.role === "CTV" ? true : false,
      stateVariables: isPayment,
      click: function (e) {
        e.preventDefault();
        setIsPayment(!isPayment);
        setIscurrentState("payments");
        updateIconSidebar(e);
      },
      subItems: [
        {
          id: "user-management",
          label: "THANH TOÁN TIỀN CTV",
          link: "/payment",
          parentId: "payment",
        },
        // {
        //   id: "user-permission",
        //   label: "Phân Quyền",
        //   link: "/permission",
        //   parentId: "users",
        // },
      ],
    },
    {
      id: "postsLink-management",
      label: "QUẢN LÝ LINK",
      icon: "ri-bookmark-line",
      link: "/#",
      disable: user?.role === "CTV" ? true : false,
      stateVariables: isPostsLink,
      click: function (e) {
        e.preventDefault();
        setIsPostsLink(!isPostsLink);
        setIscurrentState("PostsLink");
        updateIconSidebar(e);
      },
      subItems: [
        {
          id: "postsLink",
          label: "Quản lý link",
          link: "/postsLink",
          parentId: "postsLink-management",
        },
      ],
    },
    {
      id: "user-management",
      label: "QUẢN LÝ USER",
      icon: "ri-bookmark-line",
      link: "/#",
      disable: user?.role !== "Admin" ? true : false,
      stateVariables: isUser,
      click: function (e) {
        e.preventDefault();
        setIsUser(!isUser);
        setIscurrentState("User");
        updateIconSidebar(e);
      },
      subItems: [
        {
          id: "user",
          label: "Users",
          link: "/users",
          parentId: "user-management",
        },
      ],
    },
    {
      // id: "postsLink-management",
      id: "postsOrder-management",
      label: "ORDER POSTS",
      icon: "ri-bookmark-line",
      link: "/#",
      stateVariables: isOrder,
      click: function (e) {
        e.preventDefault();
        setIsOrder(!isOrder);
        setIscurrentState("PostsOrder");
        updateIconSidebar(e);
      },
      subItems: [
        {
          disabled: user?.role === "CTV" ? true : false,
          id: "postsOrder",
          label: "Quản lí bài viết",
          link: "/postsOrder",
          parentId: "postsOrder-management",
        },
        {
          id: "postsNotReceivedOrder",
          label: "Danh sách bài biết mới",
          link: "/postsNotReceived",
          parentId: "postsOrder-management",
        },
        {
          id: "postOfYou",
          label: "Danh sách bài viết của bạn",
          link: "/postOfYou",
          parentId: "postsOrder-management",
        },
        {
          id: "approved",
          label: "Danh sách bài viết đã duyệt",
          link: "/approved",
          parentId: "postsOrder-management",
        },
      ],
    },
    // {
    //   id: "roles",
    //   label: "QUẢN LÍ PHÂN QUYỀN",
    //   icon: "ri-user-2-line",
    //   link: "/#",
    //   stateVariables: isRoles,
    //   click: function (e) {
    //     e.preventDefault();
    //     setIsRoles(!isRoles);
    //     setIscurrentState("Roles");
    //   },
    //   subItems: [
    //     {
    //       id: "roles-management",
    //       label: "QUYỀN HẠN",
    //       link: "/roles",
    //       parentId: "roles",
    //     },
    //   ],
    // },
    // {
    //   id: "taxonomy-management",
    //   label: "CHUYÊN MỤC",
    //   icon: "ri-price-tag-3-line",
    //   link: "/#",
    //   stateVariables: isTaxonomy,
    //   click: function (e) {
    //     e.preventDefault();
    //     setIsTaxonomy(!isTaxonomy);
    //     setIscurrentState("Taxonomy");
    //   },
    //   subItems: [
    //     {
    //       id: "taxonomy",
    //       label: "Danh mục",
    //       link: "/categories",
    //       parentId: "taxonomy-management",
    //     },
    //     {
    //       id: "taxonomy",
    //       label: "Thẻ",
    //       link: "/tags",
    //       parentId: "taxonomy-management",
    //     },
    //   ],
    // },
    // {
    //   id: "cate-management",
    //   label: "QUẢN LÝ DANH MỤC",
    //   icon: " ri-pages-line",
    //   link: "/#",
    //   stateVariables: isCates,
    //   click: function (e) {
    //     e.preventDefault();
    //     setisCates(!isCates);
    //     setIscurrentState("Categorys");
    //     updateIconSidebar(e);
    //   },
    //   subItems: [
    //     {
    //       id: "cate",
    //       label: "Category",
    //       link: "/cate-management",
    //       parentId: "cate-management",
    //     },
    //   ],
    // },
    // {
    //   id: "post-management",
    //   label: "QUẢN LÝ BÀI VIẾT",
    //   icon: "ri-archive-line",
    //   link: "/#",
    //   stateVariables: isPosts,
    //   click: function (e) {
    //     e.preventDefault();
    //     setIsPosts(!isPosts);
    //     setIscurrentState("Posts");
    //     updateIconSidebar(e);
    //   },
    //   subItems: [
    //     {
    //       id: "posts",
    //       label: "Bài Viết",
    //       link: "/posts",
    //       parentId: "post-management",
    //     },
    //   ],
    // },
    // {
    //   id: "redirect-management",
    //   label: "QUẢN LÝ REDIRECT",
    //   icon: "ri-archive-line",
    //   link: "/#",
    //   stateVariables: isRedirect,
    //   click: function (e) {
    //     e.preventDefault();
    //     setIsRedirect(!isRedirect);
    //     setIscurrentState("Redirects");
    //     updateIconSidebar(e);
    //   },
    //   subItems: [
    //     {
    //       id: "redirect",
    //       label: "Quản lí Redirect",
    //       link: "/redirect",
    //       parentId: "redirect-management",
    //     },
    //   ],
    // },
    // {
    //   id: "faqs-management",
    //   label: "QUẢN LÝ FAQs",
    //   icon: "ri-questionnaire-line",
    //   link: "/#",
    //   stateVariables: isFAQs,
    //   click: function (e) {
    //     e.preventDefault();
    //     setIsFAQs(!isFAQs);
    //     setIscurrentState("FAQs");
    //     updateIconSidebar(e);
    //   },
    //   subItems: [
    //     {
    //       id: "faqs",
    //       label: "FAQs",
    //       link: "/faqs",
    //       parentId: "faqs-management",
    //     },
    //   ],
    // },
    // {
    //   id: "links-management",
    //   label: "QUẢN LÝ LINK",
    //   icon: "ri-links-line",
    //   link: "/#",
    //   stateVariables: isLinks,
    //   click: function (e) {
    //     e.preventDefault();
    //     setIsLinks(!isLinks);
    //     setIscurrentState("Links");
    //     updateIconSidebar(e);
    //   },
    //   subItems: [
    //     {
    //       id: "links",
    //       label: "Links",
    //       link: "/links",
    //       parentId: "links-management",
    //     },
    //   ],
    // },
    // {
    //   id: "media-management",
    //   label: "QUẢN LÝ MEDIA",
    //   icon: "ri-image-line",
    //   link: "/#",
    //   stateVariables: isMedia,
    //   click: function (e) {
    //     e.preventDefault();
    //     setIsMedia(!isMedia);
    //     setIscurrentState("Media");
    //     updateIconSidebar(e);
    //   },
    //   subItems: [
    //     {
    //       id: "media",
    //       label: "Media",
    //       link: "/media-management",
    //       parentId: "media-management",
    //     },
    //   ],
    // },
    // {
    //   id: "banners-management",
    //   label: "QUẢN LÝ BANNER",
    //   icon: "ri-image-line",
    //   link: "/#",
    //   stateVariables: isBanners,
    //   click: function (e) {
    //     e.preventDefault();
    //     setIsBanners(!isBanners);
    //     setIscurrentState("Banners");
    //     updateIconSidebar(e);
    //   },
    //   subItems: [
    //     {
    //       id: "banners",
    //       label: "Banners",
    //       link: "/banners-management",
    //       parentId: "banners-management",
    //     },
    //   ],
    // },
    // {
    //   id: "statistics",
    //   label: "THỐNG KÊ",
    //   icon: "ri-filter-3-line",
    //   link: "/#",
    //   stateVariables: isStatistics,
    //   click: function (e) {
    //     e.preventDefault();
    //     setIsStatistics(!isStatistics);
    //     setIscurrentState("Statistics");
    //     updateIconSidebar(e);
    //   },
    //   subItems: [
    //     {
    //       id: "post-statistics",
    //       label: "Bài viết",
    //       link: "/post-statistics",
    //       parentId: "statistics",
    //     },
    //     {
    //       id: "user-statistics",
    //       label: "Nhân viên",
    //       link: "/user-statistics",
    //       parentId: "statistics",
    //     },
    //   ],
    // },
  ];
  return <React.Fragment>{menuItems}</React.Fragment>;
};
export default Navdata;
