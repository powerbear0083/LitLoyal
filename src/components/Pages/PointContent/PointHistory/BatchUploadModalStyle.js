import styled from 'styled-components';
import {Modal} from 'components/Common';
import {colorObj, colorCommon} from 'styles/Variable/Color';

const BatchUploadModalStyle = styled(Modal)`
  &.batch-upload-modal {
    
    .modal-dialog {
      width: 510px;
    }
    
    ol {
      padding-left: 50px;
      
      i {
        text-decoration: underline;
        color: ${colorObj.primary};
        cursor: pointer;
        font-style: normal;
      }
    }
  }
`

export default BatchUploadModalStyle;