import {createStore, applyMiddleware, compose} from 'redux';
import thunk from 'redux-thunk';
import reducers from '../reducers';

function configureStore(initState) {

  const finalCreateStore = compose(
      applyMiddleware(
        thunk,
      ),
    )(createStore);

  const store = finalCreateStore(reducers, initState);

  //only for development
  /*store.subscribe(() => {
      console.log('state', store.getState());
      chrome.storage.local.get(null, (storage) => {console.log('storage', storage)});
  });*/

  return store;
}

export default configureStore;

