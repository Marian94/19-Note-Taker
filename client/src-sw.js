const { offlineFallback, warmStrategyCache } = require("workbox-recipes");
const { CacheFirst } = require("workbox-strategies");
const { NetworkOnly } = require("workbox-strategies");
const { registerRoute } = require("workbox-routing");
const { setDefaultHandler } = require("workbox-routing");
const { CacheableResponsePlugin } = require("workbox-cacheable-response");
const { ExpirationPlugin } = require("workbox-expiration");
const { precacheAndRoute } = require("workbox-precaching/precacheAndRoute");

precacheAndRoute(self.__WB_MANIFEST);

const pageCache = new CacheFirst({
  cacheName: "page-cache",
  plugins: [
    new CacheableResponsePlugin({
      statuses: [0, 200],
    }),
    new ExpirationPlugin({
      maxAgeSeconds: 2592000,
    }),
  ],
});

warmStrategyCache({
  urls: ["/index.html", "/"],
  strategy: pageCache,
});

registerRoute(({ request }) => request.mode === "navigate", pageCache);

const cacheName = "static-resources";
const matchCallback = ({ request }) => {
  return request.destination === "style" || request.destination === "script";
};

registerRoute(
  matchCallback,
  new StaleWhileRevalidate({
    cacheName,
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
    ],
  })
);
// Register route => caching images because it saves bandwidth and improves performance.
registerRoute(
  ({ request }) => request.destination === "image",
  new CacheFirst({
    cacheName: "image-cache",
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      new ExpirationPlugin({
        maxEntries: 60,
        maxAgeSeconds: 2592000,
      }),
    ],
  })
);

setDefaultHandler(new NetworkOnly());

offlineFallback();
