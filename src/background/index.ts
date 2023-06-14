import {getCurrentAccount} from "@/api";
import {getCurrentTab, storage} from "@/api/utils";

chrome.runtime.onMessage.addListener(async (request, _sender, sendResponse) => {
  if (request.value === 'requestConnect') {
    const {connectStatus = false} = await storage.get(['connectStatus'])

    if (!connectStatus) {
      chrome.windows.create({url: `${chrome.runtime.getURL('index.html')}`, type: 'popup', width: 350, height: 600})

      return sendResponse({msg: `backgroundJS --->调起窗口${_sender.url}${_sender?.tab?.windowId}`})
    }

    return sendResponse()
  }

  if (request.value === 'requestDisconnect') {
    await storage.set({connectStatus: false})
    // 断开连接
    const tab: any = await getCurrentTab()

    chrome.tabs.sendMessage(
        tab.id,
        {
          from: 'popup',
          value: 'disconnectConfirm',
        },
        () => {}
    )
    sendResponse({ msg: '已断开连接' })
    return
  }

  if (request.from === 'popup' && request.value === 'connectConfirm') {
    // 确认授权
    const tabs: any = await chrome.tabs.query({active: true})
    const account: any = await getCurrentAccount()

    tabs.forEach((tab: any) => {
      chrome.tabs.sendMessage(
          tab.id,
          {
            from: 'popup',
            value: 'requestConnectConfirm',
            account: account,
          },
          () => {
            console.log('account--->', account)
          }
      )
    })

    return sendResponse('background.js收到popup.js信息  background收到确认授权的消息')
  }

  sendResponse()
})

export {}
