import { stub, useFakeTimers, SinonFakeTimers, SinonStub } from 'sinon'
import { Store } from 'redux'
import { noop } from 'lodash'
const fakeAjax = {
  getJSON: noop
}

jest.mock('rxjs/ajax', () => ({ ajax: fakeAjax }))
import { configureStore } from '@demo/app/redux/store'
import { GlobalState } from '@demo/app/redux'
import { REQUESTED_USER_REPOS } from './index'
import { of, timer, throwError } from 'rxjs'
import { mapTo } from 'rxjs/operators'

describe('raw redux-observable specs', () => {
  let store: Store<GlobalState>
  let dispose: () => void
  let fakeTimer: SinonFakeTimers
  let ajaxStub: SinonStub
  const debounce = 300 // debounce in epic

  beforeEach(() => {
    store = configureStore().store
    dispose = store.subscribe(noop)
    fakeTimer = useFakeTimers()
    ajaxStub = stub(fakeAjax, 'getJSON')
  })

  afterEach(() => {
    ajaxStub.restore()
    fakeTimer.restore()
    dispose()
  })

  it('should get empty repos by name', () => {
    const username = 'fake user name'
    ajaxStub.returns(of([]))

    store.dispatch(REQUESTED_USER_REPOS(username))

    fakeTimer.tick(debounce)

    expect(store.getState().raw.repos).toHaveLength(0)
  })

  it('should get repos by name', () => {
    const username = 'fake user name'
    const repos = [{ name: 1 }, { name: 2 }]
    ajaxStub.returns(of(repos))

    store.dispatch(REQUESTED_USER_REPOS(username))

    fakeTimer.tick(debounce)

    expect(store.getState().raw.repos).toEqual(repos)
  })

  it('should set loading and finish loading', () => {
    const username = 'fake user name'
    const delay = 300
    ajaxStub.returns(timer(delay).pipe(mapTo([])))

    store.dispatch(REQUESTED_USER_REPOS(username))

    expect(store.getState().raw.loading).toBe(false)

    fakeTimer.tick(debounce)

    expect(store.getState().raw.loading).toBe(true)

    fakeTimer.tick(delay)

    expect(store.getState().raw.loading).toBe(false)
  })

  it('should catch error', () => {
    const username = 'fake user name'
    const debounce = 300 // debounce in epic
    ajaxStub.returns(throwError(new TypeError('whatever')))

    store.dispatch(REQUESTED_USER_REPOS(username))

    fakeTimer.tick(debounce)

    expect(store.getState().raw.error).toBe(true)
  })
})
