import * as actionTypes from '../constants/actionTypes';
import {setUserDataAndSendMessage, getUILanguage} from '../helpers/tools';

const initState = {
    error: false,
    loading: false,
    word: '',
    translateResult: null,
    SLanguage: 'auto',
    SLanguageAuto: '',
    TLanguage: getUILanguage(),
    HLanguage: getUILanguage(),
    showSetting: false,
    voiceFirst: true,
    voicePlaying: false,
    iconModelFlag: true,
    relectData: {
        options: JSON.parse(chrome.i18n.getMessage("languages")),
    },
    setting: {
        data: [
            { text: chrome.i18n.getMessage('dblclick_translate'), tip: chrome.i18n.getMessage('dblclick_translate_tip'), checked: true, name: "dblclickTranslate"},
            { text: chrome.i18n.getMessage('select_translate'), tip: chrome.i18n.getMessage('select_translate_tip'), checked: true, name: "selectTranslate" },
            { text: chrome.i18n.getMessage('ctrl_translate'), tip: chrome.i18n.getMessage('ctrl_translate_tip'), checked: true, name: "ctrlTranslate"},
            { text: chrome.i18n.getMessage('icon_model'), tip: chrome.i18n.getMessage('icon_model_tip'), checked: false, name: "iconModel" },
            { text: chrome.i18n.getMessage('iciba_fanyi'), tip: chrome.i18n.getMessage('iciba_fanyi_tip'), checked: getUILanguage() === 'zh-CN' ? true : false, name: "icibaFanyi"},
        ]
    },
}

const actionMaps = {
    [actionTypes.syncUserData](state, action) {
        return {...state, ...action.data};
    },

    [actionTypes.clickSetting](state, action) {
        return {...state, showSetting: !state.showSetting };
    },

    [actionTypes.showIcon](state, action) {
        return {...state, word: action.data.word, position: action.data.position, iconModelFlag: true };
    },

    [actionTypes.bindData](state, action) {
        if(action.data.SLanguage || action.data.TLanguage || action.data.HLanguage) {
            // sync chrome local storage
            setUserDataAndSendMessage(action.data, action.data.HLanguage);
        }
        return {...state, ...action.data};
    },

    [actionTypes.searchWord](state, action) {
        switch (action.status) {
            case 'emptyText':
                return {...state, iconModelFlag: false, error: false, loading: false, voiceFirst: true, showSetting: false, translateResult: null };
            case 'fetching':
                return {...state, iconModelFlag: false, error: false, loading: true, voiceFirst: true, showSetting: false };
            case 'success':
                return {...state, iconModelFlag: false, error: false, loading: false, voiceFirst: true, showSetting: false, SLanguageAuto: action.data[2] || state.SLanguageAuto, translateResult: action.data, position: action.position};
            case 'error':
                return {...state, iconModelFlag: false, error: action.error, loading: false, voiceFirst: true, showSetting: false};
            default:false
                return state;
        }
    },

    [actionTypes.playVoice](state, action) {
        if(action.status === 'playing') {
            return {...state, voiceFirst: false, voicePlaying: true, position: null };
        }
        return {...state, voiceFirst: false, voicePlaying: false, position: null };
    },

    [actionTypes.getSourceLanguage](state, action) {
        let nextState = state.translateResult.slice();
        nextState[2] = action.data;
        return {...state, SLanguageAuto: action.data, translateResult: nextState, position: null};
    },

    [actionTypes.switchSetting](state, action) {

        let nextState = {
            setting: {
                data: state.setting.data
            }
        };

        nextState.setting.data[action.data].checked = !nextState.setting.data[action.data].checked;

        // sync chrome local storage
        setUserDataAndSendMessage(nextState, true);

        return {...state, ...nextState};

    }
}

export default function(state = initState, action) {
    const actionFn = actionMaps[action.type];
    return (actionFn ? actionFn(state, action) : state);
}
