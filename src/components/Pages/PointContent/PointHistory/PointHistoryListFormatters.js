import styled, {css} from 'styled-components';
import {IconButton} from 'components/Common';
import {colorObj} from 'styles/Variable/Color';
import {pathConfig} from 'Route';

const infoMixin = css`
  img {
    width: 40px;
    height: 40px;
    object-fit: contain;
    background-color: ${colorObj.white};
    border-radius: 5px;
  }

  .info-container {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    gap: 8px;
  }

  .info-content {
    display: flex;
    flex-direction: column;
  }

  .info-title {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  .info-default {
    display: flex;
    justify-content: flex-start;
    gap: 8px;
    color: ${colorObj.darkGray};
  }
`;

const settingMixin = css`
  display: flex;
  justify-content: flex-start;
  flex-direction: row;
  gap: 0 8px;
`;

const StyledFormatter = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 15px;
  color: ${(props) => props.color || colorObj.dark};
  font-weight: 400;
  width: ${(props) => props.width || 'auto'};
  ${(props) => props.info && infoMixin}
  ${(props) => props.setting && settingMixin};
  p.note {
    color: ${colorObj.danger};
    margin-bottom: 0;
  }
`;

const ColWrap = styled.div`
  display: flex;
  align-items: center;

  .spot {
    width: 6px;
    height: 6px;
    margin-right: 10px;
    border-radius: 10px;
    background-color: ${(props) => props.color || colorObj.dark};
  }
`;


const statusColumn = (cell) => {
  let fontColor = '#333333';
  switch (cell) {
    case '進行中':
      fontColor = '#3ca078';
      break;
    case '準備中':
      fontColor = '#333333';
      break;
    case '已停用':
    case '已過期':
    default:
      fontColor = 'rgba(51, 51, 51, 0.25)';
      break;
  }
  return (
    <StyledFormatter width="110px" color={fontColor}>
      <ColWrap color={fontColor}>
        <i className="spot"></i>
        {cell}
      </ColWrap>
    </StyledFormatter>
  );
};


export default {
  statusColumn
};
