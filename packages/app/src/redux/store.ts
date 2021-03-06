import { createStore, compose, applyMiddleware, Store } from 'redux'
import { createEpicMiddleware } from 'redux-observable'
import { routerMiddleware } from 'connected-react-router'
import { catchError } from 'rxjs/operators'
import { empty } from 'rxjs'
import { identity } from 'lodash'

import { rootReducer, GlobalState } from './reducer'
import { rootEpic } from './epics'
import { history } from './history'

export const configureStore = () => {
  const epicMiddleware = createEpicMiddleware()

  const store: Store<GlobalState> = createStore(
    rootReducer,
    compose(
      applyMiddleware(routerMiddleware(history), epicMiddleware),
      window.__REDUX_DEVTOOLS_EXTENSION__
        ? window.__REDUX_DEVTOOLS_EXTENSION__({ name: 'rxjs-in-react' })
        : identity
    )
  ) as any

  const runEpic = (epic: Function) => (...args: any[]) => {
    const action$ = epic(...args).pipe(
      catchError(e => {
        console.error(e)
        return empty()
      })
    )
    return action$
  }

  epicMiddleware.run(runEpic(rootEpic))

  return { store, history }
}
