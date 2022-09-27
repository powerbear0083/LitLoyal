import "bootstrap/dist/css/bootstrap.min.css";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import styled from "styled-components";
import { useContext, useEffect, useRef, useState } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  withRouter,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Navbar from "components/Layout/Navbar";
import Sidebar from "components/Layout/Sidebar";
import Home from "pages/Home";
import MemberSearch from "pages/Member/Search";
import MemberNew from "pages/Member/New";
import MemberEdit from "pages/Member/Edit";
import MembershipSetting from "pages/MembershipSetting";
import PointSetting from "pages/PointSetting";
import { StyleLoader } from "components/Common/Elements/Loader";
import { RootContext } from "context/RootContext";
import {
  GiftExchange,
  GiftSetting,
  GiftList,
  GiftExclusive,
  GiftExclusiveSetting,
} from "pages/Gift";
import {
  ProductActivity,
  ProductActivityManagementEntry,
  PointActivity,
  QrcodeActivity,
  QrcodeActivityContent,
} from "pages/ActivitiesCode";

import { PointHistory } from "pages/PointContent";

const SideBarAndContent = styled.div`
  display: flex;
  flex-grow: 1;
  padding-top: 48px;
`;

const Content = styled.div`
  flex-grow: 1;
  background-color: #fafafa;
  display: flex;
`;

const pathConfig = {
  gift: {
    exchange: "/gift-exchange",
    setting: "/gift-setting",
    list: "/gift-list",
    exclusive: "/gift-exclusive",
    exclusiveSetting: "/gift-exclusive-setting",
  },
  activitiesCode: {
    main: "/product-activity",
    formManagement: "/product-management",
    edit: "/product-edit",
    pointActivity: "/point-activity",
    qrcodeActivity: "/qrcode-activity",
    qrcodeActivityContent: "/qrcode-activity-content",
  },
  pointContent: {
    history: "/point-history",
  }
};

const RouteConfig = [
  {
    path: "/",
    component: Home,
    exact: true,
  },
  {
    path: "/member/new",
    component: MemberNew,
  },
  {
    path: "/member/edit/:memberId",
    component: MemberEdit,
  },
  {
    path: "/member",
    component: MemberSearch,
  },
  {
    path: "/membership-setting",
    component: MembershipSetting,
  },
  {
    path: "/point-setting",
    component: PointSetting,
  },
  {
    path: pathConfig.pointContent.history,
    component: PointHistory,
  },
  {
    path: pathConfig.gift.exchange,
    component: GiftExchange,
  },
  {
    path: pathConfig.gift.setting,
    component: GiftSetting,
  },
  {
    path: pathConfig.gift.list,
    component: GiftList,
  },
  {
    path: pathConfig.gift.exclusive,
    component: GiftExclusive,
  },
  {
    path: pathConfig.gift.exclusiveSetting,
    component: GiftExclusiveSetting,
  },
  {
    path: pathConfig.activitiesCode.main,
    component: ProductActivity,
  },
  {
    path: pathConfig.activitiesCode.formManagement,
    component: ProductActivityManagementEntry,
  },
  {
    path: pathConfig.activitiesCode.edit,
    component: ProductActivityManagementEntry,
  },
  {
    path: pathConfig.activitiesCode.pointActivity,
    component: PointActivity,
  },
  {
    path: pathConfig.activitiesCode.qrcodeActivity,
    component: QrcodeActivity,
  },
  {
    path: pathConfig.activitiesCode.qrcodeActivityContent,
    component: QrcodeActivityContent,
  },
];

function PageRoutes(props) {
  const rootData = useContext(RootContext);
  const isClosePage = useRef(false); //作為上方navbar改變品牌或店家時，重新開關頁面的判斷

  useEffect(() => {
    if (
      (rootData?.brandId &&
        rootData?.shopId &&
        rootData?.prevRootData?.brandId &&
        rootData?.brandId !== rootData?.prevRootData?.brandId) ||
      (rootData?.prevRootData?.shopId &&
        rootData?.shopId !== rootData?.prevRootData?.shopId)
    ) {
      isClosePage.current = true;
    }
  }, [rootData]);

  useEffect(() => {
    if (isClosePage.current) {
      isClosePage.current = false;
    }
  });

  return (
    <div className="app">
      <SideBarAndContent>
        <Content>
          <Sidebar routerProps={props} />
          <Switch>
            {RouteConfig.map(({ path, component, ...routeConfig }) => (
              <RouteComponent
                key={path}
                path={path}
                component={component}
                componentPorps={props}
                {...routeConfig}
              />
            ))}
          </Switch>
        </Content>
      </SideBarAndContent>
    </div>
  );
}

const RouteComponent = ({ component: Component, componentPorps, ...props }) => {
  const [isPageLoading, setPageLoading] = useState(true);
  return (
    <Route {...props}>
      <StyleLoader isHide={!isPageLoading} bgColorAlpha={1} />
      <Component
        isPageLoading={isPageLoading}
        setPageLoading={setPageLoading}
        {...componentPorps}
      />
    </Route>
  );
};
const WithPageRoutes = withRouter(PageRoutes);

function AppRouter(props) {
  return (
    <>
      <Toaster
        containerStyle={{
          top: 40,
        }}
        toastOptions={{
          className: "react-hot-toast",
          style: {
            border: "1px solid #d8d8d8",
          },
          success: {
            duration: 5000,
            iconTheme: {
              primary: "#3ca078",
            },
          },
          error: {
            duration: Infinity,
            iconTheme: {
              primary: "#dc3c50",
            },
          },
        }}
      />
      <Router>
        <Navbar {...props} />
        <WithPageRoutes />
      </Router>
    </>
  );
}

export default AppRouter;
export { pathConfig };
