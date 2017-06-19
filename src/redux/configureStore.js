
import { createStore, applyMiddleware } from 'redux'
import reducer from './index'
import { createLogger } from 'redux-logger'

const logger = createLogger();

const configureStore = (preloadedState) => {
  return createStore(
    reducer,
    preloadedState,
    applyMiddleware(
      logger
    )
  )
};

const store = configureStore();

export default store;