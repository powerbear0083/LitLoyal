const initState = {
  customId: '',
  dateRange: [
    {
      startDate: "",
      endDate: "",
      key: "selection"
    }
  ],
  description: ''
}

/**
 * @description 點數歷程 root state
 * @type {{}}
 */
export const PointHistoryRootState = {
  ...initState
}

/**
 * @description 點數歷程 Reducer
 * @param state
 * @param payload
 * @param type
 * @constructor
 */

export const PointHistoryReducer = (state, { payload, type }) => {
  switch (type) {
    
    case 'CHANGE_FIELD': {
      return {
        ...state,
        [payload.keyName]: payload.value
      }
    }

    case 'CHANGE_DATE_RANGE': {
      console.log('CHANGE_DATE_RANGE',payload)
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