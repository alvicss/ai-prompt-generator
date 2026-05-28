// ============ 魔咒產生器 Service Worker ============
// 版本號：每次有重大更新時請遞增，讓舊快取自動失效
const CACHE_NAME = 'mozhu-v2';
const FONT_CACHE_NAME = 'mozhu-fonts-v2';

// 安裝時預先快取的頁面檔案（用相對路徑，相容 GitHub Pages 子目錄）
const PRECACHE_URLS = [
  './index.html',
  './manifest.json',
  './icons/icon.svg'
];

// ---- 安裝：預快取核心頁面 ----
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_URLS);
    })
  );
  // 跳過等待，立即接管舊版
  self.skipWaiting();
});

// ---- 啟動：清除舊版快取 ----
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME && name !== FONT_CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  // 立即控制所有已開啟的頁面
  self.clients.claim();
});

// ---- 攔截請求：依來源決定快取策略 ----
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Google Fonts：快取優先，有快取直接回傳，沒有才去網路抓
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    event.respondWith(
      caches.open(FONT_CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((cached) => {
          if (cached) return cached;
          return fetch(event.request).then((response) => {
            // 只快取成功的回應
            if (response.ok) {
              cache.put(event.request, response.clone());
            }
            return response;
          });
        });
      })
    );
    return;
  }

  // 同源檔案（index.html、manifest 等）：快取優先 + 背景更新
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        const networkFetch = fetch(event.request).then((response) => {
          if (response.ok) {
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, response.clone());
            });
          }
          return response;
        }).catch(() => cached); // 網路失敗就用快取

        // 有快取直接回傳（背景偷偷更新），沒快取等網路
        return cached || networkFetch;
      })
    );
  }
});
