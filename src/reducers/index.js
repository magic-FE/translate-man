import * as actionTypes from '../constants/actionTypes';
import {setUserDataAndSendMessage, getUILanguage} from '../helpers/tools';

const initState = {
    error: false,
    loading: false,
    word: '',
    translateResult: [],
    SLanguage: 'auto',
    SLanguageAuto: '',
    TLanguage: getUILanguage(),
    HLanguage: getUILanguage(),
    showSetting: false,
    voiceFirst: true,
    voicePlaying: false,
    iconModelFlag: true,
    ctrlKey: 'Control',
    relectData: {
        options: JSON.parse(browser.i18n.getMessage("languages")),
    },
    setting: {
        data: [
            { text: browser.i18n.getMessage('dblclick_translate'), tip: browser.i18n.getMessage('dblclick_translate_tip'), checked: true, name: "dblclickTranslate"},
            { text: browser.i18n.getMessage('select_translate'), tip: browser.i18n.getMessage('select_translate_tip'), checked: true, name: "selectTranslate" },
            { text: browser.i18n.getMessage('ctrl_translate'), tip: browser.i18n.getMessage('ctrl_translate_tip'), checked: true, name: "ctrlTranslate"},
            { text: browser.i18n.getMessage('icon_model'), tip: browser.i18n.getMessage('icon_model_tip'), checked: false, name: "iconModel" },
            { text: browser.i18n.getMessage('iciba_fanyi'), tip: browser.i18n.getMessage('iciba_fanyi_tip'), checked: getUILanguage() === 'zh-CN' ? true : false, name: "icibaFanyi"},
            { text: browser.i18n.getMessage('auto_voice'), tip: browser.i18n.getMessage('auto_voice_tip'), checked: false, name: "autoVoice"},
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
        return {...state, ...action.data, iconModelFlag: true };
    },

    [actionTypes.bindData](state, action) {
        if(action.data.SLanguage || action.data.TLanguage || action.data.HLanguage) {
            // sync browser local storage
            setUserDataAndSendMessage(action.data, action.data.HLanguage);
        }
        return {...state, ...action.data};
    },

    [actionTypes.searchWord](state, action) {
        switch (action.status) {
            case 'emptyText':
                return {...state, iconModelFlag: false, error: false, loading: false, voiceFirst: true, showSetting: false, translateResult: [] };
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
        nextState[2] = action.data[2];
        return {...state, word: action.word, SLanguageAuto: action.data[2], translateResult: nextState, position: null};
    },

    [actionTypes.switchSetting](state, action) {

        let nextState = {
            setting: {
                data: state.setting.data
            }
        };

        nextState.setting.data[action.data].checked = !nextState.setting.data[action.data].checked;

        // sync browser local storage
        setUserDataAndSendMessage(nextState, true);

        return {...state, ...nextState};

    },

    [actionTypes.setCtrlKey](state, action) {

        // sync browser local storage
        setUserDataAndSendMessage(action.data, true);

        return {...state, ...action.data};

    },

}

export default function(state = initState, action) {
    const actionFn = actionMaps[action.type];
    return (actionFn ? actionFn(state, action) : state);
}
