import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import {Button, DateRange, Input} from 'components/Common';
import PointHistorySearchStyle from './PointHistorySearchStyle.js';

/**
 * @description 點數歷程搜尋 UI
 * @returns {JSX.Element}
 * @constructor
 */
export default function PointHistorySearch(
  {
    searchState = {},
    searchDispatch = () => {},
  }
) {
  
  function onChanged({ currentTarget: { value, name } }) {
    searchDispatch({
      type: 'CHANGE_FIELD',
      payload: {
        keyName: name,
        value,
      }
    });
  }
  
  function onClearFileds() {
    searchDispatch({
      type: 'CLEAR_FIELDS',
    });
  }
  
  const isDisabledSearchBtn = (searchState) => {
    return (
      searchState.memberNumber === '' && 
      searchState.memberPhone === '' && 
      searchState.campaignName === ''
    )
  }
  
  function onChangeDateRange(e) {
    searchDispatch({
      type: 'CHANGE_DATE_RANGE',
      payload: e
    });
  }
  
  return (
    <PointHistorySearchStyle>
      <Form>
        <Row>
          <Col>
            <Form.Group
              controlId="memberNumber"
              className="align-items-center d-flex"
            >
              <Form.Label
                className="form-caption"
              >
                會員編號：
              </Form.Label>
              <Form.Control
                name="memberNumber"
                type="text"
                placeholder=""
                value={searchState.memberNumber}
                onChange={onChanged}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group
              controlId="memberPhone"
              className="align-items-center d-flex"
            >
              <Form.Label
                className="form-caption"
              >
                手機：
              </Form.Label>
              <Form.Control
                name="memberPhone"
                type="phone"
                placeholder=""
                value={searchState.memberPhone}
                onChange={onChanged}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group
              controlId="dateRange"
              className="align-items-center d-flex pl-2 search-date-range"
            >
              <Form.Label
                className="form-caption"
              >
                時間：
              </Form.Label>
              <DateRange
                ranges={searchState.dateRange}
                onChange={onChangeDateRange}
                placeholder={``}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col>
            <Form.Group
              controlId="campaignName"
              className="align-items-center d-flex"
            >
              <Form.Label
                className="form-caption"
              >
                名稱：
              </Form.Label>
              <Form.Control
                type="text"
                name="campaignName"
                placeholder="消費 / 活動 / 好禮"
                className="form-campaign-name"
                value={searchState.campaignName}
                onChange={onChanged}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col className="text-right">
            <Button
              className="mr-3"
              size="md"
              variant="outline-darkerGray"
              onClick={onClearFileds}
            >
              清空條件
            </Button>
            <Button
              size="md"
              variant="primary"
              onClick={() => {
              }}
              disabled={isDisabledSearchBtn(searchState)}
            >
              查詢
            </Button>
          </Col>
        </Row>
      </Form>
    </PointHistorySearchStyle>
  )
}