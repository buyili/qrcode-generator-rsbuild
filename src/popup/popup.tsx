import { useState, useEffect, useRef } from "react";
import qrcodePlaceholder from '../assets/img/qrcode-placeholder.svg'
import './Popup.css';
import QRCode from 'qrcode';
import CurrentIPUtil from '../utils/CurrentIPUtil';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames';

export const Popup = () => {
  const [activeTab, setActiveTab] = useState<{
    title: string,
    url: string,
    urlQrcode: string | null
  }>({
    title: '',
    url: '',
    urlQrcode: null,
  })
  const [ip, setIp] = useState('')
  const [copied, setCopied] = useState(false)
  const [inputQrcode, setInputQrcode] = useState<{
    input: string,
    qrcode?: string | null
  }>({
    input: '',
    qrcode: null,
  })
  const inputTextRef = useRef<HTMLTextAreaElement>(null)

  var xmarkIconClass = classNames({ 'clear-btn': true, 'opacity-20': !inputQrcode.input })

  useEffect(() => {
    chrome.storage.local.get(['selectedText'], (result) => {
      const selectedText = result.selectedText || '';

      setInputQrcode({
        ...inputQrcode,
        input: selectedText
      })

      // 清除临时存储的数据（可选）
      chrome.storage.local.remove('selectedText');
    });

    // 显示当前标签页地址的二维码
    chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
      console.log("🚀 ~ Popup ~ active tab:", tab)
      const tmpTab = {
        title: tab.title || '',
        url: tab.url || '',
        urlQrcode: null
      };
      setActiveTab(tmpTab)

      if (!tab.url) return

      QRCode.toDataURL(tab.url)
        .then((url: string) => {
          console.log("🚀 ~ Popup ~ current tab to qrcode url:", url, tmpTab)
          setActiveTab({
            ...tmpTab,
            urlQrcode: url
          })
        })
        .catch((err: any) => {
          console.error(err)
        })
    })

    // 显示本机ipv4地址
    CurrentIPUtil.getUserIP((ip: string) => {
      setIp(ip)
    });

  }, [])

  useEffect(() => {
    if (inputQrcode.input) {
      QRCode.toDataURL(inputQrcode.input)
        .then((url: string) => {
          console.log("🚀 ~ Popup ~ user input text to qrcode url:", url)
          setInputQrcode({
            ...inputQrcode,
            qrcode: url,
          })
        })
        .catch((err: any) => {
          console.error(err)
        })
    }
  }, [inputQrcode.input])

  function clearInput() {
    setInputQrcode({
      input: '',
      qrcode: null,
    })
    inputTextRef.current!.focus()
  }

  return (
    <div className="App">
      <header className="App-header">

      </header>

      <div className='App-body'>

        <div className='ellipsis activetab-title'>{activeTab.title}</div>
        <div className='ellipsis activetab-url'>{activeTab.url}</div>

        <div className='qrcode-container'>
          <img className='qrcode' src={activeTab.urlQrcode ?? qrcodePlaceholder} alt={activeTab.url} />
          <div className='space'></div>
          <img className="qrcode" src={inputQrcode.qrcode ?? qrcodePlaceholder} alt={inputQrcode.input} ></img>
        </div>

        <div className='mt8'>
          <div className='flex items-end justify-between'>
            <FontAwesomeIcon className={xmarkIconClass} icon={faXmark} onClick={clearInput}></FontAwesomeIcon>
            文本转二维码:
          </div>
          <div className="input-group">
            <textarea className='input'
              placeholder='请输入文本'
              ref={inputTextRef}
              value={inputQrcode.input}
              onChange={(e) => setInputQrcode({ input: e.target.value })}
            ></textarea>
          </div>
        </div>

        <div className="divider"></div>

        {/* ip地址 */}
        <div>
          IPv4地址：
          <CopyToClipboard text={ip} onCopy={() => {
            setCopied(true)
            setTimeout(() => {
              setCopied(false)
            }, 1000);
          }}>
            <span className='clipboard'>
              {ip}
            </span>
          </CopyToClipboard>
          {copied ? <span style={{ color: '#61dafb', fontSize: '10px', marginLeft: '5px' }}>复制成功.</span> : null}
        </div>

      </div>
    </div>
  );
};
