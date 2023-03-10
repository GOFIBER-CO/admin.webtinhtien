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
      label: "B???NG TH???NG K??",
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
          label: "Th???ng k?? th????ng hi???u",
          link: "/dashboard-analytics",
          parentId: "dashboard",
        },
        {
          id: "teamAnalytics",
          label: "Th???ng k?? team",
          link: "/team-analytics",
          parentId: "dashboard",
        },
        {
          id: "domainAnalytics",
          label: "Th???ng k?? Domain",
          link: "/domain-analytics",
          parentId: "dashboard",
        },
        {
          id: "ctvAnalytics",
          label: "Th???ng k?? CTV",
          link: "/ctv-analytics",
          parentId: "dashboard",
        },
      ],
    },
    {
      id: "brand-management",
      label: "QU???N L?? TH????NG HI???U",
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
          label: "Th????ng hi???u",
          link: "/brand",
          parentId: "brand-management",
        },
      ],
    },
    {
      id: "team-management",
      label: "QU???N L?? TEAMS",
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
      label: "QU???N L?? DOMAINS",
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
      label: "QU???N L?? THANH TO??N",
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
          label: "THANH TO??N TI???N CTV",
          link: "/payment",
          parentId: "payment",
        },
        // {
        //   id: "user-permission",
        //   label: "Ph??n Quy???n",
        //   link: "/permission",
        //   parentId: "users",
        // },
      ],
    },
    {
      id: "postsLink-management",
      label: "QU???N L?? LINK",
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
          label: "Qu???n l?? link",
          link: "/postsLink",
          parentId: "postsLink-management",
        },
      ],
    },
    {
      id: "user-management",
      label: "QU???N L?? USER",
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
          label: "Qu???n l?? b??i vi???t",
          link: "/postsOrder",
          parentId: "postsOrder-management",
        },
        {
          id: "postsNotReceivedOrder",
          label: "Danh s??ch b??i bi???t m???i",
          link: "/postsNotReceived",
          parentId: "postsOrder-management",
        },
        {
          id: "postOfYou",
          label: "Danh s??ch b??i vi???t c???a b???n",
          link: "/postOfYou",
          parentId: "postsOrder-management",
        },
        // {
        //   id: "approved",
        //   label: "Danh s??ch b??i vi???t ???? duy???t",
        //   link: "/approved",
        //   parentId: "postsOrder-management",
        // },
      ],
    },
    // {
    //   id: "roles",
    //   label: "QU???N L?? PH??N QUY???N",
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
    //       label: "QUY???N H???N",
    //       link: "/roles",
    //       parentId: "roles",
    //     },
    //   ],
    // },
    // {
    //   id: "taxonomy-management",
    //   label: "CHUY??N M???C",
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
    //       label: "Danh m???c",
    //       link: "/categories",
    //       parentId: "taxonomy-management",
    //     },
    //     {
    //       id: "taxonomy",
    //       label: "Th???",
    //       link: "/tags",
    //       parentId: "taxonomy-management",
    //     },
    //   ],
    // },
    // {
    //   id: "cate-management",
    //   label: "QU???N L?? DANH M???C",
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
    //   label: "QU???N L?? B??I VI???T",
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
    //       label: "B??i Vi???t",
    //       link: "/posts",
    //       parentId: "post-management",
    //     },
    //   ],
    // },
    // {
    //   id: "redirect-management",
    //   label: "QU???N L?? REDIRECT",
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
    //       label: "Qu???n l?? Redirect",
    //       link: "/redirect",
    //       parentId: "redirect-management",
    //     },
    //   ],
    // },
    // {
    //   id: "faqs-management",
    //   label: "QU???N L?? FAQs",
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
    //   label: "QU???N L?? LINK",
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
    //   label: "QU???N L?? MEDIA",
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
    //   label: "QU???N L?? BANNER",
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
    //   label: "TH???NG K??",
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
    //       label: "B??i vi???t",
    //       link: "/post-statistics",
    //       parentId: "statistics",
    //     },
    //     {
    //       id: "user-statistics",
    //       label: "Nh??n vi??n",
    //       link: "/user-statistics",
    //       parentId: "statistics",
    //     },
    //   ],
    // },
  ];
  return <React.Fragment>{menuItems}</React.Fragment>;
};
export default Navdata;
