import * as actionTypes from '../constants/actionTypes';
import {searchWordAC, syncUserDataAC, showIconAC} from './index';
import { getWordFromPoint, getRangeFromPoint } from '../helpers/tools';

/**
 * 使用下面的代码模拟用户首次安装
 * chrome.storage.local.clear()
 */

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
    let isSelectWord = false;
    let selectStartTimer = null;
    let userOption = {};

    const containerWrap = document.querySelector('#__fanyixia_content');
    
    parseOption(getState(), userOption);

    // get message from extension and reload page
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if(request.type === 'reload') {
            chrome.storage.local.get('userData', (storage) => {
                parseOption(storage.userData, userOption);
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
        if (userOption.ctrlTranslate && e.ctrlKey && e.which === 17) {
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
            showIconAC(dispatch)(word, {pageX: pageX, pageY: pageY});
            return false;
        }

        searchWordAC(dispatch)(word, {pageX: pageX, pageY: pageY}, userOption.icibaFanyi);
    }

    function hidePlane() {
        containerWrap.style.display = 'none';
        oldWord = '';
        clearTimeout(searchTimeHandler); // 清除搜索延迟
    }
}

export default bindContentScriptEvent;
