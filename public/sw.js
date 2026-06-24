self.addEventListener('push', event => {
  const data = event.data?.json() || {}
  event.waitUntil(
    self.registration.showNotification(data.title || '🌸 FitFernanda', {
      body: data.body || '¡Recuerda entrenar hoy, Fernanda!',
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      tag: 'fitfernanda-daily',
      renotify: true,
      vibrate: [200, 100, 200],
    })
  )
})

self.addEventListener('notificationclick', event => {
  event.notification.close()
  event.waitUntil(clients.openWindow(self.location.origin))
})
