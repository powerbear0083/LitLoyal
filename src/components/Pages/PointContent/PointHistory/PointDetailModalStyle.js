import styled from 'styled-components';
import {Modal} from 'components/Common';
import {colorObj, colorCommon} from 'styles/Variable/Color';

const PointDetailModalStyle = styled(Modal)`
  &.point-detail-modal {
    
    .modal-dialog {
      max-width: 460px;
    }
    
    .detail-row {
      margin-bottom: 16px;
      font-size: 15px;
      
      &:last-child {
        margin-bottom: 0;
      }
    }
    
    .separate-line {
      border-bottom: 1px solid ${colorCommon.borderGray};
      padding-bottom: 16px;
    }
    
    .detail-title {
      width: 100px;
      color: ${colorObj.darkerGray};
    }
    
    .detail-text {
      width: calc(100% - 100px);
    }
  }
`

export default PointDetailModalStyle;