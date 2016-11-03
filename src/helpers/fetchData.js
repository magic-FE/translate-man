function fetchData(option) {
    if(!(option && option.url)) {
        console.log('option need object type or object.url key not pass');
    }
    return new Promise((resolve, reject) => {
        // only for development
        // console.log('fetch:', option);
        chrome.runtime.sendMessage(option, (response) => {
            if(response) {
                resolve(response);
            } else {
                reject('not data response');
            }
        });
    }).then((response) => {
        // only for development
        // console.log('response:', response);
        if(option.type === 'arrayBuffer') {
            response = JSON.parse(response);
            return new Uint8Array(response).buffer;
        } else {
            return response;
        }
    });
}

export default fetchData;