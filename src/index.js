import React from 'react';
import ReactDOM from 'react-dom';
import App from './Components/App/App';
import { Provider } from 'react-redux';
import store from './redux/store/configureStore';
import registerServiceWorker from './registerServiceWorker';
import './index.css';

ReactDOM.render(
  <Provider store={ store }>
    <App />
  </Provider>,
  document.getElementById('root')
);
registerServiceWorker();
