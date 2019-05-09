import { message } from 'antd'
import { createAction, Action, handleActions } from 'redux-actions'
import { Observable, of } from 'rxjs'
import { ofType, combineEpics } from 'redux-observable'
import {
  map,
  switchMap,
  catchError,
  debounceTime,
  filter,
  startWith,
  repeatWhen,
  distinctUntilChanged
} from 'rxjs/operators'
import { ajax } from 'rxjs/ajax'

export interface Repo {
  name: string
  description: string
  fork: boolean
  forks: number
  watchers: number
  open_issues: number
}

export interface State {
  repos: Repo[]
  loading: boolean
  error: boolean
}

const START_REQUEST_REPOS = createAction<void>('START_REQUEST_REPOS')
export const REQUESTED_USER_REPOS = createAction<string>('REQUESTED_USER_REPOS')
const RECEIVED_REPOS = createAction<Repo[]>('RECEIVED_REPOS')
const RECEIVED_REPOS_FAILD = createAction<void>('RECEIVED_REPOS_FAILD')
export const RETRY_SEARCH = createAction<void>('RETRY_SEARCH')

const fetchRepoByUser = (action$: Observable<Action<string>>) =>
  action$.pipe(
    ofType(`${REQUESTED_USER_REPOS}`),
    map(({ payload: user }) => user),
    filter(user => !!user),
    distinctUntilChanged(),
    debounceTime(300),
    switchMap(user =>
      ajax.getJSON<Repo[]>(`https://api.github.com/users/${user}/repos`).pipe(
        map(RECEIVED_REPOS),
        startWith(START_REQUEST_REPOS()),
        catchError(err => {
          message.error(`搜索用户 ${user} 的 repo 失败: ${err.message}`)
          console.error(err)
          return of(RECEIVED_REPOS_FAILD())
        }),
        repeatWhen(() => action$.pipe(ofType(`${RETRY_SEARCH}`)))
      )
    )
  )

export const reducer = handleActions(
  {
    [`${START_REQUEST_REPOS}`]: (state: State) => {
      return { ...state, loading: true, error: false }
    },
    [`${RECEIVED_REPOS}`]: (
      state: State,
      { payload: repos }: Action<Repo[]>
    ) => {
      return { ...state, loading: false, repos }
    },
    [`${RECEIVED_REPOS_FAILD}`]: (state: State) => {
      return { ...state, repos: [], loading: false, error: true }
    }
  },
  {
    loading: false,
    repos: [],
    error: false
  }
)

export const epic = combineEpics(fetchRepoByUser)
