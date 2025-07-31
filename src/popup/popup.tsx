import { useState, useEffect, useRef } from "react";
import qrcodePlaceholder from '../assets/img/qrcode-placeholder.svg'
import './Popup.css';
import ipUtils from '../utils/ip';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames';
import { useQrcodeUrl } from "./hook";

export const Popup = () => {
  const [activeTab, setActiveTab] = useState<{
    title: string,
    url: string,
  }>({
    title: '',
    url: '',
  })
  const activeTabUrlQrcode = useQrcodeUrl(activeTab.url)
  const [ip, setIp] = useState('')
  const [copied, setCopied] = useState(false)
  const [inputQrcode, setInputQrcode] = useState<{
    input: string,
    qrcode?: string | null
  }>({
    input: '',
    qrcode: null,
  })
  const inputTextQrcode = useQrcodeUrl(inputQrcode.input)
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
      };
      setActiveTab(tmpTab)
    })

    // 显示本机ipv4地址
    ipUtils.getUserIP((ip: string) => {
      setIp(ip)
    });

  }, [])

  // 清空二维码输入框
  function clearInput() {
    setInputQrcode({
      input: '',
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
          <img className='qrcode' src={activeTabUrlQrcode ?? qrcodePlaceholder} alt={activeTab.url} />
          <div className='space'></div>
          <img className="qrcode" src={inputTextQrcode ?? qrcodePlaceholder} alt={inputQrcode.input} ></img>
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
