import {useEffect, useState, createContext, useReducer, useContext} from 'react';
import paginationFactory, { PaginationProvider } from "react-bootstrap-table2-paginator";
import { formatISO } from "date-fns";
import { RootContext } from "context/RootContext";
import { Basic, ContentSection } from "templates";
import { Breadcrumb } from "components/Common";
import { getPointHistoryListApi } from "api/ApiMain";
import { 
  PointHistorySearch, 
  PointHistoryList,
  PointHistoryRootState,
  PointHistoryReducer
} from "components/Pages/PointContent";


const PointHistoryContext = createContext();
PointHistoryContext.displayName = "PointHistoryContext";

const settingPageType = {
  new: "new",
  edit: "edit",
  view: "view",
};

const defaultSort = {
  sf: "no",
  so: "desc"
};

const paginationOption = {
  custom: true,
  sizePerPageList: [
    { text: "25 筆", value: 25 },
    { text: "50 筆", value: 50 },
    { text: "100 筆", value: 100 },
  ],
};


/**
 * @description 點數歷程進入點
 * @param setPageLoading 頁面載入狀態 method
 * @returns {JSX.Element}
 * @constructor
 */
export default function PointHistory(
  {
      setPageLoading = () => {},
  }
) {

  const rootData = useContext(RootContext);
  const [pointHistoryState, pointHistoryDispatch] = useReducer(PointHistoryReducer, PointHistoryRootState);

  const [totalSize, setTotalSize] = useState(0);
  const [apiPayload, setApiPayload] = useState(
    {
      p: 1,
      ps: 25,
      ...defaultSort
    }
  );
  
  useEffect(() => {
    setPageLoading(false);
  });

  const paginationFn = {
    onPageChange: (page) => setApiPayload((prev) => ({ ...prev, p: page })),
    onSizePerPageChange: (sizePerPage, page) =>
      setApiPayload((prev) => ({ ...prev, ps: sizePerPage, p: page })),
  };

  const [isLoadingTableData, setIsLoadingTableData] = useState(false);
  const [tableData, setTableData] = useState([]);
  const fetchPointHistoryList = async (brandId, apiPayload, pointHistoryState) => {
    const startDate = pointHistoryState.dateRange[0].startDate
    const endDate = pointHistoryState.dateRange[0].endDate
    const newStartDate = startDate === ''
      ? ''
      : formatISO(startDate, { representation: "date" })
    const newEndDate = endDate === ''
      ? ''
      : formatISO(startDate, { representation: "date" })
    const newApiPayload = {
      ...apiPayload,
      brandId,
      customId: pointHistoryState.customId,
      startDate: newStartDate,
      endDate: newEndDate,
      description: pointHistoryState.description
    }
    setIsLoadingTableData(true);
    const respond = await getPointHistoryListApi(newApiPayload);
    const successState = 200
    if(respond && respond?.data?.code === successState) {
      const {
        data: {
          data: {
            rows,
            totalSize,
          }
        }
      } = respond
      setTableData(rows);
      setTotalSize(totalSize);
      setIsLoadingTableData(false);
    }
  }

  useEffect(() => {
    if(rootData.brandId) {
      fetchPointHistoryList(rootData.brandId, apiPayload, pointHistoryState)
    }
  },[rootData?.brandId, apiPayload, pointHistoryState]);

  /**
   * @description 點數歷程搜尋事件
   */
  function clickSearch() {
    fetchPointHistoryList(rootData.brandId, apiPayload, pointHistoryState)
  }
  
  function clearSearchFields() {
    pointHistoryDispatch({
      type: 'CLEAR_FIELDS',
    });
  }
  return (
    <PointHistoryContext.Provider
      value={
        {
          apiPayload,
          setApiPayload,
          defaultSort,
          setPageLoading,
          setTotalSize
        }
      }
    >
      <Basic navSection={NavSection}>
        <ContentSection>
          <PointHistorySearch
            pointHistoryState={pointHistoryState}
            pointHistoryDispatch={pointHistoryDispatch}
            onClearFields={clearSearchFields}
            onClickSearch={clickSearch}
          />
          <PaginationProvider
            pagination={
              paginationFactory(
                {
                  ...paginationOption,
                  ...paginationFn,
                  ...paginationFn,
                  totalSize,
                  page: apiPayload.p,
                  sizePerPage: apiPayload.ps,
                }
              )
            }
          >
            {
              ({ paginationProps, paginationTableProps }) => (
                <PointHistoryList
                  paginationProps={paginationProps}
                  paginationTableProps={paginationTableProps}
                  tableData={tableData}
                  isLoadingTableData={isLoadingTableData}
                />
              )
            }
          </PaginationProvider>
        </ContentSection>
      </Basic>
    </PointHistoryContext.Provider>
  );
}

function NavSection() {
  const config = {
    now: <span className="width-max-content d-inline-block">點數歷程</span>,
    pathList: [{ title: "點數內容 ", slash: true }],
  };
  return <Breadcrumb {...config} />;
}

export { PointHistoryContext, settingPageType };