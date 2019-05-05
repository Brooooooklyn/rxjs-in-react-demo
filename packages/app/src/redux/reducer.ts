import { combineReducers } from 'redux'
import { RouterState, connectRouter } from 'connected-react-router'

import { State as RawState, reducer as rawReducer } from '@demo/raw'

import { history } from './history'

export interface GlobalState {
  router: RouterState
  raw: RawState
}

export const rootReducer = combineReducers({
  raw: rawReducer,
  router: connectRouter(history)
})
