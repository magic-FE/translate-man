import * as actionTypes from '../constants/actionTypes';
import {searchWordAC, syncUserDataAC, showIconAC, bindDataAC} from './index';
import { getWordFromPoint, getRangeFromPoint } from '../helpers/tools';

function parseOption(userData, userOption) {
    userData.setting.data.forEach(function(value, index) {
        userOption[value.name] = value.checked;
    });
}

function bindContentScriptEvent(dispatch, getState) {

    let mouseX = 0;
    let mouseY = 0;
    let pageX = 0;
    let pageY = 0;
    let oldWord = '';
    let oldWordTimeHandler = null;
    let searchTimeHandler = null;
    let isMouseDown = false;
    let mainLanguage = '';
    let isSelectWord = false;
    let selectStartTimer = null;
    let ctrlKey = 'Control';
    let userOption = {};

    const containerWrap = document.querySelector('#__fanyixia_content');

    parseOption(getState(), userOption);

    // get message from extension and reload page
    browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if(request.type === 'reload') {
            browser.storage.local.get('userData', (storage) => {
                parseOption(storage.userData, userOption);
                if (storage.userData.HLanguage) {
                  mainLanguage = storage.userData.HLanguage;
                }
                if (storage.userData.ctrlKey) {
                  ctrlKey = storage.userData.ctrlKey;
                }
            });
        }
    });

    // bind event
    document.addEventListener('dblclick', function(e) {
        if(userOption.dblclickTranslate) {
            let word = window.getSelection().toString();
            if (word) {
                search(word);
            } else {
                hidePlane();
            }
        }
    }, false);


    // only key down ctrl event
    window.addEventListener('keydown', function(e) {
        if (userOption.ctrlTranslate && e.key === ctrlKey) {
            // 如果选择了文字,按下ctrl即翻译选中文本,否则翻译鼠标指向的单词
            let selection = window.getSelection().toString();
            let word;

            if (selection) {
                word = selection;
            }

            if (!word) {
                word = getWordFromPoint(mouseX, mouseY, containerWrap);
            }

            searchTimeHandler = setTimeout(function() {
                search(word);
            }, 250);
        } else {
            hidePlane();
        }
    }, false);

    // mouse move event
    document.addEventListener('mousemove', function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
        pageX = e.pageX;
        pageY = e.pageY;
    }, false);

    document.addEventListener('mousedown', function() {
        isMouseDown = true;
        selectStartTimer = new Date().getTime();
        hidePlane();
    }, false);

    document.addEventListener('mouseup', function() {
        if (userOption.selectTranslate) {
            /* 判断是否是划词动作 */
            if (isMouseDown) {
                if (new Date().getTime() - selectStartTimer > 300) {
                    let word = window.getSelection().toString();
                    search(word);
                }
            }
        }
    });

    // 翻译弹窗内操作不上传事件
    containerWrap.addEventListener('mousedown', function(e) { e.stopPropagation(); }, false);
    containerWrap.addEventListener('mouseup', function(e) { e.stopPropagation(); }, false);
    containerWrap.addEventListener('dblclick', function(e) { e.stopPropagation(); }, false);
    containerWrap.addEventListener('keydown', function(e) { e.stopPropagation(); }, false);


    function search(word) {
        if (word === '' || !word.match(/\S/) || word === oldWord) {
            return;
        }
        oldWord = word;
        // 同一个单词 3000ms 重新请求
        clearTimeout(oldWordTimeHandler);
        oldWordTimeHandler = setTimeout(function() {
            oldWord = '';
        }, 3000);

        if (userOption.iconModel) {
            showIconAC(dispatch)(word, {pageX: pageX, pageY: pageY}, userOption.icibaFanyi, mainLanguage, userOption.autoVoice);
            return false;
        }

        searchWordAC(dispatch)(word, {pageX: pageX, pageY: pageY}, userOption.icibaFanyi, mainLanguage, userOption.autoVoice);
    }

    function hidePlane() {
        containerWrap.style.display = 'none';
        oldWord = '';
        clearTimeout(searchTimeHandler); // 清除搜索延迟
    }
}

export default bindContentScriptEvent;
