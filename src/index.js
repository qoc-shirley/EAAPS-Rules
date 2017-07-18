import React from 'react';
import ReactDOM from 'react-dom';
import logger from 'redux-logger';
import thunk from 'redux-thunk';
import {
  applyMiddleware,
  combineReducers,
  createStore,
} from 'redux';
import {Provider} from 'react-redux';
import {composeWithDevTools} from 'redux-devtools-extension';
import RulesApp from './Containers/RulesApp/RulesApp';
import registerServiceWorker from './registerServiceWorker';
import reducer from './redux/App/reducer';
import './index.css';

const store = createStore(
  combineReducers({
    medication: reducer,
  }),
  composeWithDevTools(
    applyMiddleware(
      thunk,
      logger
    )
  ));

ReactDOM.render(
  <Provider store={store}>
    <RulesApp />
  </Provider>,
  document.getElementById('root')
);
registerServiceWorker();
