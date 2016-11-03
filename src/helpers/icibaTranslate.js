import fetchData from './fetchData';

function icibaTranslate(option) {

    if (!option) {
        return;
    }

    option = Object.assign({
        from: 'auto',
        to: 'auto',
        q: '',
        type: 'json',
    }, option);

    return new Promise(function(reslove, reject) {
        option.url = 'http://fy.iciba.com/ajax.php?a=fy';
        option.params = {
            method: 'POST',
            body: `&f=${option.from}&t=auto&w=${option.q}`,
            headers: {
                "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
            },
        };
        fetchData(option).then((json) => {
            let res = [
                [],
                []
            ];
            if (json.content.out) {
                // remove <br/>
                res[0].push([json.content.out.replace(/<br\/>/g, ''), option.q]);
                reslove(res);
            } else if (json.content.word_mean) {
                let firstMean = '';
                json.content.word_mean.forEach((means) => {
                    // 分离属性和释义
                    const lastIndex = means.lastIndexOf('.');
                    let prop = '释义';
                    if (~lastIndex) {
                        prop = means.slice(0, lastIndex);
                    }

                    let mean = means.slice(lastIndex + 2).split(';');
                    firstMean = firstMean || mean[0];
                    res[1].push([prop, mean]);
                });

                res[0].push([firstMean, option.q]);
                res[0].push([null, null, null, json.content.ph_am]);
                reslove(res);
            } else {
                reject('not get translate data');
            }
        }).catch((error) => {
            reject(error);
        });
    });
}

export default icibaTranslate;
