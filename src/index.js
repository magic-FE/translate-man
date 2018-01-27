import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import App from './components/App/App';
import configureStore from './store/configureStore';
import {syncUserDataAC} from './actionCreators';
import {POPENV} from './helpers/tools';

// 模拟用户升级
// browser.storage.local.set({'userData': {setting: {data: [{hecked:false, name: "dblclickTranslate", text: "双击单词翻译", tip: "页面中双击文字,即可翻译选中文本"}]}}});

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
