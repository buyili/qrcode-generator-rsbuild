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
  // options_page: "./src/options/index.html",
  // content_scripts: [
  //   {
  //     matches: [
  //       "https://www.bookmarkearth.cn/view/*"
  //     ],
  //     js: [
  //       "./src/content/skipbookmarkearth/index.ts"
  //     ]
  //   }
  // ],
  background: {
    service_worker: "./src/background/index.ts",
    type: "module",
  },
  devtools_page: "./src/devtools/index.html",
  permissions: [
    "tabs",
    "contextMenus",
    "storage"
  ]
};

export default manifest;
