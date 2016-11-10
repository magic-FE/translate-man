import {createStore, applyMiddleware, compose} from 'redux';
import thunk from 'redux-thunk';
import reducers from '../reducers';

function configureStore(initState) {

  let finalCreateStore;

  // in development log action info
  if(process.env.NODE_ENV === 'development') {
  	const createLogger = require('redux-logger');
  	finalCreateStore = compose(
  	    applyMiddleware(
  	      thunk,
  	      createLogger(),
  	    ),
  	  )(createStore);
  } else {
  	finalCreateStore = compose(
  	    applyMiddleware(
  	      thunk,
  	    ),
  	  )(createStore);
  }

  const store = finalCreateStore(reducers, initState);

  return store;
}

export default configureStore;

