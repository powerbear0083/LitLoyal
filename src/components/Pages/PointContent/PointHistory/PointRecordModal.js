import {useRef, useState, useReducer} from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import {StyleRadio} from 'components/Common/Elements/Radio';
import {StyleInput} from 'components/Common/Elements/Input';
import PointRecordModalStyle from './PointRecordModalStyle';
import { recordRootState, PointRecordReducer } from './PointRecordModalReducer';

/**
 * @description 補登點數 Modal
 * @param isShowModal 是否顯示 Modal
 * @param setIsShowRecordModal 設定是否顯示 Modal
 * @returns {JSX.Element}
 * @constructor
 */
export default function PointRecordModal(
  {
    isShowModal = false,
    setIsShowRecordModal = () => {},
  }
) {

  const [recordState, dispatch] = useReducer(PointRecordReducer, recordRootState);
  const [validated, setValidated] = useState(false);
  const formRef = useRef(null);
  function onSubmit() {
    setValidated(true);
  }
  
  const updateDispatch = (keyName, value) => {
    dispatch({
      type: 'CHANGE_FIELD',
      payload: {
        keyName: name,
        value: value
      }
    });
  }
  function onChange({ currentTarget: { name, value } }) {
    console.log(name, value);
    const remarkMaxLimit = 50
    if (name === 'customId') {
      updateDispatch(name, value);
    }
    if(name === 'remark' && value.length <= remarkMaxLimit) {
      updateDispatch(name, value);
    }
    
    const pointMaxLimit = 6;
    console.log(name)
    console.log(value.length <= pointMaxLimit)
    if(name === 'point' && value.length <= pointMaxLimit ) {
      updateDispatch(name, value);
    }
  }
  
  function onClosed() {
    setValidated(false);
    setIsShowRecordModal(false);
  }
  return (
    <PointRecordModalStyle
      backdrop="static"
      className="point-record-modal"
      titleText={`補登點數`}
      confirmBtnText={`儲存`}
      closeBtnText="取消"
      show={isShowModal}
      onClose={onClosed}
      onConfirm={onSubmit}
    >
      <Form
        noValidate
        className="point-record-form text-left"
        validated={validated}
        ref={formRef}
      >
        <Form.Group className="d-flex mb-3">
          <Form.Label className={`form-caption pt-1`}>會員編號：</Form.Label>
          <div className="member-number-fields mr-2">
            <Form.Control
              required
              type="text"
              name={`customId`}
              onChange={onChange}
              value={recordState.customId}
            />
            <Form.Control.Feedback type="invalid">此為必填欄位</Form.Control.Feedback>
          </div>
          <Button 
            type="button"
            variant="outline-dark"
          >
            查詢
          </Button>
        </Form.Group>
        <Form.Group className="d-flex mb-3">
          <Form.Label className={`form-caption pt-1`}>會員：</Form.Label>
          <Form.Control
            type="text"
            name={`memberName`}
            className={`input-field`}
            value={recordState.memberName}
            readOnly
          />
        </Form.Group>
        <Form.Group className="d-flex mb-3">
          <Form.Label className={`form-caption pt-1`}>手機：</Form.Label>
          <Form.Control
            type="text"
            name={`phone`}
            className={`input-field`}
            value={recordState.phone}
            readOnly
          />
        </Form.Group>
        <Form.Group className="d-flex mb-3">
          <Form.Label className={`form-caption pt-1`}>名稱：</Form.Label>
          <div className="input-field-name">
            <Form.Control
              required
              type="text"
              name={`name`}
              className={`input-field`}
              placeholder="上限 50 字"
              onChange={onChange}
              maxLength={50}
              value={recordState.name}
            />
            <Form.Control.Feedback type="invalid">此為必填欄位</Form.Control.Feedback>
          </div>
        </Form.Group>
        <Form.Group className="d-flex mb-3">
          <Form.Label className={`form-caption pt-1`}>異動類別：</Form.Label>
          <div className={`d-flex`}>
            <StyleRadio
              required
              id="increasePoint"
              name="pointChangeType"
              label="贈點"
              checked={null}
              onChange={null}
              inline={true}
            />
            <StyleRadio
              required
              id="decreasePoint"
              name="pointChangeType"
              label="扣點"
              checked={null}
              onChange={null}
              inline={true}
            />
          </div>
        </Form.Group>
        <Form.Group className="d-flex mb-3">
          <Form.Label className={`form-caption pt-1`}>異動點數：</Form.Label>
          <StyleInput
            className="input-field-point"
            appendContent="點"
            appendContentBgColor="#fff"
            appendContentPadding={'0 4px 0 0'}
            appendContentHaveBorder={false}
            isFocusCocatAppend
            formControlOption={{
              required: true,
              name: 'point',
              disabled: false,
              onChange: onChange,
              value: recordState.point,
              maxLength: 6,
            }}
            feedbackText={'此為必填欄位'}
          />
        </Form.Group>
        <Form.Group className="d-flex mb-3">
          <Form.Label className={`form-caption pt-1`}>補登說明：</Form.Label>
          <Form.Control
            as="textarea"
            className={`input-field-textarea`}
            placeholder="選填上限 50 字"
            name={`remark`}
            maxLength={50}
            onChange={onChange}
            value={recordState.remark}
          />
        </Form.Group>
      </Form>
    </PointRecordModalStyle>
  )
}