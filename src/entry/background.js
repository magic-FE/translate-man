/**
 * background script
 * main function is fetch data
 */
import '../common/global'

const checkStatus = response => {
  if (response.status >= 200 && response.status < 300) {
    return response
  }
  const error = new Error(response.statusText)
  error.response = response
  throw error
}

browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const { url, type = 'text', params = {} } = request

  if (url && !request.action) {
    fetch(url, params)
      .then(checkStatus)
      .then(response => {
        switch (type) {
        case 'text':
          return response.text()
        case 'json':
          return response.json()
        case 'arrayBuffer':
          return response.arrayBuffer()
        }
      })
      .then(response => {
        if (type === 'arrayBuffer') {
          /* eslint-disable */
          return JSON.stringify(Array.apply(null, new Uint8Array(response)))
          /* eslint-enable */
        }
        return response
      })
      .then(response => {
        sendResponse(response)
      })
      .catch(error => {
        sendResponse({ error })
      })
  }
  return true
})

// when update available
if (browser.runtime.onUpdateAvailable) {
  browser.runtime.onUpdateAvailable.addListener(detail => {
    console.log(`Have a new version:${detail.version}`)
    // install new version soon
    browser.runtime.reload()
  })
}
