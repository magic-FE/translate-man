function fetchData(option) {
    if(!(option && option.url)) {
        console.log('option need object type or object.url key not pass');
    }
    return new Promise((resolve, reject) => {

        chrome.runtime.sendMessage(option, (response) => {
            if(response.error) {
                reject(response.error);
            } else {
                resolve(response);
            }
        });

    }).then((response) => {

        if(option.type === 'arrayBuffer') {
            response = JSON.parse(response);
            return new Uint8Array(response).buffer;
        } else {
            return response;
        }
        
    });
}

export default fetchData;