import styled from "styled-components";
import { colorObj, colorCommon } from "styles/Variable/Color";

const PointHistorySearchStyle = styled.div`
  .form-caption {
    width: 80px;
    margin-bottom: 0;
    color: ${colorObj.darkGray};
  }
  
  .form-control {
    width: calc(100% - 80px);
    height: 32px;
    border-color: colorCommon.borderGray;
    &::placeholder {
      color: ${colorObj.gray};
    }
  }
  
  .search-date-range > div {
    width: 100%
  }
  
  .form-campaign-name {
    width: 286px;
  }
  
  .btn {
    width: 120px;
  }
`


export default PointHistorySearchStyle;