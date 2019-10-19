import {
  Ayanami,
  Effect,
  DefineAction,
  ImmerReducer,
  EffectAction
} from 'ayanami'
import { State as RawState, Repo } from '@demo/raw'
import { Injectable } from '@asuka/di'
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
import { Draft } from 'immer'

@Injectable()
export class HooksModule extends Ayanami<RawState> {
  defaultState = {
    repos: [],
    loading: false,
    error: false
  }

  @DefineAction() retry$!: Observable<void>

  constructor(private repoService: RepoService) {
    super()
  }

  @ImmerReducer()
  loading(state: Draft<RawState>) {
    state.error = false
    state.loading = true
    state.repos = []
  }

  @ImmerReducer()
  success(state: Draft<RawState>, repos: Repo[]) {
    state.repos = repos
    state.loading = false
    state.error = false
  }

  @ImmerReducer()
  fail(state: Draft<RawState>) {
    state.repos = []
    state.loading = false
    state.error = true
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
