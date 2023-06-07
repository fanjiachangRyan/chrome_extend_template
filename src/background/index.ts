import {connect, getCurrentAccount} from "@/api";
import {getCurrentTab, storage} from "@/api/utils";

chrome.runtime.onMessage.addListener(async (request, _sender, sendResponse) => {
  if (request.value === 'requestConnect') {
    const {connectStatus = false} = await storage.get(['connectStatus'])

    if (!connectStatus) {
      chrome.windows.create({url: `${chrome.runtime.getURL('index.html')}`, type: 'popup', width: 400, height: 600})
      sendResponse({msg: `backgroundJS --->调起窗口${_sender.url}${_sender?.tab?.windowId}`})
    }

    return
  }
})


// 断开连接
chrome.runtime.onMessage.addListener(async (request, _sender, sendResponse) => {
  if (request.value === 'requestDisconnect') {
    const tab: any = await getCurrentTab()

    chrome.tabs.sendMessage(
        tab.id,
        {
          from: 'popup',
          value: 'disconnectConfirm',
        },
        async () => {
          sendResponse({ msg: '已断开连接' })
        }
    )

    return true
  }
})

// 确认授权
chrome.runtime.onMessage.addListener(async (request, _sender, sendResponse) => {
  if (request.from === 'popup' && request.value === 'connectConfirm') {
    sendResponse('background.js收到popup.js信息  background收到确认授权的消息')

    const tabs: any = await chrome.tabs.query({ active: true })
    const account: any = await getCurrentAccount()



    tabs.forEach((tab: any) => {
      chrome.tabs.sendMessage(
          tab.id,
          {
            from: 'popup',
            value: 'requestConnectConfirm',
            account: account,
          },
          async (result) => {

          }
      )
    })
  }
})


export {}
