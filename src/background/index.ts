import {connect, getCurrentAccount} from "@/api";
import {getCurrentTab} from "@/api/utils";

if (process.env.NODE_ENV === 'development') {
  const eventSource = new EventSource(`http://${process.env.REACT_APP__HOST__}:${process.env.REACT_APP__PORT__}/reload/`)
  // console.log('--- 开始监听更新消息 ---')
  eventSource.addEventListener('content_changed_reload', async ({ data }) => {
    const [tab] = await chrome.tabs.query({
      active: true,
      lastFocusedWindow: true,
    })
    const tabId = tab.id || 0
    // console.log(`tabId is ${tabId}`)
    await chrome.tabs.sendMessage(tabId, {
      type: 'window.location.reload',
    })
    // console.log('chrome extension will reload', data)
    chrome.runtime.reload()
  })
}

chrome.runtime.onMessage.addListener(async (request, _sender, sendResponse) => {
  if (request.value === 'requestConnect') {
    chrome.windows.create({url: `${chrome.runtime.getURL('index.html')}`, type: 'popup', width: 400, height: 600})

    sendResponse({msg: `backgroundJS --->调起窗口${_sender.url}${_sender?.tab?.windowId}`})
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
        async () => {}
    )
    sendResponse({ msg: '已断开连接' })
    return true
  }
})

// 确认授权
chrome.runtime.onMessage.addListener(async (request, _sender, sendResponse) => {
  if (request.from === 'popup' && request.value === 'connectConfirm') {
    sendResponse('background.js收到popup.js信息  background收到确认授权的消息')

    const tabs: any = await chrome.tabs.query({ active: true })

    // const tab: any = await getCurrentTab()
    const account: any = await getCurrentAccount()
    console.log('给content发送确认授权的消息....', tabs)
    tabs.forEach((tab: any) => {
      chrome.tabs.sendMessage(
          tab.id,
          {
            from: 'popup',
            value: 'requestConnectConfirm',
            account: account,
          },
          async (result) => {
            console.log('background--content的反馈信息：',result)
          }
      )
    })
  }
})


export {}
