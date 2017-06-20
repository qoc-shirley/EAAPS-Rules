import React from 'react';
import ReactDOM from 'react-dom';
import RulesApp from './Containers/RulesApp/RulesApp';
import { Provider } from 'react-redux';
import {
  applyMiddleware,
  combineReducers,
  createStore,
} from 'redux';

import logger from 'redux-logger';
import thunk from 'redux-thunk';

import registerServiceWorker from './registerServiceWorker';
import reducer from './redux/App/reducer';
import './index.css';

const store = createStore(
  combineReducers({
    medication: reducer,
  }),
  applyMiddleware(
    thunk,
    logger
  )
);

ReactDOM.render(
  <Provider store={store}>
    <RulesApp />
  </Provider>,
  document.getElementById('root')
);
registerServiceWorker();
