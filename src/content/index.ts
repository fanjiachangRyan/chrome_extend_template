import {DOMAINS} from "@/config/define";
import {storage} from "@/api/utils";

declare const window: any

// 注入脚本
const container = document.head || document.documentElement
const scriptElement = document.createElement('script')

scriptElement.src = chrome.runtime.getURL('/static/js/injectedScript.js')
scriptElement.type = 'text/javascript'
container.insertBefore(scriptElement, container.children[0])
scriptElement.remove()

window.addEventListener(
    'message',
    (event: MessageEvent) => {
      if (DOMAINS.includes(event.origin) && event.data.from === 'injectedScript') {
        if (event.data.value === 'requestConnect') {
          chrome.runtime.sendMessage(
              {
                value: event.data.value,
                origin: event.origin,
              }
          )
        } else if (event.data.value === 'requestDisconnect') {
          chrome.runtime.sendMessage(
              {
                value: event.data.value,
                origin: event.origin,
              }
          )
        }
      }
    },
    false
)

chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  if (request.from === 'popup') {
    switch (request.value) {
      case 'requestConnectConfirm':
        // 监听确认授权消息
        window.postMessage(
            {
              value: request.value,
              form: 'content',
              account: request.account,
            },
            window.location.origin
        )
        sendResponse({msg: 'content收到确认授权'})
        break;
      case 'requestConnectCancel':
        // 监听确认授权取消的消息
        window.postMessage(
            {
              value: request.value,
              form: 'content',
            },
            window.location.origin
        )

        sendResponse()
        break;
      case 'disconnect':
        // 监听断开消息
        window.postMessage(
            {
              value: request.value,
              form: 'content',
            },
            window.location.origin
        )
        sendResponse({msg: '断开'})
        break;
      case "disconnectConfirm":
        // 监听已断开消息
        window.postMessage(
            {
              value: request.value,
              form: 'content',
            },
            window.location.origin
        )

        storage.set({connectStatus: false})
        sendResponse({msg: '收到确认断开'})
        break;
      default:
        sendResponse()
        break;
    }
  }


})


export {}
