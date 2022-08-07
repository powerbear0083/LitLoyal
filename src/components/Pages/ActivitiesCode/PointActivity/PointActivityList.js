import {useContext, useState, useEffect, useReducer} from 'react';
import { PaginationListStandalone, SizePerPageDropdownStandalone,} from "react-bootstrap-table2-paginator";
import { Row } from "react-bootstrap";
import { toast } from "react-hot-toast";
import { Table, NoDataIndication, Col } from "components/Common";
import { RootContext } from "context/RootContext";
import { PointActivityContext } from "pages/ActivitiesCode/PointActivity";
import { getPointActivityListApi, getPointActivitySettingApi, stopPointActivityApi, deletePointActivityApi, getEditPointActivityApi } from "api/ApiMain";
import Formatter from "components/Pages/ActivitiesCode/PointActivity/PointActivityTableFormatters";
import { StyleCard } from "components/Common/Elements/Card";
import { StyleButton } from "components/Common/Elements/Button";
import PointActivityListStyle from "./PointActivityListStyle"
import PointActivityModal from "./PointActivityModal";
import PointActivityHintsModal from "./PointActivityHintsModal";
import {initState, PointActivityReducer} from './PointActivityModalReducer';

/**
 * @description 點數活動頁面列表
 * @returns {string}
 * @constructor
 */
function PointActivityList(
    {
        paginationProps,
        paginationTableProps
    }
) {
    const [state, dispatch] = useReducer(PointActivityReducer, initState);
    const rootData = useContext(RootContext);
    const {
        apiPayload,
        setApiPayload,
        setPageLoading,
        setTotalSize,
        setEvent
    } = useContext(PointActivityContext);
    
    const [isLoadingTableData, setIsLoadingTableData] = useState(false);
    const [tableData, setTableData] = useState([]);
    const [visibleDoublePoint, setVisibleDoublePoint] = useState(false);
    const fetchPointActivityList = async () => {
        setIsLoadingTableData(true);
        const respond = await getPointActivityListApi(rootData.brandId, apiPayload);
        if(respond) {
            const {
                data: {
                    data: {
                        rows,
                        totalSize,
                        feature
                    }
                }
            } = respond
            setTableData(rows);
            setTotalSize(totalSize);
            setVisibleDoublePoint(feature.visibleDoublePoint);
            setIsLoadingTableData(false);
        }
    }
   
    useEffect(() => {
        if(rootData.brandId) {
            fetchPointActivityList()
        }

    },[rootData?.brandId, apiPayload])
    
    useEffect(() => {
        const isEmptyList = 0
        if(rootData.brandId && state.barcodeMultipleList?.length === isEmptyList) {
            const fetchData = async () => {
                try {
                    const respond = await getPointActivitySettingApi(rootData.brandId);
                    // if api success
                    if(respond?.data.code === 200) {
                        dispatch(
                            {
                                type: 'SET_BARCODE_MULTIPLE_LIST',
                                payload: respond.data.data.pointBarcodeMultipleList
                            }
                        )
                    }
                } catch (error) {
                    console.log(error)
                }
            }
            fetchData()

        }
    },[rootData?.brandId])
    
    
    const [isShowAddModal, setIsShowAddModal] = useState(false);
    
    /**
     * @description 新增活動 event
     */
    function onAddNewPointActivity() {
        dispatch(
            {
                type: 'CLEAR_ALL_FILEDS'
            }
        )
        setIsShowAddModal(true);
    }

    const [isShowEditModal, setIsShowEditModal] = useState(false);
    const [currentEditId, setCurrentEditId] = useState(null);
    /**
     * @description 編輯活動點數 event
     * @param pointBarcodeRuleId
     */
    async function onEditPointActivity(pointBarcodeRuleId) {
        try {
            const respond = await getEditPointActivityApi(rootData.brandId, pointBarcodeRuleId);
            // if api success
            if(respond?.data.code === 200) {
                setCurrentEditId(pointBarcodeRuleId)
                dispatch(
                    {
                        type: 'UPDATE_EDIT_FIELDS',
                        payload: respond?.data.data
                    }
                )
                setIsShowEditModal(true);
            }
        } catch (error) {
            console.log(error)
            setCurrentEditId(null)
        }
    }

    const [stopPointActivity, setStopPointActivity] = useState({
        isShowModal: false,
        pointBarcodeRuleId: null
    });
    
    /**
     * @description 確認關閉停用 Modal 並發送 API
     */
    function onConfirmCloseHintsModal() {
        setStopPointActivity(prevState => (
            {
                ...prevState,
                isShowModal: false
            }
        ))
        onStopPointActivity(rootData.brandId, stopPointActivity.pointBarcodeRuleId)
    }

    async function onStopPointActivity(brandId, pointBarcodeRuleId) {
        const respond = await stopPointActivityApi(brandId, pointBarcodeRuleId)

        // if api success
        if(respond?.data?.code === 200) {
            setStopPointActivity(prevState => (
                {
                    ...prevState,
                    pointBarcodeRuleId: null
                }
            ))
            fetchPointActivityList()
        }
    }

    /**
     * @description 關閉停用點數活動的 Modal
     */
    function onCloseHintsModal() {
        setStopPointActivity(
            { 
                isShowModal: false, 
                pointBarcodeRuleId: null 
            }
        )
    }
    
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

    /**
     * @description 刪除活動事件
     * @param pointBarcodeRuleId
     * @returns {Promise<void>}
     */
    async function onDeletePointActivity(pointBarcodeRuleId) {
        const respond = await deletePointActivityApi(rootData.brandId, pointBarcodeRuleId)
        // if api success
        if(respond?.data?.code === 200) {
            toast.success("點數活動刪除成功");
            fetchPointActivityList()
        }
    }
    return (
        <PointActivityListStyle>
            <StyleCard className="w-100">
                <TableToolBar
                    totalSize={paginationProps.totalSize}
                    paginationProps={paginationProps}
                    sizePerPage={paginationProps.sizePerPage}
                    onClick={onAddNewPointActivity}
                />
                <Table
                    striped
                    remote
                    headerClasses="table-header"
                    bodyClasses="paragraph"
                    className="overflow-auto"
                    keyField="no"
                    data={tableData}
                    columns={
                        generageColumns(
                            {
                                onEditPointActivity,
                                onDeletePointActivity,
                                setStopPointActivity
                            }
                        )
                    }
                    sort={{ dataField: apiPayload.sf, order: apiPayload.so }}
                    onTableChange={(type, value) => onTableChange(setApiPayload, type, value)}
                    noDataIndication={
                        <NoDataIndication message={isLoadingTableData ? "載入中..." : "尚無資料"} />
                    }
                    {...paginationTableProps}
                />
                <PaginationListStandalone {...paginationProps} />
            </StyleCard>
            <PointActivityModal
                state={state}
                dispatch={dispatch}
                brandId={rootData.brandId}
                isShowAddModal={isShowAddModal}
                isShowEditModal={isShowEditModal}
                onCloseModal={(isBool) => {
                    setIsShowAddModal(isBool)
                    setIsShowEditModal(isBool)
                }}
                visibleDoublePoint={visibleDoublePoint}
                pointBarcodeMultipleList={state.barcodeMultipleList}
                fetchPointActivityList={fetchPointActivityList}
                currentEditId={currentEditId}
                setCurrentEditId={setCurrentEditId}
            />
            <PointActivityHintsModal
                isShow={stopPointActivity.isShowModal}
                onClose={onCloseHintsModal}
                onConfirm={onConfirmCloseHintsModal}
            />
        </PointActivityListStyle>
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
        onClick = () => { }
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
                    variant="outline-primary"
                    onClick={onClick}
                    size="sm"
                >
                    新增活動
                </StyleButton>
            </Col>
        </Row>
    )
}

/**
 * @description 產生 columns 配置
 * @param setStopPointActivity
 */
function generageColumns({ onEditPointActivity, onDeletePointActivity, setStopPointActivity }) {
    return [
        {
            dataField: "no",
            text: "No.",
            sort: true,
            headerStyle: {
                width: "3%",
            },
            style: (_cell, row) => {
                return {
                    backgroundColor:
                        row.pointProductCount === 0 ? "rgba(220, 60, 80, 0.2)" : "",
                };
            },
        },
        {
            dataField: "barcode",
            text: "活動條碼",
            sort: false,
            formatter: Formatter.barcodeColumn,
            headerStyle: {
                width: "10%",
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
            text: "名稱",
            sort: false,
            formatter: Formatter.nameColumn,
            headerStyle: {
                width: "33%",
            },
            style: (_cell, row) => {
                return {
                    backgroundColor:
                        row.pointProductCount === 0 ? "rgba(220, 60, 80, 0.2)" : "",
                };
            },
        },
        {
            dataField: "validPeriod",
            text: "效期",
            sort: true,
            formatter: Formatter.nameColumn,
            headerStyle: {
                width: "14%",
            },
            style: (_cell, row) => {
                return {
                    backgroundColor:
                        row.pointProductCount === 0 ? "rgba(220, 60, 80, 0.2)" : "",
                };
            },
        },
        {
            dataField: "content",
            text: "內容",
            sort: false,
            formatter: Formatter.contentColumn,
            headerStyle: {
                width: "20%",
            },
            style: (_cell, row) => {
                return {
                    backgroundColor:
                        row.pointProductCount === 0 ? "rgba(220, 60, 80, 0.2)" : "",
                };
            },
        },
        {
            dataField: "state",
            text: "狀態",
            sort: true,
            formatter: Formatter.statusColumn,
            headerStyle: {
                width: "10%",
            },
            style: (_cell, row) => {
                switch (row.state) {
                    case "進行中":
                        return {
                            color: "#3ca078",
                            backgroundColor:
                                row.pointProductCount === 0 ? "rgba(220, 60, 80, 0.2)" : "",
                        };
                    case "準備中":
                        return {
                            color: "#333333",
                            backgroundColor:
                                row.pointProductCount === 0 ? "rgba(220, 60, 80, 0.2)" : "",
                        };
                    case "已停用":
                    case "已過期":
                        return {
                            backgroundColor:
                                row.pointProductCount === 0 ? "rgba(220, 60, 80, 0.2)" : "",
                        };
                    default:
                        return {
                            color: "rgba(51, 51, 51, 0.25)",
                        };
                }
            },
        },
        {
            dataField: "funcButton",
            text: "",
            headerStyle: {
                width: "10%",
            },
            style: (_cell, row) => {
                return {
                    backgroundColor:
                        row.pointProductCount === 0 ? "rgba(220, 60, 80, 0.2)" : "",
                };
            },
            formatter: (cell, row) => Formatter.editColumn(
                {
                    cell, 
                    row,
                    onEditPointActivity,
                    onDeletePointActivity,
                    setStopPointActivity 
                }
            )
        }
    ]
}


export default PointActivityList;