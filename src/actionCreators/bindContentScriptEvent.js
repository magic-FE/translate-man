import { searchWordAC, showIconAC } from './index';
import { getWordFromPoint } from '../helpers/tools';

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
    let isMouseDown = false;
    let isOnlyKeyDownCtrlKey = false;
    let mainLanguage = '';
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
          isOnlyKeyDownCtrlKey = true
        } else {
          isOnlyKeyDownCtrlKey = false
        }
    }, false);

    window.addEventListener('keyup', function(e) {
        if (userOption.ctrlTranslate && isOnlyKeyDownCtrlKey) {
            // 如果选择了文字,按下ctrl即翻译选中文本,否则翻译鼠标指向的单词
            let selection = window.getSelection().toString();
            let word;

            if (selection) {
                word = selection;
            }

            if (!word) {
                word = getWordFromPoint(mouseX, mouseY, containerWrap);
            }
            search(word);
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
    containerWrap.addEventListener('keyup', function(e) { e.stopPropagation(); }, false);

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

        if (window.ga) {
          window.ga('send', {
            hitType: 'event',
            eventCategory: 'Tranlates',
            eventAction: 'webpage translate',
            eventValue: 1,
          });
        }

        if (userOption.iconModel) {
            showIconAC(dispatch)(word, {pageX: pageX, pageY: pageY}, userOption.icibaFanyi, mainLanguage, userOption.autoVoice);
            return false;
        }

        searchWordAC(dispatch)(word, {pageX: pageX, pageY: pageY}, userOption.icibaFanyi, mainLanguage, userOption.autoVoice);
    }

    function hidePlane() {
        containerWrap.style.display = 'none';
        oldWord = '';
    }

    // 谷歌分析
    /* eslint-disable */
    try {
      (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
      (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
      m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
      })(window,document,'script','https://www.google-analytics.com/analytics.js','ga')

      window.ga('create', 'UA-85615715-2', 'auto')
      window.ga('send', 'pageview')
    } catch(e) {}
    /* eslint-enable */
}

export default bindContentScriptEvent;
