import {
  SET_SONGS,
  SET_SONGS_LOAD_STATUS,
  INCREMENT_SONG_PAGE_COUNTER,
  DECREMENT_SONG_PAGE_COUNTER
  // SET_PREVIOUS_START_KEY
  // ADD_SONG_NAV_HISTORY
} from '../../constants'
import { last, map, merge, prop, append, find } from 'ramda'

/*
{
  type: SET_SONGS,
  payload: {currentPage: 2, data: [ ...array of songs...]}
}
*/

export const songs = (state = [], action) => {
  switch (action.type) {
    case SET_SONGS:
      return action.payload.data
    default:
      return state
  }
}

export const songLoadStatus = (state = 'loading', action) => {
  switch (action.type) {
    case SET_SONGS_LOAD_STATUS:
      return action.payload
    default:
      return state
  }
}

const initialState = [{ page: 1, current: null, next: null }]

/* {
  type: SET_SONGS,
  payload: {currentPage: 2, data: [ ...array of songs...]}
} */

export const pageHistory = (state = initialState, action) => {
  switch (action.type) {
    case SET_SONGS:
      console.log('pageHistory reducer SET_SONGS')
      console.log('pageHistory state', state)
      console.log('pageHistory action.payload', action.payload)
      if (action.payload.currentPage === 1) {
        console.log('1 pageHistory currentPage', action.payload.currentPage)
        const newState = map(
          page =>
            page.page === 1
              ? merge(page, { next: prop('_id', last(action.payload.data)) })
              : page,
          state
        )
        console.log('pageHistory new state', newState)
        return newState
      } else if (action.payload.currentPage > 1) {
        console.log('> 1 pageHistory currentPage', action.payload.currentPage)
        // see if the page is already in pageHistory
        //page => page.page === action.payload.currentPage - 1,
        const previousHistoryPage = find(
          page => page.page === action.payload.currentPage - 1,
          state
        )
        console.log('> 1 previousHistoryPage', previousHistoryPage)

        // get the previous page's next value and use for the current page value
        if (previousHistoryPage) {
          const newState = append(
            {
              page: action.payload.currentPage,
              current: previousHistoryPage.next,
              next: prop('_id', last(action.payload.data))
            },
            state
          )
          console.log('> 1 newState', newState)
          return newState
        }
      } else {
        return state
      }
      break
    default:
      return state
  }
}

/*
{type: INCREMENT_SONG_PAGE_COUNTER}
{type: DECREMENT_SONG_PAGE_COUNTER}
*/
export const songPageCounter = (state = 1, action) => {
  switch (action.type) {
    case INCREMENT_SONG_PAGE_COUNTER:
      return state + 1
    case DECREMENT_SONG_PAGE_COUNTER:
      return state - 1 === 0 ? 1 : state - 1
    default:
      return state
  }
}

//
// export const prevStartKey = (state = null, action) => {
//   switch (action.type) {
//     case SET_SONGS:
//       console.log('REDUCER prevStartKey', action.payload)
//       return propOr(null, '_id', last(action.payload))
//     default:
//       return state
//   }
// }

// export const songPageNavHistory = (
//   state = [
//     {
//       prevStartKey: undefined,
//       nextStartKey: undefined
//     }
//   ],
//   action
// ) => {
//   switch (action.type) {
//     case ADD_SONG_NAV_HISTORY:
//       return concat(state, action.payload)
//     default:
//       return state
//   }
// }