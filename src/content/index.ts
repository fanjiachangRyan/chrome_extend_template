import {DOMAINS} from "@/config/define";

declare const window: any

// 注入脚本
const container = document.head || document.documentElement
const scriptElement = document.createElement('script')

scriptElement.src = chrome.runtime.getURL('/static/js/injectedScript.js')
scriptElement.type = 'text/javascript'
container.insertBefore(scriptElement, container.children[0])
scriptElement.remove()

//
window.addEventListener(
    'message',
    (event: MessageEvent) => {
      if (DOMAINS.includes(event.origin) && event.data.from === 'injectedScript' && event.data.value === 'requestConnect') {
        try {
          chrome.runtime.sendMessage(
              {
                value: event.data.value,
                origin: event.origin,
              },
              (res) => {
                console.log('requestConnect response==>', res)
              }
          )
        } catch (error) {
          console.error('error::', error)
        }
      }
    },
    false
)

// 监听确认授权消息
chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  if (request.from === 'popup' && request.value === 'requestConnectConfirm') {
    console.log('content收到确认授权')
    window.postMessage(
        {
          value: request.value,
          form: 'content',
          account: request.account,
        },
        window.location.origin
    )

    return sendResponse({msg: 'content收到确认授权'})
  } else if (request.from === 'popup' && request.value === 'requestConnectCancel') {
    window.postMessage(
        {
          value: request.value,
          form: 'content',
        },
        window.location.origin
    )

    return sendResponse({msg: '收到取消授权'})
  }
})

// 监听取消授权消息
chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  if (request.from === 'popup' && request.value === 'requestConnectCancel') {

    window.postMessage(
        {
          value: request.value,
          form: 'content',
        },
        window.location.origin
    )

    return sendResponse()
  }
})

// 监听断开消息
chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  if (request.from === 'popup' && request.value === 'disconnect') {

    window.postMessage(
        {
          value: request.value,
          form: 'content',
        },
        window.location.origin
    )

    return sendResponse()
  }
})

// 监听请求断开消息
window.addEventListener(
    'message',
    async (event: MessageEvent) => {
      if (DOMAINS.includes(event.origin) && event.data.from === 'injectedScript' && event.data.value === 'requestDisconnect') {
        chrome.runtime.sendMessage(
            {
              value: event.data.value,
              origin: event.origin,
            },
            (res) => {
              console.log('请求断开链接===>', res)
            }
        )
      }
    },
    false
)

// 监听已断开消息
chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  if (request.from === 'popup' && request.value === 'disconnectConfirm') {
    window.postMessage(
        {
          value: request.value,
          form: 'content',
        },
        window.location.origin
    )

    return sendResponse({msg: '收到确认断开'})
  }
})

// 监听普通交易请求
window.addEventListener(
    'message',
    async (event: MessageEvent) => {
      if (event.data.from === 'injectedScript' && event.data.value === 'createSend') {
        chrome.runtime.sendMessage(
            {
              value: event.data.value,
              origin: event.origin,
              tx: event.data.tx,
            },
            (res) => {
            }
        )
      }
    },
    false
)

// 监听其他交易请求
window.addEventListener(
    'message',
    async (event: MessageEvent) => {
      // console.log('event::', event)
      if (event.data.from === 'injectedScript' && event.data.value === 'sendTx') {
        // console.log('content收到发起其他交易的消息', event)
        chrome.runtime.sendMessage(
            {
              value: event.data.value,
              origin: event.origin,
              tx: event.data.tx,
            },
            (res) => {
              // console.log('其他交易请求', res)
            }
        )
      }
    },
    false
)

// 监听其他交易结果
chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  if (request.from === 'popup' && request.value === 'sendTx') {
    // console.log('content收到其他交易结果的消息', request)
    window.postMessage(
        {
          value: request.value,
          form: 'content',
          response: request.response,
        },
        window.location.origin
    )

    return sendResponse({msg: '收到其他交易结果'})
  }
})

// 监听普通交易结果
chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  if (request.from === 'popup' && request.value === 'createSend') {
    window.postMessage(
        {
          value: request.value,
          form: 'content',
          response: request.response,
        },
        window.location.origin
    )

    return sendResponse({msg: '收到普通交易结果'})
  }
})

export {}
