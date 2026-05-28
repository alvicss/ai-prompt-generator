# Changelog

## 2026-05-28（PWA 升級）

### 新功能：PWA 支援
- 新增 `manifest.json`，App 名稱「魔咒產生器」，短名「魔咒」，深色主題。
- 新增 `sw.js` Service Worker，支援離線使用；快取策略：
  - 頁面檔案（`index.html`、`manifest.json`）：快取優先 + 背景更新。
  - Google Fonts：快取後不再重新抓取，節省流量。
- 新增 `icons/icon.svg`：深色背景 + 藍青漸層「魔咒」字樣，可直接替換更新圖示。
- 新增 `icons/generate.html`：在瀏覽器開啟即可下載 192px / 512px PNG 圖示。
- 新增 PWA 安裝相關 meta tags（含 Apple Touch Icon、theme-color）。

### 功能改進：GPT / Gemini 開啟邏輯重寫
- **視窗重用**：同一個 session 內再次點擊 GPT 或 Gemini 按鈕，偵測到原視窗仍開啟時，
  詢問「更新原視窗」或「開新視窗」，避免不必要地開啟重複分頁。
- **PWA 模式偏好**：在已安裝的 App 模式下，首次點擊 GPT / Gemini 時詢問開啟偏好
  （開啟 App 並複製提示詞 / 只複製提示詞），之後不再重複詢問。
- Gemini 邏輯統一：網頁與 PWA 模式都先複製提示詞到剪貼簿再開啟視窗。

### 其他
- `ai-prompt-generator.html` 改為自動轉址到 `index.html`，舊連結不失效。

---

## 2026-05-28（舊）

- 修正 Gemini 生圖按鈕只開啟網頁但不帶入提示詞的問題。
- Gemini 生圖改為先開啟 `https://gemini.google.com/app`，再將完整提示詞複製到剪貼簿，避免依賴 Gemini 不穩定的 URL query 帶入行為。
- 新增 Gemini 專用複製提示訊息，提醒使用者在 Gemini 輸入框貼上提示詞。
- 同步更新 `index.html` 與 `ai-prompt-generator.html`。

## 2026-05-27

- 全站 `rem` 字級統一增加 `0.2rem`，提升介面可讀性。
- 新增全介面中文 / 英文切換。
- 將靜態文案、動態分類操作、Modal、提示訊息與瀏覽器標題納入語系文字表。
- 介面語言、選項顯示語言與 Prompt 輸出語言會分別記住在 `localStorage`。
- 同步更新 `index.html` 與 `ai-prompt-generator.html`，保持 GitHub Pages 首頁一致。
