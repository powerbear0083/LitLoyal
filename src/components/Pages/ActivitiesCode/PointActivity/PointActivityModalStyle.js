import styled from "styled-components";
import { Modal } from "components/Common";
import { color, colorObj } from "styles/Variable/Color";

const AddPointActivityModalStyle = styled(Modal)`
  &.modal-box {
    .modal-dialog {
      max-width: 520px;
    }
    
    .form-caption {
      font-size: 15px;
      color: ${colorObj.darkerGray};
      width: 90px;
    }

    .fields-col {
        width: calc(100% - 90px);
    }
    
    .input-col .form-control{
      height: 32px;
      
      &::placeholder {
        color: ${colorObj.gray};
      }
    }
    
    .form-point-content {
      font-size: 15px;
    }
    
    .discount-fields {
      .discount-input {
        width: 72px;
      }
    }
    
    .bonus-fields {
      width: 100%;
      .bonus-input {
        width: inherit;
        margin-left: 2px;
      }
    } 
    .give-away-fields {
      .style-select-container {
        padding-left: 4px;
      }
      .dropdown {
        width: 100px;
      }
      
      .input-group {
        width: 70px;
      }
    }  
  }
`

export default AddPointActivityModalStyle;