# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 專案概覽

這是一個 **AI 繪圖提示詞產生器（魔咒產生器）**，純前端靜態網頁工具，同時也是一個 PWA（Progressive Web App）。使用者可從預設分類中勾選標籤，組合出適合 AI 生圖的英文或中文 Prompt，並直接送至 ChatGPT 或 Google Gemini。

無後端、無建置工具、無套件管理器。

## 開發方式

直接開啟 `index.html` 在瀏覽器預覽即可，不需要任何建置或啟動指令。

> **注意**：Service Worker（`sw.js`）在本機直接開啟檔案時無法運作，需透過 localhost 或 HTTPS 才會生效。可用 `npx serve .` 快速起一個本機伺服器測試 PWA 功能。

## 檔案說明

- `index.html` — 主應用程式，包含所有 HTML、CSS、JavaScript
- `ai-prompt-generator.html` — 自動轉址到 `index.html`（保留舊連結相容性）
- `manifest.json` — PWA 設定檔（App 名稱、圖示、主題色）
- `sw.js` — Service Worker（離線快取、字體快取）
- `icons/icon.svg` — 主圖示（深色背景 + 藍青漸層「魔咒」字樣），可直接替換
- `icons/generate.html` — 在瀏覽器開啟，可下載 192px / 512px PNG 圖示
- `icons/icon-192.png` — 由 generate.html 產生後放入（PWA 必要）
- `icons/icon-512.png` — 由 generate.html 產生後放入（PWA 必要）

所有邏輯、樣式、資料都在 `index.html` 中，沒有分拆模組。

## 架構概覽

### 資料層（JavaScript 全域狀態）

```javascript
const STORAGE_KEY = 'ai_prompt_gen_v3'
let data = { categories: [...] }  // 分類與選擇狀態
let displayLang = 'zh'            // 介面顯示語言：'zh' | 'en' | 'both'
let outputLang = 'en'             // 輸出語言：'en' | 'zh'
```

每個分類（category）結構：
```javascript
{
  id: 'style',
  name: { zh: '🎨 藝術風格', en: '🎨 Art Style' },
  items: [
    { zh: '寫實攝影', en: 'Photorealistic', selected: false },
    ...
  ]
}
```

資料以 JSON 格式存入 `localStorage`，`loadData()` 讀取時支援舊版本資料遷移。

### 渲染層

- `render()` — 根據 `data` 動態產生所有分類卡片，覆寫 `#categoriesGrid` 的內容
- `renderSummary()` — 顯示已選取項目的摘要列表
- 沒有使用任何前端框架（React/Vue 等），純 DOM 操作

### 核心功能函式

| 函式 | 用途 |
|------|------|
| `toggleTag(catId, ii)` | 切換某分類中某項目的選取狀態 |
| `generatePrompt()` | 組合已選取項目，輸出完整 Prompt 字串 |
| `randomPick()` | 從各分類各隨機選一項 |
| `exportData()` | 下載 JSON 設定檔 |
| `importData(event)` | 從 JSON 檔案載入設定 |
| `sendToGPT()` | 送 Prompt 到 ChatGPT（網頁：具名視窗重用；PWA：依偏好開 App 或複製）|
| `sendToGemini()` | 送 Prompt 到 Gemini（先複製到剪貼簿再開啟，因 Gemini 不支援 URL 帶文字）|
| `isPWA()` | 偵測是否以獨立 App 模式（standalone）執行 |
| `savePWAPref(pref)` | 儲存 PWA 開啟偏好（'app' 或 'copy'），只問一次 |
| `handleReuseChoice(reuse)` | 處理「更新原視窗 / 開新視窗」的使用者選擇 |
| `copyToClipboard(text, cb)` | 複製文字到剪貼簿（含 fallback） |
| `getItemDisplay(item)` | 依 `displayLang` 回傳顯示文字 |
| `getItemOutput(item)` | 依 `outputLang` 回傳輸出文字 |
| `toast(msg)` | 顯示短暫的操作通知 |

### PWA 相關 localStorage key

| Key | 說明 |
|-----|------|
| `mozhu_open_pref` | PWA 開啟偏好：`'app'`（開 App）或 `'copy'`（只複製），未設定為 null |

### 樣式設計

使用 CSS Variables 定義深色主題色彩系統：
- `--bg-primary: #0a0e14`（主背景）
- `--accent: #1a7ad4`（主要藍色）
- `--accent-2: #2ec4b6`（次要青色）
- `--danger: #ef4444`（危險操作）

字體：
- 介面文字：`Noto Sans TC`（繁體中文），由 Google Fonts 載入，SW 會快取
- 輸出區域：`JetBrains Mono`（等寬）

## 部署

GitHub Pages：設定 source 為 `main` branch 的 `/root`，首頁為 `index.html`。

PWA 安裝條件（GitHub Pages 已滿足）：
1. HTTPS — ✅ GitHub Pages 預設 HTTPS
2. manifest.json — ✅ 已建立
3. Service Worker — ✅ 已建立（`sw.js`）
4. 圖示（192px + 512px PNG）— ⚠️ 需用 `icons/generate.html` 產生後放入

## 上架 Google Play（未來）

透過 TWA（Trusted Web Activity）包裝成 APK：
1. 先確保 PWA 圖示 PNG 都就位
2. 用 PWABuilder（pwabuilder.com）或 Bubblewrap CLI 打包
3. 上傳到 Google Play Console（一次性 $25 USD 開發者費）
