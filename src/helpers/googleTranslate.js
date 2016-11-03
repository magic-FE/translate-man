import googleTranslateTk from './googleTranslateTk';
import fetchData from './fetchData';
import {getUILanguage} from './tools';

function getGoogleURL(option) {
    option.to = option.to === 'auto' ? getUILanguage() : option.to;
    option.hl = option.hl === 'auto' ? getUILanguage() : option.hl;

    return googleTranslateTk(option.q).then(function(hostAndTk) {
        const {host, tk} = hostAndTk;
        let url = host + '/translate_a/single?client=t&dt=at&dt=bd&dt=ex&dt=ld&dt=md&dt=qca&dt=rw&dt=rm&dt=ss&dt=t&ie=UTF-8&oe=UTF-8&source=btn&rom=1&srcrom=1&ssel=0&tsel=0&kc=0';
        url += `&sl=${option.from}&tl=${option.to}&hl=${option.hl}&tk=${tk}&q=${option.q}`;
        return url;
    });
}

function googleTranslate(option) {

    if (!option) {
        return;
    }

    option = Object.assign({
        from: 'auto',
        to: 'en',
        q: '',
        hl: 'en',
    }, option);

    return new Promise(function(reslove, reject) {
        getGoogleURL(option).then(function(url) {
            fetchData({ url, type: "text" }).then(function(responseText) {
                /**
                 * Array undefined like [,,] will be parsed error
                 * Add null value to undefined array
                 */
                responseText = responseText.replace(/\[,/g, '[null,');
                responseText = responseText.replace(/,\]/g, ',null]');
                responseText = responseText.replace(/,{2,}/g, function(result) {
                    return result.split('').join('null')
                });
                return JSON.parse(responseText);
            }).then(function(response) {
                reslove(response);
            }).catch(function(error) {
                reject(error);
            });
        });
    });
}

export default googleTranslate;
