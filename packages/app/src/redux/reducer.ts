import { combineReducers } from 'redux'
import { RouterState, connectRouter } from 'connected-react-router'
import { combineModuleReducers } from 'redux-epics-decorator'
import { State as RawState, reducer as rawReducer } from '@demo/raw'
import { DecoratorModule } from '@demo/decorator'

import { history } from './history'

export interface GlobalState {
  router: RouterState
  raw: RawState
  decorator: RawState
}

export const rootReducer = combineReducers({
  raw: rawReducer,
  router: connectRouter(history),
  ...combineModuleReducers({
    decorator: DecoratorModule
  })
})
