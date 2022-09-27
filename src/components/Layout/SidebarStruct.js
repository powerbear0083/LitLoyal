import React from "react";
import styled from "styled-components";

import { ReactComponent as IconMenuTriangle } from "assets/images/menubar/icon_menuTriangle.svg";
import { ReactComponent as IconHomepage } from "assets/images/menubar/icon_homepage.svg";
import { ReactComponent as IconMemberList } from "assets/images/menubar/icon_memberList.svg";
import { ReactComponent as IconMembershipSetting } from "assets/images/menubar/icon_membershipSetting.svg";
import { ReactComponent as IconPointSetting } from "assets/images/menubar/icon_pointSetting.svg";
import { ReactComponent as IconActivitySetting } from "assets/images/menubar/icon_menubar_barcode.svg";
import { ReactComponent as IconDiamond } from "assets/images/icon_diamond.svg";
//import iconActivitySetting from 'assets/images/menubar/icon_activitySetting.svg';
//import iconSystemSetting from 'assets/images/menubar/icon_systemSetting.svg';

const SubmenuIsOpened = styled.div`
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 6px 5px 0 5px;
  border-color: #b8b8b8 transparent transparent transparent;
`;

const SubmenuIsClosed = styled.div`
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 5px 6px 5px 0;
  border-color: transparent #b8b8b8 transparent transparent;
`;
export const SidebarStruct = [
  {
    title: "首頁",
    path: "/",
    icon: <IconHomepage />,
    iconClosed: <IconMenuTriangle />,
    iconOpened: <IconMenuTriangle />,
  },
  {
    title: "會員名單",
    path: "#",
    icon: <IconMemberList />,
    iconClosed: <SubmenuIsClosed className="icon-menu-switch" />,
    iconOpened: <SubmenuIsOpened className="icon-menu-switch" />,
    subNav: [
      {
        title: "會員查詢",
        path: "/member",
        cName: "sub-nav",
      },
      {
        title: "會員新增",
        path: "/member/new",
        cName: "sub-nav",
      },
    ],
  },
  {
    title: "會籍設定",
    path: "/membership-setting",
    icon: <IconMembershipSetting />,
  },
  {
    title: "點數內容",
    path: "#",
    icon: <IconDiamond />,
    iconClosed: <SubmenuIsClosed className="icon-menu-switch" />,
    iconOpened: <SubmenuIsOpened className="icon-menu-switch" />,
    subNav: [
      {
        title: "點數設定",
        path: "/point-setting",
      },
      {
        title: "點數歷程",
        path: "/point-history",
      },
    ],
  },
  {
    title: "活動條碼",
    path: "#",
    icon: <IconActivitySetting />,
    iconClosed: <SubmenuIsClosed className="icon-menu-switch" />,
    iconOpened: <SubmenuIsOpened className="icon-menu-switch" />,
    subNav: [
      {
        title: "點數活動",
        path: "/point-activity",
      },
      {
        title: "商品活動",
        path: "/product-activity",
      },
      {
        title: "QRCode 活動",
        path: "/qrcode-activity",
      },
    ],
  },
  {
    title: "好禮贈送",
    path: "#",
    icon: <IconPointSetting />,
    iconClosed: <SubmenuIsClosed className="icon-menu-switch" />,
    iconOpened: <SubmenuIsOpened className="icon-menu-switch" />,
    subNav: [
      {
        title: "專屬好禮",
        path: "/gift-exclusive",
      },
      {
        title: "贈品兌換",
        path: "/gift-exchange",
      },
      {
        title: "好禮名單",
        path: "/gift-list",
      },
    ],
  },
  /*{
    title: "系統設定",
    path: "#",
    icon: <img src={iconSystemSetting} alt="" />,
    iconClosed: <SubmenuIsClosed><img src={iconMenuTriangle} alt="" /></SubmenuIsClosed>,
    iconOpened: <SubmenuIsOpened><img src={iconMenuTriangle} alt="" /></SubmenuIsOpened>,
    subNav: [
      {
        title: "權限管理",
        path: "/sys-setting/auth-mgmt",
        //icon: <span>*</span>,
      },
      {
        title: "使用者管理",
        path: "/sys-setting/user-mgmt",
        //icon: <span>*</span>,
      },
    ],
  },*/
];
