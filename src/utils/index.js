const $fetch = option => {
  if (!(option && option.url)) {
    console.log('option need object type or object.url key not pass')
  }
  return new Promise((resolve, reject) => {
    browser.runtime.sendMessage(option, response => {
      if (response.error) {
        reject(response.error)
      } else {
        resolve(response)
      }
    })
  }).then(response => {
    if (option.type === 'arrayBuffer') {
      return new Uint8Array(JSON.parse(response)).buffer
    }
    return response
  })
}

/**
 * Array undefined like [,,] will be parsed error
 * Add null value to undefined array
 */
const fixArrayError = responseText => {
  let text = responseText.replace(/\[,/g, '[null,')
  text = text.replace(/,\]/g, ',null]')
  text = text.replace(/,{2,}/g, result => result.split('').join('null'))
  return JSON.parse(text)
}

export {
  $fetch,
  fixArrayError,
}
