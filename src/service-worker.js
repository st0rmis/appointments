console.log('WWWWAAA')
if (workbox) {
  console.log(`Yay! Workbox is loaded 🎉`);
} else {
  console.log(`Boo! Workbox didn't load 😬`);
}

workbox.routing.registerRoute(
  new RegExp('.*\.js'),
  // new workbox.strategies.StaleWhileRevalidate()
  new workbox.strategies.NetworkFirst()
)

self.addEventListener('fetch', function (event) {
  console.log('[SW] Fetching something!', event)
  event.respondWith(fetch(event.request))
})

self.addEventListener('push', (event) => {
  let data = {
    title: 'Pranešimas gautas',
    content: 'Naujas įrašas sukurtas'
  }
  if (event.data) {
    data = JSON.parse(event.data.text())
  }
  let options = {
    body: data.content,
    icon: '../public/img/icons/apple-touch-icon-76x76.png',
    badge: '../public/img/icons/apple-touch-icon-76x76.png'
  }
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  )
})
