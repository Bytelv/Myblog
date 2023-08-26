importScripts("https://cdn.chuqis.com/npm/workbox-sw/build/workbox-sw.js"),
importScripts("https://cdn.webpushr.com/sw-server.min.js"),
workbox ? console.log("Workbox 加载成功🎉") : console.log("Workbox 加载失败😬"),
self.addEventListener("install", async()=>{
    await self.skipWaiting(),
    console.log("Service Worker 开始安装🎊")
}
),
self.addEventListener("activate", async()=>{
    await self.clients.claim(),
    console.log("Service Worker 安装完成，开始启动✨"),
    self.clients.matchAll().then(e=>{
        e.forEach(e=>e.postMessage({
            type: "refresh"
        }))
    }
    )
}
);
const fallbackCdnUrls = ["https://cdn.chuqis.com", "https://cdn2.chuqis.com", "https://jsd.onmicrosoft.cn", "https://jsd.cdn.zzko.cn", "https://jsdelivr.goodboyboy.top"]
  , invalidCdnUrls = ["https://cdn.jsdelivr.ren", "https://cdn1.tianli0.top"]
  , referrerDomains = ["cdn.nlark.com", "pic1.afdiancdn.com", "f.video.weibocdn.com", "api.icodeq.com"]
  , MIN = 60
  , HOUR = 60 * MIN
  , DAY = 24 * HOUR
  , WEEK = 7 * DAY
  , MONTH = 30 * DAY
  , YEAR = 365 * DAY;
function isFallbackCdnUrl(r) {
    return fallbackCdnUrls.some(e=>r.startsWith(e))
}
function isInvalidCdnUrl(r) {
    return invalidCdnUrls.some(e=>r.startsWith(e))
}
function handleFallbackCdn(o) {
    let t = [];
    return fallbackCdnUrls.reduce((e,r)=>{
        if (!t.includes(r)) {
            const n = new Request(r + o.url.substring(o.url.indexOf("/", 8)));
            e = e.catch(async()=>{
                try {
                    var e = await fetch(n, {
                        cache: "reload"
                    });
                    if (e.ok)
                        return e;
                    throw t.push(r),
                    new Error("请求资源失败")
                } catch (e) {
                    throw t.push(r),
                    new Error("所有备用 CDN 镜像请求失败")
                }
            }
            )
        }
        return e
    }
    , Promise.reject())
}
function requiresEmptyReferrerDomain(e) {
    return referrerDomains.includes(e)
}
function handleEmptyReferrer(e) {
    return fetch(e, {
        referrerPolicy: "no-referrer"
    })
}
workbox.precaching.cleanupOutdatedCaches(),
fallbackCdnUrls.forEach(e=>{
    workbox.routing.registerRoute(new RegExp("^" + e + ".*\\.(?:js|css|woff|woff2)$"), new workbox.strategies.StaleWhileRevalidate({
        cacheName: "备用CDN资源",
        plugins: [new workbox.expiration.ExpirationPlugin({
            maxEntries: 50,
            maxAgeSeconds: WEEK,
            purgeOnQuotaError: !0
        }), new workbox.cacheableResponse.CacheableResponsePlugin({
            statuses: [200]
        })]
    }))
}
),
self.addEventListener("fetch", e=>{
    var r = e.request
      , n = new URL(r.url)
      , o = n.hostname;
    (isInvalidCdnUrl(n.href) || isFallbackCdnUrl(n.href)) && e.respondWith(handleFallbackCdn(r)),
    requiresEmptyReferrerDomain(o) && e.respondWith(handleEmptyReferrer(r))
}
),
workbox.core.setCacheNameDetails({
    prefix: "字节君",
    suffix: "缓存",
    precache: "预先",
    runtime: "运行时",
    googleAnalytics: "离线谷歌分析"
}),
workbox.precaching.precacheAndRoute([{
    revision: "60321e9cc7139a9f5f57abe91eb57f78",
    url: "./offline"
}], {
    ignoreUrlParametersMatching: [/.*/],
    directoryIndex: null
}),
workbox.navigationPreload.enable();
const Offline = new workbox.routing.Route(({request: e})=>"navigate" === e.mode,new workbox.strategies.NetworkOnly({
    plugins: [new workbox.precaching.PrecacheFallbackPlugin({
        fallbackURL: "/offline"
    }), new workbox.cacheableResponse.CacheableResponsePlugin({
        statuses: [200]
    })]
}));
workbox.routing.registerRoute(Offline),
workbox.routing.registerRoute(({url: e})=>String(e).includes("busuanzi?") || String(e).includes("busuanzi="), new workbox.strategies.NetworkOnly),
workbox.routing.registerRoute(({request: e})=>"style" === e.destination || "script" === e.destination || "font" === e.destination || "worker" === e.destination || e.url.endsWith("/favicon.ico"), new workbox.strategies.StaleWhileRevalidate({
    cacheName: "静态资源",
    plugins: [new workbox.expiration.ExpirationPlugin({
        maxEntries: 20,
        maxAgeSeconds: WEEK,
        purgeOnQuotaError: !0
    }), new workbox.cacheableResponse.CacheableResponsePlugin({
        statuses: [200]
    })]
}));
