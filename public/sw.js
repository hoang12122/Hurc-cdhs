const CACHE_NAME = 'hurc-cdhs-cache-v1';

// Các tài nguyên cần lưu Offline ngay khi cài đặt
const PRECACHE_URLS = [
  '/',
  '/manifest.json',
  '/favicon.ico',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Chế độ Cache-First (Ưu tiên tải từ cache nếu Offline)
self.addEventListener('fetch', (event) => {
  // Chỉ cache các request GET
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse; // Trả về từ Cache ngay lập tức
        }

        // Nếu không có trong cache, gọi mạng
        return fetch(event.request).then((networkResponse) => {
          // Lưu vào cache để dùng cho lần sau
          if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return networkResponse;
        }).catch(() => {
          // Fallback nếu mất mạng và không có trong cache
          // Có thể trả về trang offline.html ở đây
        });
      })
  );
});

// Chế độ Background Sync (Dùng cho API POST khi mất mạng)
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-dnf-reports') {
    event.waitUntil(syncReports());
  }
});

async function syncReports() {
  console.log('[Service Worker] Đang đồng bộ dữ liệu Offline lên Server...');
  // Logic đọc IndexedDB và gọi fetch() POST ở đây
}
