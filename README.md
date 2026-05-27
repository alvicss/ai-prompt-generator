# AI Prompt Generator

AI 繪圖提示詞產生器，提供可自訂分類與選項的靜態網頁工具，方便快速組合高品質圖像生成 Prompt。

## 功能

- 依分類選擇風格、構圖、光線、色彩等提示詞元素
- 支援自訂分類與選項
- 可匯出與匯入設定資料
- 可一鍵複製生成結果
- 可將 Prompt 帶到 ChatGPT 或 Gemini 使用

## 使用方式

直接開啟 `index.html` 即可使用。部署到 GitHub Pages 時，將 Pages 來源設定為 `main` branch 的 `/root`。

## 資料儲存

自訂資料會儲存在使用者瀏覽器的 `localStorage`。清除瀏覽器資料或更換裝置後，資料不會自動同步；建議使用匯出功能自行備份。

## GitHub Pages

此專案是純前端靜態頁面，不需要後端伺服器或建置流程。
