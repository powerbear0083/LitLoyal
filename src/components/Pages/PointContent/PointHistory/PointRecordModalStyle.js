import styled from 'styled-components';
import {Modal} from 'components/Common';
import {colorObj, colorCommon} from 'styles/Variable/Color';

const PointRecordModalStyle = styled(Modal)`
  &.point-record-modal {
    
    .modal-dialog {
      width: 510px;
    }
    
    .point-record-form {
      font-size: 15px;
    }

    .form-caption {
      width: 86px;
    }

    .form-control {
      height: 32px;
      
      &::placeholder {
        color: ${colorObj.gray};
      }

      &:read-only {
        border-color: transparent;
        background-color: transparent;
      }
    }
    
    .member-number-fields {
      width: 276px
    }
    
    .input-field,
    .input-field-name,
    .input-field-textarea,
    .input-field-point {
      width: calc(100% - 86px);
    }

    .input-field-name {
      .form-control {
        width: 100%;
      }
    }

    .input-field-point  {
      .input-group {
        width: 342px;
      }
    }
    
    .input-field-textarea {
      height: 80px;
    }
    
    .btn-outline-dark {
      height: 32px;
      padding-top: 0;
      padding-bottom: 0;
    }
  }
`

export default PointRecordModalStyle;