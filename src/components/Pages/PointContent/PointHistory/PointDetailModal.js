import PointDetailModalStyle from './PointDetailModalStyle';

/**
 * @description 點數詳情 Modal
 * @param isShowModal 是否顯示 Modal
 * @param pointDetailModalInfo 點數詳情資訊
 * @param closePointDetailModal 關閉 Modal
 * @returns {JSX.Element}
 * @constructor
 */
export default function PointDetailModal(
  {
    isShowModal = false,
    pointDetailModalInfo = {},
    closePointDetailModal = () => {
    },
  }
) {
  
  const renderRowClassName = (rowIndex) => {
    let className = `d-flex detail-row`;

    // 讓 index 從 1 開始
    // 每 4 個 加上 class name
    if ((rowIndex + 1) % 4 === 0) {
      className += ` separate-line`;
    }
    
    return className
  }
  const getCaptionType = (keyName) => {
    const type = {
      time: '時間',
      memberNum: '會員編號',
      member: '會員',
      phone: '手機',
      name: '名稱',
      changeType: '異動類別',
      changePoint: '異動點數',
      storeName: '虛擬店',
      recordMail: '補登者',
      recordDescription: '補登說明'
    }
    return type[keyName]
  }
  return (
    <PointDetailModalStyle
      backdrop="static"
      className="point-detail-modal"
      titleText={`點數詳情`}
      closeBtnText="關閉"
      show={isShowModal}
      onClose={closePointDetailModal}
      customConfirm={() => <></>}
    >
      <div className="text-left">
        {
          Object.keys(pointDetailModalInfo).map((key, index) => (
            <div
              key={index} 
              className={renderRowClassName(index)}
            >
              <span className="detail-title">{getCaptionType(key)}：</span>
              <span className="detail-text">{pointDetailModalInfo[key]}</span>
            </div>
          ))
        }
      </div>
    </PointDetailModalStyle>
  )
}