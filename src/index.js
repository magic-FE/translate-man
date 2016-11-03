import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import App from './components/App/App';
import configureStore from './store/configureStore';
import {syncUserDataAC} from './actionCreators';
import {POPENV} from './helpers/tools';

const store = configureStore();

syncUserDataAC(store.dispatch)();

if(POPENV) {
	ReactDOM.render(
		<Provider store={store}>
			<App />
		</Provider>
		,document.getElementById('__fanyixia_container')
	);
} else {
	const content = document.createElement('div');
	content.id = '__fanyixia_content';
	document.body.appendChild(content);

	ReactDOM.render(
		<Provider store={store}>
			<App />
		</Provider>
		,document.getElementById('__fanyixia_content')
	);
}