import {useState, useRef, useReducer} from 'react';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { toast } from "react-hot-toast";
import { toastErrorContent } from "utilities/common"
import { toastErrorText } from "utilities/common";
import startOfToday from 'date-fns/startOfToday';
import {color} from 'styles/Variable/Color';
import {Table, NoDataIndication, Row, Col, Radio, Input, Calendar} from 'components/Common';
import {ComplexListWrapper, CalendarWrapper, InValidFeedback} from 'templates';
import {setHours, setMinutes, setSeconds, setMilliseconds, format, isAfter} from 'date-fns';
import {regexRule} from 'utilities/validation';
import {StyleInput} from 'components/Common/Elements/Input';
import {StyleSelect} from 'components/Common/Elements/Select';
import {StyleRadio} from 'components/Common/Elements/Radio';
import {addBarcodeRuleApi, editPointActivityApi} from 'api/ApiMain';
import PointActivityModalStyle from './PointActivityModalStyle';
import {POINT_ACTIVITY} from './POINT_ACTIVITY';

/**
 * @description 新增或編輯點數活動 Modal
 * @param state 父層 reducer 往下傳的 state
 * @param dispatch 父層 reducer 往下傳的 dispatch
 * @param isShowAddModal
 * @param isShowEditModal
 * @param onCloseModal
 * @param visibleDoublePoint
 * @param fetchPointActivityList
 * @param currentEditId 當前可編輯 ID
 * @param setCurrentEditId 更新可編輯 ID method
 * @returns {JSX.Element}
 * @constructor
 */
export default function PointActivityModal(
    {
        state = {},
        dispatch = () => {},
        brandId = null,
        isShowAddModal = false,
        isShowEditModal = false,
        onCloseModal = () => {},
        visibleDoublePoint = false,
        fetchPointActivityList = () => {},
        currentEditId = null,
        setCurrentEditId = () => {}
    }
) {
    
    const [validated, setValidated] = useState(false);
    const formRef = useRef(null);
    
    const formatHMS = (date) => {
        let formatDate = date;
        formatDate = setMilliseconds(formatDate, 0);
        formatDate = setSeconds(formatDate, 0);
        formatDate = setMinutes(formatDate, 0);
        formatDate = setHours(formatDate, 0);
        return format(formatDate, 'yyyy-MM-dd\'T\'HH:mm:ss\'+08:00\'');
    }
    /**
     * @description 取得點數折抵、加贈、贈送所需要的資料
     * @param pointType
     * @param TYPE
     */
    const getPointTypeValue = (pointType, TYPE) => {
        let result = {
            discountPoint: null,
            discountAmount: null,
            additionalPoint: null,
            pointBarcodeMultiple: null,
            pointMultipleMaxResult: null
        }
        if (pointType === TYPE.DISCOUNT.VALUE) {
            result = {
                ...result,
                discountPoint: state.discountPoint,
                discountAmount: state.discountAmount
            }
        }
        if (pointType === TYPE.ADDITION.VALUE) {
            result = {
                ...result,
                additionalPoint: state.additionalPoint
            }
        }
        if (pointType === TYPE.BARCODE_MULTIPLE.VALUE) {
            result = {
                ...result,
                pointBarcodeMultiple: {
                    id: state.pointBarcodeMultiple.id,
                    code: state.pointBarcodeMultiple.code,
                    name: state.pointBarcodeMultiple.name
                },
                pointMultipleMaxResult: state.pointMultipleMaxResult
            }
        }
        return result;
    }
    /**
     * @description 產生要往後端送的資料
     * @param state
     * @param formatHMS
     * @param getPointTypeValue
     * @param TYPE
     */
    const generateSubmitData = ({state, formatHMS, getPointTypeValue, TYPE}) => {
        const newEndDate = state.endDate === null ? null : formatHMS(state.endDate)
        const newPointTypeValue = getPointTypeValue(state.type, TYPE);
        const newPointBarcodeValue = newPointTypeValue.pointBarcodeMultiple === null
            ? null
            : {
                id: newPointTypeValue.pointBarcodeMultiple.id,
                code: newPointTypeValue.pointBarcodeMultiple.code,
                name: newPointTypeValue.pointBarcodeMultiple.name
            }
        return {
            barcode: state.barcode,
            name: state.name,
            startDate: formatHMS(state.startDate),
            endDate: newEndDate,
            type: state.type,
            discountPoint: newPointTypeValue.discountPoint,
            discountAmount: newPointTypeValue.discountAmount,
            additionalPoint: newPointTypeValue.additionalPoint,
            pointBarcodeMultiple: newPointBarcodeValue,
            pointMultipleMaxResult: newPointTypeValue.pointMultipleMaxResult
        }
    }

    /**
     * @description 新增活動確認送出
     * @returns {Promise<void>}
     */
    function onSubmit() {
        setValidated(true);
        if(isShowAddModal) {
            submitAddPointActivity()
        }
        if(isShowEditModal) {
            submitEditPointActivity()
        }
    }

    /**
     * @description 送出新增活動
     * @returns {Promise<void>}
     */
    async function submitAddPointActivity() {
        const form = formRef.current;
        if (form.checkValidity()) {
            addBarcodeRuleApi(brandId, generateSubmitData(
                {
                    state,
                    formatHMS,
                    getPointTypeValue,
                    TYPE: POINT_ACTIVITY.POINT_TYPE
                }
            ))
                .then(() => {
                    toast.success("點數活動新增成功");
                    fetchPointActivityList();
                    resetValidateds();
                })
                .catch((error) => {
                    if(error.code === 400) {
                        generateToastErrorContent(error)
                    }
                })

        }
    }

    /**
     * @description 送出編輯活動
     * @returns {Promise<void>}
     */
    async function submitEditPointActivity() {
        const form = formRef.current;
        if(form.checkValidity()) {
            editPointActivityApi(brandId, currentEditId, generateSubmitData(
                {
                    state,
                    formatHMS,
                    getPointTypeValue,
                    TYPE: POINT_ACTIVITY.POINT_TYPE
                }
            ))
                .then(() => {
                    toast.success("修改點數活動成功");
                    fetchPointActivityList();
                    resetValidateds();
                })
                .catch((error) => {
                    if(error.code === 400) {
                        console.log('error edit', error)
                        generateToastErrorContent(error)
                    }
                })
        }
        
    }

    /**
     * @description 產生錯誤訊息
     * @param error
     */
    function generateToastErrorContent(error) {
        const toastId = Math.random().toString(36).substr(2);
        toast.error(toastErrorContent(error.code , getFieldsErrosMsg(error.errors), toastId), {
            id: toastId,
        });
    }

    /**
     * @description 取得每個欄位的錯誤訊息
     * @param errors
     * @returns {string}
     */
    function getFieldsErrosMsg(errors) {
        let msg = ''
        let errorFileds = errors?.Barcode || 
            errors?.Name || 
            errors?.StartDate || 
            errors?.EndDate 
        
        if(errorFileds) {
            msg = errorFileds
        }
        return msg
    }

    /**
     * @description 驗證點數折購、點數加贈、點數贈送 state
     * @param validated 是否起用表單驗證
     * @param discountPointType 折扣內容類型
     * @param discountPoint 點數折抵
     * @param discountAmount 點數折抵現金折扣
     * @param additionalPoint 點數加贈
     * @param pointMultipleMaxResult 點數贈送
     * @returns {boolean}
     */
    const isShowDiscountContentValidatedMsg = (
        {
            validated,
            discountPointType,
            discountPoint,
            discountAmount,
            additionalPoint,
            pointMultipleMaxResult
        }
    ) => {
        let isValid = false
        const isEmptyFileds = (validated && discountPointType === '') && 
            (discountPoint === 0 && discountAmount === 0 && additionalPoint === 0 && pointMultipleMaxResult === 0)
        if(isEmptyFileds) {
            isValid = true
        }
        return isValid
    }

    /**
     * @description 當結束日設定早於起始日，顯示錯誤訊息
     * @param validated
     * @param startDate
     * @param endDate
     * @returns {boolean}
     */
    const isShowEndDateMoreThanStartDate = ({ validated, startDate, endDate, isAfter}) => {
        return validated && isAfter(startDate, endDate)
    }
    
    const [isValidBarcodeFiled, setIsValidBarcodeFiled] = useState(false);
    /**
     * @description 活動條碼 onChange event
     * @param e
     */
    function onChangeBarcode({currentTarget: {name, value}}) {
        const isValid = regexRule.numberEnglishWordsASCII.test(value);
        
        if (isValid) {
            dispatch({
                type: 'CHANGE_FIELD',
                payload: {
                    keyName: name,
                    value: value
                }
            });
            setIsValidBarcodeFiled(false);
        } else {
            setIsValidBarcodeFiled(true);
        }

        if (value === '') {
            dispatch({
                type: 'CHANGE_FIELD',
                payload: {
                    keyName: name,
                    value: value
                }
            });
            setIsValidBarcodeFiled(false);
        }
    }
    
    
    /**
     * @description 名稱 onChange event
     * @param name
     * @param value
     */
    function onChangeName({currentTarget: {name, value}}) {
        const strMaxLimit = 50
        if(value.length <= strMaxLimit) {
            dispatch(
                {
                    type: 'CHANGE_FIELD',
                    payload: {
                        keyName: name,
                        value: value
                    }
                }
            )
        }
        
    }

    const [isValidNameFiled, setIsValidNameFiled] = useState(false);
    function onBlurName({currentTarget: {name, value}}) {
        const strMaxLimit = 50
        if(value.length === strMaxLimit) {
            setIsValidNameFiled(true)
        } else {
            setIsValidNameFiled(false)
        }
    }
    
    
    /**
     * @description Calendar onChange event
     * @param e
     * @param dateType
     */
    function onChangeCalendarDate(e, dateType) {
        dispatch(
            {
                type: 'CHANGE_DATE',
                payload: {
                    keyName: dateType,
                    value: e
                }
            }
        )
    }

    /**
     * @description change 日期效期類型，立即開使、起始日、永久、結束日
     * @param name
     * @param value
     * @param id
     */
    function onChangeDateType({currentTarget: {name, value, id}}) {
        if( id === 'startDate') {
            dispatch(
                {
                    type: 'CHANGE_START_DATE',
                    payload: {
                        keyName: name,
                        id
                    }
                }
            )
        } else {
            dispatch(
                {
                    type: 'CHANGE_END_DATE',
                    payload: {
                        keyName: name,
                        id
                    }
                }
            )
        }

    }

    /**
     * @description 選取點數折扣類型
     * @param id
     */
    function onChangePointType({currentTarget: {id}}) {
        const giveAwayInitial = id === 'giveAwayType'
            ? state.barcodeMultipleList[0]
            : {}
        dispatch(
            {
                type: 'CHANGE_POINT_TYPE',
                payload: {
                    id,
                    giveAwayInitial
                }
            }
        )
    }

    function onChangeDiscountPointFields({currentTarget: {name, value}}) {
        // 最大輸入上限為 6
        if(value.length <= 6) {
            dispatch(
                {
                    type: 'CHANGE_DISCOUNT_POINT_FIELDS',
                    payload: {
                        name,
                        currentType: state.discountPointType,
                        value: value
                    }
                }
            )
        }
    }

    const getPointBarcodeMultipleData = (value, list) => {
        let result = list.find(item => item.value === value);
        return {
            id: result.value,
            code: result.code,
            name: result.text
        }
    }

    /**
     * @description 點數贈送 chagne event
     * @param e
     * @param value
     */
    function onChangeGiveAway(e, value) {
        const {id, code, name} = getPointBarcodeMultipleData(value, state.barcodeMultipleList);
        dispatch(
            {
                type: 'CHANGE_GIVE_AWAY',
                payload: {
                    id,
                    code,
                    name
                }
            }
        )
    }

    const disabledContentFileds = (discountType, typeName) => {
        let isDisabled = true
        if (discountType === typeName) {
            isDisabled = false
        }
        return isDisabled
    }
    /**
     * @description 渲染 input 的 value
     * @param value
     * @returns {string|*}
     */
    const renderContentFiledsValue = (value) => {
        // 當初始化的值為 0 的時候，回傳空字串
        return value === 0 ? '' : value
    }

    const isShowDateValidatedMsg = (validated, dateType) => {
        return validated && dateType === ''
    }
    const isValidCalendar = (validated, date) => {
        let isValid = true
        if (validated && date === '') {
            isValid = false
        }
        return isValid
    }

    /**
     * @description 產生贈送點數 Select 的 option
     * @param list
     */
    const generateSelectData = (list, index) => {
        return list.map(item => {
            return {
                text: item.name,
                value: item.id,
                code: item.code,
                dropdownItemOption: {
                    eventKey: index
                }
            }
        })
    }
    
    /**
     * @description 關閉 Modal
     */
    function onClose() {
        resetValidateds()
    }
    
    
    function resetValidateds() {
        setValidated(false);
        setIsValidBarcodeFiled(false);
        onCloseModal(false);
    }
    return (
        <PointActivityModalStyle
            show={isShowAddModal || isShowEditModal}
            backdrop="static"
            className="modal-box"
            onClose={onClose}
            onConfirm={onSubmit}
            titleText={`新增點數活動`}
            confirmBtnText={`儲存`}
            closeBtnText={`取消`}
        >
            <Form
                noValidate
                className={`text-left`}
                validated={validated}
                ref={formRef}
            >
                <Form.Group className="d-flex mb-3">
                    <Form.Label className={`form-caption pt-1`}>活動條碼：</Form.Label>
                    <div className={`fields-col input-col`}>
                        <Form.Control
                            required
                            type="text"
                            name={`barcode`}
                            placeholder="Barcode，不可重複"
                            maxLength={128}
                            value={state.barcode}
                            onChange={onChangeBarcode}
                        />
                        <Form.Control.Feedback type="invalid">尚未填寫</Form.Control.Feedback>
                        {
                            isValidBarcodeFiled
                                ? <div className="custom-invalid-feedback">請輸入半形英數、ASCII 符號</div>
                                : null
                        }
                    </div>
                </Form.Group>
                <Form.Group className="d-flex mb-3">
                    <Form.Label className={`form-caption pt-1`}>名稱：</Form.Label>
                    <div className={`fields-col input-col`}>
                        <Form.Control
                            required
                            type="text"
                            name={`name`}
                            placeholder="上限 50 字"
                            maxLength={50}
                            value={state.name}
                            onChange={onChangeName}
                            onBlur={onBlurName}
                        />
                        <Form.Control.Feedback type="invalid">尚未填寫</Form.Control.Feedback>
                        {
                            isValidNameFiled
                                ? <div className="custom-invalid-feedback">上限 50 字</div>
                                : null
                                
                        }
                    </div>
                </Form.Group>
                <Form.Group className="d-flex">
                    <Form.Label className={`form-caption pt-1`}>效期起始：</Form.Label>
                    <ComplexListWrapper className={`fields-col`}>
                        <StyleRadio
                            id="immediately"
                            name="startDateType"
                            label="立即開始"
                            required
                            inline={true}
                            checked={state.startDateType === 'immediately'}
                            onChange={onChangeDateType}
                        />
                        <CalendarWrapper className={`d-flex align-items-center justify-content-between`}>
                            <StyleRadio
                                id="startDate"
                                name="startDateType"
                                label="起始日"
                                required
                                inline={true}
                                checked={state.startDateType === 'startDate'}
                                onChange={onChangeDateType}
                            />
                            <Calendar
                                value={state.startDate}
                                isValid={isValidCalendar(validated, state.startDate)}
                                minDate={startOfToday()}
                                onChange={(e) => onChangeCalendarDate(e, 'startDate')}
                            />
                        </CalendarWrapper>
                        {
                            isShowDateValidatedMsg(validated, state.startDateType)
                                ? (
                                    <div className="custom-invalid-feedback mt-1 mb-3">
                                        尚未填寫
                                    </div>
                                )
                                : null
                        }
                    </ComplexListWrapper>
                </Form.Group>
                <Form.Group className="d-flex mt-3">
                    <Form.Label className={`form-caption`}>效期結束：</Form.Label>
                    <ComplexListWrapper className={`fields-col`}>
                        <StyleRadio
                            id="datePermanen"
                            name="endDateType"
                            label="永久"
                            required
                            checked={state.endDateType === 'datePermanen'}
                            onChange={onChangeDateType}
                        />
                        <CalendarWrapper className={`d-flex align-items-center justify-content-between`}>
                            <StyleRadio
                                id="endDate"
                                name="endDateType"
                                label="結束日"
                                required
                                inline={true}
                                checked={state.endDateType === 'endDate'}
                                onChange={onChangeDateType}
                            />
                            <Calendar
                                value={state.endDate}
                                ivalid={isValidCalendar(validated, state.endDate)}
                                minDate={startOfToday()}
                                onChange={(e) => onChangeCalendarDate(e, 'endDate')}
                            />
                        </CalendarWrapper>
                        {
                            isShowDateValidatedMsg(validated, state.endDateType)
                                ? (
                                    <div className="custom-invalid-feedback mt-1 mb-3">
                                        尚未填寫
                                    </div>
                                )
                                : null
                        }
                        {
                            isShowEndDateMoreThanStartDate(
                                {
                                    validated,
                                    startDate: state.startDate,
                                    endDate: state.endDate, 
                                    isAfter
                                }
                            )
                                ? (
                                    <div className="custom-invalid-feedback mt-1 mb-3">
                                        不可早於起始日
                                    </div>
                                )
                                : null
                        }
                    </ComplexListWrapper>
                </Form.Group>
                <hr/>
                <Form.Group className="d-flex form-point-content">
                    <div className={`form-caption pt-1`}>內容：</div>
                    <ComplexListWrapper
                        className={``}
                    >
                        <div className="discount-fields d-flex align-items-center mb-3 justify-content-between">
                            <StyleRadio
                                id="discountType"
                                name="discountPointContent"
                                value="extraPoint"
                                label="點數折抵"
                                required
                                onChange={onChangePointType}
                                inline={true}
                                checked={state.discountPointType === 'discountType'}
                            />
                            <StyleInput
                                className="discount-input"
                                appendContent="點"
                                appendContentBgColor="#fff"
                                appendContentPadding={'0 4px 0 0'}
                                appendContentHaveBorder={false}
                                isFocusCocatAppend
                                formControlOption={
                                    {
                                        required: true,
                                        name: 'discountPoint',
                                        disabled: disabledContentFileds(state.discountPointType, 'discountType'),
                                        onChange: onChangeDiscountPointFields,
                                        value: renderContentFiledsValue(state.discountPoint)
                                    }
                                }
                            />
                            <span>，現金折扣</span>
                            <StyleInput
                                className="discount-input"
                                appendContent="元"
                                appendContentBgColor="#fff"
                                appendContentPadding={'0 4px 0 0'}
                                appendContentHaveBorder={false}
                                isFocusCocatAppend
                                formControlOption={
                                    {
                                        required: true,
                                        name: 'discountAmount',
                                        disabled: disabledContentFileds(state.discountPointType, 'discountType'),
                                        onChange: onChangeDiscountPointFields,
                                        value: renderContentFiledsValue(state.discountAmount)
                                    }
                                }
                            />
                        </div>
                        <div className="bonus-fields d-flex align-items-center mb-3">
                            <StyleRadio
                                id="additionalPoint"
                                name="discountPointContent"
                                label="點數加贈"
                                required
                                inline={true}
                                onChange={onChangePointType}
                                checked={state.discountPointType === 'additionalPoint'}
                            />
                            <StyleInput
                                className="bonus-input"
                                appendContent="點"
                                appendContentBgColor="#fff"
                                appendContentPadding={'0 4px 0 0'}
                                appendContentHaveBorder={false}
                                isFocusCocatAppend
                                formControlOption={{
                                    required: true,
                                    name: 'additionalPoint',
                                    disabled: disabledContentFileds(state.discountPointType, 'additionalPoint'),
                                    onChange: onChangeDiscountPointFields,
                                    value: renderContentFiledsValue(state.additionalPoint)
                                }}
                            />
                        </div>
                        {
                            visibleDoublePoint
                                ? (
                                    <div
                                        className="give-away-fields d-flex align-items-center justify-content-between mb-3">
                                        <StyleRadio
                                            id="giveAwayType"
                                            name="discountPointContent"
                                            label="點數贈送"
                                            required
                                            onChange={onChangePointType}
                                            inline={true}
                                            checked={state.discountPointType === 'giveAwayType'}
                                        />
                                        <StyleSelect
                                            optionItems={state.barcodeMultipleList}
                                            selectedValue={state.pointBarcodeMultiple.id}
                                            onChange={onChangeGiveAway}
                                            dropdownToggleOption={{
                                                name: 'pointBarcodeMultiple',
                                                disabled: disabledContentFileds(state.discountPointType, 'giveAwayType'),
                                            }}
                                        />
                                        <span>，最多</span>
                                        <StyleInput
                                            className="ml-2"
                                            appendContent="點"
                                            appendContentBgColor="#fff"
                                            appendContentPadding={'0 4px 0 0'}
                                            appendContentHaveBorder={false}
                                            isFocusCocatAppend
                                            formControlOption={{
                                                required: true,
                                                name: 'pointMultipleMaxResult',
                                                disabled: disabledContentFileds(state.discountPointType, 'giveAwayType'),
                                                onChange: onChangeDiscountPointFields,
                                                value: renderContentFiledsValue(state.pointMultipleMaxResult)
                                            }}
                                        />
                                    </div>
                                )
                                : null
                        }
                        {
                            isShowDiscountContentValidatedMsg(
                                {
                                    validated,
                                    discountPointType: state.discountPointType,
                                    discountPoint: state.discountPoint,
                                    discountAmount: state.discountAmount,
                                    additionalPoint: state.additionalPoint,
                                    pointMultipleMaxResult: state.pointMultipleMaxResult
                                }
                            )
                                ? (
                                    <div className="custom-invalid-feedback mt-1 mb-3">
                                        尚未填寫
                                    </div>
                                )
                                : null
                        }
                    </ComplexListWrapper>
                </Form.Group>
            </Form>
        </PointActivityModalStyle>
    )
}