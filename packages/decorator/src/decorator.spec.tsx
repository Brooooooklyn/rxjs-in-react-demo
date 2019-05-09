import React from 'react'
import { Store } from 'redux'
import { TestBedFactory } from 'redux-epics-decorator/testbed'
import { GlobalState } from '@demo/app/redux'
import { SinonFakeTimers, SinonStub, useFakeTimers, stub } from 'sinon'
import { of, timer, throwError } from 'rxjs'
import { noop } from 'lodash'
import { mapTo } from 'rxjs/operators'
import { mount } from 'enzyme'

import { RepoService } from './service'
import { DecoratorModule, DispatchProps } from './index'
import { Provider } from 'react-redux'

class FakeRepoService {
  getRepoByUsers = noop
}

const Component = () => <div />

describe('redux-epics-decorator specs', () => {
  let store: Store<GlobalState>
  let fakeTimer: SinonFakeTimers
  let ajaxStub: SinonStub
  const debounce = 300 // debounce in epic
  let props: DispatchProps

  beforeEach(() => {
    fakeTimer = useFakeTimers()
    const testModule = TestBedFactory.configureTestingModule({
      providers: [
        {
          provide: RepoService,
          useClass: FakeRepoService
        }
      ]
    })
    const Container = testModule.connect(DecoratorModule)((state: GlobalState) => state.decorator)(Component)
    store = testModule.setupStore({
      decorator: DecoratorModule,
    })
    const root = mount(<Provider store={store}><Container/></Provider>)
    props = root.find(Component).props() as any
    ajaxStub = stub(testModule.getInstance(RepoService), 'getRepoByUsers')
  })

  afterEach(() => {
    ajaxStub.restore()
    fakeTimer.restore()
  })

  it('should get empty repos by name', () => {
    const username = 'fake user name'
    ajaxStub.returns(of([]))

    props.fetchRepoByUser(username)

    fakeTimer.tick(debounce)

    expect(store.getState().decorator.repos).toHaveLength(0)
  })

  it('should get repos by name', () => {
    const username = 'fake user name'
    const repos = [{ name: 1 }, { name: 2 }]
    ajaxStub.returns(of(repos))

    props.fetchRepoByUser(username)

    fakeTimer.tick(debounce)

    expect(store.getState().decorator.repos).toEqual(repos)
  })

  it('should set loading and finish loading', () => {
    const username = 'fake user name'
    const delay = 300
    ajaxStub.returns(timer(delay).pipe(mapTo([])))

    props.fetchRepoByUser(username)

    expect(store.getState().decorator.loading).toBe(false)

    fakeTimer.tick(debounce)

    expect(store.getState().decorator.loading).toBe(true)

    fakeTimer.tick(delay)

    expect(store.getState().decorator.loading).toBe(false)
  })

  it('should catch error', () => {
    const username = 'fake user name'
    const debounce = 300 // debounce in epic
    ajaxStub.returns(throwError(new TypeError('whatever')))

    props.fetchRepoByUser(username)

    fakeTimer.tick(debounce)

    expect(store.getState().decorator.error).toBe(true)
  })
})
