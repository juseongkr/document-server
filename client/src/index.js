import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './App';
import { createBrowserHistory } from 'history';
import reportWebVitals from './reportWebVitals';
import { RouterStore, syncHistoryWithStore } from 'mobx-react-router';
import { Provider } from 'mobx-react';
import { Router } from 'react-router';

const services = {};
const stores = {
  routerStore: new RouterStore(),
};

const browserHistory = createBrowserHistory();
const history = syncHistoryWithStore(browserHistory, stores.routerStore);

ReactDOM.render(
  <Provider { ...stores }>
    <Router history={ history }>
      <App />
    </Router>
  </Provider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
