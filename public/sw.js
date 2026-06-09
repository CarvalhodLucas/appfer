self.addEventListener('push', event => {
  const data = event.data?.json() || {}
  event.waitUntil(
    self.registration.showNotification(data.title || '🌸 FitFernanda', {
      body: data.body || '¡Recuerda entrenar hoy, Fernanda!',
      icon: '/favicon.svg',
      badge: '/favicon.svg',
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
