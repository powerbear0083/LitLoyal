import {useContext, useState, useEffect} from 'react';
import { PaginationListStandalone, SizePerPageDropdownStandalone,} from "react-bootstrap-table2-paginator";
import { Row } from "react-bootstrap";
import { formatISO } from "date-fns";
import { RootContext } from "context/RootContext";
import { Table, NoDataIndication, Col } from "components/Common";
import { StyleCard } from "components/Common/Elements/Card";
import { StyleButton } from "components/Common/Elements/Button";
import { getPointHistoryListApi } from "api/ApiMain";
import { PointHistoryContext } from "pages/PointContent/PointHistory/PointHistory";
import PointHistoryListStyle from "./PointHistoryListStyle";
import Formatter from "./PointHistoryListFormatters.js";
import PointDetailModal from "./PointDetailModal";
import PointRecordModal from "./PointRecordModal";

/**
 * @description 點數歷程列表
 * @returns {JSX.Element}
 * @constructor
 */
export default function PointHistoryList(
  {
    paginationProps,
    paginationTableProps,
    tableData = [],
    isLoadingTableData = false
  }
) {
  const {
    apiPayload,
    setApiPayload,
  } = useContext(PointHistoryContext);
  
  function onTableChange(setApiPayload, type, value) {
    if(type === "sort") {
      setApiPayload(
        (prev) => (
          {
            ...prev,
            sf: value.sortField,
            so: value.sortOrder
          }
        )
      )
    }
  }
  
  const renderEmptyStringSymbol = (keyName) => {
    const isEmptyString = keyName === null || keyName === undefined || keyName === '';
    return isEmptyString ? '-' : keyName;
  }
  const initPointDetailModalInfo = {
    createDateTime: '',
    customId: '',
    name: '',
    description: '',
    transactionCategory: '',
    pointGain: null,
    shopName: '',
    creatorEmail: '',
    additionalInstructions: ''
  }
  const [pointDetailModalInfo, setPointDetailModalInfo] = useState({...initPointDetailModalInfo});
  function onClickRow(e, row) {
    if(row) {
      setPointDetailModalInfo({
        createDateTime: row.createDateTime,
        customId: row.customId,
        name: row.name,
        description: row.description,
        transactionCategory: row.transactionCategory,
        pointGain: row.pointGain,
        shopName: renderEmptyStringSymbol(row.shopName),
        creatorEmail: renderEmptyStringSymbol(row.creatorEmail),
        additionalInstructions: renderEmptyStringSymbol(row.additionalInstructions)
      })
    }
  }
  const isShowPointDetailModal = (modalInfo) => {
    return modalInfo.createDateTime !== ''
  };

  function closePointDetailModal() {
    setPointDetailModalInfo({...initPointDetailModalInfo});
  }
  
  const [isShowRecordModal, setIsShowRecordModal] = useState(false);
  function clickRecordPoint() {
    setIsShowRecordModal(true);
  }
  function closeRecordModal() {
    setIsShowRecordModal(false);
  }
  return (
    <PointHistoryListStyle>
      <StyleCard className="w-100 mt-4">
        <TableToolBar
          totalSize={paginationProps.totalSize}
          paginationProps={paginationProps}
          sizePerPage={paginationProps.sizePerPage}
          onClick={null}
          onClickRecordPoint={clickRecordPoint}
        />
        <Table
          striped
          remote
          headerClasses="table-header"
          bodyClasses="paragraph"
          className="overflow-auto"
          keyField="no"
          data={tableData}
          columns={generateColumns()}
          sort={{ dataField: apiPayload.sf, order: apiPayload.so }}
          rowEvents={
            {
              onClick: onClickRow
            }
          }
          onTableChange={(type, value) => onTableChange(setApiPayload, type, value)}
          noDataIndication={
            <NoDataIndication message={isLoadingTableData ? "載入中..." : "尚無資料"} />
          }
          {...paginationTableProps}
        />
        <PaginationListStandalone {...paginationProps} />
      </StyleCard>
      <PointDetailModal
        isShowModal={isShowPointDetailModal(pointDetailModalInfo)}
        pointDetailModalInfo={pointDetailModalInfo}
        closePointDetailModal={closePointDetailModal}
      />
      <PointRecordModal
        isShowModal={isShowRecordModal}
        setIsShowRecordModal={setIsShowRecordModal}
      />
    </PointHistoryListStyle>
  )
}

/**
 * @description table 上方工具列 UI
 * @param totalSize
 * @param paginationProps
 * @param sizePerPage
 * @param onClick
 * @param onClickRecordPoint 補單點數事件
 * @returns {JSX.Element}
 * @constructor
 */
function TableToolBar(
  {
    totalSize = 0,
    paginationProps = {},
    sizePerPage = 0,
    onClick = () => { },
    onClickRecordPoint = () => { }
  }
) {
  return (
    <Row className="table-toolbar d-flex">
      <Col>
        <span>總項目：</span>
        <span className={`total-size`}>
          {totalSize}  筆
        </span>
      </Col>
      <Col className="d-flex">
        <div className="ml-auto mr-3">
          <span>每頁項目：</span>
          <SizePerPageDropdownStandalone
            {...paginationProps}
            sizePerPage={`${sizePerPage} 筆`}
          />
        </div>
        <StyleButton
          className="mr-3"
          variant="outline-darkerGray"
          onClick={onClick}
          size="sm"
        >
          批次上傳
        </StyleButton>
        <StyleButton
          variant="outline-primary"
          onClick={onClickRecordPoint}
          size="sm"
        >
          補登點數
        </StyleButton>
      </Col>
    </Row>
  )
}

/**
 * @description 產生 columns 配置
 */
function generateColumns() {
  return [
    {
      dataField: "no",
      text: "No.",
      sort: true,
      headerStyle: {
        width: "2%",
      },
      style: (_cell, row) => {
        return {
          backgroundColor:
            row.pointProductCount === 0 ? "rgba(220, 60, 80, 0.2)" : "",
        };
      },
    },
    {
      dataField: "createDateTime",
      text: "時間",
      sort: true,
      headerStyle: {
        width: "23%",
      },
      style: (_cell, row) => {
        return {
          backgroundColor:
            row.pointProductCount === 0 ? "rgba(220, 60, 80, 0.2)" : "",
        };
      },
    },
    {
      dataField: "customId",
      text: "會員編號",
      sort: true,
      headerStyle: {
        width: "6%",
      },
      style: (_cell, row) => {
        return {
          backgroundColor:
            row.pointProductCount === 0 ? "rgba(220, 60, 80, 0.2)" : "",
        };
      },
    },
    {
      dataField: "name",
      text: "會員",
      sort: false,
      headerStyle: {
        width: "12%",
      },
      style: (_cell, row) => {
        return {
          backgroundColor:
            row.pointProductCount === 0 ? "rgba(220, 60, 80, 0.2)" : "",
        };
      },
    },
    {
      dataField: "description",
      text: "名稱",
      sort: true,
      headerStyle: {
        width: "27%",
      },
      style: (_cell, row) => {
        return {
          backgroundColor:
            row.pointProductCount === 0 ? "rgba(220, 60, 80, 0.2)" : "",
        };
      },
    },
    {
      dataField: "pointGain",
      text: "點數異動",
      sort: true,
      headerStyle: {
        width: "2%",
      },
      style: (_cell, row) => {
        return {
          backgroundColor:
            row.pointProductCount === 0 ? "rgba(220, 60, 80, 0.2)" : "",
        };
      },
    },
    {
      dataField: "shopName",
      text: "補登者",
      sort: true,
      headerStyle: {
        width: "13%",
      },
      style: (_cell, row) => {
        return {
          backgroundColor:
            row.pointProductCount === 0 ? "rgba(220, 60, 80, 0.2)" : "",
        };
      },
    }
  ]
}