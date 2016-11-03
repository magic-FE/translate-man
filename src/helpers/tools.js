export const POPENV = (window.location.protocol === "chrome-extension:" ? true : false);

export const getUILanguage = function() {
    let language = chrome.i18n.getUILanguage() || 'en';
    if (language.slice(0, 2) === 'en') {
        language = 'en';
    }
    return language;
}

export const getAbsoluteURL = function(url) {
    return chrome.extension.getURL(url);
}

export const setUserDataAndSendMessage = function(value, flag) { // value: storage value, flag: is sendMessage to contentScript
    // sync chrome local storage
    chrome.storage.local.get('userData', (storage) => {
        let { userData } = storage;
        let putStorage = {
            userData: Object.assign({}, userData, value),
        }
        chrome.storage.local.set(Object.assign({}, storage, putStorage), () => {
            if (flag) {
                // send message to tabs and reload page
                chrome.tabs.query({}, (tabs) => {
                    tabs.forEach((tab) => {
                        chrome.tabs.sendMessage(tab.id, { type: 'reload' });
                    });
                });
            }
        });
    });
}

export const getRangeFromPoint = function(clientX, clientY) {
    let range;
    let node;
    let offset;
    // ref:https://developer.mozilla.org/en-US/docs/Web/API/Document/caretPositionFromPoint
    if (document.caretPositionFromPoint) {
        range = document.caretPositionFromPoint(clientX, clientY);
        node = range.offsetNode;
        offset = range.offset;

    } else if (document.caretRangeFromPoint) {
        range = document.caretRangeFromPoint(clientX, clientY);
        node = range.startContainer;
        offset = range.startOffset;
    } else {
        return '';
    }

    return {
        node: node,
        offset: offset
    }
}

/**
 * getWordFromPoint 
 * get a word depend on the point, if the pointer has no word or space will return empty string
 * @param  {int} clientX [x pointer]
 * @param  {int} clientY [y pointer]
 * @return {string} the pointer string
 */
export const getWordFromPoint = function(clientX, clientY, exceptEle) {
    // refefer: http://stackoverflow.com/questions/2444430/how-to-get-a-word-under-cursor-using-javascript
    let range;
    let textNode;
    let offset;
    let data;
    let begin;
    let end;
    const breakWord = /((?=[\x00-\x7e]+)[^A-Za-z-'])/; //分割符号
    const hasParents = function(dom, parent) {

        if (!parent) return false;

        if (typeof dom === 'string') {
            dom = document.querySelector(dom);
        }

        if (typeof parent === 'string') {
            parent = document.querySelector(parent);
        }

        let a = [dom],
            i = 1;
        while ((a[0] = a[0]['parentNode']) && a[0].nodeType !== 9) {
            if (parent === a[0]) {
                a[i] = a[0];
                i++;
            }
        }
        return i === 2 ? true : false;
    };

    range = getRangeFromPoint(clientX, clientY);

    textNode = range.node;
    offset = range.offset;

    // only TEXT_NODEs
    if (!textNode || textNode.nodeType !== Node.TEXT_NODE) {
        return '';
    }

    // 去除父元素包含fanyixai_container_wrap的选择
    if (hasParents(textNode, exceptEle)) {
        return '';
    }

    data = textNode.data;

    // Sometimes the offset can be at the 'length' of the data.
    // It might be a bug with this 'experimental' feature
    // Compensate for this below
    if (offset >= data.length) {
        offset = data.length - 1;
    }

    /**
     * ignore the last word 鼠标指向最后一个单词失效
     * 值得考虑是否真的需要这样
     */
    if (offset === data.length - 1) {
        return '';
    }

    // ignore break word, there are not word
    if (data[offset].match(breakWord)) {
        return '';
    }

    // get begin
    for (let i = offset; i > -1; i--) {
        if (i === 0 || data[i - 1].match(breakWord)) {
            begin = i;
            break;
        }
    }

    // get end
    for (let j = offset; j < data.length; j++) {
        if (j === data.length || data[j].match(breakWord)) {
            end = j;
            break;
        }
    }

    return data.substring(begin, end);
}
