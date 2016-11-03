import googleTranslateTk from './googleTranslateTk';
import  fetchData from './fetchData';

let ttsspeed = false;
const ac = new (window.AudioContext || window.webkitAudioContext)();

function googleSpeech(option) {
    
    option = Object.assign({}, {
        tl: 'en',
        q: '',
        first: true,
    }, option);

    return new Promise((reslove, reject) => {
        googleTranslateTk(option.q).then(function(hostAndTk) {
            // baidu speech url: http://tts.baidu.com/text2audio?lan=zh&pid=101&ie=UTF-8&text=%25E5%259C%25B0%25E7%258B%25B1
            const {host, tk} = hostAndTk;
            let url = host + '/translate_tts?ie=UTF-8&total=1&idx=0&client=t&prev=input';
            url += `&textlen=${option.q.length}&tl=${option.tl}&tk=${tk}&q=${option.q}&ttsspeed=${ttsspeed || option.first ? 1 : 0.24}`;
            ttsspeed = !ttsspeed;
            return url;
        }).then(function(url) {
            fetchData({url, type: 'arrayBuffer'}).then(function(arraybuffer){
                ac.decodeAudioData(arraybuffer).then(function(buffer) {
                  const source = ac.createBufferSource();
                  source.buffer = buffer;
                  source.connect(ac.destination);
                  source.start(0);
                  reslove();
                }).catch(function(error){
                  // no one cases
                  reject(error);
                });
            }).catch(function(error){
                reject(error);
            });
        });
    });
}

export default googleSpeech;