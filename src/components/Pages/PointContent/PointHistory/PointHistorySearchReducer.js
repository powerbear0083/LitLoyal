const initState = {
  customId: '',
  dateRange: [
    {
      startDate: "",
      endDate: "",
      key: "selection"
    }
  ],
  description: '',
}


/**
 * @description 點數歷程 Search state
 * @type {{}}
 */
export const searchRootState = {
  ...initState
}

/**
 * @description 點數歷程 Search Reducer
 * @param state
 * @param payload
 * @param type
 * @constructor
 */
export const PointHistorySearchReducer = (state, { payload, type }) => {
  switch (type) {
    
    case 'CHANGE_FIELD': {
      return {
        ...state,
        [payload.keyName]: payload.value
      }
    }
    
    case 'CHANGE_DATE_RANGE': {
      console.log(payload)
      return {
        ...state,
        dateRange: [
          ...payload
        ]
      }
    }
    
    case 'CLEAR_FIELDS': {
      return {
        ...initState,
        dateRange: [
          ...initState.dateRange
        ]
      }
    }
  }
}