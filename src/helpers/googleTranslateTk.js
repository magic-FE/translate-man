import * as google from '../constants/google';
import fetchData from './fetchData';

/**
 * params query [string]
 * return {host: [string], tk: [number]}
 */

/* eslint-disable */
function googleTranslateTk(query) {
    return updateTKK().then(function(host) {
        var tk = sM(query);
        tk = tk.replace('&tk=', '');
        return {host: host, tk: tk};
    }).catch(function(err) {
        throw err;
    });
}

var yr = null;
var wr = function(a) {
        return function() {
            return a
        }
    },
    xr = function(a, b) {
        for (var c = 0; c < b.length - 2; c += 3) {
            var d = b.charAt(c + 2),
                d = "a" <= d ? d.charCodeAt(0) - 87 : Number(d),
                d = "+" == b.charAt(c + 1) ? a >>> d : a << d;
            a = "+" == b.charAt(c) ? a + d & 4294967295 : a ^ d
        }
        return a
    };

function sM(a) {
    var b;
    if (null !== yr)
        b = yr;
    else {
        b = wr(String.fromCharCode(84));
        var c = wr(String.fromCharCode(75));
        b = [b(), b()];
        b[1] = c();
        b = (yr = window[b.join(c())] || "") || ""
    }
    var d = wr(String.fromCharCode(116)),
        c = wr(String.fromCharCode(107)),
        d = [d(), d()];
    d[1] = c();
    c = "&" + d.join("") + "=";
    d = b.split(".");
    b = Number(d[0]) || 0;
    for (var e = [], f = 0, g = 0; g < a.length; g++) {
        var l = a.charCodeAt(g);
        128 > l ? e[f++] = l : (2048 > l ? e[f++] = l >> 6 | 192 : (55296 == (l & 64512) && g + 1 < a.length && 56320 == (a.charCodeAt(g + 1) & 64512) ? (l = 65536 + ((l & 1023) << 10) + (a.charCodeAt(++g) & 1023),
                    e[f++] = l >> 18 | 240,
                    e[f++] = l >> 12 & 63 | 128) : e[f++] = l >> 12 | 224,
                e[f++] = l >> 6 & 63 | 128),
            e[f++] = l & 63 | 128)
    }
    a = b;
    for (f = 0; f < e.length; f++)
        a += e[f],
        a = xr(a, "+-a^+6");
    a = xr(a, "+-3^+b+-f");
    a ^= Number(d[1]) || 0;
    0 > a && (a = (a & 2147483647) + 2147483648);
    a %= 1E6;
    return c + (a.toString() + "." + (a ^ b))
}

function getStore(callback) {
    if (window.chrome) { // chrome extension
        try {
            chrome.storage.local.get(null, function(storage) {
                callback(storage);
            });
        } catch (e) {
            // who cases?
        }
    } else {
        callback({});
    }
}

function setStore(TKK, host) {
    if (window.chrome) { // chrome extension
        try {
            var expires = new Date();
            expires.setHours(expires.getMinutes() + 1);  // token 失效时间
            chrome.storage.local.set({ TKK: TKK, expiresTKK: expires.getTime(), googleHost: host});
        } catch (e) {
            // who cases?
        }
    }
}

function updateTKK() {
    return new Promise(function(resolve, reject) {
        getStore(function(storage) {
            if (storage.expiresTKK > new Date().getTime()) {
                window.TKK = storage.TKK;
                resolve(storage.googleHost);
            } else {
                getHtmlAndHost(storage).then((htmlAndHost) => {
                    setHtmlAndHost(htmlAndHost);
                    resolve(htmlAndHost.host);
                }).catch((err) => {
                    var e = new Error();
                    e.code = 'BAD_NETWORK';
                    e.message = err.message;
                    reject(e);
                });
            }
        });
    });
}

function setHtmlAndHost(htmlAndHost) {
    var code = htmlAndHost.html.match(/TKK=(.*?)\(\)\)'\);/g);
    if (code) {
        eval('window.' + code[0]);
        /* eslint-disable no-undef */
        if (typeof window.TKK !== 'undefined') {
            setStore(window.TKK, htmlAndHost.host);
        }
        /* eslint-enable no-undef */
    }
}

function sendRequests(hosts, resolve, reject) {
    let errorNum = 0;
    const requests = [];
    for(var i = 0; i < hosts.length; i++) {
        (function(index){
            requests.push(fetchData({url: hosts[index], type: "text"}).then((html) => {
                resolve({html: html, host: hosts[index]})
            }).catch((e) => {
                errorNum++;
                if(errorNum === requests.length) {
                    reject(e);
                }
            }));
        })(i);
    }
}

function getHtmlAndHost(storage) {
    return new Promise((resolve, reject) => {
        if(storage.googleHost) {
            fetchData({url: storage.googleHost, type: "text"}).then((html) => {
                resolve({html: html, host: storage.googleHost});
            }).catch(() => {
                sendRequests(google.host, resolve, reject);
            });
        } else {
            sendRequests(google.host, resolve, reject);
        }
    });
}

export default googleTranslateTk;
