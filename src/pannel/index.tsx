import React from 'react'
import ReactDOM from 'react-dom/client'

import Pannel from './pannel'
import './index.less'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
    <React.StrictMode>
        <Pannel />
    </React.StrictMode>
)
