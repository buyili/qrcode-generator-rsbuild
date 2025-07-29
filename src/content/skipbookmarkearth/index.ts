
import './index.scss';
import { storageKeys, assets } from '../../utils/const';
const logo = assets.logo;


var linkUrl = '';

(() => {
    const link = document.getElementsByClassName('link')[0]
    console.log("🚀 ~ toggleLink ~ link:", link)

    if (!link) {
        return;
    }

    const href = link.innerHTML;
    console.log("🚀 ~ toggleLink ~ href:", href)

    linkUrl = href;
})()

function createJumpBtn() {
    const link = document.getElementsByClassName('link')[0]
    if (!link) {
        return;
    }

    // 创建跳转按钮
    const eleA = document.createElement('a');
    eleA.className = 'qrcodeg-jump-btn';
    eleA.href = linkUrl;
    eleA.innerHTML = '跳转';
    link.append(eleA)

    const eleImg = document.createElement('img');
    eleImg.className = 'qrcodeg-jump-btn-logo';
    eleImg.src = logo;
    eleA.prepend(eleImg);

}

function toggleLink() {
    const href = linkUrl;
    if (href) {
        // location.href = href;
        location.replace(href)
    }
}

chrome.storage.local.get([storageKeys.autoSkipBookmarkearthExternalLinkVerification], (result) => {
    const autoSkip = result[storageKeys.autoSkipBookmarkearthExternalLinkVerification];

    createJumpBtn();

    if (autoSkip) {
        toggleLink();
    }
});