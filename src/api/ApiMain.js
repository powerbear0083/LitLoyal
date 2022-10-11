import { fetchData } from "api/ApiRoute";
import { getSearchParameter, commonFetchProps } from "api/ApiCommon";
import {
  getGiftList,
  deleteEvent,
  getEvent,
  updateEvent,
  addEvent,
  changeStatus,
  getMemberList,
  generateSystemExchangeCode,
  importExchangeCode,
  exportExchangeCode,
  getExchangeCodeList,
  addExchangeCode,
  switchExchangeCodeType,
  batchDeleteExchangeCode,
  getMemberOutline,
  getVipGiftList,
  addVipGift,
  getVipGiftInfo,
  updateVipGiftInfo,
  deleteVipGiftInfo,
  changeVipGiftStatus,
  copyVipGiftInfo,
  getVipExchangeCodeList,
  importVipExchangeCode,
  addVipExchangeCode,
  switchVipExchangeCodeType,
  batchDeleteVipExchangeCode,
  checkVipExchangeRule,
  getGiftExchangeRecord,
  getVipGiftExchangeRecord,
  getVipExchangedRecord,
  getVipExchangeLink,
  vipExchangeUnlink,
} from "api/pages/Gift";
import {
  getProductActivityList,
  getProductActivityEvent,
  deleteProductActivityEvent,
  stopProductActivity,
  getPointproductrulemultiple,
  addProductActivityEvent,
  updateProductActivityEvent,
  getProductListList,
  addSingleProductListItem,
  batchDeleteProductItem,
  importProductItems,
} from "api/pages/ProductActivity";

import {
  getPointActivityListApi,
  getPointActivitySettingApi,
  addBarcodeRuleApi,
  stopPointActivityApi,
  deletePointActivityApi,
  getEditPointActivityApi,
  editPointActivityApi
} from "api/pages/PointActivityApi";


import {
  getPointHistoryListApi
} from "api/pages/PointHistoryApi.js";

/* Qrcode 活動 */
import { testApi, testApi2 } from "api/pages/QrcodeActivity";

/*--------------------------------------
    登入頁 or 使用者相關資訊
----------------------------------------*/

//登入
const postAuth = (data) => {
  return fetchData(`account/auth`, "POST", data).then((rsp) => {
    return rsp?.data?.data;
  });
};
//獲得使用者資訊
const getAuth = () => {
  return fetchData(`account/auth`, "GET", null).then((rsp) => {
    return rsp?.data?.data;
  });
};
//獲得對應使用者的公司列表
const getAuthCompanies = () => {
  return fetchData(
    `account/auth/companies`,
    "GET",
    null,
    commonFetchProps
  ).then((rsp) => {
    return rsp?.data?.data;
  });
};
//獲得對應使用者公司的品牌列表
const getAuthCompanyBrands = (companyId) => {
  return fetchData(
    `account/auth/company/${companyId}/brands`,
    "GET",
    null,
    commonFetchProps
  ).then((rsp) => {
    return rsp?.data?.data;
  });
};
//獲得對應使用者公司品牌的商店列表
const getAuthCompanyBrandShops = (companyId, brandId) => {
  return fetchData(
    `account/auth/company/${companyId}/brand/${brandId}/shops`,
    "GET",
    null,
    commonFetchProps
  ).then((rsp) => {
    return rsp?.data?.data;
  });
};
//修改登入密碼
const patchAuthChpwd = (data) => {
  return fetchData(`account/auth/chpwd`, "PATCH", data, commonFetchProps).then(
    (rsp) => {
      return rsp?.data?.data;
    }
  );
};

/*--------------------------------------
    首頁
----------------------------------------*/
//獲得總會員數、月招募會員數等資訊
const getMemberDashboard = (queryStringObj) => {
  const searchParameter = getSearchParameter(queryStringObj);
  return fetchData(
    `member/dashboard${searchParameter}`,
    "GET",
    null,
    commonFetchProps
  ).then((rsp) => {
    return rsp?.data?.data;
  });
};

/*--------------------------------------
    會員查詢頁
----------------------------------------*/
//取得所有會員資料
const getMember = (queryStringObj) => {
  const searchParameter = getSearchParameter(queryStringObj);
  return fetchData(
    `member${searchParameter}`,
    "GET",
    null,
    commonFetchProps
  ).then((rsp) => {
    return rsp?.data?.data;
  });
};
const postMember = (data) => {
  return fetchData(`member`, "POST", data, commonFetchProps).then((rsp) => {
    return rsp?.data?.data;
  });
};
//取得指定會員資料、新增會員的欄位資料
const getMemberOnce = (memberId, queryStringObj) => {
  const searchParameter = getSearchParameter(queryStringObj);
  return fetchData(
    `member/${memberId}${searchParameter}`,
    "GET",
    null,
    commonFetchProps
  ).then((rsp) => {
    return rsp?.data?.data;
  });
};

/*--------------------------------------
    會員資料頁
----------------------------------------*/
//修改會員資料
const patchMember = (memberId, data) => {
  const searchParameter = getSearchParameter();
  return fetchData(
    `member/${memberId}${searchParameter}`,
    "PATCH",
    data,
    commonFetchProps
  ).then((rsp) => {
    return rsp?.data?.data;
  });
};
//取得交易資料
const getMemberDealinfo = (memberId, queryStringObj) => {
  const searchParameter = getSearchParameter(queryStringObj);
  return fetchData(
    `member/${memberId}/dealinfo${searchParameter}`,
    "GET",
    null,
    commonFetchProps
  ).then((rsp) => {
    return rsp?.data?.data;
  });
};
//取得點數紀錄
const getMemberPointRecord = (memberId, queryStringObj) => {
  const searchParameter = getSearchParameter(queryStringObj);
  return fetchData(
    `member/${memberId}/pointrecord${searchParameter}`,
    "GET",
    null,
    commonFetchProps
  ).then((rsp) => {
    return rsp?.data?.data;
  });
};
//取得會籍紀錄
const getMembershipRecord = (memberId, queryStringObj) => {
  const searchParameter = getSearchParameter(queryStringObj);
  return fetchData(
    `member/${memberId}/membershiprecord${searchParameter}`,
    "GET",
    null,
    commonFetchProps
  ).then((rsp) => {
    return rsp?.data?.data;
  });
};
//刪除會員資料
const deleteMember = (memberId, queryStringObj) => {
  const searchParameter = getSearchParameter(queryStringObj);
  return fetchData(
    `member/${memberId}${searchParameter}`,
    "DELETE",
    null,
    commonFetchProps
  ).then((rsp) => {
    return rsp?.data?.data;
  });
};
//解除手機綁定
const patchUnbind = (memberId, data) => {
  return fetchData(
    `member/${memberId}/unbind`,
    "PATCH",
    data,
    commonFetchProps
  ).then((rsp) => {
    return rsp?.data?.data;
  });
};
/*--------------------------------------
    點數設定頁
----------------------------------------*/
//點數設定頁全部資料
const getPoint = (brandId) => {
  return fetchData(
    `setting/brand/${brandId}/point`,
    "GET",
    null,
    commonFetchProps
  ).then((rsp) => {
    return rsp?.data?.data;
  });
};
//點數設定頁-贈點設定的表格資料
const getPointGainPointRules = (brandId, queryStringObj) => {
  const searchParameter = getSearchParameter(queryStringObj);
  return fetchData(
    `setting/brand/${brandId}/point/gainpointrules${searchParameter}`,
    "GET",
    null,
    commonFetchProps
  ).then((rsp) => {
    return rsp?.data?.data;
  });
};
//點數設定頁-編輯基本設定
const patchPointBase = (brandId, baseId, data) => {
  return fetchData(
    `setting/brand/${brandId}/point/base/${baseId}`,
    "PATCH",
    data,
    commonFetchProps
  ).then((rsp) => {
    return rsp?.data?.data;
  });
};
//點數設定頁-新增基本設定
const postPointBase = (brandId, data) => {
  return fetchData(
    `setting/brand/${brandId}/point/base`,
    "POST",
    data,
    commonFetchProps
  ).then((rsp) => {
    return rsp?.data?.data;
  });
};
//點數設定頁-獲得編輯贈點設定單一row的資料
const getPointGainPointRuleOnce = (brandId, gainPointRuleId) => {
  return fetchData(
    `setting/brand/${brandId}/point/gainpointrule/${gainPointRuleId}`,
    "GET"
  ).then((rsp) => {
    return rsp?.data?.data;
  });
};
//點數設定頁-編輯贈點設定
const patchGainPointRule = (brandId, gainPointRuleId, data) => {
  return fetchData(
    `setting/brand/${brandId}/point/gainpointrule/${gainPointRuleId}`,
    "PATCH",
    data,
    commonFetchProps
  ).then((rsp) => {
    return rsp?.data?.data;
  });
};
//點數設定頁-新增贈點
const postGainPointRule = (brandId, data) => {
  return fetchData(
    `setting/brand/${brandId}/point/gainpointrule`,
    "POST",
    data,
    commonFetchProps
  ).then((rsp) => {
    return rsp?.data?.data;
  });
};
//點數設定頁-刪除贈點
const deleteGainPointRule = (brandId, gainPointRuleId) => {
  return fetchData(
    `setting/brand/${brandId}/point/gainpointrule/${gainPointRuleId}`,
    "DELETE",
    null,
    commonFetchProps
  ).then((rsp) => {
    return rsp?.data?.data;
  });
};
//點數設定頁-刪除所有贈點
const deleteGainPointRules = (brandId) => {
  return fetchData(
    `setting/brand/${brandId}/point/gainpointrules}`,
    "DELETE",
    null,
    commonFetchProps
  ).then((rsp) => {
    return rsp?.data?.data;
  });
};
//點數設定頁-停用贈點
const patchGainPointRuleStop = (brandId, gainPointRuleId) => {
  return fetchData(
    `setting/brand/${brandId}/point/gainpointrule/${gainPointRuleId}/stop`,
    "PATCH",
    null,
    commonFetchProps
  ).then((rsp) => {
    return rsp?.data?.data;
  });
};
//點數設定頁-開始計算
const patchPointStartCompute = (brandId, baseId) => {
  return fetchData(
    `setting/brand/${brandId}/point/base/${baseId}/startcompute`,
    "PATCH",
    null
  ).then((rsp) => {
    return rsp?.data?.data;
  });
};

/*--------------------------------------
    會籍設定頁
----------------------------------------*/
//會籍設定頁全部資料(不包含會員等級的表格資料)
const getMemberShip = (brandId) => {
  return fetchData(
    `setting/brand/${brandId}/membership`,
    "GET",
    null,
    commonFetchProps
  ).then((rsp) => {
    return rsp?.data?.data;
  });
};
//會籍設定頁-會員等級資料(規則設定表格)
const getMemberShipLevels = (brandId, queryStringObj) => {
  const searchParameter = getSearchParameter(queryStringObj);
  return fetchData(
    `setting/brand/${brandId}/membership/levels${searchParameter}`,
    "GET",
    null,
    commonFetchProps
  ).then((rsp) => {
    return rsp?.data?.data;
  });
};
//會籍設定頁-獲得編輯會級單一row的資料
const getMemberShipLevelOnce = (brandId, levelId) => {
  return fetchData(
    `setting/brand/${brandId}/membership/level/${levelId}`,
    "GET",
    null,
    commonFetchProps
  ).then((rsp) => {
    return rsp?.data?.data;
  });
};
//會籍設定頁-編輯會級
const patchMemberShipLevel = (brandId, levelId, data) => {
  return fetchData(
    `setting/brand/${brandId}/membership/level/${levelId}`,
    "PATCH",
    data,
    commonFetchProps
  ).then((rsp) => {
    return rsp?.data?.data;
  });
};
//會籍設定頁-新增會級
const postMemberShipLevel = (brandId, data) => {
  return fetchData(
    `setting/brand/${brandId}/membership/level`,
    "POST",
    data,
    commonFetchProps
  ).then((rsp) => {
    return rsp?.data?.data;
  });
};
//會籍設定頁-編輯基本設定
const patchMemberShipBase = (brandId, baseId, data) => {
  return fetchData(
    `setting/brand/${brandId}/membership/base/${baseId}`,
    "PATCH",
    data,
    commonFetchProps
  ).then((rsp) => {
    return rsp?.data?.data;
  });
};
//會籍設定頁-新增基本設定
const postMemberShipBase = (brandId, data) => {
  return fetchData(
    `setting/brand/${brandId}/membership/base`,
    "POST",
    data,
    commonFetchProps
  ).then((rsp) => {
    return rsp?.data?.data;
  });
};
//會籍設定頁-開始計算
const patchMemberShipStartCompute = (brandId, baseId) => {
  return fetchData(
    `setting/brand/${brandId}/membership/base/${baseId}/startcompute`,
    "PATCH",
    null
  ).then((rsp) => {
    return rsp?.data?.data;
  });
};
//會籍設定頁-刪除會級
const deleteMemberShipLevel = (brandId, levelId) => {
  return fetchData(
    `setting/brand/${brandId}/membership/level/${levelId}`,
    "DELETE",
    null,
    commonFetchProps
  ).then((rsp) => {
    return rsp?.data?.data;
  });
};
//會籍設定頁-刪除全部會級
const deleteMemberShipLevels = (brandId) => {
  return fetchData(
    `setting/brand/${brandId}/membership/levels`,
    "DELETE",
    null,
    commonFetchProps
  );
};
export {
  /* 登入頁 or 使用者相關資訊 */
  postAuth,
  getAuth,
  getAuthCompanies,
  getAuthCompanyBrands,
  getAuthCompanyBrandShops,
  /* 首頁 */
  getMemberDashboard,
  patchAuthChpwd,
  /* 會員查詢頁 */
  getMember,
  postMember,
  getMemberOnce,
  /* 會員資料頁 */
  patchMember,
  getMemberDealinfo,
  getMemberPointRecord,
  getMembershipRecord,
  deleteMember,
  patchUnbind,
  /* 點數設定頁 */
  getPoint,
  getPointGainPointRules,
  patchPointBase,
  postPointBase,
  getPointGainPointRuleOnce,
  patchGainPointRule,
  postGainPointRule,
  deleteGainPointRule,
  deleteGainPointRules,
  patchGainPointRuleStop,
  patchPointStartCompute,
  /* 會籍設定頁 */
  getMemberShip,
  getMemberShipLevels,
  getMemberShipLevelOnce,
  patchMemberShipLevel,
  postMemberShipLevel,
  patchMemberShipBase,
  postMemberShipBase,
  patchMemberShipStartCompute,
  deleteMemberShipLevel,
  deleteMemberShipLevels,
  /* 活動條碼 - 商品活動 */
  getProductActivityList,
  getProductActivityEvent,
  deleteProductActivityEvent,
  stopProductActivity,
  getPointproductrulemultiple,
  addProductActivityEvent,
  updateProductActivityEvent,
  getProductListList,
  addSingleProductListItem,
  batchDeleteProductItem,
  importProductItems,
  /* 活動條碼 - Qrcode 活動 */
  testApi,
  testApi2,
  /* 好禮贈送 - 贈品兌換 */
  getGiftList,
  deleteEvent,
  getEvent,
  updateEvent,
  addEvent,
  getMemberList,
  changeStatus,
  generateSystemExchangeCode,
  importExchangeCode,
  exportExchangeCode,
  getExchangeCodeList,
  addExchangeCode,
  switchExchangeCodeType,
  batchDeleteExchangeCode,
  getMemberOutline,
  /* 好禮贈送 - 專屬好禮 */
  getVipGiftList,
  addVipGift,
  getVipGiftInfo,
  updateVipGiftInfo,
  deleteVipGiftInfo,
  changeVipGiftStatus,
  copyVipGiftInfo,
  getVipExchangeCodeList,
  importVipExchangeCode,
  addVipExchangeCode,
  switchVipExchangeCodeType,
  batchDeleteVipExchangeCode,
  checkVipExchangeRule,
  getVipExchangedRecord,
  getVipExchangeLink,
  vipExchangeUnlink,
  /* 好禮贈送 - 好禮名單 */
  getGiftExchangeRecord,
  getVipGiftExchangeRecord,
  /* 點數活動 API  */
  getPointActivityListApi,
  getPointActivitySettingApi,
  addBarcodeRuleApi,
  stopPointActivityApi,
  deletePointActivityApi,
  getEditPointActivityApi,
  editPointActivityApi,
  /* 點數歷程 API  */
  getPointHistoryListApi
};
