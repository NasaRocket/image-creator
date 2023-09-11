import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './app';
import { bitable } from '@lark-base-open/js-sdk';
import { initI18n } from './i18n';
import { Alert } from 'antd';

const LoadApp = () => {
  const [load, setLoad] = useState(false)
  useEffect(() => {
    bitable.bridge.getLanguage().then((lang) => {
      initI18n(lang as 'en' | 'zh');
      setLoad(true)
    })
  }, [])

  if (load) {
    return <App />
  }

  return <Alert message={'Please Wait'}/>
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <LoadApp/>
  </React.StrictMode>
)


