import React from 'react'
import ReactDOM from 'react-dom/client'

import HelloWorld from './components/HelloWorld'

const root = ReactDOM.createRoot(document.getElementById('app'))
root.render(<HelloWorld name='John' />)
