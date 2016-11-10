import googleTranslate from './googleTranslate';
import icibaTranslate from './icibaTranslate';
import {getSourceLanguageAC} from '../actionCreators';
import {POPENV, getUILanguage} from './tools';

function shouldUseIciba(option) {
	if((option.hl === 'zh-CN' || (option.hl === 'auto' && getUILanguage() === 'zh-CN')) && option.firstIciba) {
		if(POPENV) {
			if(~['auto', 'zh-CN', 'ko', 'ja', 'en', 'fr'].indexOf(option.from) && ~['auto', 'zh-CN'].indexOf(option.to)) {
				return true;
			} else {
				return false;
			}
		} else {
			return true;
		}
	}
	return false;
}

function translate(option, dispatch) {
	/**
	 * 只有当主语言是中文简体的时候,开启金山翻译才会有用.
	 * 如果开启金山翻译,会同时请求金山和谷歌的接口.那个返回快,用那个的数据.空数据算为拒绝.
	 * 当2个接口都抛出错误,即抛出错误.
	 */
	
	if(shouldUseIciba(option)) {
		return new Promise((reslove, reject) => {
			let errorNum = 0;
			icibaTranslate(option).then((response) => {
				reslove(response);
			}).catch((error) => {
				errorNum++;
				if(errorNum === 2) {
					reject(error);
				}
			});
			googleTranslate(option).then((response) => {
				getSourceLanguageAC(dispatch)(response[2]);
				reslove(response);
			}).catch((error) => {
				errorNum++;
				if(errorNum === 2) {
					reject(error);
				}
			});
		});
	} else {
		return googleTranslate(option);
	}
}


export default translate;