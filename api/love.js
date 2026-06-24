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
  { title: 'Tu pololito 💖', body: 'Ver cómo te cuidas a ti misma me hace amerte aún más, amor. Eres fuerte, hermosa y mía. 💕' },
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
  try {
    if (req.method !== 'GET' && req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' })
    }

    const authHeader = req.headers.authorization
    // Allow unauthenticated calls (for in-app test); only block requests that send a WRONG secret
    if (process.env.CRON_SECRET && authHeader && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    const vapidPublic = process.env.VITE_VAPID_PUBLIC_KEY || process.env.VAPID_PUBLIC_KEY || process.env['VITE_VAPID_CHAVE_PÚBLICA']
    const vapidPrivate = process.env.VAPID_PRIVATE_KEY
    const vapidEmail = process.env.VAPID_EMAIL
    const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!vapidPublic || !vapidPrivate || !vapidEmail) {
      return res.status(500).json({
        error: 'Missing VAPID configuration',
        debug: { vapidPublic: !!vapidPublic, vapidPrivate: !!vapidPrivate, vapidEmail: !!vapidEmail }
      })
    }

    if (!supabaseUrl) {
      return res.status(500).json({ error: 'Missing SUPABASE URL env var' })
    }
    if (!supabaseKey || supabaseKey === 'your-service-role-key-here') {
      return res.status(500).json({ error: 'SUPABASE_SERVICE_ROLE_KEY is missing or still has the placeholder value.' })
    }

    webpush.setVapidDetails(`mailto:${vapidEmail}`, vapidPublic, vapidPrivate)

    const supabase = createClient(supabaseUrl.trim(), supabaseKey.trim(), {
      auth: { autoRefreshToken: false, persistSession: false }
    })

    const { data: subs, error, count } = await supabase
      .from('push_subscriptions')
      .select('endpoint, subscription', { count: 'exact' })

    const debug = { url: supabaseUrl.slice(-20), keyRole: supabaseKey.includes('service_role') ? 'service_role' : 'anon_or_other', count }
    if (error) return res.status(500).json({ error: `Supabase error: ${error.message}`, debug })
    if (!subs || subs.length === 0) return res.json({ sent: 0, message: 'No subscriptions found', debug })

    const send = (msg) => Promise.allSettled(
      subs.map(row => {
        const sub = typeof row.subscription === 'string' ? JSON.parse(row.subscription) : row.subscription
        return webpush.sendNotification(sub, JSON.stringify(msg))
      })
    )

    const isTest = req.query?.test === '1' || req.query?.test === 'true'
    const forceLove = req.query?.love === '1' || req.query?.love === 'true'
    const results = []

    const cleanup = async (res) => {
      const expired = res
        .map((r, i) => r.status === 'rejected' && (r.reason?.statusCode === 410 || r.reason?.statusCode === 404) ? subs[i]?.endpoint : null)
        .filter(Boolean)
      if (expired.length > 0) {
        await supabase.from('push_subscriptions').delete().in('endpoint', [...new Set(expired)])
      }
      return expired.length
    }

    // Test mode: confirm push pipeline works + clean expired subscriptions
    if (isTest) {
      const testResults = await send({ title: '🔔 Teste de notificação', body: 'Se você recebeu isso, as notificações estão funcionando! 🎉' })
      const cleaned = await cleanup(testResults)
      const errors = testResults
        .map((r, i) => r.status === 'rejected' ? {
          endpoint: subs[i]?.endpoint?.slice(0, 60),
          status: r.reason?.statusCode,
          msg: r.reason?.body || r.reason?.message || String(r.reason)
        } : null)
        .filter(Boolean)
      return res.json({ sent: testResults.filter(r => r.status === 'fulfilled').length, test: true, subs: subs.length, cleaned, errors, debug })
    }

    // Force love mode: send a love message now regardless of the 3-day interval
    if (forceLove) {
      const msg = MESSAGES[Math.floor(Math.random() * MESSAGES.length)]
      const loveResults = await send(msg)
      await cleanup(loveResults)
      return res.json({ sent: loveResults.filter(r => r.status === 'fulfilled').length, love: true, subs: subs.length, debug })
    }

    // 1. Check YESTERDAY's meals → send reminder if yellow or red
    const yesterday = new Date()
    yesterday.setUTCDate(yesterday.getUTCDate() - 1)
    const yesterdayStr = yesterday.toISOString().split('T')[0]
    const { data: ydMeals } = await supabase.from('refeicoes').select('meal_type').eq('date', yesterdayStr)
    const hasMeals = (ydMeals?.length || 0) > 0
    const hasCena = ydMeals?.some(m => m.meal_type === 'cena') || false
    const hasComida = ydMeals?.some(m => m.meal_type !== 'cena') || false

    if (!hasMeals) {
      results.push(...await send({ title: '🍽️ Fer, ¿registraste todo ayer?', body: 'No encontré ninguna comida registrada de ayer. ¡Entra al app y anota lo que comiste para llevar un buen seguimiento! 📊' }))
    } else if (!hasCena && !hasComida) {
      // no debería pasar, pero por seguridad
      results.push(...await send({ title: '🍽️ Fer, ¿registraste todo ayer?', body: 'No encontré ninguna comida registrada de ayer. ¡Entra al app y anota lo que comiste! 📊' }))
    } else if (!hasCena) {
      results.push(...await send({ title: '🌙 ¿Cenaste ayer, Fer?', body: 'Ayer no registraste tu cena. ¡Completa tu diario para tener un seguimiento más preciso!' }))
    } else if (!hasComida) {
      results.push(...await send({ title: '🍳 ¿Comiste bien ayer, Fer?', body: 'Ayer solo registraste la cena. ¿Qué comiste durante el día? ¡Añádelo para un seguimiento completo!' }))
    }

    // 2. Love message every 3 days from fixed epoch (exact interval, no month-boundary drift)
    const EPOCH = Date.UTC(2026, 0, 1) // Jan 1, 2026
    const daysSinceEpoch = Math.floor((Date.now() - EPOCH) / 86_400_000)
    if (daysSinceEpoch % 3 === 0) {
      const msg = MESSAGES[Math.floor(Math.random() * MESSAGES.length)]
      results.push(...await send(msg))
    }

    await cleanup(results)

    return res.json({
      sent: results.filter(r => r.status === 'fulfilled').length,
      mealStatus: (hasCena && hasComida) ? 'green' : hasMeals ? 'yellow' : 'red',
      loveDay: daysSinceEpoch % 3 === 0,
      debug,
    })
  } catch (err) {
    return res.status(500).json({ error: err.message || String(err) })
  }
}
