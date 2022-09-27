import { useEffect, useState, createContext, useReducer } from 'react';
import paginationFactory, { PaginationProvider } from "react-bootstrap-table2-paginator";
import { Basic, ContentSection } from "templates";
import { Breadcrumb } from "components/Common";
import { PointHistorySearch, PointHistoryList, searchRootState, PointHistorySearchReducer } from "components/Pages/PointContent";


const PointHistoryContext = createContext();
PointHistoryContext.displayName = "PointHistoryContext";

const settingPageType = {
  new: "new",
  edit: "edit",
  view: "view",
};

const defaultSort = {
  so: "desc",
  sf: "no"
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

  const [searchState, searchDispatch] = useReducer(PointHistorySearchReducer, searchRootState);

  const [totalSize, setTotalSize] = useState(0);
  const [apiPayload, setApiPayload] = useState(
    {
      ps: 25,
      p: 1,
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
            searchState={searchState}
            searchDispatch={searchDispatch}
          />
          <PaginationProvider
            pagination={
              paginationFactory(
                {
                  ...paginationOption,
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