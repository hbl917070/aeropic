# Tiefsee 官方網站


![TiefSee官方網站](https://hbl917070.github.io/aeropic/img/index/filePanel.jpg)


## 專案說明

此專案為 Tiefsee 官方網站 的原始碼，使用 TypeScript、SCSS、EJS 進行開發，並以 gulp 進行打包成多國語言的靜態網站。
<br><br>
開啟 `/index.html` 後，會透過 js 檢測使用者使用的語言，以判斷要轉址到 `/en/index.html` 或 `/zh-TW/index.html`
<br><br>
目錄結構：
```
/
 ├ ejs：放 ejs 的目錄，編譯後會輸出成多國語言的 html
 ├ scss：放 scss 的目錄，編譯後會輸到 css
 ├ ts：放 ts 的目錄，編譯後會輸出到 js
 ├ vender：放第三方 js 的目錄
 │
 ├ css：由 gulp 自動生成
 ├ js：由 gulp 自動生成
 ├ zh-TW：中文版網站的 html 目錄，由 gulp 自動生成
 ├ en：英文版網站的 html 目錄，由 gulp 自動生成
 ├ index.html：由 gulp 自動生成
 ├ plugin.html：由 gulp 自動生成
 ├ support.html：由 gulp 自動生成
 │
 ├ v3：舊版 TiefSee 3 的網站
 ├ img_view：舊版 TiefSee 3 的大量瀏覽模式頁面
 │
 ├ gulpfile.js
 └ I18n.js：翻譯
```

## 相關鏈接

- 官方網站：https://hbl917070.github.io/aeropic/index.html
- TiefSee GitHub：https://github.com/hbl917070/Tiefsee4


