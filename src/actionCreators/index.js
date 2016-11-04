import * as actionTypes from '../constants/actionTypes';
import translate from '../helpers/translate';
import googleSpeech from '../helpers/googleSpeech';
import googleTranslateTk from '../helpers/googleTranslateTk';
import bindContentScriptEvent from './bindContentScriptEvent';
import {POPENV} from '../helpers/tools';

// spcecial two way bind use redux
export const bindDataAC = (dispatch) => {
    return (variable) => {
        dispatch({type: actionTypes.bindData, data: variable});
    }
}

// get user option from chrome storage and put it on state
// only run once
function replaceSettingName(name) {
    return name.replace(/([A-Z])/g, (res) => {
        return '_' + res.toLowerCase() });
}

export const syncUserDataAC = (dispatch) => {
    return () => {
        googleTranslateTk('');  // init google token when open the extension
        dispatch((dispatch, getState) => {
            // get chrome storage
            chrome.storage.local.get('userData', (storage) => {
                // put text to setting
                if(storage.userData && storage.userData.setting) {
                    storage.userData.setting.data.forEach((set) => {
                        set.text = chrome.i18n.getMessage(replaceSettingName(set.name));
                    });
                }
                dispatch({ type: actionTypes.syncUserData, data: storage.userData });
                if(!POPENV) {
                    dispatch(bindContentScriptEvent);
                }
            });
        });
    }
}

// show and hide setting plane
export const clickSettingAC = (dispatch) => {
    return (event) => {
        dispatch({ type: actionTypes.clickSetting }, );
    }
}

// show icon
export const showIconAC = (dispatch) => {
    return (word, position) => {
        dispatch({ type: actionTypes.showIcon , data: {word:word, position: position}});
    }
}

// search word from google translate website
export const searchWordAC = (dispatch) => {
    return (word, position, firstIciba) => {
        dispatch((dispatch, getState) => {
            position = position || getState().position;
            firstIciba = typeof firstIciba === 'undefined' ? getState().setting.data[4].checked : firstIciba;
            let text = word || getState().word;
            if (!text) {
                dispatch({ type: actionTypes.searchWord, status: 'emptyText' });
                return;
            }

            text = text.trim();

            let sourceLanguage, translateLanguage, hostLanguage;

            if(POPENV) {
                dispatch({ type: actionTypes.searchWord, status: 'fetching' }); // only pop should show fetching loading
                sourceLanguage = getState().SLanguage;
                translateLanguage = getState().TLanguage;
                hostLanguage = getState().HLanguage;
            } else {
                sourceLanguage = 'auto';
                translateLanguage = getState().HLanguage;
                hostLanguage = getState().HLanguage;
            }

            translate({ from: sourceLanguage, to: translateLanguage, q: text, hl: hostLanguage, firstIciba:  firstIciba}, dispatch).then((data) => {
                dispatch({ type: actionTypes.searchWord, status: 'success', data: data, position: position });
            }).catch((error) => {
                console.log('fetching translate data error:', error);
                if(POPENV) {
                    dispatch({ type: actionTypes.searchWord, status: 'error', error: error });
                }
            });

        });
    }
}

// play the google translate voice, the current word voice
export const playVoiceAC = (dispatch) => {
    return (event) => {
        dispatch((dispatch, getState) => {
            googleSpeech({ tl: getState().translateResult[2], q: getState().translateResult[0][0][1], first: getState().voiceFirst }).then(() => {
                dispatch({ type: actionTypes.playVoice, status: 'playing' });
                setTimeout(function() {
                    dispatch({ type: actionTypes.playVoice});
                }, 1500);
            });
        });
    }
}

// play the google translate voice, the current word voice
export const getSourceLanguageAC = (dispatch) => {
    return (data) => {
        dispatch({type: actionTypes.getSourceLanguage, data: data});
    }
}

// switch setting when click switch button
export const switchSettingAC = (dispatch) => {
    return (index) => {
        dispatch({ type: actionTypes.switchSetting, data: index });
    }
}
