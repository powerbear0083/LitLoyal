/**
 * @description 補登點數初始化 state
 * @type {{}}
 */
export const recordRootState = {
  customId: '',
  memberName: '-',
  phone: '-',
  name: '',
  pointChangeType: null,
  point: 0,
  remark: ''
}

/**
 * @description 補登點數 Reducer
 * @param state
 * @param payload
 * @param type
 * @constructor
 */
export const PointRecordReducer = (state, { payload, type }) => {
  switch (type) {
    case 'CHANGE_FIELD': {
      console.log(payload);
      return {
        ...state,
        [payload.keyName]: payload.value
      }
    }
  }
}