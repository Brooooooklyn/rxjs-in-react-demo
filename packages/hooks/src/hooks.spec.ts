import { Test } from '@asuka/di'
import { getAllActionsForTest, ActionMethodOfAyanami } from 'ayanami'
import { SinonFakeTimers, SinonStub, useFakeTimers, stub } from 'sinon'
import { of, timer, throwError } from 'rxjs'
import { mapTo } from 'rxjs/operators'

import { RepoService } from './service'
import { HooksState, StateProps } from './index'

class FakeRepoService {
  getRepoByUsers = stub()
}

describe('redux-epics-decorator specs', () => {
  let fakeTimer: SinonFakeTimers
  let ajaxStub: SinonStub
  let hookState: HooksState
  let actions: ActionMethodOfAyanami<HooksState, StateProps>
  const debounce = 300 // debounce in epic

  beforeEach(() => {
    fakeTimer = useFakeTimers()
    const testModule = Test.createTestingModule()
      .overrideProvider(RepoService)
      .useClass(FakeRepoService)
      .compile()
    hookState = testModule.getInstance(HooksState)
    actions = getAllActionsForTest(hookState)
    ajaxStub = testModule.getInstance(RepoService).getRepoByUsers as SinonStub
  })

  afterEach(() => {
    ajaxStub.reset()
    fakeTimer.restore()
  })

  it('should get empty repos by name', () => {
    const username = 'fake user name'
    ajaxStub.returns(of([]))

    actions.fetchRepoByUser(username)

    fakeTimer.tick(debounce)

    expect(hookState.getState().repos).toHaveLength(0)
  })

  it('should get repos by name', () => {
    const username = 'fake user name'
    const repos = [{ name: 1 }, { name: 2 }]
    ajaxStub.returns(of(repos))

    actions.fetchRepoByUser(username)

    fakeTimer.tick(debounce)

    expect(hookState.getState().repos).toEqual(repos)
  })

  it('should set loading and finish loading', () => {
    const username = 'fake user name'
    const delay = 300
    ajaxStub.returns(timer(delay).pipe(mapTo([])))

    actions.fetchRepoByUser(username)

    expect(hookState.getState().loading).toBe(false)

    fakeTimer.tick(debounce)

    expect(hookState.getState().loading).toBe(true)

    fakeTimer.tick(delay)

    expect(hookState.getState().loading).toBe(false)
  })

  it('should catch error', () => {
    const username = 'fake user name'
    const debounce = 300 // debounce in epic
    ajaxStub.returns(throwError(new TypeError('whatever')))

    actions.fetchRepoByUser(username)

    fakeTimer.tick(debounce)

    expect(hookState.getState().error).toBe(true)
  })
})
