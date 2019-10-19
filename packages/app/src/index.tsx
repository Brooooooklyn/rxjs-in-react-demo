import 'reflect-metadata'
import React from 'react'
import { render } from 'react-dom'
import { BrowserRouter, Route, Switch, Link } from 'react-router-dom'
import { Provider } from 'react-redux'
import { Menu } from 'antd'

import { store } from './redux'
import { Raw, Decorator, HooksContainer } from './modules'

import 'antd/dist/antd.css'

const App = () =>
  <Provider store={store}>
    <BrowserRouter>
      <Menu mode="horizontal">
        <Menu.Item>
          <Link to='/redux-observable'>
            redux-observable
          </Link>
        </Menu.Item>
        <Menu.Item>
          <Link to='/decorator'>
            redux-epics-decorator
          </Link>
        </Menu.Item>
        <Menu.Item>
          <Link to='/hooks'>
            ayanami
          </Link>
        </Menu.Item>
      </Menu>
      <Switch>
        <Route exact={true} path="/redux-observable" component={Raw} />
        <Route exact={true} path="/decorator" component={Decorator} />
        <Route exact={true} path="/hooks" component={HooksContainer} />
      </Switch>
    </BrowserRouter>
  </Provider>

render(<App />, document.querySelector('#app'))
