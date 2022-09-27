import {useContext, useState} from 'react';
import { PaginationListStandalone, SizePerPageDropdownStandalone,} from "react-bootstrap-table2-paginator";
import { Row } from "react-bootstrap";
import { RootContext } from "context/RootContext";
import { Table, NoDataIndication, Col, Modal } from "components/Common";
import { StyleCard } from "components/Common/Elements/Card";
import { StyleButton } from "components/Common/Elements/Button";
import { PointHistoryContext } from "pages/PointContent/PointHistory/PointHistory";
import PointHistoryListStyle from "./PointHistoryListStyle";
import Formatter from "./PointHistoryListFormatters.js";
import PointDetailModal from "./PointDetailModal";
import PointRecordModal from "./PointRecordModal";
import BatchUploadModal from "./BatchUploadModal";

/**
 * @description 點數歷程列表
 * @returns {JSX.Element}
 * @constructor
 */
export default function PointHistoryList(
  {
    paginationProps,
    paginationTableProps
  }
) {
  const tableData = [
    {
      no: 0,
      time: "2022/08/22 ~ 2022/08/31",
      memberNum: "AAA010000001",
      member: "王一明",
      phone: "09999-123-456",
      campaignName: "QRCode 掃碼贈點活動名稱活動名稱活動名稱活動名稱活",
      pointChange: "200",
      recordMail: "me@migocorp.com",
      modalInfo: {
        time: "2022/08/12 17:15",
        memberNum: "AAA010000001",
        member: "王一明",
        phone: "09999-123-456",
        name: "兌換扣點活動名稱活動名稱活動名稱活動名稱活動名稱活動名稱活動名稱",
        changeType: 0,
        changePoint: 200,
        storeName: '虛擬店',
        recordMail: "me@migocorp.com",
        recordDescription: ''
      },
    },
    {
      no: 1,
      time: "2022/08/22 ~ 2022/08/31",
      memberNum: "AAA010000002",
      member: "王二明",
      phone: "0955-101-008",
      campaignName: "點數 7 點",
      pointChange: "100",
      recordMail: "me@migocorp.com",
      modalInfo: {
        time: "2022/08/12 17:15",
        memberNum: "AAA010000002",
        member: "王二明",
        phone: "0955-101-008",
        name: "兌換扣點活動名稱活動名稱活動名稱活動名稱活動名稱活動名稱活動名稱",
        changeType: 0,
        changePoint: 50,
        storeName: '信義新天地 A11',
        recordMail: "me@migocorp.com",
        recordDescription: ''
      },
    },
    {
      no: 2,
      time: "2022/08/22 ~ 2022/08/31",
      memberNum: "AAA010000003",
      member: "王三明",
      phone: "09999-123-456",
      campaignName: "QRCode 掃碼贈點活動名稱活動名稱活動名稱活動名稱活",
      pointChange: "200",
      recordMail: "me@migocorp.com",
      modalInfo: {
        time: "2022/08/12 17:15",
        memberNum: "AAA010000003",
        member: "王三明",
        phone: "09999-123-456",
        name: "兌換扣點活動名稱活動名稱活動名稱活動名稱活動名稱活動名稱活動名稱",
        changeType: 0,
        changePoint: 200,
        storeName: '虛擬店',
        recordMail: "me@migocorp.com",
        recordDescription: ''
      },
    },
    {
      no: 3,
      time: "2022/08/22 ~ 2022/08/31",
      memberNum: "AAA010000004",
      member: "王五明",
      phone: "0955-101-008",
      campaignName: "點數 7 點",
      pointChange: "100",
      recordMail: "me@migocorp.com",
      modalInfo: {
        time: "2022/08/12 17:15",
        memberNum: "AAA010000005",
        member: "王五明",
        phone: "0955-101-008",
        name: "兌換扣點活動名稱活動名稱活動名稱活動名稱活動名稱活動名稱活動名稱",
        changeType: 0,
        changePoint: 50,
        storeName: '信義新天地 A11',
        recordMail: "me@migocorp.com",
        recordDescription: ''
      },
    },
    {
      no: 4,
      time: "2022/08/22 ~ 2022/08/31",
      memberNum: "AAA010000005",
      member: "王六明",
      phone: "09999-123-456",
      campaignName: "QRCode 掃碼贈點活動名稱活動名稱活動名稱活動名稱活",
      pointChange: "200",
      recordMail: "me@migocorp.com",
      modalInfo: {
        time: "2022/08/12 17:15",
        memberNum: "AAA010000005",
        member: "王六明",
        phone: "09999-123-456",
        name: "兌換扣點活動名稱活動名稱活動名稱活動名稱活動名稱活動名稱活動名稱",
        changeType: 0,
        changePoint: 200,
        storeName: '虛擬店',
        recordMail: "me@migocorp.com",
        recordDescription: ''
      },
    },
    {
      no: 5,
      time: "2022/08/22 ~ 2022/08/31",
      memberNum: "AAA010000006",
      member: "王四明",
      phone: "0955-101-008",
      campaignName: "點數 7 點",
      pointChange: "100",
      recordMail: "me@migocorp.com",
      modalInfo: {
        time: "2022/08/12 17:15",
        memberNum: "AAA010000006",
        member: "王四明",
        phone: "0955-101-008",
        name: "兌換扣點活動名稱活動名稱活動名稱活動名稱活動名稱活動名稱活動名稱",
        changeType: 0,
        changePoint: 50,
        storeName: '信義新天地 A11',
        recordMail: "me@migocorp.com",
        recordDescription: ''
      },
    }
  ]
  const {
    apiPayload,
    setApiPayload,
    setPageLoading,
    setTotalSize
  } = useContext(PointHistoryContext);

  const [isLoadingTableData, setIsLoadingTableData] = useState(false);

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
  
  
  const [pointDetailModalInfo, setPointDetailModalInfo] = useState({});
  function onClickRow(e, row, rowIndex) {
    const newData = row.modalInfo
    setPointDetailModalInfo({...newData})
  }
  const isShowPointDetailModal = (modalInfo) => Object.keys(modalInfo).length;
  
  function closePointDetailModal() {
    console.log('closeModalPointDetail');
    setPointDetailModalInfo({});
  }
  
  const [isShowRecordModal, setIsShowRecordModal] = useState(false);
  function clickRecordPoint() {
    setIsShowRecordModal(true);
  }
  function closeRecordModal() {
    setIsShowRecordModal(false);
  }
  
  const [isShowBatchUploadModal, setIsShowBatchUploadModal] = useState(false);
  
  function clickBatchUpload() {
    setIsShowBatchUploadModal(true);
  }
  return (
    <PointHistoryListStyle>
      <StyleCard className="w-100 mt-4">
        <TableToolBar
          totalSize={paginationProps.totalSize}
          paginationProps={paginationProps}
          sizePerPage={paginationProps.sizePerPage}
          onClickBatchUpload={clickBatchUpload}
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
          columns={generageColumns()}
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
      <BatchUploadModal
        isShowBatchUploadModal={isShowBatchUploadModal}
        setIsShowBatchUploadModal={setIsShowBatchUploadModal}
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
 * @returns {JSX.Element}
 * @constructor
 */
function TableToolBar(
  {
    totalSize = 0,
    paginationProps = {},
    sizePerPage = 0,
    onClickBatchUpload = () => { },
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
          onClick={onClickBatchUpload}
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
 * @param setStopPointActivity
 */
function generageColumns() {
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
      dataField: "time",
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
      dataField: "memberNum",
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
      dataField: "member",
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
      dataField: "phone",
      text: "手機",
      sort: false,
      headerStyle: {
        width: "15%",
      },
      style: (_cell, row) => {
        return {
          backgroundColor:
            row.pointProductCount === 0 ? "rgba(220, 60, 80, 0.2)" : "",
        };
      },
    },
    {
      dataField: "campaignName",
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
      dataField: "pointChange",
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
      dataField: "recordMail",
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