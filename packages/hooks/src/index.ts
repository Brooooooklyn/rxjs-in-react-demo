import {
  Ayanami,
  Singleton,
  Effect,
  DefineAction,
  Reducer,
  EffectAction
} from 'ayanami'
import { State as RawState, Repo } from '@demo/raw'
import { Observable, of } from 'rxjs'
import {
  filter,
  debounceTime,
  switchMap,
  map,
  startWith,
  catchError,
  repeatWhen,
  distinctUntilChanged
} from 'rxjs/operators'
import { message } from 'antd'
import { RepoService } from './service'

@Singleton()
export class HooksState extends Ayanami<RawState> {
  defaultState = {
    repos: [],
    loading: false,
    error: false
  }

  @DefineAction() retry$!: Observable<void>

  constructor(private repoService: RepoService) {
    super()
  }

  @Reducer()
  loading(_: void, state: RawState) {
    return { ...state, repos: [], loading: true, error: false }
  }

  @Reducer()
  success(repos: Repo[], state: RawState) {
    return { ...state, repos, loading: false, error: false }
  }

  @Reducer()
  fail(_: void, state: RawState) {
    return { ...state, repos: [], loading: false, error: true }
  }

  @Effect()
  fetchRepoByUser(payload$: Observable<string>): Observable<EffectAction> {
    return payload$.pipe(
      filter(user => !!user),
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(user =>
        this.repoService.getRepoByUsers(user).pipe(
          map(repos => this.getActions().success(repos)),
          startWith(this.getActions().loading()),
          catchError(err => {
            message.error(`搜索用户 ${user} 的 repo 失败: ${err.message}`)
            console.error(err)
            return of(this.getActions().fail())
          }),
          repeatWhen(() => this.retry$)
        )
      )
    )
  }
}

export type StateProps = RawState
