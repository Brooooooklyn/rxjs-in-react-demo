import React from 'react'
import { render } from 'react-dom'
import { BrowserRouter, Route, Switch, Link } from 'react-router-dom'
import { Provider } from 'react-redux'
import { Menu } from 'antd'

import { store } from './redux'
import { Raw } from './modules'

import 'antd/dist/antd.css'

const App = () =>
  <Provider store={store}>
    <BrowserRouter>
      <Menu>
        <Menu.Item>
          <Link to='/redux-observable'>
            redux-observable
          </Link>
        </Menu.Item>
      </Menu>
      <Switch>
        <Route exact={true} path="/redux-observable" component={Raw} />
      </Switch>
    </BrowserRouter>
  </Provider>

render(<App />, document.querySelector('#app'))