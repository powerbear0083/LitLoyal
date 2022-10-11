import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import {Button, DateRange} from 'components/Common';
import PointHistorySearchStyle from './PointHistorySearchStyle.js';

/**
 * @description 點數歷程搜尋 UI
 * @returns {JSX.Element}
 * @constructor
 */
export default function PointHistorySearch(
  {
    pointHistoryState = {},
    pointHistoryDispatch = () => {},
    onClearFields = () => {},
    onClickSearch = () => {},
  }
) {
  
  function onChanged({ currentTarget: { value, name } }) {
    pointHistoryDispatch({
      type: 'CHANGE_FIELD',
      payload: {
        keyName: name,
        value,
      }
    });
  }
  
  const isDisabledSearchBtn = (pointHistoryState) => {
    return (
      pointHistoryState.customId === '' &&
      pointHistoryState.description === '' &&
      pointHistoryState.dateRange[0].startDate === '' &&
      pointHistoryState.dateRange[0].endDate === ''
    )
  }
  
  function onChangeDateRange(e) {
    pointHistoryDispatch({
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
              controlId="customId"
              className="align-items-center d-flex"
            >
              <Form.Label
                className="form-caption"
              >
                會員編號：
              </Form.Label>
              <Form.Control
                name="customId"
                type="text"
                placeholder=""
                value={pointHistoryState.customId}
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
                ranges={pointHistoryState.dateRange}
                onChange={onChangeDateRange}
                placeholder={`發送 / 扣除時間`}
              />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group
              controlId="description"
              className="align-items-center d-flex"
            >
              <Form.Label
                className="form-caption"
              >
                名稱：
              </Form.Label>
              <Form.Control
                type="text"
                name="description"
                placeholder="消費 / 活動 / 好禮名稱"
                className="form-campaign-name"
                value={pointHistoryState.description}
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
              onClick={onClearFields}
            >
              清空條件
            </Button>
            <Button
              size="md"
              variant="primary"
              onClick={onClickSearch}
              disabled={isDisabledSearchBtn(pointHistoryState)}
            >
              查詢
            </Button>
          </Col>
        </Row>
      </Form>
    </PointHistorySearchStyle>
  )
}