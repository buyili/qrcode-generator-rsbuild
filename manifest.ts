import fs from "fs";
const packageJson = JSON.parse(fs.readFileSync("./package.json", "utf8"));

const manifest: chrome.runtime.ManifestV3 = {
  manifest_version: 3,
  name: packageJson.name,
  version: packageJson.version,
  description: packageJson.description || "",
  action: {
    default_popup: "./src/popup/index.html",
    default_icon: "./icon-34.png"
  },
  icons: {
    128: "./icon-128.png"
  },
  // chrome_url_overrides: {
  //   newtab: "./src/newtab/index.html"
  // },
  options_ui: {
    page: './src/options/index.html',
    open_in_tab: true,
  },
  content_scripts: [
    {
      matches: [
        "https://www.bookmarkearth.cn/view/*"
      ],
      js: [
        "./src/content/skipbookmarkearth/index.ts"
      ],
      css: [
        "./static/css/content/skipbookmarkearth.css"
      ]
    }
  ],
  background: {
    service_worker: "./src/background/index.ts",
    type: "module",
  },
  // devtools_page: "./src/devtools/index.html",
  permissions: [
    "tabs",
    "contextMenus",
    "storage"
  ]
};

export default manifest;
