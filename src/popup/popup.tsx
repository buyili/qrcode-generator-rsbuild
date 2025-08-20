import { useEffect, useRef, useState } from 'react';
import qrcodePlaceholder from '../assets/img/qrcode-placeholder.svg';
import './Popup.css';
import {
  faArrowDown,
  faArrowUp,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import ipUtils from '../utils/ip';
import { useQrcodeUrl } from './hook';

export const Popup = () => {
  const [activeTab, setActiveTab] = useState<{
    title: string;
    url: string;
  }>({
    title: '',
    url: '',
  });
  const activeTabUrlQrcode = useQrcodeUrl(activeTab.url);
  const [inputText, setInputText] = useState('');
  const inputTextQrcode = useQrcodeUrl(inputText);
  const inputTextRef = useRef<HTMLTextAreaElement>(null);
  const [ip, setIp] = useState('');
  const [copied, setCopied] = useState(false);

  const xmarkIconClass = classNames({
    'clear-btn': true,
    'opacity-20': !inputText,
  });

  useEffect(() => {
    chrome.storage.local.get(['selectedText'], result => {
      const selectedText = result.selectedText || '';

      setInputText(selectedText);

      // 清除临时存储的数据（可选）
      chrome.storage.local.remove('selectedText');
    });

    // 显示当前标签页地址的二维码
    chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
      console.log('🚀 ~ Popup ~ active tab:', tab);
      const tmpTab = {
        title: tab.title || '',
        url: tab.url || '',
      };
      setActiveTab(tmpTab);
    });

    // 显示本机ipv4地址
    ipUtils.getUserIP((ip: string) => {
      setIp(ip);
    });
  }, []);

  // 清空二维码输入框
  function clearInput() {
    setInputText('');
    inputTextRef.current?.focus();
  }

  return (
    <div className="App">
      <header className="App-header" />

      <div className="App-body">
        <div className="ellipsis activetab-title">{activeTab.title}</div>
        <div className="ellipsis activetab-url">{activeTab.url}</div>

        <div className="pl8">
          <FontAwesomeIcon icon={faArrowDown} />
        </div>

        <div className="qrcode-container mt8">
          <img
            className="qrcode"
            src={activeTabUrlQrcode ?? qrcodePlaceholder}
            alt={activeTab.url}
          />
          <div className="space" />
          <img
            className="qrcode"
            src={inputTextQrcode ?? qrcodePlaceholder}
            alt={inputText}
          />
        </div>

        <div className="mt8 pr8 text-right">
          <FontAwesomeIcon icon={faArrowUp} />
        </div>

        <div className="mt8">
          <div className="flex items-end justify-between">
            <FontAwesomeIcon
              className={xmarkIconClass}
              icon={faXmark}
              onClick={clearInput}
            />
            文本转二维码:
          </div>
          <div className="input-group">
            <textarea
              className="input"
              placeholder="请输入文本"
              ref={inputTextRef}
              value={inputText}
              onChange={e => setInputText(e.target.value)}
            />
          </div>
        </div>

        <div className="divider" />

        {/* ip地址 */}
        <div>
          IPv4地址：
          <CopyToClipboard
            text={ip}
            onCopy={() => {
              setCopied(true);
              setTimeout(() => {
                setCopied(false);
              }, 1000);
            }}
          >
            <span className="clipboard">{ip}</span>
          </CopyToClipboard>
          {copied ? (
            <span
              style={{ color: '#61dafb', fontSize: '10px', marginLeft: '5px' }}
            >
              复制成功.
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
};
