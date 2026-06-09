import webpush from 'web-push'
import { createClient } from '@supabase/supabase-js'

const MESSAGES = [
  { title: 'Lucas 💕', body: 'Fernanda, quiero que sepas que eres la mejor parte de mis días. Te amo más de lo que las palabras pueden expresar.' },
  { title: 'De Lucas para ti 🌸', body: 'Solo quería recordarte lo orgulloso que estoy de ti. Cada esfuerzo que haces me hace amarte aún más.' },
  { title: 'Lucas 💌', body: 'Eres la persona más especial que he conocido en mi vida. Gracias por existir y por ser mía.' },
  { title: 'Para Fernanda 🌺', body: 'Cada vez que te veo perseguir tus metas, mi corazón se llena de orgullo. Eres increíble, amor.' },
  { title: 'Lucas te ama 💖', body: 'No hay un solo día que pase sin que piense en lo afortunado que soy de tenerte. Eres mi todo.' },
  { title: 'De Lucas 🌹', body: 'Fernanda, eres mi motivación, mi calma y mi hogar. Te amo con toda mi alma.' },
  { title: 'Lucas 💕', body: 'Cada meta que alcanzas, cada día que te cuidas, me recuerda lo maravillosa que eres. Estoy aquí, siempre.' },
  { title: 'Para ti, amor 🌸', body: 'Quiero que sepas que eres la razón de mi mayor sonrisa. Hoy, mañana y siempre. Con amor, Lucas.' },
  { title: 'Lucas 💌', body: 'No imagino mi vida sin ti. Eres mi persona favorita en todo el mundo. Te amo, Fernanda.' },
  { title: 'De Lucas con amor 💖', body: 'Ver cómo cuidas de ti misma me hace amarte aún más. Eres fuerte, hermosa y mía. 💕' },
  { title: 'Lucas te recuerda 🌺', body: 'Solo quería interrumpir tu día para decirte que te amo. Sin motivo. Solo porque sí y porque te lo mereces.' },
  { title: 'Para Fernanda 🌹', body: 'Eres la persona que elegí y que elegiría mil veces más. Gracias por existir en mi mundo.' },
  { title: 'Lucas 💕', body: 'Tu sonrisa es mi lugar favorito del universo. Espero que hoy estés sonriendo mucho. Te amo.' },
  { title: 'De Lucas 💌', body: 'Cada día contigo es un regalo. Eres todo lo que siempre quise y más de lo que merezco. Te amo.' },
  { title: 'Amor, soy Lucas 🌸', body: 'Quiero que recuerdes hoy que tienes a alguien que te ama profundamente y está orgulloso de ti.' },
  { title: 'Lucas 💖', body: 'Fernanda, eres brillante, fuerte y absolutamente hermosa. Y yo soy el más afortunado por tenerte.' },
  { title: 'De Lucas para ti 🌺', body: 'No hay mejor compañía en este mundo que la tuya. Eres mi persona favorita, siempre.' },
  { title: 'Lucas te ama 🌹', body: 'Solo quiero que sepas que pienso en ti todos los días y que cada uno de esos días me alegra el alma.' },
  { title: 'Para Fernanda 💕', body: 'Cada pequeño esfuerzo que haces por ti misma también lo haces por los dos. Eso me hace amarte más.' },
  { title: 'Lucas 💌', body: 'Si pudiera darte algo hoy, te daría la certeza de cuánto te amo y lo especial que eres para mí.' },
  { title: 'De Lucas con todo 💖', body: 'Eres mi tranquilidad, mi alegría y mi hogar. Gracias por ser tú, Fernanda. Te amo.' },
  { title: 'Lucas te recuerda 🌸', body: 'Hoy, mañana y siempre: eres amada, admirada y la persona más importante de mi vida.' },
  { title: 'Para ti, amor mío 🌺', body: 'Fernanda, eres una mujer extraordinaria. Y yo soy el hombre más feliz del mundo por tenerte.' },
  { title: 'Lucas 💕', body: 'Tu esfuerzo, tu fuerza, tu sonrisa... todo de ti me enamora cada día un poco más. Te amo.' },
  { title: 'De Lucas 🌹', body: 'Quiero que este mensaje te llegue justo cuando lo necesites: eres suficiente, eres amada, eres mía. 💕' },
  { title: 'Lucas 💌', body: 'Que sepas que tengo el privilegio de amarte, y no hay día que no lo agradezca. Te amo, Fernanda.' },
  { title: 'Amor, es Lucas 💖', body: 'Me enorgullece todo lo que eres y todo lo que estás construyendo. Sigo aquí, apoyándote siempre.' },
  { title: 'Para Fernanda 🌸', body: 'El mejor momento de mi día es cuando estás tú en él. Gracias por existir, amor.' },
  { title: 'Lucas te ama 🌺', body: 'No olvides hoy que alguien te ama muchísimo y está pensando en ti. Con todo mi corazón, Lucas.' },
  { title: 'De Lucas, siempre 🌹', body: 'Fernanda, eres mi mayor aventura, mi paz favorita y el amor de mi vida. Hoy y todos los días.' },
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
