import webpush from 'web-push'
import { createClient } from '@supabase/supabase-js'

const MESSAGES = [
  { title: '¡Buenos días, Fernanda! 🌸', body: 'Hoy es un nuevo día para ser la mejor versión de ti misma. ¡Tú puedes!' },
  { title: '¡Hola, campeona! 💪', body: 'Cada repetición te acerca más a tu meta. ¡Hoy es día de brillar!' },
  { title: '🌟 ¡Tú puedes!', body: 'El único entrenamiento malo es el que no se hace. ¡Vamos, Fernanda!' },
  { title: '¡Buenos días! 🔥', body: 'Tu cuerpo puede con todo. Es tu mente la que debes convencer. ¡A por ello!' },
  { title: '¡Hola, Fernanda! 🌺', body: 'Pequeños pasos cada día construyen grandes cambios. ¡No te rindas!' },
  { title: '💪 ¡Momento de brillar!', body: 'Todo el esfuerzo que estás poniendo se nota. ¡Sigue adelante con orgullo!' },
  { title: '🌸 Coach Fit te saluda', body: 'Fernanda, hoy es un gran día para sudar un poco y sentirte increíble.' },
  { title: '¡Despierta, guerrera! ⚡', body: 'Tu entrenamiento de hoy te va a hacer sentir poderosa. ¡Vamos a por él!' },
  { title: '🏋️ ¡Es hora de moverse!', body: 'Tu cuerpo te lo agradecerá esta noche. ¡Vamos a entrenar, Fernanda!' },
  { title: '¡Buenos días! ☀️', body: '¡Fernanda, hoy tienes todo para lograrlo. No te quedes sin intentarlo!' },
  { title: '💥 ¡Eres imparable!', body: 'Cada día que entrenas eres más fuerte que ayer. ¡Sigue así!' },
  { title: '🌸 ¡Recuerda tu meta!', body: 'Cuando quieras rendirte, recuerda por qué empezaste. ¡Tú puedes!' },
  { title: '¡Fernanda, buenos días! ☀️', body: 'El sol salió y tú también. ¡Hoy es día de mover ese cuerpo!' },
  { title: '💪 ¡No rompas tu racha!', body: 'Hoy es otro día para demostrar de qué estás hecha. ¡Adelante!' },
  { title: '🌟 ¡Constancia es clave!', body: 'No se trata de ser perfecta, se trata de ser constante. ¡Vamos!' },
  { title: '🔥 ¡Actívate, Fernanda!', body: '10 minutos de movimiento pueden cambiar tu día entero. ¡Empieza ahora!' },
  { title: '¡Hola, estrella! 🌟', body: 'Tu esfuerzo de hoy es tu recompensa de mañana. ¡A entrenar!' },
  { title: '🌸 ¡Cuídate hoy!', body: 'Recuerda tomar agua, comer bien y mover el cuerpo. ¡Te mereces lo mejor!' },
  { title: '💫 ¡Buenos días!', body: 'Hoy tienes la oportunidad de ser más fuerte que ayer. ¡Aprovéchala!' },
  { title: '🏃 ¡Muévete, Fernanda!', body: 'El movimiento es medicina. Hoy, dosis de entreno para ti. 💊' },
  { title: '¡Eres increíble! 🌺', body: 'Lo que estás logrando es impresionante. ¡Sigue, que el resultado vale!' },
  { title: '🌸 ¡Recarga energías!', body: 'Un buen entrenamiento hoy significa un mejor descanso esta noche. ¡Vamos!' },
  { title: '💪 ¡Sin excusas!', body: 'Hoy no hay excusa que valga. ¡Tu cuerpo y tu mente te lo van a agradecer!' },
  { title: '🌟 ¡Día de energía!', body: 'Fernanda, hoy tienes todo para lograrlo. ¡No te quedes sin intentarlo!' },
  { title: '🔥 ¡A quemar!', body: 'Hoy quemas calorías, construyes músculo y ganas confianza. ¡Vamos!' },
  { title: '¡Tú lo vales! 💖', body: 'Invertir en tu salud es lo mejor que puedes hacer. ¡Hoy entrena por ti!' },
  { title: '🌺 ¡Fuerza, Fernanda!', body: 'Cada gota de sudor es un paso más cerca de tu mejor versión. ¡Dale!' },
  { title: '⚡ ¡Energía total!', body: 'Hoy vas a entrenar, comer bien y sentirte increíble. ¡Yo creo en ti!' },
  { title: '🌸 ¡Buenos días, campeona!', body: 'Un nuevo día, una nueva oportunidad de acercarte a tu meta. ¡Tú puedes!' },
  { title: '💪 ¡Vamos, Fernanda!', body: 'Las metas no se logran solas — se logran con días como hoy. ¡A por ello!' },
]

export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const authHeader = req.headers.authorization
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  webpush.setVapidDetails(
    `mailto:${process.env.VAPID_EMAIL}`,
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  )

  const supabase = createClient(
    process.env.VITE_SUPABASE_URL.trim(),
    process.env.SUPABASE_SERVICE_ROLE_KEY.trim()
  )

  const { data: subs, error } = await supabase.from('push_subscriptions').select('endpoint, subscription')
  if (error) return res.status(500).json({ error: error.message })
  if (!subs || subs.length === 0) return res.json({ sent: 0, message: 'No subscriptions' })

  const msg = MESSAGES[Math.floor(Math.random() * MESSAGES.length)]

  const results = await Promise.allSettled(
    subs.map(row => webpush.sendNotification(row.subscription, JSON.stringify(msg)))
  )

  // Remove expired/invalid subscriptions
  const expired = results
    .map((r, i) => r.status === 'rejected' && (r.reason?.statusCode === 410 || r.reason?.statusCode === 404) ? subs[i].endpoint : null)
    .filter(Boolean)
  if (expired.length > 0) {
    await supabase.from('push_subscriptions').delete().in('endpoint', expired)
  }

  return res.json({
    sent: results.filter(r => r.status === 'fulfilled').length,
    failed: results.filter(r => r.status === 'rejected').length,
  })
}
