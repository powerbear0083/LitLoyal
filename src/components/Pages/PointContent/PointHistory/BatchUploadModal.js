import { useRef, Fragment } from 'react';
import { Button, Input } from "components/Common";
import { color } from "styles/Variable/Color";
import BatchUploadModalStyle from './BatchUploadModalStyle';

/**
 * @description 批次下載 Modal
 * @param isShowBatchUploadModal 是否顯示 Modal
 * @param setIsShowBatchUploadModal 設定是否顯示 Modal
 * @returns {JSX.Element}
 * @constructor
 */
export default function BatchUploadModal(
  {
    isShowBatchUploadModal = false,
    setIsShowBatchUploadModal = () => {}
  }
) {

  function onClosed() {
    setIsShowBatchUploadModal(false);
  }

  /**
   * @description 產生 CSV 檔案範例
   * @param rowNumber
   * @returns {string}
   */
  const generateCsvExample = (rowNumber = 2) => {
    const rowTitle = "會員編號, 名稱, 增/減 (I/D), 點數 (上限六位數), 補登說明 \r\n";
    let rowContent = "";
    for (let i = 0; i <= rowNumber; i++) {
      rowContent += `AAA010000${String(i)}, 快閃店抽獎贈點, ${ i % 2 === 0 ? 'D' : 'I'}, 100, 快閃電小遊戲得獎\r\n`;
    }
    return rowTitle + rowContent;
  }
  
  function onClikcDownloadExample() {
    generateDowanloadLink(
      {
        csvData: generateCsvExample(),
        fileName: '補登點數匯入範本說明'
      }
    )
  }
  
  function generateDowanloadLink(
    {
      url = '', 
      csvData = '', 
      fileName = ''
    }
  ) {
    // 防止中文變亂碼，所以前綴加上 \ufeff
    const herf =
      url || `data:text/csv;charset=utf-8,\ufeff${encodeURIComponent(csvData)}`;
    const a = document.createElement("a");
    a.href = herf;
    a.download = `${fileName}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }
  
  return (
    <BatchUploadModalStyle
      backdrop="static"
      className="batch-upload-modal"
      show={isShowBatchUploadModal}
      titleText="批次上傳"
      onClose={onClosed}
      customConfirm={() => <UploadBtn />}
    >
      <ol className="text-left">
        <li>檔案格式限 csv 檔，檔案大小限 ≤ 25MB</li>
        <li>
          <span>欄位設定說明，詳見</span>
          <i
            title="匯入範本說明 (下載)"
            className="ml-1"
            onClick={onClikcDownloadExample}
          >匯入範本說明 (下載)</i>
        </li>
      </ol>
    </BatchUploadModalStyle>
  )
}

function UploadBtn({ onChange }) {
  const inputRef = useRef(null);
  
  return (
    <Fragment>
      <Button 
        variant={color.primary} 
        onClick={() => inputRef.current.click()}
      >
        上傳檔案
      </Button>
      <Input
        onClick={(e) => {
          e.target.value = "";
        }}
        formControlOption={{
          style: { display: "none" },
          ref: inputRef,
          type: "file",
          accept: ".csv",
          onChange: (e) => {
            const [file] = e.currentTarget.files;
            typeof onChange === "function" &&  onChange(file);
          }
        }}
      />
    </Fragment>
  )
}