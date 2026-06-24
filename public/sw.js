self.addEventListener('push', event => {
  const data = event.data?.json() || {}
  event.waitUntil(
    self.registration.showNotification(data.title || '🌸 FitFernanda', {
      body: data.body || '¡Recuerda entrenar hoy, Fernanda!',
      icon: '/icon-192.png',
    })
  )
})

self.addEventListener('notificationclick', event => {
  event.notification.close()
  event.waitUntil(clients.openWindow(self.location.origin))
})
