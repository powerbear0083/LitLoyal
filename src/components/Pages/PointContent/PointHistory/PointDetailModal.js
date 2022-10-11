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
    
    // rowIndex 2 跟 6 加上分隔線 class name
    if(rowIndex === 2 || rowIndex === 6) {
      className += ` separate-line`;
    }
    
    return className
  }
  const getCaptionType = (keyName) => {
    const type = {
      createDateTime: '時間',
      customId: '會員編號',
      name: '會員',
      description: '名稱',
      transactionCategory: '異動類別',
      pointGain: '異動點數',
      shopName: '消費門店',
      creatorEmail: '補登者',
      additionalInstructions: '補登說明'
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