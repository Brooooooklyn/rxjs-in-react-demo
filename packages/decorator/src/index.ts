import {
  Module,
  EffectModule,
  Effect,
  ModuleDispatchProps,
  DefineAction
} from 'redux-epics-decorator'
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
import { Action } from 'redux-actions'

import { RepoService } from './service'

@Module('decorator')
export class DecoratorModule extends EffectModule<RawState> {
  defaultState = {
    repos: [],
    loading: false,
    error: false
  }

  @DefineAction() retry$!: Observable<void>

  constructor(private repoService: RepoService) {
    super()
  }

  @Effect({
    loading: (state: RawState) => {
      return { ...state, repos: [], loading: true, error: false }
    },
    success: (state: RawState, { payload: repos }: Action<Repo[]>) => {
      return { ...state, repos, loading: false, error: false }
    },
    fail: (state: RawState) => {
      return { ...state, repos: [], loading: false, error: true }
    }
  })
  fetchRepoByUser(payload$: Observable<string>) {
    return payload$.pipe(
      filter(user => !!user),
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(user =>
        this.repoService.getRepoByUsers(user).pipe(
          map(this.createAction('success')),
          startWith(this.createAction('loading')()),
          catchError(err => {
            message.error(`搜索用户 ${user} 的 repo 失败: ${err.message}`)
            console.error(err)
            return of(this.createAction('fail')())
          }),
          repeatWhen(() => this.retry$)
        )
      )
    )
  }
}

export type StateProps = RawState
export type DispatchProps = ModuleDispatchProps<DecoratorModule>
