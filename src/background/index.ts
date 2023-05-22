import {connect, getCurrentAccount} from "@/api";

chrome.runtime.onMessage.addListener(async (request, _sender, sendResponse) => {
  if (request.value === 'requestConnect') {
    // const account: any = await getCurrentAccount()
    //
    // if (!account?.address) {
    //   // chrome.windows.create({
    //   //   url: `${chrome.runtime.getURL('index.html')}#/welcome`,
    //   //   type: 'popup',
    //   // })
    //   sendResponse({msg: `打开创建窗口`})
    //
    //   return
    // }

    //
    chrome.windows.create({url: `${chrome.runtime.getURL('index.html')}`, type: 'popup'})
    // sendResponse({msg: `打开解锁窗口`})

    // const { closeTime, autoLockTime, isLock } = await storage.get(['closeTime', 'autoLockTime', 'isLock'])
    // const now = new Date().getTime()
    //
    // if (now - closeTime > autoLockTime * 60 * 1000 || isLock) {
    //   chrome.windows.create({ url: `${chrome.runtime.getURL('index.html')}/unlock`, type: 'popup'})
    //   sendResponse({ msg: '打开解锁窗口' })
    //   return
    // }

    // connect()
    sendResponse({msg: '成功授权'})
    return
  }
})

export {}
