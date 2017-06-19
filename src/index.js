import React from 'react';
import ReactDOM from 'react-dom';
import RulesApp from './Containers/RulesApp/RulesApp';
import { Provider } from 'react-redux';
import {
  combineReducers,
  createStore,
} from 'redux';

import registerServiceWorker from './registerServiceWorker';
import reducer from './redux/App/reducer';
import './index.css';

const store = createStore(
  combineReducers({
    medication: reducer,
  } ),
);

ReactDOM.render(
  <Provider store={store}>
    <RulesApp />
  </Provider>,
  document.getElementById('root')
);
registerServiceWorker();
