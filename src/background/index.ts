import { dayFormat } from '../utils/day_format';

const isDevelopment = process.env.NODE_ENV !== 'production';

chrome.runtime.onInstalled.addListener(() => {
    console.log("🚀 ~ chrome.runtime.onInstalled.addListener ~ run at:", dayFormat())

    // 菜单配置数组
    const menuItems: chrome.contextMenus.CreateProperties[] = [
        { id: "createQRCodeForPage", title: "为此页面创建二维码", contexts: ["page"] },
        { id: "createQRCodeForSelecton", title: "为选中文本创建二维码", contexts: ["selection"] },
        { id: "createQRCodeForLink", title: "为链接创建二维码", contexts: ["link"] },
        { id: "createQRCodeForImage", title: "为图片链接创建二维码", contexts: ["image"] },
        { id: "createQRCodeForVideo", title: "为视频链接创建二维码", contexts: ["video"] },
    ];

    if (isDevelopment) menuItems.push({ id: "clearBackgroundConsoleLog", title: "清理 background 日志", contexts: ["all"] })

    // 批量创建菜单
    menuItems.forEach(item => chrome.contextMenus.create(item));
});

// 统一处理菜单点击事件
chrome.contextMenus.onClicked.addListener((info, tab) => {
    console.log("🚀 ~ 菜单点击信息:", info);

    if (info.menuItemId === "createQRCodeForPage") {
        chrome.action.openPopup();
        return;
    }

    if (info.menuItemId == 'clearBackgroundConsoleLog') {
        console.clear()
        return true;
    }

    // 根据菜单ID映射需要存储的数据
    const dataMap: any = {
        createQRCodeForSelecton: info.selectionText,
        createQRCodeForLink: info.linkUrl,
        createQRCodeForImage: info.srcUrl,
        createQRCodeForVideo: info.srcUrl
    };

    // 获取当前需要处理的数据
    const content = dataMap[info.menuItemId];

    // 只有存在有效内容时才执行操作
    if (content) {
        chrome.storage.local.set({ selectedText: content }, () => {
            chrome.action.openPopup();
        });
    } else {
        console.log("🚀 ~ 菜单点击: 没有可处理的内容");
    }
});


/**
 * 拦截弹窗广告
 * 
 * 
 * 思路一：广告窗口先是一个小窗口，再打开大窗口，通过判断窗口高度拦截。
 * 拦截高度等于99的窗口，过几天后发现小窗高度会变化；该方式不完善。
 * 
 * 思路二：新建窗口时 tab.pendingUrl 属性值为空。
 * 注意：这只适用于 chrome.tabs.onCreated 事件，不适用于 chrome.tabs.onUpdated 事件
 * 根据 tab.active 是否为 true 区分广告。例如第三方网站(如 x.com)使用google账号登录时，弹窗标签信息中 tab.active = true
 * 
 * 思路三：完善思路一，根据新开窗口大小拦截；窗口 top=0 并且 width/left<0.2 就拦截。
 * 
 * 思路四: 监听窗口创建，同时判断当前活动标签页域名是否匹配，是就拦截，否就放行
 */
chrome.tabs.onCreated.addListener((tab) => {
    console.log("🚀 ~ chrome.tabs.onCreated.addListener ~ tab:", tab)
    blockNewWindowAD(tab)
})

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    console.log("🚀 ~ chrome.tabs.onUpdated.addListener ~ tabId, changeInfo, tab:", tabId, changeInfo, tab)
});

chrome.windows.onCreated.addListener((window) => {
    console.log("🚀 ~ chrome.windows.onCreated.addListener ~ window:", window)
    if (window.top == 0 && window.width! / window.left! < 0.2) {
        chrome.windows.remove(window.id!)
    }
})

/**
 * 拦截在新建窗口中打开的广告
 * @param {chrome.tabs.Tab} tab 
 */
function blockNewWindowAD(tab: chrome.tabs.Tab) {
    // 判断 newWindowAD 方式一：窗口高度等于 99
    if (tab.height == 99) {
        chrome.tabs.remove(tab.id!);
        return
    }
    // 判断 newWindowAD 方式二：新建窗口时 tab.pendingUrl 属性值为空。
    // 注意：这只适用于 chrome.tabs.onCreated 事件，不适用于 chrome.tabs.onUpdated 事件
    // 根据 tab.active 是否为 true 区分广告。例如第三方网站(如 x.com)使用google账号登录时，弹窗标签信息中 tab.active = true
    if (!tab.pendingUrl && tab.active == false) {
        chrome.tabs.remove(tab.id!)
        return
    }
}