const CACHE_NAME = "niji-trip-cache-v1";
const urlsToCache = ["./", "./index.html", "./manifest.json", "./icon-192.png", "./icon-512.png"];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});

// 自動同步（雲端備份）
self.addEventListener("sync", event => {
  if (event.tag === "syncData") {
    event.waitUntil(syncDataToCloud());
  }
});

async function syncDataToCloud() {
  const data = localStorage.getItem("nijiTripData");
  if (data) {
    await fetch("https://api.niji-trip-cloud.com/backup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: data
    });
  }
}
