import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!supabaseUrl || !supabaseKey) return res.status(500).json({ error: 'Missing env vars' })

  const supabase = createClient(supabaseUrl.trim(), supabaseKey.trim(), {
    auth: { autoRefreshToken: false, persistSession: false }
  })

  const { endpoint, subscription } = req.body || {}
  if (!endpoint || !subscription) return res.status(400).json({ error: 'Missing endpoint or subscription' })

  const { error } = await supabase
    .from('push_subscriptions')
    .upsert({ endpoint, subscription }, { onConflict: 'endpoint' })

  if (error) return res.status(500).json({ error: error.message })
  return res.json({ ok: true })
}
