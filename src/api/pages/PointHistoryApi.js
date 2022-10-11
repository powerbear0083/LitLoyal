import { toast } from "react-hot-toast";
import { toastErrorContent, parserUrl } from "utilities/common";
import { fetchData } from "api/ApiRoute";
import { commonFetchProps } from "api/ApiCommon";


const pointHistoryUrl = {
  list: 'member/pointhistory',
}

const handleError400 = (res) => {
  if (res.status === 400 && res?.data?.msg) {
    toast.error((t) => toastErrorContent(res.status, res.data.msg, t.id));
  }
  return Promise.reject(res.data ?? res);
};

/**
 * @description 點數歷程列表 API method
 * @param brandId
 * @param payload
 * @returns {PromipaginationPropsse<any>}
 */
function getPointHistoryListApi(payload){
  return fetchData(
    parserUrl(pointHistoryUrl.list, {}, payload),
    "GET",
    null,
    commonFetchProps
  ).catch(handleError400);
}

export  {
  getPointHistoryListApi
}

