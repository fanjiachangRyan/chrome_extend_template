import {message} from "antd";

chrome.runtime.onMessage.addListener(
    (
        msg: MessageEventType,
        sender: chrome.runtime.MessageSender,
        sendResponse: (res: any) => void
    ) => {
        console.log('[content.js]. Message received', msg);
        sendResponse(msg);
        if (process.env.NODE_ENV === 'development') {
            if (msg.type === 'window.location.reload') {
                console.log('current page will reload.');
                window.location.reload();
            }
        }
    }
);

export {}
