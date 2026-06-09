import webpush from 'web-push'
import { createClient } from '@supabase/supabase-js'

const MESSAGES = [
  { title: 'Tu pololo 💕', body: 'Amorzinho, quiero que sepas que eres la mejor parte de mis días. Te amo más de lo que las palabras pueden decir.' },
  { title: 'Tu pololito 🌸', body: 'Solo quería interrumpir tu día para decirte que estoy muy orgulloso de ti. Cada esfuerzo que haces me enamora más.' },
  { title: 'Tu pololo 💌', body: 'Eres la persona más especial que he conocido en mi vida, amorzito. Gracias por existir y por ser mía.' },
  { title: 'Tu pololito 🌺', body: 'Cada vez que te veo perseguir tus metas, mi corazón se llena de orgullo. Eres increíble, amor.' },
  { title: 'Tu pololo te ama 💖', body: 'No hay un solo día que pase sin que piense en lo afortunado que soy de tenerte. Eres mi todo, amorzinho.' },
  { title: 'Tu pololito 🌹', body: 'Eres mi motivación, mi calma y mi hogar, amor. Te amo con toda mi alma.' },
  { title: 'Tu pololo 💕', body: 'Cada meta que alcanzas, cada día que te cuidas, me recuerda lo maravillosa que eres. Estoy aquí, siempre.' },
  { title: 'Tu pololito 🌸', body: 'Amorzito, eres la razón de mi mayor sonrisa. Hoy, mañana y siempre. Con todo mi amor.' },
  { title: 'Tu pololo 💌', body: 'No imagino mi vida sin ti, amorzinho. Eres mi persona favorita en todo el mundo. Te amo tanto.' },
  { title: 'Tu pololito 💖', body: 'Ver cómo te cuidas a ti misma me hace amarte aún más, amor. Eres fuerte, hermosa y mía. 💕' },
  { title: 'Tu pololo 🌺', body: 'Solo quería colarte en el día para decirte que te amo. Sin motivo. Solo porque sí, amorzinho.' },
  { title: 'Tu pololito 🌹', body: 'Eres la persona que elegí y que elegiría mil veces más, amorzito. Gracias por existir en mi mundo.' },
  { title: 'Tu pololo 💕', body: 'Tu sonrisa es mi lugar favorito del universo, amor. Espero que hoy estés sonriendo muchísimo.' },
  { title: 'Tu pololito 💌', body: 'Cada día contigo es un regalo, amorzinho. Eres todo lo que siempre quise y más de lo que merezco.' },
  { title: 'Tu pololo 🌸', body: 'Quiero que recuerdes hoy que tu pololito te ama profundamente y está muy orgulloso de ti.' },
  { title: 'Tu pololito 💖', body: 'Eres brillante, fuerte y absolutamente hermosa, amor. Y yo soy el más afortunado del mundo por tenerte.' },
  { title: 'Tu pololo 🌺', body: 'No hay mejor compañía en este mundo que la tuya, amorzito. Eres mi persona favorita, siempre.' },
  { title: 'Tu pololito 🌹', body: 'Solo quiero que sepas que pienso en ti todos los días, amorzinho, y que eso me alegra el alma.' },
  { title: 'Tu pololo 💕', body: 'Cada pequeño esfuerzo que haces por ti misma también lo haces por los dos, amor. Eso me hace amarte más.' },
  { title: 'Tu pololito 💌', body: 'Si pudiera darte algo hoy, amorzito, te daría la certeza de cuánto te amo y lo especial que eres para mí.' },
  { title: 'Tu pololo 💖', body: 'Eres mi tranquilidad, mi alegría y mi hogar, amorzinho. Gracias por ser exactamente como eres.' },
  { title: 'Tu pololito 🌸', body: 'Hoy, mañana y siempre: eres amada, admirada y la persona más importante en la vida de tu pololo.' },
  { title: 'Tu pololo 🌺', body: 'Eres una mujer extraordinaria, amor. Y yo soy el hombre más feliz del mundo por tenerte a mi lado.' },
  { title: 'Tu pololito 💕', body: 'Tu esfuerzo, tu fuerza, tu sonrisa... todo de ti me enamora cada día un poco más, amorzinho.' },
  { title: 'Tu pololo 🌹', body: 'Quiero que este mensaje te llegue justo cuando lo necesites: eres suficiente, eres amada, eres mía, amorzito. 💕' },
  { title: 'Tu pololito 💌', body: 'Que sepas que tengo el privilegio de amarte, amor, y no hay día que no lo agradezca con todo mi corazón.' },
  { title: 'Tu pololo 💖', body: 'Me enorgullece todo lo que eres y todo lo que estás construyendo, amorzinho. Aquí sigo, apoyándote siempre.' },
  { title: 'Tu pololito 🌸', body: 'El mejor momento de mi día es cuando estás tú en él, amorzito. Gracias por existir en mi vida.' },
  { title: 'Tu pololo 🌺', body: 'No olvides hoy que tu pololito te ama muchísimo y está pensando en ti en este momento.' },
  { title: 'Tu pololito 🌹', body: 'Amorzinho, eres mi mayor aventura, mi paz favorita y el amor de mi vida. Hoy y todos los días. 💕' },
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
