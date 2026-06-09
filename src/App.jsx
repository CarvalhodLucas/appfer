import { useState, useEffect, useRef, useCallback } from 'react'
import { createClient } from '@supabase/supabase-js'
import './index.css'

// ============================================================
// ICONS — SVG inline (Heroicons / Tabler-style)
// ============================================================
const Icon = ({ name, size = 22, ...props }) => {
  const icons = {
    home: <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />,
    dumbbell: <><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0 0 21 18V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v12a2.25 2.25 0 0 0 2.25 2.25Z" /></>,
    salad: <path strokeLinecap="round" strokeLinejoin="round" d="M12 8.25v-1.5m0 1.5c-1.355 0-2.697.056-4.024.166C6.845 8.51 6 9.473 6 10.608v2.513m6-4.871c1.355 0 2.697.056 4.024.166C17.155 8.51 18 9.473 18 10.608v2.513M15 8.25v-1.5m-6 1.5v-1.5m12 9.75-1.5.75a3.354 3.354 0 0 1-3 0 3.354 3.354 0 0 0-3 0 3.354 3.354 0 0 1-3 0 3.354 3.354 0 0 0-3 0 3.354 3.354 0 0 1-3 0L3 16.5m15-3.379a48.474 48.474 0 0 0-6-.371c-2.032 0-4.034.126-6 .371m12 0c.39.049.777.102 1.163.16 1.07.16 1.837 1.094 1.837 2.175v5.169c0 .621-.504 1.125-1.125 1.125H4.125A1.125 1.125 0 0 1 3 20.625v-5.17c0-1.08.768-2.014 1.837-2.174A47.78 47.78 0 0 1 6 13.12M12.265 3.11a.375.375 0 1 1-.53 0L12 2.845l.265.265Zm-3 0a.375.375 0 1 1-.53 0L9 2.845l.265.265Zm6 0a.375.375 0 1 1-.53 0L15 2.845l.265.265Z" />,
    chat: <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />,
    user: <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />,
    check: <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />,
    plus: <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />,
    x: <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />,
    send: <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />,
    refresh: <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />,
    fire: <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z M12 18a3.75 3.75 0 0 0 .495-7.468 5.99 5.99 0 0 0-1.925 3.547 5.975 5.975 0 0 1-2.133-1.001A3.75 3.75 0 0 0 12 18Z" />,
    lightbulb: <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />,
    star: <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />,
    cog: <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />,
    pencil: <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125" />,
    trophy: <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 0 0 2.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 0 1 2.916.52 6.003 6.003 0 0 1-5.395 4.972m0 0a6.726 6.726 0 0 1-2.749 1.35m0 0a6.772 6.772 0 0 1-3.044 0" />,
    scale: <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0 0 12 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52 2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 0 1-2.031.352 5.988 5.988 0 0 1-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.97Zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0 2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 0 1-2.031.352 5.989 5.989 0 0 1-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.97Z" />,
    sparkles: <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />,
    calorie: <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z" />,
    info: <><path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" /></>,
    trash: <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />,
    clock: <><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></>,
  }
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      {icons[name]}
    </svg>
  )
}

// ============================================================
// DEFAULT WORKOUT PLAN (5 días)
// ============================================================
const DEFAULT_PLAN = [
  {
    dia: 1, emoji: '🦵', nombre: 'Glúteos & Piernas', grupo_muscular: 'piernas', intensidad: 'normal', duracion_min: 50,
    ejercicios: [
      { nombre: 'Hip Thrust', series: 4, repeticiones: '12', descripcion: 'Contracción de glúteos en la cima' },
      { nombre: 'Peso Muerto Rumano', series: 3, repeticiones: '12', descripcion: 'Espalda recta, siente el estiramiento' },
      { nombre: 'Patada de Glúteo', series: 3, repeticiones: '15', descripcion: 'Cable o máquina, contrae arriba' },
      { nombre: 'Leg Press / Gemelos', series: 4, repeticiones: '15', descripcion: 'Combinado con gemelos al final' },
      { nombre: 'Abductor', series: 3, repeticiones: '15', descripcion: 'Máquina abductora, rango completo' },
    ]
  },
  {
    dia: 2, emoji: '💪', nombre: 'Superior — Push & Pull', grupo_muscular: 'superior', intensidad: 'normal', duracion_min: 55,
    ejercicios: [
      { nombre: 'Dominadas Máquina', series: 4, repeticiones: '10', descripcion: 'Asistidas, foco en el dorsal' },
      { nombre: 'Press de Banca', series: 4, repeticiones: '10', descripcion: 'Barra o mancuernas' },
      { nombre: 'Banca Inclinada c/ Mancuernas', series: 3, repeticiones: '12', descripcion: 'Inclinación ~30-45°' },
      { nombre: 'Tríceps Polea', series: 3, repeticiones: '15', descripcion: 'Cuerda o barra recta' },
      { nombre: 'Bíceps Mancuernas', series: 3, repeticiones: '12', descripcion: 'Curl alterno o simultáneo' },
    ]
  },
  {
    dia: 3, emoji: '🧱', nombre: 'Core & Abdomen', grupo_muscular: 'core', intensidad: 'normal', duracion_min: 40,
    ejercicios: [
      { nombre: 'Crunch Clásico', series: 3, repeticiones: '20', descripcion: 'Contrae el core al subir' },
      { nombre: 'Elevación de Piernas', series: 3, repeticiones: '15', descripcion: 'Acostada, piernas rectas' },
      { nombre: 'Plancha Frontal', series: 3, repeticiones: '45 seg', descripcion: 'Cuerpo en línea recta' },
      { nombre: 'Russian Twist', series: 3, repeticiones: '20', descripcion: 'Con o sin peso' },
      { nombre: 'Levantamiento de Piernas', series: 3, repeticiones: '15', descripcion: 'En barra o banco' },
      { nombre: 'Abdominales Largos', series: 3, repeticiones: '15', descripcion: 'Movimiento completo y controlado' },
    ]
  },
  {
    dia: 4, emoji: '🏋️', nombre: 'Piernas & Fuerza', grupo_muscular: 'piernas', intensidad: 'intenso', duracion_min: 60,
    ejercicios: [
      { nombre: 'Peso Muerto Tradicional', series: 4, repeticiones: '8', descripcion: 'Técnica perfecta, peso moderado' },
      { nombre: 'Sentadilla con Barra', series: 4, repeticiones: '10', descripcion: 'Profundidad paralela o más' },
      { nombre: 'Estocada con Mancuernas', series: 3, repeticiones: '12 c/lado', descripcion: 'Rodilla a 90°' },
      { nombre: 'Leg Extension', series: 3, repeticiones: '15', descripcion: 'Máquina, extensión completa' },
      { nombre: 'Sentadilla Búlgara', series: 3, repeticiones: '10 c/lado', descripcion: 'Pie trasero en banco' },
      { nombre: 'Zumo c/ Mancuerna', series: 3, repeticiones: '15', descripcion: 'Sobre discos para más rango' },
    ]
  },
  {
    dia: 5, emoji: '🏋️', nombre: 'Espalda & Hombros', grupo_muscular: 'superior', intensidad: 'normal', duracion_min: 55,
    ejercicios: [
      { nombre: 'Remo con Barra', series: 4, repeticiones: '10', descripcion: 'Tirón al ombligo, espalda baja' },
      { nombre: 'Pull Over con Mancuerna', series: 3, repeticiones: '12', descripcion: 'En banco, rango completo' },
      { nombre: 'Jalón al Pecho', series: 4, repeticiones: '12', descripcion: 'Agarre ancho, baja al pecho' },
      { nombre: 'Elevaciones Laterales', series: 3, repeticiones: '15', descripcion: 'Codos ligeramente doblados' },
      { nombre: 'Press Militar c/ Mancuernas', series: 3, repeticiones: '10', descripcion: 'Sentada o de pie' },
      { nombre: 'Dorsal', series: 3, repeticiones: '12', descripcion: 'Máquina o polea alta' },
    ]
  },
]

// ============================================================
// PUSH NOTIFICATIONS HELPER
// ============================================================
const urlBase64ToUint8Array = (base64String) => {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const raw = atob(base64)
  return Uint8Array.from([...raw].map(c => c.charCodeAt(0)))
}

// ============================================================
// SUPABASE CLIENT
// ============================================================
let supabaseClient = null
const getSupabase = () => supabaseClient

const initSupabase = (url, key) => {
  supabaseClient = createClient(url, key)
  return supabaseClient
}

// ============================================================
// CLAUDE API
// ============================================================
const callClaude = async (apiKey, systemPrompt, userMessage, isJson = false) => {
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
      'HTTP-Referer': 'https://fitfernanda.app',
      'X-Title': 'FitFernanda App',
    },
    body: JSON.stringify({
      model: 'nvidia/nemotron-3-super-120b-a12b:free',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage }
      ],
    }),
  })

  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error(err.error?.message || `Error de API: ${response.status}`)
  }

  const data = await response.json()
  const text = data.choices[0].message.content.trim()

  if (isJson) {
    const match = text.match(/\{[\s\S]*\}|\[[\s\S]*\]/)
    if (match) return JSON.parse(match[0])
    throw new Error('La IA no devolvió JSON válido')
  }
  return text
}

// ============================================================
// SYSTEM PROMPT BUILDER
// ============================================================
const buildSystemPrompt = (profile, todayData) => {
  const { humor, calorias, comidas, ultimoTreino, diasSemana, exAvoided, exPrioritized, weightHistory, recentHistory } = todayData
  const today = new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

  return `Eres Coach Fit 🌸, la entrenadora personal y nutricionista virtual de Fernanda.

SOBRE FERNANDA:
- Nombre: Fernanda
- Objetivo: ${profile?.goal || 'Adelgazar de forma saludable y progresiva'}
- Nivel: Principiante (lleva pocas semanas en el gimnasio)
- Altura: ${profile?.height_cm ? profile.height_cm + ' cm' : 'no especificada'}
- Edad: ${profile?.age ? profile.age + ' años' : 'no especificada'}
- Peso actual: ${profile?.current_weight ? profile.current_weight + ' kg' : 'no especificado'}
- Peso meta: ${profile?.goal_weight ? profile.goal_weight + ' kg' : 'no especificado'}
- Nivel de actividad: ${profile?.activity_level || 'no especificado'}
- Lesiones o limitaciones físicas: ${profile?.physical_limitations || 'ninguna reportada'}
- Horas de sueño promedio: ${profile?.sleep_hours ? profile.sleep_hours + 'h' : 'no especificado'}
- Nivel de estrés habitual: ${profile?.stress_level || 'no especificado'}
- Horario preferido para entrenar: ${profile?.preferred_workout_time || 'no especificado'}
- Meta calórica diaria: ${profile?.daily_calories || 1500} kcal
- Alimentos que le gustan: ${(profile?.food_likes || []).join(', ') || 'no especificados'}
- Alimentos que NO le gustan (NUNCA sugerir): ${(profile?.food_dislikes || []).join(', ') || 'ninguno por ahora'}

CONTEXTO DE HOY ${today}:
- Humor del día: ${humor || 'no registrado'} (alto / normal / bajo / no registrado)
- Último entrenamiento: ${ultimoTreino?.muscle_group || 'sin datos'} hace ${ultimoTreino ? Math.floor((Date.now() - new Date(ultimoTreino.created_at)) / 86400000) : '?'} días
- Días entrenados esta semana: ${diasSemana || 0}
- Calorías consumidas hoy: ${calorias || 0} de ${profile?.daily_calories || 1500} kcal meta
- Lo que comió hoy: ${comidas?.map(c => c.description).join(', ') || 'nada registrado aún'}

HISTORIAL DE ENTRENAMIENTO (últimos 30 días):
${recentHistory?.length
  ? recentHistory.map(w => {
      const exStr = (w.exercises || []).slice(0, 5).map(e => e.nombre + (e.peso_kg ? ` @${e.peso_kg}kg` : '')).join(', ')
      return `• ${w.date} — ${w.muscle_group} (${w.intensity || 'normal'})${exStr ? ': ' + exStr : ''}`
    }).join('\n')
  : 'Sin historial aún — es su primera semana'}

PLAN DE ENTRENAMIENTO FIJO (5 días):
${DEFAULT_PLAN.map(d => `Día ${d.dia} ${d.emoji} ${d.nombre}: ${d.ejercicios.map(e => e.nombre).join(', ')}`).join('\n')}
- Ejercicios que NUNCA debe incluir: ${exAvoided?.length ? exAvoided.join(', ') : 'ninguno'}
- Ejercicios prioritarios (incluir si posible): ${exPrioritized?.length ? exPrioritized.join(', ') : 'ninguno'}
- Historial de pesos recientes: ${weightHistory || 'sin datos aún — pide pesos ligeros para empezar'}

REGLAS DE COMPORTAMIENTO:
1. Siempre habla en español de España, con tono cálido, motivador y cercano
2. Usa su nombre "Fernanda" ocasionalmente para hacer la experiencia personal
3. NUNCA juzgues lo que comió ni hagas comentarios negativos sobre su cuerpo
4. Si el humor es "bajo" → propón entrenamientos más ligeros, usa tono extra cariñoso y comprensivo
5. Para sugerencias de comida: respeta SIEMPRE los alimentos que no le gustan
6. Adapta el vocabulario al nivel principiante — sin términos técnicos complejos
7. Sé breve y directa, no más de 3-4 frases en respuestas del chat
8. Celebra cada pequeño logro con entusiasmo genuino
9. Si tiene lesiones o limitaciones físicas → NUNCA incluyas ejercicios que las agraven; sugiere siempre alternativas seguras
10. Usa la altura, el peso y la edad para dar recomendaciones calóricas y de progresión más precisas

CUANDO GENERES UN ENTRENAMIENTO, devuelve SOLO este JSON:
{"titulo":"Nombre motivador del entrenamiento","grupo_muscular":"piernas|superior|core|cardio|fullbody|ligero","intensidad":"ligero|normal|intenso","duracion_min":30,"ejercicios":[{"nombre":"Nombre","series":3,"repeticiones":"12","descripcion":"Descripción simple"}]}

CUANDO ESTIMES CALORÍAS, devuelve SOLO este JSON:
{"descripcion":"Resumen","calorias":450,"proteina_g":35,"carbs_g":40,"grasa_g":12}

CUANDO SUGERIERAS PLATOS, devuelve SOLO este JSON:
{"sugerencias":[{"nombre":"Nombre","descripcion":"Descripción","calorias_aprox":350,"tiempo_prep":"20 min"}]}

PROPONER CAMBIOS EN EL PERFIL — Cuando Fernanda confirme querer cambiar su meta calórica, peso u objetivo, añade EXACTAMENTE este bloque al FINAL de tu respuesta:
[ACCIÓN:{"type":"update_calories","value":1800,"description":"Cambiar meta diaria a 1800 kcal"}]
Tipos disponibles: update_calories (value:número), update_weight (current_weight:número, goal_weight:número), update_goal (goal:"texto").
Solo añade el bloque tras confirmación explícita. No lo añadas si el usuario solo pregunta o comenta.`
}

// ============================================================
// TOAST
// ============================================================
const Toast = ({ toasts }) => (
  <div className="toast-container">
    {toasts.map(t => (
      <div key={t.id} className={`toast toast-${t.type}`}>
        <Icon name={t.type === 'success' ? 'check' : t.type === 'error' ? 'x' : 'info'} size={16} />
        {t.msg}
      </div>
    ))}
  </div>
)

// ============================================================
// ONBOARDING
// ============================================================
const Onboarding = ({ onComplete }) => {
  const [step, setStep] = useState(0)
  const [form, setForm] = useState({
    foodLikes: [],
    foodDislikes: [],
    likesInput: '',
    dislikesInput: '',
    dailyCalories: 1500,
    weight: '',
    weightGoal: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const updateForm = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const addTag = (field, input) => {
    const val = form[input].trim()
    if (!val) return
    updateForm(field, [...form[field], val])
    updateForm(input, '')
  }

  const removeTag = (field, idx) => {
    updateForm(field, form[field].filter((_, i) => i !== idx))
  }

  const handleNext = async () => {
    setError('')
    if (step === 0) { setStep(1); return }
    if (step === 1) {
      setLoading(true)
      try {
        const url = (import.meta.env.VITE_SUPABASE_URL || '').trim()
        const key = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim()
        const sb = initSupabase(url, key)

        // Try upsert first (works if UNIQUE constraint exists on name)
        const { error: upsertErr } = await sb.from('profiles').upsert({
          name: 'Fernanda',
          goal: 'Adelgazar',
          level: 'Principiante',
          daily_calories: form.dailyCalories,
          food_likes: form.foodLikes,
          food_dislikes: form.foodDislikes,
          current_weight: Number(form.weight) || null,
          goal_weight: Number(form.weightGoal) || null,
        }, { onConflict: 'name' })

        if (upsertErr) {
          // Fallback: plain insert (ignore duplicate errors)
          const { error: insertErr } = await sb.from('profiles').insert({
            name: 'Fernanda',
            goal: 'Adelgazar',
            level: 'Principiante',
            daily_calories: form.dailyCalories,
            food_likes: form.foodLikes,
            food_dislikes: form.foodDislikes,
            current_weight: Number(form.weight) || null,
            goal_weight: Number(form.weightGoal) || null,
          })
          if (insertErr && insertErr.code !== '23505') {
            console.error('Profile insert failed:', insertErr)
          }
        }

        onComplete()
      } catch (e) {
        console.error('Onboarding error:', e)
        onComplete()
      }
      setLoading(false)
    }
  }

  const steps = [
    {
      title: 'Tu objetivo',
      content: (
        <div className="onboarding-step">
          <div className="card card-coral" style={{ textAlign: 'center', padding: '20px' }}>
            <p style={{ fontSize: '2rem', marginBottom: '8px' }}>🎯</p>
            <h3>¡Adelgazar de forma saludable!</h3>
            <p style={{ opacity: 0.9, marginTop: '4px', fontSize: '0.875rem' }}>Tu meta calórica diaria es 1.500 kcal</p>
          </div>
          <div className="input-group">
            <label className="input-label">Meta calórica diaria (kcal)</label>
            <input className="input" type="number" value={form.dailyCalories}
              onChange={e => updateForm('dailyCalories', Number(e.target.value))} />
          </div>
          <div className="flex gap-8">
            <div className="input-group" style={{ flex: 1 }}>
              <label className="input-label">Peso actual (kg)</label>
              <input className="input" type="number" placeholder="65" value={form.weight}
                onChange={e => updateForm('weight', e.target.value)} />
            </div>
            <div className="input-group" style={{ flex: 1 }}>
              <label className="input-label">Peso meta (kg)</label>
              <input className="input" type="number" placeholder="55" value={form.weightGoal}
                onChange={e => updateForm('weightGoal', e.target.value)} />
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Tus preferencias',
      content: (
        <div className="onboarding-step">
          <div className="input-group">
            <label className="input-label">Alimentos que te gustan</label>
            <div className="input-row">
              <input className="input" placeholder="Arroz, pollo, fruta..." value={form.likesInput}
                onChange={e => updateForm('likesInput', e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addTag('foodLikes', 'likesInput')} />
              <button className="btn btn-secondary btn-sm" onClick={() => addTag('foodLikes', 'likesInput')}>
                <Icon name="plus" size={16} />
              </button>
            </div>
            <div className="tags-wrap mt-8">
              {form.foodLikes.map((f, i) => (
                <span key={i} className="tag">
                  {f}
                  <button className="tag-remove" onClick={() => removeTag('foodLikes', i)}>
                    <Icon name="x" size={12} />
                  </button>
                </span>
              ))}
            </div>
          </div>
          <div className="input-group">
            <label className="input-label">Alimentos que NO te gustan</label>
            <div className="input-row">
              <input className="input" placeholder="Hígado, brócoli..." value={form.dislikesInput}
                onChange={e => updateForm('dislikesInput', e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addTag('foodDislikes', 'dislikesInput')} />
              <button className="btn btn-secondary btn-sm" onClick={() => addTag('foodDislikes', 'dislikesInput')}>
                <Icon name="plus" size={16} />
              </button>
            </div>
            <div className="tags-wrap mt-8">
              {form.foodDislikes.map((f, i) => (
                <span key={i} className="tag tag-dislike">
                  {f}
                  <button className="tag-remove" onClick={() => removeTag('foodDislikes', i)}>
                    <Icon name="x" size={12} />
                  </button>
                </span>
              ))}
            </div>
          </div>
          {error && <p style={{ color: 'var(--danger)', fontSize: '0.875rem', textAlign: 'center' }}>{error}</p>}
        </div>
      )
    }
  ]

  return (
    <div className="onboarding-screen">
      <div className="blob-bg blob-1" />
      <div className="blob-bg blob-2" />

      <div className="onboarding-logo">FitFernanda</div>
      <p className="onboarding-subtitle">
        {step === 0 ? '¡Hola Fernanda! 🌸 Cuéntame sobre tu objetivo' : 'Cuéntame qué te gusta comer'}
      </p>

      <div className="onboarding-card">
        <div className="step-dots" style={{ marginBottom: '24px' }}>
          {steps.map((_, i) => <div key={i} className={`dot ${i === step ? 'active' : ''}`} />)}
        </div>
        <h2 className="step-title" style={{ marginBottom: '20px' }}>{steps[step].title}</h2>
        {steps[step].content}
        <button
          className="btn btn-primary btn-lg"
          style={{ marginTop: '24px' }}
          onClick={handleNext}
          disabled={loading}
          id="onboarding-next-btn"
        >
          {loading ? <><div className="spinner spinner-sm" />Configurando...</> :
            step < steps.length - 1 ? 'Continuar →' : '¡Empezar! 🌸'}
        </button>
      </div>
    </div>
  )
}

// ============================================================
// HOME SCREEN
// ============================================================
const HomeScreen = ({ profile, claudeKey, supabase, onNavigate, addToast }) => {
  const [humor, setHumor] = useState(null)
  const [showHumorModal, setShowHumorModal] = useState(false)
  const [todayCals, setTodayCals] = useState(0)
  const [lastTreino, setLastTreino] = useState(null)
  const [suggestion, setSuggestion] = useState('')
  const [loadingSuggestion, setLoadingSuggestion] = useState(true)
  const [savingHumor, setSavingHumor] = useState(false)
  const [selectedHumor, setSelectedHumor] = useState('')
  const [expandedLastWorkout, setExpandedLastWorkout] = useState(false)
  const [dataLoaded, setDataLoaded] = useState(false)

  const today = new Date().toISOString().split('T')[0]

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    const sb = supabase
    // Load today's humor
    const { data: hd } = await sb.from('humor_checkin').select('*').eq('date', today).single()
    setHumor(hd)

    // Load today's calories
    const { data: meals } = await sb.from('refeicoes').select('calories').eq('date', today)
    const totalCals = meals?.reduce((s, m) => s + (m.calories || 0), 0) || 0
    setTodayCals(totalCals)

    // Load last workout
    const { data: treinos } = await sb.from('treinos').select('*').order('date', { ascending: false }).limit(1)
    setLastTreino(treinos?.[0] || null)
    setDataLoaded(true)

    // Generate daily suggestion
    generateSuggestion(hd, totalCals, treinos?.[0])
  }

  const generateSuggestion = async (humorData, cals, treino) => {
    setLoadingSuggestion(true)
    try {
      const sp = buildSystemPrompt(profile, {
        humor: humorData?.level,
        calorias: cals,
        comidas: [],
        ultimoTreino: treino,
        diasSemana: 0,
      })
      const text = await callClaude(
        claudeKey, sp,
        `Genera una frase motivadora corta y personalizada para Fernanda para hoy. Máximo 2 frases. Considera su humor del día: ${humorData?.level || 'no registrado'}. No uses emojis en exceso.`,
      )
      setSuggestion(text)
    } catch {
      setSuggestion('¡Cada día que entrenas es un paso más hacia tu mejor versión! Fernanda, tú puedes. 💪')
    }
    setLoadingSuggestion(false)
  }

  const saveHumor = async () => {
    if (!selectedHumor) return
    setSavingHumor(true)
    try {
      const { data: existing } = await supabase.from('humor_checkin').select('id').eq('date', today).maybeSingle()
      let error
      if (existing) {
        ;({ error } = await supabase.from('humor_checkin').update({ level: selectedHumor }).eq('date', today))
      } else {
        ;({ error } = await supabase.from('humor_checkin').insert({ date: today, level: selectedHumor }))
      }
      if (error) throw error
      setHumor({ level: selectedHumor })
      setShowHumorModal(false)
      addToast('success', '¡Check-in de humor guardado! 🌸')
    } catch {
      addToast('error', 'Error al guardar el humor. Verifica la conexión.')
    }
    setSavingHumor(false)
  }

  const moodEmoji = { alto: '🌟', normal: '😊', bajo: '🌧️' }
  const moodLabel = { alto: 'Energía alta', normal: 'Día normal', bajo: 'Un poco cansada' }
  const moodColor = { alto: 'var(--success)', normal: 'var(--coral)', bajo: 'var(--nude-dark)' }

  const hour = new Date().getHours()
  const greeting = hour < 12 ? '¡Buenos días' : hour < 18 ? '¡Buenas tardes' : '¡Buenas noches'
  const pct = Math.min(100, Math.round((todayCals / (profile?.daily_calories || 1500)) * 100))

  return (
    <div className="screen-content">
      {/* Greeting */}
      <div style={{ paddingTop: '4px' }}>
        <h1 style={{ fontSize: '1.5rem' }}>{greeting}, Fernanda! 🌸</h1>
        <p className="text-muted" style={{ marginTop: '4px' }}>
          {new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
        </p>
      </div>

      {/* Humor card — fixed height */}
      <div className="card card-sm" id="humor-card" style={{ minHeight: '72px' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <span style={{ fontSize: '1.5rem' }}>
              {humor ? moodEmoji[humor.level] : '💭'}
            </span>
            <div>
              <p style={{ fontWeight: 600, fontSize: '0.9rem', color: humor ? moodColor[humor.level] : 'var(--text)' }}>
                {humor ? moodLabel[humor.level] : 'Check-in de humor'}
              </p>
              <p className="text-light" style={{ fontSize: '0.8rem' }}>
                {humor ? '¡Anotado!' : 'Cuéntame cómo estás hoy'}
              </p>
            </div>
          </div>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setShowHumorModal(true)}
            id="humor-checkin-btn"
          >
            {humor ? <Icon name="pencil" size={14} /> : <Icon name="plus" size={14} />}
            {humor ? 'Cambiar' : 'Registrar'}
          </button>
        </div>
      </div>

      {/* Calories card */}
      <div className="card" id="calories-summary-card">
        <div className="section-title">
          <Icon name="fire" />
          Calorías de hoy
        </div>
        <div className="progress-wrap mt-12">
          <div className="progress-header">
            <span className="progress-label">{todayCals} kcal consumidas</span>
            <span className="progress-value">{pct}%</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${pct}%` }} />
          </div>
          <p className="text-muted" style={{ fontSize: '0.8rem', marginTop: '6px' }}>
            Meta: {profile?.daily_calories || 1500} kcal · Quedan: <strong style={{ color: 'var(--coral)' }}>{Math.max(0, (profile?.daily_calories || 1500) - todayCals)} kcal</strong>
          </p>
        </div>
      </div>

      {/* Last workout card — fixed height to avoid layout shift */}
      <div className="card" id="last-workout-card" style={{ minHeight: '88px' }}>
        <div className="section-title"><Icon name="dumbbell" />Último entrenamiento</div>
        {!dataLoaded ? (
          <div style={{ marginTop: '12px', height: '36px', background: 'var(--border-light)', borderRadius: '8px', opacity: 0.6 }} />
        ) : lastTreino ? (
          <>
            <button
              onClick={() => setExpandedLastWorkout(v => !v)}
              style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginTop: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontFamily: 'var(--font-body)', textAlign: 'left' }}
            >
              <div>
                <p style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text)' }}>{lastTreino.muscle_group}</p>
                <p className="text-muted" style={{ fontSize: '0.8rem', marginTop: '3px' }}>
                  {new Date(lastTreino.date).toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' })}
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className={`badge badge-${lastTreino.intensity === 'ligero' ? 'nude' : 'coral'}`}>{lastTreino.intensity}</span>
                <Icon name={expandedLastWorkout ? 'x' : 'plus'} size={14} style={{ color: 'var(--text-muted)' }} />
              </div>
            </button>
            {expandedLastWorkout && (
              <div style={{ marginTop: '12px', borderTop: '1px solid var(--border-light)', paddingTop: '12px' }}>
                {(lastTreino.exercises || lastTreino.ejercicios || []).map((ex, i, arr) => (
                  <div key={i} style={{ display: 'flex', gap: '8px', padding: '6px 0', borderBottom: i < arr.length - 1 ? '1px solid var(--border-light)' : 'none' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--coral)', fontWeight: 700, minWidth: '16px' }}>{i + 1}</span>
                    <div>
                      <p style={{ fontSize: '0.875rem', fontWeight: 600 }}>{ex.nombre}</p>
                      <p className="text-muted" style={{ fontSize: '0.75rem' }}>
                        {ex.series} series × {ex.repeticiones} reps{ex.peso_kg ? ` · ${ex.peso_kg}kg` : ''}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <p className="text-muted" style={{ fontSize: '0.875rem', marginTop: '12px' }}>
            🏋️ Aún no tienes entrenamientos. ¡Empieza hoy!
          </p>
        )}
      </div>

      {/* CTA Button */}
      <button className="btn btn-primary btn-lg" onClick={() => onNavigate('workout')} id="workout-cta-btn">
        <Icon name="sparkles" size={20} />
        Entrenar Hoy
      </button>

      {/* AI Suggestion — min-height to avoid layout shift */}
      <div className="suggestion-card" id="coach-suggestion-card" style={{ minHeight: '100px' }}>
        <div className="flex items-center gap-8" style={{ marginBottom: '10px' }}>
          <span style={{ fontSize: '1.1rem' }}>🌸</span>
          <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--coral)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Coach Fit dice
          </p>
        </div>
        <p className="suggestion-text" style={{ minHeight: '42px' }}>
          {loadingSuggestion ? <span className="text-muted" style={{ opacity: 0.5 }}>Pensando en algo especial para ti...</span> : `"${suggestion}"`}
        </p>
      </div>

      {/* Humor Modal */}
      {showHumorModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(61,44,44,0.4)', backdropFilter: 'blur(4px)', zIndex: 80, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
          <div style={{ background: 'var(--bg-card)', borderRadius: '24px 24px 0 0', padding: '28px 24px 36px', width: '100%', maxWidth: '430px', animation: 'fadeSlideIn 0.3s ease forwards' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '8px' }}>¿Cómo te sientes hoy?</h2>
            <p className="text-muted" style={{ textAlign: 'center', fontSize: '0.875rem', marginBottom: '24px' }}>
              Tu humor nos ayuda a adaptar tu entrenamiento
            </p>
            <div className="mood-selector">
              {[
                { id: 'alto', emoji: '🌟', label: 'Con energía' },
                { id: 'normal', emoji: '😊', label: 'Normal' },
                { id: 'bajo', emoji: '🌧️', label: 'Cansada' },
              ].map(m => (
                <button key={m.id} className={`mood-btn ${selectedHumor === m.id ? 'selected' : ''}`} onClick={() => setSelectedHumor(m.id)}>
                  <span className="mood-emoji">{m.emoji}</span>
                  {m.label}
                </button>
              ))}
            </div>
            <div className="flex gap-8 mt-16">
              <button className="btn btn-ghost" style={{ flex: 1 }} onClick={() => setShowHumorModal(false)}>Cancelar</button>
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={saveHumor} disabled={!selectedHumor || savingHumor} id="save-humor-btn">
                {savingHumor ? <div className="spinner spinner-sm" /> : '¡Guardar!'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ============================================================
// WORKOUT SCREEN
// ============================================================
const WorkoutScreen = ({ profile, claudeKey, supabase, addToast }) => {
  const [treino, setTreino] = useState(null)
  const [checked, setChecked] = useState({})
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [history, setHistory] = useState([])
  const [view, setView] = useState('today') // 'today' | 'history' | 'plan'
  const [generated, setGenerated] = useState(false)
  const [humor, setHumor] = useState(null)
  const [seedingPlan, setSeedingPlan] = useState(false)
  const [planExpanded, setPlanExpanded] = useState(null)
  const [weights, setWeights] = useState({})
  const [weightSuggestions, setWeightSuggestions] = useState({})
  const [exAvoided, setExAvoided] = useState(() => { try { return JSON.parse(localStorage.getItem('ff_ex_avoided') || '[]') } catch { return [] } })
  const [exPrioritized, setExPrioritized] = useState(() => { try { return JSON.parse(localStorage.getItem('ff_ex_prioritized') || '[]') } catch { return [] } })
  const [exInput, setExInput] = useState({ avoided: '', prioritized: '' })
  const [expandedExercise, setExpandedExercise] = useState(null)
  const [swappingExercise, setSwappingExercise] = useState(null)
  const mountedRef = useRef(true)

  const today = new Date().toISOString().split('T')[0]

  useEffect(() => {
    mountedRef.current = true
    loadTodayWorkout()
    loadHistory()
    return () => { mountedRef.current = false }
  }, [])

  const normalizeTreino = (data) => ({
    ...data,
    titulo: data.titulo || data.muscle_group,
    grupo_muscular: data.grupo_muscular || data.muscle_group,
    intensidad: data.intensidad || data.intensity,
    ejercicios: data.ejercicios || data.exercises || [],
  })

  const loadTodayWorkout = async () => {
    const { data: hd } = await supabase.from('humor_checkin').select('level').eq('date', today).maybeSingle()
    if (mountedRef.current) setHumor(hd?.level)
    const { data } = await supabase.from('treinos').select('*').eq('date', today).maybeSingle()
    if (data) {
      if (mountedRef.current) { setTreino(normalizeTreino(data)); setGenerated(false) }
    } else {
      try {
        const pending = localStorage.getItem('ff_pending_treino_' + today)
        if (pending && mountedRef.current) { setTreino(normalizeTreino(JSON.parse(pending))); setGenerated(true) }
      } catch {}
    }
  }

  const loadHistory = async () => {
    const { data } = await supabase.from('treinos').select('*').order('date', { ascending: false }).limit(14)
    const hist = data || []
    if (mountedRef.current) setHistory(hist)
    // Build weight suggestions from history
    const suggestions = {}
    for (const t of hist) {
      const exList = t.exercises || t.ejercicios || []
      for (const ex of exList) {
        if (ex.peso_kg && !suggestions[ex.nombre]) suggestions[ex.nombre] = ex.peso_kg
      }
    }
    if (mountedRef.current) setWeightSuggestions(suggestions)
  }

  const seedPlan = async () => {
    setSeedingPlan(true)
    try {
      const base = new Date()
      const entries = DEFAULT_PLAN.map((day, i) => {
        const d = new Date(base)
        d.setDate(base.getDate() - ((DEFAULT_PLAN.length - i) * 2))
        return {
          date: d.toISOString().split('T')[0],
          muscle_group: day.nombre,
          intensity: day.intensidad,
          exercises: day.ejercicios,
          completed: true,
        }
      })
      await supabase.from('treinos').insert(entries)
      await loadHistory()
      addToast('success', '¡Plan base importado al historial! 🏋️')
    } catch {
      addToast('error', 'Error al importar el plan')
    }
    setSeedingPlan(false)
  }

  const useTemplate = (day) => {
    setTreino(normalizeTreino({
      titulo: day.nombre,
      grupo_muscular: day.grupo_muscular,
      intensidad: day.intensidad,
      duracion_min: day.duracion_min,
      ejercicios: day.ejercicios,
    }))
    setGenerated(true)
    setChecked({})
    setView('today')
  }

  const generateWorkout = async (variant = false) => {
    if (!humor) {
      addToast('error', '¡Registra primero tu humor del día en Inicio! 🌸')
      return
    }
    setLoading(true)
    try {
      const thirtyDaysAgo = new Date(); thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      const [{ data: recentWorkouts }, { data: meals }] = await Promise.all([
        supabase.from('treinos').select('date,muscle_group,intensity,exercises').order('date', { ascending: false }).gte('date', thirtyDaysAgo.toISOString().split('T')[0]).limit(30),
        supabase.from('refeicoes').select('calories').eq('date', today),
      ])
      const cals = meals?.reduce((s, m) => s + (m.calories || 0), 0) || 0
      const weightHistoryStr = Object.entries(weightSuggestions).map(([ex, kg]) => `${ex}: ${kg}kg`).join(', ') || null

      const sp = buildSystemPrompt(profile, {
        humor, calorias: cals, comidas: [], ultimoTreino: recentWorkouts?.[0], diasSemana: history.length,
        exAvoided, exPrioritized, weightHistory: weightHistoryStr, recentHistory: recentWorkouts,
      })

      let prompt = humor === 'bajo'
        ? 'Fernanda está cansada hoy. Genera un entrenamiento MUY ligero de no más de 20 minutos.'
        : variant
          ? `Fernanda quiere algo diferente. El anterior era ${treino?.muscle_group || 'fullbody'}. Genera una alternativa. Respeta los ejercicios a evitar.`
          : 'Genera el entrenamiento de hoy para Fernanda basado en su plan de 5 días. Varía el grupo respecto al último. Incluye 4-6 ejercicios. Respeta ejercicios a evitar y prioriza los favoritos.'

      // 45s timeout para modelos gratuitos lentos
      const result = await Promise.race([
        callClaude(claudeKey, sp, prompt, true),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Tiempo de espera agotado (45s). Inténtalo de nuevo.')), 45000))
      ])

      // Guardar en localStorage para persistir si el usuario navega
      localStorage.setItem('ff_pending_treino_' + today, JSON.stringify(result))

      if (mountedRef.current) {
        setTreino(normalizeTreino(result))
        setGenerated(true)
        setChecked({})
        setWeights({})
      }
    } catch (e) {
      if (mountedRef.current) addToast('error', `Error al generar: ${e.message}`)
    }
    if (mountedRef.current) setLoading(false)
  }

  const swapExercise = async (exIndex) => {
    setSwappingExercise(exIndex)
    try {
      const ex = treino.ejercicios[exIndex]
      const sp = buildSystemPrompt(profile, { humor, calorias: 0, comidas: [], ultimoTreino: null, diasSemana: history.length, exAvoided, exPrioritized, weightHistory: null })
      const result = await Promise.race([
        callClaude(claudeKey, sp,
          `Sugiere UN ejercicio alternativo similar a "${ex.nombre}" para el grupo muscular "${treino.grupo_muscular || treino.titulo}". ` +
          `Mismo nivel de dificultad. Devuelve SOLO JSON con esta estructura exacta: {"nombre":"...","series":N,"repeticiones":"...","descripcion":"..."}`,
          true),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Tiempo de espera agotado')), 30000))
      ])
      const updated = treino.ejercicios.map((e, i) => i === exIndex ? { ...result } : e)
      const updatedTreino = { ...treino, ejercicios: updated }
      setTreino(updatedTreino)
      if (generated) localStorage.setItem('ff_pending_treino_' + today, JSON.stringify(updatedTreino))
      setExpandedExercise(null)
      addToast('success', `Ejercicio cambiado a ${result.nombre} 💪`)
    } catch (e) {
      addToast('error', `Error al cambiar ejercicio: ${e.message}`)
    }
    setSwappingExercise(null)
  }

  const saveWorkout = async () => {
    setSaving(true)
    try {
      const exercisesWithWeights = treino.ejercicios?.map((ex, i) => ({
        ...ex,
        peso_kg: weights[i] ? Number(weights[i]) : null,
      }))
      const payload = {
        date: today,
        muscle_group: treino.grupo_muscular || treino.titulo,
        intensity: treino.intensidad,
        exercises: exercisesWithWeights,
        completed: Object.values(checked).filter(Boolean).length === treino.ejercicios.length,
      }
      const { data: existing } = await supabase.from('treinos').select('id').eq('date', today).maybeSingle()
      let error
      if (existing) {
        ;({ error } = await supabase.from('treinos').update(payload).eq('date', today))
      } else {
        ;({ error } = await supabase.from('treinos').insert(payload))
      }
      if (error) throw error
      localStorage.removeItem('ff_pending_treino_' + today)
      setGenerated(false)
      addToast('success', '¡Entrenamiento guardado! 💪 ¡Fantástico trabajo!')
      loadHistory()
    } catch (e) {
      addToast('error', 'Error al guardar el entrenamiento')
    }
    setSaving(false)
  }

  const toggleCheck = (i) => {
    setChecked(c => ({ ...c, [i]: !c[i] }))
  }

  const muscleGroupEmoji = {
    piernas: '🦵', superior: '💪', core: '🔥', cardio: '🏃', fullbody: '⚡', ligero: '🕊️'
  }

  return (
    <div className="screen-content">
      {/* Tab switcher */}
      <div style={{ display: 'flex', background: 'var(--border-light)', borderRadius: 'var(--radius-full)', padding: '4px', gap: '4px' }}>
        {[['today', 'Hoy'], ['history', 'Historial'], ['plan', 'Mi Plan']].map(([v, l]) => (
          <button key={v} onClick={() => setView(v)} style={{
            flex: 1, padding: '9px', border: 'none', borderRadius: 'var(--radius-full)',
            background: view === v ? 'var(--bg-card)' : 'transparent',
            color: view === v ? 'var(--coral)' : 'var(--text-muted)',
            fontWeight: view === v ? 600 : 500,
            fontSize: '0.875rem', cursor: 'pointer',
            boxShadow: view === v ? 'var(--shadow-sm)' : 'none',
            transition: 'var(--transition)',
            fontFamily: 'var(--font-body)',
          }}>
            {l}
          </button>
        ))}
      </div>

      {view === 'today' ? (
        <>
          {!treino && !loading && (
            <div className="empty-state">
              <div className="empty-icon">
                <Icon name="dumbbell" size={28} />
              </div>
              <h3 className="empty-title">¡Tu entrenamiento te espera!</h3>
              <p className="empty-desc">
                {humor === 'bajo'
                  ? 'Hoy estás un poco cansada. Te preparo algo suave y gentil 🕊️'
                  : 'Coach Fit generará un entrenamiento personalizado para ti'}
              </p>
              <div style={{ display: 'flex', gap: '10px', marginTop: '12px', justifyContent: 'center' }}>
                <button className="btn btn-primary btn-sm" onClick={() => generateWorkout()} id="generate-workout-btn">
                  <Icon name="sparkles" size={16} />Generar con IA
                </button>
                <button className="btn btn-secondary btn-sm" onClick={() => setView('plan')}>
                  <Icon name="dumbbell" size={16} />Usar mi plan
                </button>
              </div>
            </div>
          )}

          {loading && (
            <div className="loading-wrap">
              <div className="spinner" />
              <p className="loading-text">Coach Fit está preparando tu rutina...</p>
            </div>
          )}

          {treino && !loading && (
            <>
              <div className="card card-coral">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <p style={{ opacity: 0.8, fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '4px' }}>
                      Entrenamiento de hoy
                    </p>
                    <h2 style={{ fontSize: '1.2rem' }}>{treino.titulo}</h2>
                  </div>
                  <span style={{ fontSize: '2rem' }}>
                    {muscleGroupEmoji[treino.grupo_muscular] || '💪'}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '8px', marginTop: '14px', flexWrap: 'wrap' }}>
                  {treino.duracion_min && (
                    <span style={{ background: 'rgba(255,255,255,0.25)', borderRadius: '999px', padding: '4px 12px', fontSize: '0.8rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Icon name="clock" size={12} /> {treino.duracion_min} min
                    </span>
                  )}
                  <span style={{ background: 'rgba(255,255,255,0.25)', borderRadius: '999px', padding: '4px 12px', fontSize: '0.8rem', fontWeight: 600, textTransform: 'capitalize' }}>
                    {treino.intensidad}
                  </span>
                  <span style={{ background: 'rgba(255,255,255,0.25)', borderRadius: '999px', padding: '4px 12px', fontSize: '0.8rem', fontWeight: 600, textTransform: 'capitalize' }}>
                    {treino.grupo_muscular}
                  </span>
                </div>
              </div>

              <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <div className="section-title" style={{ padding: '16px 16px 12px' }}>
                  <Icon name="dumbbell" />
                  Ejercicios ({Object.values(checked).filter(Boolean).length}/{treino.ejercicios?.length || 0} completados)
                </div>
                {treino.ejercicios?.map((ex, i) => {
                  const isExpanded = expandedExercise === i
                  const hasSuggestion = weightSuggestions[ex.nombre]
                  return (
                    <div key={i} style={{ borderTop: i === 0 ? 'none' : '1px solid var(--border-light)' }}>
                      {/* Header row */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 16px' }}>
                        <button className={`exercise-checkbox ${checked[i] ? 'checked' : ''}`} onClick={() => toggleCheck(i)} id={`exercise-check-${i}`}>
                          {checked[i] && <Icon name="check" size={12} />}
                        </button>
                        {/* Tappable name area */}
                        <button
                          onClick={() => setExpandedExercise(isExpanded ? null : i)}
                          style={{ flex: 1, background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', fontFamily: 'var(--font-body)', padding: 0 }}
                        >
                          <p className={`exercise-name${checked[i] ? ' done' : ''}`} style={{ textDecoration: checked[i] ? 'line-through' : 'none', opacity: checked[i] ? 0.6 : 1 }}>{ex.nombre}</p>
                          <p className="exercise-sets">{ex.series} series × {ex.repeticiones} reps</p>
                        </button>
                        {/* Weight input */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                          <input
                            type="number"
                            placeholder={hasSuggestion ? `${hasSuggestion}` : '—'}
                            value={weights[i] || ''}
                            onChange={e => setWeights(w => ({ ...w, [i]: e.target.value }))}
                            style={{ width: '60px', padding: '5px 6px', borderRadius: '10px', border: `1.5px solid ${weights[i] ? 'var(--coral)' : 'var(--border)'}`, background: 'var(--bg)', fontSize: '0.82rem', textAlign: 'center', fontFamily: 'var(--font-body)', outline: 'none', color: 'var(--text)' }}
                          />
                          <span style={{ fontSize: '0.65rem', color: hasSuggestion && !weights[i] ? 'var(--coral)' : 'var(--text-muted)', fontWeight: hasSuggestion && !weights[i] ? 600 : 400 }}>
                            {hasSuggestion && !weights[i] ? `↑${hasSuggestion}kg` : 'kg'}
                          </span>
                        </div>
                        {/* Expand toggle */}
                        <button
                          onClick={() => setExpandedExercise(isExpanded ? null : i)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '4px', borderRadius: '6px', display: 'flex', alignItems: 'center' }}
                        >
                          <Icon name={isExpanded ? 'x' : 'info'} size={16} />
                        </button>
                      </div>
                      {/* Expanded detail panel */}
                      {isExpanded && (
                        <div style={{ background: 'var(--border-light)', borderTop: '1px solid var(--border)', padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                          {ex.descripcion && (
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>{ex.descripcion}</p>
                          )}
                          {hasSuggestion && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(232,115,90,0.08)', borderRadius: '8px', padding: '8px 10px' }}>
                              <span style={{ fontSize: '1rem' }}>💡</span>
                              <p style={{ fontSize: '0.82rem', color: 'var(--coral)', fontWeight: 600 }}>
                                Última vez: {hasSuggestion}kg — intenta {Math.round(hasSuggestion * 1.025 / 2.5) * 2.5}kg hoy
                              </p>
                            </div>
                          )}
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => swapExercise(i)}
                            disabled={swappingExercise === i}
                            style={{ width: '100%' }}
                            id={`swap-exercise-${i}`}
                          >
                            {swappingExercise === i
                              ? <><div className="spinner spinner-sm" />Buscando alternativa...</>
                              : <><Icon name="refresh" size={14} />Cambiar por ejercicio similar</>
                            }
                          </button>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>

              {/* LISTO — siempre visible */}
              <button
                className="btn btn-success"
                onClick={saveWorkout}
                disabled={saving}
                id="save-workout-btn"
                style={{ fontSize: '1rem', padding: '15px', letterSpacing: '0.04em', fontWeight: 700 }}
              >
                {saving
                  ? <><div className="spinner spinner-sm" />Guardando...</>
                  : <><Icon name="check" size={20} />¡LISTO! Guardar entreno y pesos</>
                }
              </button>

              {/* Secondary: generate new or generate variant */}
              <button
                className="btn btn-ghost"
                onClick={() => generateWorkout(generated)}
                disabled={loading}
                id="regen-workout-btn"
                style={{ fontSize: '0.85rem' }}
              >
                <Icon name="sparkles" size={15} />
                {generated ? 'Generar variante diferente' : 'Generar nuevo entreno para hoy'}
              </button>
            </>
          )}
        </>
      ) : view === 'history' ? (
        <>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 className="section-title"><Icon name="trophy" />Últimos 14 días</h3>
            {history.length === 0 && (
              <button className="btn btn-secondary btn-sm" onClick={seedPlan} disabled={seedingPlan}>
                {seedingPlan ? <div className="spinner spinner-sm" /> : <><Icon name="plus" size={14} />Importar plan</>}
              </button>
            )}
          </div>
          {history.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon"><Icon name="dumbbell" size={28} /></div>
              <p className="empty-desc">Sin entrenamientos aún. Importa tu plan base para empezar.</p>
            </div>
          ) : (
            history.map((t, i) => (
              <div key={i} className="history-item">
                <div className="history-icon">
                  <Icon name="dumbbell" size={20} style={{ color: 'var(--coral)' }} />
                </div>
                <div className="history-info">
                  <p className="history-title">{t.muscle_group}</p>
                  <div className="history-meta">
                    <span>{new Date(t.date).toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' })}</span>
                    <span className={`badge badge-${t.intensity === 'ligero' ? 'nude' : 'coral'}`}>{t.intensity}</span>
                    {t.completed && <span className="badge badge-success">✓ Completado</span>}
                  </div>
                </div>
              </div>
            ))
          )}
        </>
      ) : (
        <>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 className="section-title"><Icon name="star" />Plan de 5 días</h3>
            <button className="btn btn-secondary btn-sm" onClick={seedPlan} disabled={seedingPlan}>
              {seedingPlan ? <div className="spinner spinner-sm" /> : <><Icon name="refresh" size={14} />Importar historial</>}
            </button>
          </div>
          {/* Exercise preferences */}
          {[
            { field: 'avoided', label: '🚫 Ejercicios a evitar', state: exAvoided, setState: setExAvoided, color: 'var(--danger)', storageKey: 'ff_ex_avoided', placeholder: 'Ej: Sentadilla búlgara...' },
            { field: 'prioritized', label: '⭐ Ejercicios prioritarios', state: exPrioritized, setState: setExPrioritized, color: 'var(--success)', storageKey: 'ff_ex_prioritized', placeholder: 'Ej: Hip Thrust...' },
          ].map(({ field, label, state, setState, color, storageKey, placeholder }) => (
            <div key={field} className="card card-sm">
              <p style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '10px', color }}>{label}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '10px' }}>
                {state.map((ex, i) => (
                  <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '5px 10px', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 500, background: color + '18', color, border: `1px solid ${color}40` }}>
                    {ex}
                    <button onClick={() => { const n = state.filter((_, j) => j !== i); setState(n); localStorage.setItem(storageKey, JSON.stringify(n)) }} style={{ background: 'none', border: 'none', cursor: 'pointer', color, lineHeight: 1 }}>×</button>
                  </span>
                ))}
                {state.length === 0 && <p className="text-light" style={{ fontSize: '0.8rem' }}>Ninguno aún</p>}
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input className="input" placeholder={placeholder} value={exInput[field]} onChange={e => setExInput(v => ({ ...v, [field]: e.target.value }))}
                  onKeyDown={e => { if (e.key === 'Enter' && exInput[field].trim()) { const n = [...state, exInput[field].trim()]; setState(n); localStorage.setItem(storageKey, JSON.stringify(n)); setExInput(v => ({ ...v, [field]: '' })) } }}
                  style={{ flex: 1 }} />
                <button className="btn btn-secondary btn-sm" onClick={() => { if (!exInput[field].trim()) return; const n = [...state, exInput[field].trim()]; setState(n); localStorage.setItem(storageKey, JSON.stringify(n)); setExInput(v => ({ ...v, [field]: '' })) }}>
                  <Icon name="plus" size={14} />
                </button>
              </div>
            </div>
          ))}

          {DEFAULT_PLAN.map((day) => (
            <div key={day.dia} className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <button
                onClick={() => setPlanExpanded(planExpanded === day.dia ? null : day.dia)}
                style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontFamily: 'var(--font-body)' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '1.5rem' }}>{day.emoji}</span>
                  <div style={{ textAlign: 'left' }}>
                    <p style={{ fontWeight: 600, fontSize: '0.9375rem', color: 'var(--text)' }}>Día {day.dia} — {day.nombre}</p>
                    <p className="text-muted" style={{ fontSize: '0.8rem' }}>{day.ejercicios.length} ejercicios · {day.duracion_min} min · {day.intensidad}</p>
                  </div>
                </div>
                <Icon name={planExpanded === day.dia ? 'x' : 'plus'} size={16} style={{ color: 'var(--coral)', flexShrink: 0 }} />
              </button>
              {planExpanded === day.dia && (
                <div style={{ borderTop: '1px solid var(--border-light)', padding: '12px 16px 16px' }}>
                  {day.ejercicios.map((ex, i) => (
                    <div key={i} style={{ display: 'flex', gap: '10px', padding: '8px 0', borderBottom: i < day.ejercicios.length - 1 ? '1px solid var(--border-light)' : 'none' }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--coral)', fontWeight: 700, minWidth: '18px' }}>{i + 1}</span>
                      <div>
                        <p style={{ fontSize: '0.9rem', fontWeight: 600 }}>{ex.nombre}</p>
                        <p className="text-muted" style={{ fontSize: '0.8rem' }}>{ex.series} series × {ex.repeticiones} reps</p>
                        {ex.descripcion && <p style={{ fontSize: '0.75rem', color: 'var(--text-light)', marginTop: '2px' }}>{ex.descripcion}</p>}
                      </div>
                    </div>
                  ))}
                  <button className="btn btn-primary w-full" style={{ marginTop: '14px' }} onClick={() => useTemplate(day)}>
                    <Icon name="sparkles" size={16} />
                    Entrenar este día hoy
                  </button>
                </div>
              )}
            </div>
          ))}
        </>
      )}
    </div>
  )
}

// ============================================================
// NUTRITION SCREEN
// ============================================================
const NutritionScreen = ({ profile, claudeKey, supabase, addToast }) => {
  const [view, setView] = useState('log') // 'log' | 'history' | 'prefs'
  const [mealDesc, setMealDesc] = useState('')
  const [mealType, setMealType] = useState('almuerzo')
  const [calculated, setCalculated] = useState(null)
  const [calculating, setCalculating] = useState(false)
  const [saving, setSaving] = useState(false)
  const [todayMeals, setTodayMeals] = useState([])
  const [suggestions, setSuggestions] = useState(null)
  const [loadingSugg, setLoadingSugg] = useState(false)
  const [localProfile, setLocalProfile] = useState(profile)
  const [mealQty, setMealQty] = useState('')
  const [likesInput, setLikesInput] = useState('')
  const [dislikesInput, setDislikesInput] = useState('')
  const [calHistory, setCalHistory] = useState([])
  const [loadingCalHistory, setLoadingCalHistory] = useState(false)
  const [expandedDay, setExpandedDay] = useState(null)

  const today = new Date().toISOString().split('T')[0]

  useEffect(() => { loadMeals() }, [])

  useEffect(() => {
    if (view === 'history' && calHistory.length === 0) loadCalHistory()
  }, [view])

  const loadMeals = async () => {
    const { data } = await supabase.from('refeicoes').select('*').eq('date', today).order('created_at')
    setTodayMeals(data || [])
  }

  const loadCalHistory = async () => {
    setLoadingCalHistory(true)
    const from = new Date(); from.setDate(from.getDate() - 30)
    const { data } = await supabase.from('refeicoes')
      .select('*')
      .gte('date', from.toISOString().split('T')[0])
      .order('date', { ascending: false })
    if (data) {
      const grouped = {}
      for (const m of data) {
        if (!grouped[m.date]) grouped[m.date] = { date: m.date, meals: [], cals: 0, prot: 0, carbs: 0, fat: 0 }
        grouped[m.date].meals.push(m)
        grouped[m.date].cals += m.calories || 0
        grouped[m.date].prot += m.protein_g || 0
        grouped[m.date].carbs += m.carbs_g || 0
        grouped[m.date].fat += m.fat_g || 0
      }
      setCalHistory(Object.values(grouped).sort((a, b) => b.date.localeCompare(a.date)))
    }
    setLoadingCalHistory(false)
  }

  const calculateMeal = async () => {
    if (!mealDesc.trim()) return
    setCalculating(true)
    setSuggestions(null)
    try {
      const sp = buildSystemPrompt(localProfile, { humor: null, calorias: 0, comidas: [], ultimoTreino: null, diasSemana: 0 })
      const result = await callClaude(claudeKey, sp, `Estima las calorías y macros de: "${mealDesc}". Devuelve SOLO el JSON.`, true)
      setCalculated(result)
    } catch (e) {
      addToast('error', `Error al calcular: ${e.message}`)
    }
    setCalculating(false)
  }

  const saveMeal = async () => {
    if (!calculated) return
    setSaving(true)
    try {
      const { error } = await supabase.from('refeicoes').insert({
        date: today,
        meal_type: mealType,
        description: calculated.descripcion || mealDesc,
        calories: calculated.calorias,
        protein_g: calculated.proteina_g,
        carbs_g: calculated.carbs_g,
        fat_g: calculated.grasa_g,
      })
      if (error) throw error
      setMealDesc('')
      setCalculated(null)
      addToast('success', '¡Comida guardada! 🥗')
      loadMeals()
    } catch (e) {
      addToast('error', 'Error al guardar la comida')
    }
    setSaving(false)
  }

  const getSuggestions = async () => {
    setLoadingSugg(true)
    setSuggestions(null)
    try {
      const totalCals = todayMeals.reduce((s, m) => s + (m.calories || 0), 0)
      const sp = buildSystemPrompt(localProfile, { humor: null, calorias: totalCals, comidas: todayMeals, ultimoTreino: null, diasSemana: 0 })
      const result = await callClaude(claudeKey, sp,
        `Fernanda quiere saber qué comer ahora. Ya lleva ${totalCals} kcal hoy de ${localProfile?.daily_calories || 1500} kcal meta. Sugiere 3 platos fáciles que pueda preparar en casa. Devuelve SOLO el JSON de sugerencias.`,
        true
      )
      setSuggestions(result.sugerencias || [])
    } catch (e) {
      addToast('error', `Error al obtener sugerencias: ${e.message}`)
    }
    setLoadingSugg(false)
  }

  const updatePreferences = async () => {
    const { error } = await supabase.from('profiles').update({
      food_likes: localProfile.food_likes,
      food_dislikes: localProfile.food_dislikes,
    }).eq('name', 'Fernanda')
    if (!error) addToast('success', 'Preferencias actualizadas 🌸')
    else addToast('error', 'Error al guardar preferencias')
  }

  const addTag = (field, val) => {
    if (!val.trim()) return
    setLocalProfile(p => ({ ...p, [field]: [...(p[field] || []), val.trim()] }))
  }

  const removeTag = (field, idx) => {
    setLocalProfile(p => ({ ...p, [field]: p[field].filter((_, i) => i !== idx) }))
  }

  const totalCals = todayMeals.reduce((s, m) => s + (m.calories || 0), 0)
  const totalProt = todayMeals.reduce((s, m) => s + (m.protein_g || 0), 0)
  const totalCarbs = todayMeals.reduce((s, m) => s + (m.carbs_g || 0), 0)
  const totalFat = todayMeals.reduce((s, m) => s + (m.fat_g || 0), 0)
  const calGoal = localProfile?.daily_calories || 1500
  const calPct = Math.min(100, Math.round((totalCals / calGoal) * 100))

  return (
    <div className="screen-content">
      {/* Tab switcher */}
      <div style={{ display: 'flex', background: 'var(--border-light)', borderRadius: 'var(--radius-full)', padding: '4px', gap: '4px' }}>
        {[['log', 'Registrar'], ['history', 'Historial'], ['prefs', 'Preferencias']].map(([v, l]) => (
          <button key={v} onClick={() => setView(v)} style={{
            flex: 1, padding: '9px', border: 'none', borderRadius: 'var(--radius-full)',
            background: view === v ? 'var(--bg-card)' : 'transparent',
            color: view === v ? 'var(--coral)' : 'var(--text-muted)',
            fontWeight: view === v ? 600 : 500, fontSize: '0.875rem', cursor: 'pointer',
            boxShadow: view === v ? 'var(--shadow-sm)' : 'none',
            transition: 'var(--transition)', fontFamily: 'var(--font-body)',
          }}>
            {l}
          </button>
        ))}
      </div>

      {view === 'history' ? (
        <>
          {loadingCalHistory ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}><div className="spinner" /><p className="text-muted" style={{ marginTop: '12px' }}>Cargando historial...</p></div>
          ) : calHistory.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '32px 20px' }}>
              <p style={{ fontSize: '2rem' }}>🥗</p>
              <p style={{ fontWeight: 600, marginTop: '10px' }}>Sin historial aún</p>
              <p className="text-muted" style={{ fontSize: '0.875rem', marginTop: '6px' }}>Empieza a registrar tus comidas y aquí verás el resumen de cada día.</p>
            </div>
          ) : (
            <>
              {/* 7-day average */}
              {calHistory.length >= 3 && (() => {
                const last7 = calHistory.slice(0, 7)
                const avg = Math.round(last7.reduce((s, d) => s + d.cals, 0) / last7.length)
                const goal = localProfile?.daily_calories || 1500
                const diff = avg - goal
                return (
                  <div className="card card-nude" style={{ textAlign: 'center', padding: '16px' }}>
                    <p className="text-muted" style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Promedio últimos {last7.length} días</p>
                    <p style={{ fontSize: '2rem', fontWeight: 700, color: Math.abs(diff) < 150 ? 'var(--success)' : 'var(--coral)', fontFamily: 'var(--font-heading)', marginTop: '4px' }}>
                      {avg} <span style={{ fontSize: '1rem', fontWeight: 400, color: 'var(--text-muted)' }}>kcal</span>
                    </p>
                    <p className="text-muted" style={{ fontSize: '0.8rem', marginTop: '4px' }}>
                      Meta: {goal} kcal · {diff > 0 ? `+${diff} sobre` : `${Math.abs(diff)} bajo`} la meta
                    </p>
                  </div>
                )
              })()}

              {calHistory.map(day => {
                const goal = localProfile?.daily_calories || 1500
                const pct = Math.min(100, Math.round((day.cals / goal) * 100))
                const barColor = pct > 110 ? 'var(--coral)' : pct >= 85 ? 'var(--success)' : 'var(--nude-dark)'
                const dateObj = new Date(day.date + 'T12:00:00')
                const diffDays = Math.round((new Date().setHours(12,0,0,0) - dateObj) / 86400000)
                const dateLabel = diffDays === 0 ? 'Hoy' : diffDays === 1 ? 'Ayer' : dateObj.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' })
                const isOpen = expandedDay === day.date
                const MEAL_ICONS = { desayuno: '🌅', almuerzo: '☀️', cena: '🌙', snack: '🍎' }
                return (
                  <div key={day.date} className="card" style={{ padding: 0, overflow: 'hidden' }}>
                    <button
                      onClick={() => setExpandedDay(isOpen ? null : day.date)}
                      style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '12px', fontFamily: 'var(--font-body)', textAlign: 'left' }}
                    >
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                          <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>{dateLabel}</p>
                          <span style={{ fontWeight: 700, fontSize: '0.95rem', color: barColor }}>{day.cals} <span style={{ fontSize: '0.72rem', fontWeight: 400, color: 'var(--text-muted)' }}>kcal</span></span>
                        </div>
                        <div style={{ height: '5px', background: 'var(--border-light)', borderRadius: '999px', overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${pct}%`, background: barColor, borderRadius: '999px', transition: 'width 0.4s ease' }} />
                        </div>
                        <p className="text-muted" style={{ fontSize: '0.72rem', marginTop: '4px' }}>{day.meals.length} comida{day.meals.length !== 1 ? 's' : ''} · P {Math.round(day.prot)}g · C {Math.round(day.carbs)}g · G {Math.round(day.fat)}g</p>
                      </div>
                      <Icon name={isOpen ? 'chevron-up' : 'chevron-down'} size={16} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                    </button>
                    {isOpen && (
                      <div style={{ borderTop: '1px solid var(--border-light)', padding: '10px 16px 14px' }}>
                        {day.meals.map((m, i) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '8px 0', borderBottom: i < day.meals.length - 1 ? '1px solid var(--border-light)' : 'none' }}>
                            <span style={{ fontSize: '1.1rem', flexShrink: 0, marginTop: '1px' }}>{MEAL_ICONS[m.meal_type] || '🍽️'}</span>
                            <div style={{ flex: 1 }}>
                              <p style={{ fontSize: '0.875rem', fontWeight: 500 }}>{m.description}</p>
                              <p className="text-muted" style={{ fontSize: '0.75rem' }}>{m.meal_type} · P {m.protein_g || 0}g · C {m.carbs_g || 0}g · G {m.fat_g || 0}g</p>
                            </div>
                            <span style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--coral)', flexShrink: 0 }}>{m.calories}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </>
          )}
        </>
      ) : view === 'log' ? (
        <>
          {/* Daily summary */}
          <div className="card" id="nutrition-summary-card">
            <div className="section-title"><Icon name="fire" />Resumen del día</div>
            <div className="progress-wrap mt-12">
              <div className="progress-header">
                <span className="progress-label">{totalCals} / {calGoal} kcal</span>
                <span className="progress-value">{calPct}%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${calPct}%` }} />
              </div>
            </div>
            <div className="macro-bars mt-12">
              {[
                { label: 'Proteína', value: totalProt, unit: 'g', color: '#E8735A', max: 120 },
                { label: 'Carbos', value: totalCarbs, unit: 'g', color: '#C4A882', max: 200 },
                { label: 'Grasa', value: totalFat, unit: 'g', color: '#7BC67A', max: 60 },
              ].map(m => (
                <div key={m.label} className="macro-bar-item">
                  <span className="macro-value" style={{ color: m.color }}>{m.value}g</span>
                  <div className="macro-bar-track">
                    <div className="macro-bar-fill" style={{ width: `${Math.min(100, (m.value / m.max) * 100)}%`, background: m.color }} />
                  </div>
                  <span className="macro-label">{m.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Log food */}
          <div className="card" id="log-food-card">
            <div className="section-title"><Icon name="salad" />¿Qué comiste?</div>
            <div className="input-group mt-12">
              <textarea
                className="input"
                placeholder="Ej: 200g de arroz con pollo, 1 plato de ensalada verde, 1 vaso de jugo..."
                value={mealDesc}
                onChange={e => setMealDesc(e.target.value)}
                rows={3}
              />
            </div>
            <div className="input-group mt-8">
              <select className="select" value={mealType} onChange={e => setMealType(e.target.value)}>
                <option value="desayuno">🌅 Desayuno</option>
                <option value="almuerzo">☀️ Almuerzo</option>
                <option value="cena">🌙 Cena</option>
                <option value="snack">🍎 Snack</option>
              </select>
            </div>
            <button className="btn btn-primary w-full mt-12" onClick={calculateMeal} disabled={calculating || !mealDesc.trim()} id="calculate-meal-btn">
              {calculating ? <><div className="spinner spinner-sm" />Calculando...</> : <><Icon name="sparkles" size={16} />Calcular Calorías</>}
            </button>
          </div>

          {calculated && (
            <div className="card card-nude" id="meal-result-card">
              <div className="section-title"><Icon name="check" />Resultado</div>
              <p style={{ marginTop: '10px', fontWeight: 500, fontSize: '0.9rem', marginBottom: '14px' }}>{calculated.descripcion}</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '16px' }}>
                {[
                  { label: 'Calorías', value: `${calculated.calorias}`, unit: 'kcal', color: 'var(--coral)' },
                  { label: 'Proteína', value: `${calculated.proteina_g}`, unit: 'g', color: 'var(--text)' },
                  { label: 'Carbos', value: `${calculated.carbs_g}`, unit: 'g', color: 'var(--nude-dark)' },
                  { label: 'Grasa', value: `${calculated.grasa_g}`, unit: 'g', color: 'var(--text-muted)' },
                ].map(stat => (
                  <div key={stat.label} style={{ textAlign: 'center' }}>
                    <p style={{ fontWeight: 700, fontSize: '1.1rem', color: stat.color }}>{stat.value}<span style={{ fontSize: '0.7rem', fontWeight: 500 }}>{stat.unit}</span></p>
                    <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{stat.label}</p>
                  </div>
                ))}
              </div>
              <button className="btn btn-success w-full" onClick={saveMeal} disabled={saving} id="save-meal-btn">
                {saving ? <div className="spinner spinner-sm" /> : <><Icon name="check" size={16} />Guardar Comida</>}
              </button>
            </div>
          )}

          {/* Today's meals */}
          {todayMeals.length > 0 && (
            <div className="card">
              <div className="section-title"><Icon name="clock" />Lo que comiste hoy</div>
              <div style={{ marginTop: '12px' }}>
                {todayMeals.map((m, i) => (
                  <div key={i} className="meal-item">
                    <div className="meal-info">
                      <p className="meal-name">{m.description}</p>
                      <span className="meal-type-badge">{m.meal_type}</span>
                    </div>
                    <span className="meal-calories">{m.calories} kcal</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Suggestions */}
          <button className="btn btn-secondary w-full" onClick={getSuggestions} disabled={loadingSugg} id="get-suggestions-btn">
            {loadingSugg ? <><div className="spinner spinner-sm" />Pensando...</> : <><Icon name="lightbulb" size={16} />¿Qué como ahora?</>}
          </button>

          {suggestions && suggestions.length > 0 && (
            <div className="card" id="meal-suggestions-card">
              <div className="section-title"><Icon name="lightbulb" />Sugerencias de Coach Fit</div>
              {suggestions.map((s, i) => (
                <div key={i} style={{
                  padding: '14px', background: 'rgba(232,115,90,0.04)', borderRadius: 'var(--radius-md)',
                  border: '1px solid rgba(232,115,90,0.12)', marginTop: i === 0 ? '12px' : '10px'
                }}>
                  <div className="flex items-center justify-between" style={{ marginBottom: '6px' }}>
                    <p style={{ fontWeight: 600, fontSize: '0.9375rem' }}>{s.nombre}</p>
                    <span style={{ fontWeight: 700, color: 'var(--coral)', fontSize: '0.875rem' }}>{s.calorias_aprox} kcal</span>
                  </div>
                  <p className="text-muted" style={{ fontSize: '0.8375rem', lineHeight: 1.5 }}>{s.descripcion}</p>
                  {s.tiempo_prep && (
                    <p style={{ fontSize: '0.75rem', color: 'var(--nude-dark)', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Icon name="clock" size={12} /> {s.tiempo_prep}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <>
          <div className="card">
            <div className="section-title"><Icon name="star" />Alimentos que me gustan</div>
            <div className="tags-wrap" style={{ margin: '12px 0' }}>
              {(localProfile?.food_likes || []).map((f, i) => (
                <span key={i} className="tag">
                  {f}
                  <button className="tag-remove" onClick={() => removeTag('food_likes', i)}><Icon name="x" size={12} /></button>
                </span>
              ))}
              {(localProfile?.food_likes || []).length === 0 && (
                <p className="text-light" style={{ fontSize: '0.875rem' }}>Agrega tus alimentos favoritos</p>
              )}
            </div>
            <div className="input-row">
              <input className="input" placeholder="Ej: arroz, pollo..." value={likesInput}
                onChange={e => setLikesInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { addTag('food_likes', likesInput); setLikesInput('') } }} />
              <button className="btn btn-secondary btn-sm" onClick={() => { addTag('food_likes', likesInput); setLikesInput('') }}>
                <Icon name="plus" size={16} />
              </button>
            </div>
          </div>

          <div className="card">
            <div className="section-title" style={{ color: 'var(--danger)' }}>
              <Icon name="x" style={{ color: 'var(--danger)' }} />
              Alimentos que NO me gustan
            </div>
            <div className="tags-wrap" style={{ margin: '12px 0' }}>
              {(localProfile?.food_dislikes || []).map((f, i) => (
                <span key={i} className="tag tag-dislike">
                  {f}
                  <button className="tag-remove" onClick={() => removeTag('food_dislikes', i)}><Icon name="x" size={12} /></button>
                </span>
              ))}
              {(localProfile?.food_dislikes || []).length === 0 && (
                <p className="text-light" style={{ fontSize: '0.875rem' }}>Agrega lo que no te gusta</p>
              )}
            </div>
            <div className="input-row">
              <input className="input" placeholder="Ej: hígado, brócoli..." value={dislikesInput}
                onChange={e => setDislikesInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { addTag('food_dislikes', dislikesInput); setDislikesInput('') } }} />
              <button className="btn btn-secondary btn-sm" onClick={() => { addTag('food_dislikes', dislikesInput); setDislikesInput('') }}>
                <Icon name="plus" size={16} />
              </button>
            </div>
          </div>

          <button className="btn btn-primary w-full" onClick={updatePreferences} id="save-prefs-btn">
            <Icon name="check" size={16} />
            Guardar Preferencias
          </button>
        </>
      )}
    </div>
  )
}

// ============================================================
// CHAT SCREEN
// ============================================================
const ChatScreen = ({ profile, claudeKey, supabase, addToast }) => {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [initialLoad, setInitialLoad] = useState(true)
  const [pendingAction, setPendingAction] = useState(null)
  const bottomRef = useRef(null)
  const textareaRef = useRef(null)

  useEffect(() => {
    loadMessages()
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const loadMessages = async () => {
    const { data } = await supabase.from('mensagens_agente')
      .select('*')
      .order('created_at', { ascending: true })
      .limit(50)

    if (data && data.length > 0) {
      setMessages(data)
    } else {
      // Welcome message
      setMessages([{
        id: 'welcome',
        role: 'assistant',
        content: `¡Hola, Fernanda! 🌸 Soy Coach Fit, tu entrenadora personal virtual. Estoy aquí para ayudarte con tus entrenamientos, tu alimentación, o simplemente para motivarte cuando lo necesites. ¿En qué te puedo ayudar hoy?`
      }])
    }
    setInitialLoad(false)
  }

  const sendMessage = async () => {
    const text = input.trim()
    if (!text || loading) return

    const userMsg = { id: Date.now(), role: 'user', content: text }
    setMessages(m => [...m, userMsg])
    setInput('')
    setLoading(true)

    try {
      // Get today's context
      const today = new Date().toISOString().split('T')[0]
      const thirtyDaysAgo = new Date(); thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      const [{ data: hd }, { data: meals }, { data: recentWorkouts }] = await Promise.all([
        supabase.from('humor_checkin').select('level').eq('date', today).single(),
        supabase.from('refeicoes').select('*').eq('date', today),
        supabase.from('treinos').select('date,muscle_group,intensity,exercises').order('date', { ascending: false }).gte('date', thirtyDaysAgo.toISOString().split('T')[0]).limit(30),
      ])

      const cals = meals?.reduce((s, m) => s + (m.calories || 0), 0) || 0
      const sp = buildSystemPrompt(profile, {
        humor: hd?.level, calorias: cals, comidas: meals || [],
        ultimoTreino: recentWorkouts?.[0], diasSemana: recentWorkouts?.length || 0,
        recentHistory: recentWorkouts,
      })

      // Build conversation history for context
      const history = messages
        .filter(m => m.id !== 'welcome')
        .slice(-8)
        .map(m => ({ role: m.role, content: m.content }))
      history.push({ role: 'user', content: text })

      const formattedMessages = [
        { role: 'system', content: sp },
        ...history
      ]

      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${claudeKey}`,
          'HTTP-Referer': 'https://fitfernanda.app',
          'X-Title': 'FitFernanda App',
        },
        body: JSON.stringify({
          model: 'nvidia/nemotron-3-super-120b-a12b:free',
          messages: formattedMessages,
        }),
      })

      if (!response.ok) {
        const err = await response.json().catch(() => ({}))
        throw new Error(err.error?.message || `Error de API: ${response.status}`)
      }
      const data = await response.json()
      const reply = data.choices[0].message.content.trim()

      // Parse action block
      let cleanReply = reply
      let actionData = null
      const actionMatch = reply.match(/\[ACCIÓN:([\s\S]*?)\]/)
      if (actionMatch) {
        try { actionData = JSON.parse(actionMatch[1]) } catch {}
        cleanReply = reply.replace(/\[ACCIÓN:[\s\S]*?\]/, '').trim()
      }

      const assistantMsg = { id: Date.now() + 1, role: 'assistant', content: cleanReply }
      setMessages(m => [...m, assistantMsg])
      if (actionData) setPendingAction(actionData)

      // Save to Supabase
      await supabase.from('mensagens_agente').insert([
        { role: 'user', content: text },
        { role: 'assistant', content: cleanReply },
      ])
    } catch (e) {
      addToast('error', `Error al enviar mensaje: ${e.message}`)
      setMessages(m => m.filter(msg => msg.id !== userMsg.id))
    }
    setLoading(false)
  }

  const executeAction = async () => {
    if (!pendingAction) return
    try {
      if (pendingAction.type === 'update_calories') {
        await supabase.from('profiles').update({ daily_calories: pendingAction.value }).eq('name', 'Fernanda')
        addToast('success', `Meta calórica cambiada a ${pendingAction.value} kcal 🌸`)
      } else if (pendingAction.type === 'update_weight') {
        const upd = {}
        if (pendingAction.current_weight) upd.current_weight = Number(pendingAction.current_weight)
        if (pendingAction.goal_weight) upd.goal_weight = Number(pendingAction.goal_weight)
        await supabase.from('profiles').update(upd).eq('name', 'Fernanda')
        addToast('success', 'Peso actualizado 🌸')
      } else if (pendingAction.type === 'update_goal') {
        await supabase.from('profiles').update({ goal: pendingAction.goal }).eq('name', 'Fernanda')
        addToast('success', `Objetivo actualizado 🌸`)
      }
      const confirmMsg = { id: Date.now(), role: 'assistant', content: `¡Listo! He aplicado el cambio: ${pendingAction.description}. Se verá reflejado al navegar al perfil. 🌸` }
      setMessages(m => [...m, confirmMsg])
      await supabase.from('mensagens_agente').insert([{ role: 'assistant', content: confirmMsg.content }])
    } catch {
      addToast('error', 'Error al aplicar el cambio')
    }
    setPendingAction(null)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const autoResize = (e) => {
    e.target.style.height = 'auto'
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px'
  }

  if (initialLoad) return (
    <div className="loading-wrap">
      <div className="spinner" />
      <p className="loading-text">Cargando tu chat...</p>
    </div>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', paddingTop: 'var(--header-height)' }}>
      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px', paddingBottom: '100px', scrollbarWidth: 'none' }}>
        <div className="chat-wrap">
          {messages.map((msg, i) => (
            <div key={msg.id || i} className={`chat-row ${msg.role}`}>
              {msg.role === 'assistant' && (
                <div className="chat-avatar">🌸</div>
              )}
              <div className={`chat-bubble bubble-${msg.role}`} id={`msg-${i}`}>
                {msg.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="chat-row">
              <div className="chat-avatar">🌸</div>
              <div className="chat-bubble bubble-assistant" style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                {[0, 1, 2].map(i => (
                  <div key={i} style={{
                    width: 8, height: 8, borderRadius: '50%', background: 'var(--nude-light)',
                    animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`
                  }} />
                ))}
              </div>
            </div>
          )}
          {pendingAction && (
            <div style={{ margin: '8px 0', background: 'rgba(232,115,90,0.07)', border: '1.5px solid rgba(232,115,90,0.25)', borderRadius: 'var(--radius-md)', padding: '14px 16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span style={{ fontSize: '1rem' }}>🌸</span>
                <p style={{ fontWeight: 700, fontSize: '0.8rem', color: 'var(--coral)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Coach Fit propone un cambio</p>
              </div>
              <p style={{ fontSize: '0.9rem', marginBottom: '14px' }}>{pendingAction.description}</p>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="btn btn-ghost btn-sm" style={{ flex: 1 }} onClick={() => setPendingAction(null)}>No, cancelar</button>
                <button className="btn btn-primary btn-sm" style={{ flex: 1 }} onClick={executeAction}>
                  <Icon name="check" size={14} />Sí, confirmar
                </button>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input area */}
      <div className="chat-input-area">
        <textarea
          ref={textareaRef}
          className="input"
          placeholder="Pregúntale algo a Coach Fit..."
          value={input}
          onChange={e => { setInput(e.target.value); autoResize(e) }}
          onKeyDown={handleKeyDown}
          rows={1}
          style={{ height: '44px' }}
          id="chat-input"
        />
        <button className="chat-send-btn" onClick={sendMessage} disabled={loading || !input.trim()} id="chat-send-btn">
          <Icon name="send" size={18} />
        </button>
      </div>
    </div>
  )
}

// ============================================================
// PROFILE SCREEN
// ============================================================
const ProfileScreen = ({ profile, supabase, addToast, onReset, onProfileUpdate }) => {
  const [localProfile, setLocalProfile] = useState(profile)
  const [streak, setStreak] = useState(0)
  const [totalWorkouts, setTotalWorkouts] = useState(0)
  const [editingCal, setEditingCal] = useState(false)
  const [newCal, setNewCal] = useState(profile?.daily_calories || 1500)
  const [photo, setPhoto] = useState(localStorage.getItem('ff_profile_photo') || null)
  const [editingGoal, setEditingGoal] = useState(false)
  const [goalForm, setGoalForm] = useState({
    goal: profile?.goal || 'Adelgazar',
    current_weight: profile?.current_weight || '',
    goal_weight: profile?.goal_weight || '',
  })
  const [notifStatus, setNotifStatus] = useState(() => {
    if (!('Notification' in window)) return 'unsupported'
    return Notification.permission // 'default' | 'granted' | 'denied'
  })
  const [notifLoading, setNotifLoading] = useState(false)

  const enableNotifications = async () => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      addToast('error', 'Tu navegador no soporta notificaciones push')
      return
    }
    setNotifLoading(true)
    try {
      const permission = await Notification.requestPermission()
      setNotifStatus(permission)
      if (permission !== 'granted') {
        addToast('error', 'Permiso de notificaciones denegado')
        setNotifLoading(false)
        return
      }
      const reg = await navigator.serviceWorker.ready
      const existing = await reg.pushManager.getSubscription()
      const vapidKey = import.meta.env.VITE_VAPID_PUBLIC_KEY
      const sub = existing || await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidKey),
      })
      await supabase.from('push_subscriptions').upsert(
        { endpoint: sub.endpoint, subscription: sub.toJSON() },
        { onConflict: 'endpoint' }
      )
      addToast('success', '¡Notificaciones activadas! 🔔 Recibirás un mensaje cada día a las 10h')
    } catch (e) {
      addToast('error', `Error: ${e.message}`)
    }
    setNotifLoading(false)
  }

  const disableNotifications = async () => {
    setNotifLoading(true)
    try {
      const reg = await navigator.serviceWorker.ready
      const sub = await reg.pushManager.getSubscription()
      if (sub) {
        await sub.unsubscribe()
        await supabase.from('push_subscriptions').delete().eq('endpoint', sub.endpoint)
      }
      setNotifStatus('default')
      addToast('success', 'Notificaciones desactivadas')
    } catch (e) {
      addToast('error', `Error: ${e.message}`)
    }
    setNotifLoading(false)
  }

  const [editingPersonal, setEditingPersonal] = useState(false)
  const [personalForm, setPersonalForm] = useState({
    height_cm: profile?.height_cm || '',
    age: profile?.age || '',
    activity_level: profile?.activity_level || 'Activa',
    physical_limitations: profile?.physical_limitations || '',
    sleep_hours: profile?.sleep_hours || '',
    stress_level: profile?.stress_level || 'Medio',
    preferred_workout_time: profile?.preferred_workout_time || 'Tarde',
  })
  const fileInputRef = useRef(null)

  const handlePhotoChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 3 * 1024 * 1024) { addToast('error', 'La foto debe ser menor de 3MB'); return }
    const reader = new FileReader()
    reader.onload = async (ev) => {
      const base64 = ev.target.result
      localStorage.setItem('ff_profile_photo', base64)
      setPhoto(base64)
      const { error } = await supabase.from('profiles').update({ photo: base64 }).eq('name', 'Fernanda')
      if (error) {
        addToast('error', 'Foto guardada solo localmente — error al sincronizar')
      } else {
        addToast('success', '¡Foto actualizada! 🌸')
      }
    }
    reader.readAsDataURL(file)
  }

  const saveGoal = async () => {
    const { error } = await supabase.from('profiles').update({
      goal: goalForm.goal,
      current_weight: Number(goalForm.current_weight) || null,
      goal_weight: Number(goalForm.goal_weight) || null,
    }).eq('name', 'Fernanda')
    if (!error) {
      setLocalProfile(p => ({ ...p, ...goalForm }))
      onProfileUpdate?.(p => ({ ...p, ...goalForm }))
      setEditingGoal(false)
      addToast('success', 'Objetivo actualizado 🌸')
    } else {
      addToast('error', 'Error al guardar')
    }
  }

  const savePersonal = async () => {
    const { error } = await supabase.from('profiles').update({
      height_cm: Number(personalForm.height_cm) || null,
      age: Number(personalForm.age) || null,
      activity_level: personalForm.activity_level || null,
      physical_limitations: personalForm.physical_limitations || null,
      sleep_hours: Number(personalForm.sleep_hours) || null,
      stress_level: personalForm.stress_level || null,
      preferred_workout_time: personalForm.preferred_workout_time || null,
    }).eq('name', 'Fernanda')
    if (!error) {
      setLocalProfile(p => ({ ...p, ...personalForm }))
      onProfileUpdate?.(p => ({ ...p, ...personalForm }))
      setEditingPersonal(false)
      addToast('success', 'Datos personales actualizados 🌸')
    } else {
      addToast('error', 'Error al guardar')
    }
  }

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    const { data: treinos } = await supabase.from('treinos').select('date').order('date', { ascending: false })
    if (treinos) {
      setTotalWorkouts(treinos.length)
      // Calculate streak
      let s = 0
      const today = new Date()
      const dates = treinos.map(t => new Date(t.date).toDateString())
      for (let i = 0; i < 30; i++) {
        const d = new Date(today)
        d.setDate(today.getDate() - i)
        if (dates.includes(d.toDateString())) s++
        else if (i > 0) break
      }
      setStreak(s)
    }
  }

  const saveCalories = async () => {
    const { error } = await supabase.from('profiles').update({ daily_calories: newCal }).eq('name', 'Fernanda')
    if (!error) {
      setLocalProfile(p => ({ ...p, daily_calories: newCal }))
      onProfileUpdate?.(p => ({ ...p, daily_calories: newCal }))
      setEditingCal(false)
      addToast('success', 'Meta calórica actualizada 🌸')
    }
  }

  return (
    <div className="screen-content">
      {/* Avatar & Name */}
      <div style={{ textAlign: 'center', paddingTop: '8px' }}>
        <div
          className="profile-avatar"
          onClick={() => fileInputRef.current?.click()}
          style={{ cursor: 'pointer', overflow: 'hidden', position: 'relative' }}
          title="Toca para cambiar foto"
        >
          {photo
            ? <img src={photo} alt="Foto de perfil" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
            : '🌸'
          }
        </div>
        <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePhotoChange} />
        <p className="text-muted" style={{ fontSize: '0.72rem', marginTop: '4px' }}>Toca la foto para cambiarla</p>
        <h1 style={{ fontSize: '1.75rem', marginTop: '6px' }}>Fernanda</h1>
        <p className="text-muted" style={{ marginTop: '4px' }}>
          {localProfile?.goal} · {localProfile?.level}
        </p>
      </div>

      {/* Stats */}
      <div className="stats-row">
        <div className="stat-card">
          <span className="stat-value">{streak}</span>
          <span className="stat-label">Días racha</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{totalWorkouts}</span>
          <span className="stat-label">Entrenos</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{localProfile?.daily_calories || 1500}</span>
          <span className="stat-label">Meta kcal</span>
        </div>
      </div>

      {/* Streak card */}
      {streak > 0 && (
        <div className="streak-card">
          <span className="streak-icon">🔥</span>
          <div>
            <div className="flex items-center gap-8">
              <span className="streak-value">{streak}</span>
              <span style={{ fontSize: '0.9rem', color: 'var(--text)' }}>día{streak !== 1 ? 's' : ''} seguido{streak !== 1 ? 's' : ''}</span>
            </div>
            <p className="streak-label">¡No rompas tu racha, Fernanda! 💪</p>
          </div>
        </div>
      )}

      {/* Calorie goal */}
      <div className="card" id="calorie-goal-card">
        <div className="section-title"><Icon name="fire" />Meta calórica diaria</div>
        {editingCal ? (
          <div className="flex gap-8 mt-12">
            <input className="input" type="number" value={newCal} onChange={e => setNewCal(Number(e.target.value))} style={{ flex: 1 }} />
            <button className="btn btn-primary btn-sm" onClick={saveCalories}>Guardar</button>
            <button className="btn btn-ghost btn-sm" onClick={() => setEditingCal(false)}>Cancelar</button>
          </div>
        ) : (
          <div className="flex items-center justify-between mt-12">
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--coral)' }}>
              {localProfile?.daily_calories || 1500} <span style={{ fontSize: '0.9rem', fontWeight: 400, color: 'var(--text-muted)' }}>kcal</span>
            </span>
            <button className="btn btn-secondary btn-sm" onClick={() => setEditingCal(true)} id="edit-calories-btn">
              <Icon name="pencil" size={14} />Editar
            </button>
          </div>
        )}
      </div>

      {/* Goal + Weight */}
      <div className="card card-sm card-nude">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div className="section-title"><Icon name="scale" />Tu objetivo</div>
          <button className="btn btn-ghost btn-sm" style={{ minHeight: 'auto', padding: '6px 12px' }} onClick={() => setEditingGoal(!editingGoal)}>
            <Icon name={editingGoal ? 'x' : 'pencil'} size={14} />{editingGoal ? 'Cancelar' : 'Editar'}
          </button>
        </div>
        {editingGoal ? (
          <div style={{ marginTop: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div className="input-group">
              <label className="input-label">Objetivo</label>
              <input className="input" value={goalForm.goal} onChange={e => setGoalForm(f => ({ ...f, goal: e.target.value }))} placeholder="Ej: Adelgazar, Ganar músculo..." />
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <div className="input-group" style={{ flex: 1 }}>
                <label className="input-label">Peso actual (kg)</label>
                <input className="input" type="number" value={goalForm.current_weight} onChange={e => setGoalForm(f => ({ ...f, current_weight: e.target.value }))} placeholder="65" />
              </div>
              <div className="input-group" style={{ flex: 1 }}>
                <label className="input-label">Peso meta (kg)</label>
                <input className="input" type="number" value={goalForm.goal_weight} onChange={e => setGoalForm(f => ({ ...f, goal_weight: e.target.value }))} placeholder="55" />
              </div>
            </div>
            <button className="btn btn-primary btn-sm w-full" onClick={saveGoal}>
              <Icon name="check" size={14} />Guardar objetivo
            </button>
          </div>
        ) : (
          <div className="flex gap-16 mt-8">
            <div style={{ textAlign: 'center', flex: 1 }}>
              <p style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--coral)' }}>
                {localProfile?.current_weight || '—'} <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>kg</span>
              </p>
              <p className="text-muted" style={{ fontSize: '0.75rem' }}>Peso actual</p>
            </div>
            <div style={{ width: '1px', background: 'var(--border)' }} />
            <div style={{ textAlign: 'center', flex: 1 }}>
              <p style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--success)' }}>
                {localProfile?.goal_weight || '—'} <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>kg</span>
              </p>
              <p className="text-muted" style={{ fontSize: '0.75rem' }}>Peso meta</p>
            </div>
          </div>
        )}
      </div>

      {/* Personal data */}
      <div className="card card-sm card-nude">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div className="section-title"><Icon name="user" />Datos personales</div>
          <button className="btn btn-ghost btn-sm" style={{ minHeight: 'auto', padding: '6px 12px' }} onClick={() => setEditingPersonal(!editingPersonal)}>
            <Icon name={editingPersonal ? 'x' : 'pencil'} size={14} />{editingPersonal ? 'Cancelar' : 'Editar'}
          </button>
        </div>
        {editingPersonal ? (
          <div style={{ marginTop: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', gap: '10px' }}>
              <div className="input-group" style={{ flex: 1 }}>
                <label className="input-label">Altura (cm)</label>
                <input className="input" type="number" value={personalForm.height_cm} onChange={e => setPersonalForm(f => ({ ...f, height_cm: e.target.value }))} placeholder="165" />
              </div>
              <div className="input-group" style={{ flex: 1 }}>
                <label className="input-label">Edad (años)</label>
                <input className="input" type="number" value={personalForm.age} onChange={e => setPersonalForm(f => ({ ...f, age: e.target.value }))} placeholder="25" />
              </div>
            </div>
            <div className="input-group">
              <label className="input-label">Nivel de actividad</label>
              <select className="input" value={personalForm.activity_level} onChange={e => setPersonalForm(f => ({ ...f, activity_level: e.target.value }))}>
                <option value="Sedentaria">Sedentaria (poco o nada de ejercicio)</option>
                <option value="Poco activa">Poco activa (ejercicio ligero 1-3 días/sem)</option>
                <option value="Activa">Activa (ejercicio moderado 3-5 días/sem)</option>
                <option value="Muy activa">Muy activa (ejercicio intenso 6-7 días/sem)</option>
              </select>
            </div>
            <div className="input-group">
              <label className="input-label">Lesiones o limitaciones físicas</label>
              <input className="input" value={personalForm.physical_limitations} onChange={e => setPersonalForm(f => ({ ...f, physical_limitations: e.target.value }))} placeholder="Ej: rodilla derecha, dolor de espalda... (opcional)" />
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <div className="input-group" style={{ flex: 1 }}>
                <label className="input-label">Horas de sueño</label>
                <input className="input" type="number" min="1" max="12" step="0.5" value={personalForm.sleep_hours} onChange={e => setPersonalForm(f => ({ ...f, sleep_hours: e.target.value }))} placeholder="7.5" />
              </div>
              <div className="input-group" style={{ flex: 1 }}>
                <label className="input-label">Nivel de estrés</label>
                <select className="input" value={personalForm.stress_level} onChange={e => setPersonalForm(f => ({ ...f, stress_level: e.target.value }))}>
                  <option value="Bajo">Bajo</option>
                  <option value="Medio">Medio</option>
                  <option value="Alto">Alto</option>
                </select>
              </div>
            </div>
            <div className="input-group">
              <label className="input-label">Horario preferido para entrenar</label>
              <select className="input" value={personalForm.preferred_workout_time} onChange={e => setPersonalForm(f => ({ ...f, preferred_workout_time: e.target.value }))}>
                <option value="Mañana">Mañana (antes de las 12h)</option>
                <option value="Tarde">Tarde (12h–18h)</option>
                <option value="Noche">Noche (después de las 18h)</option>
              </select>
            </div>
            <button className="btn btn-primary btn-sm w-full" onClick={savePersonal}>
              <Icon name="check" size={14} />Guardar datos personales
            </button>
          </div>
        ) : (
          <div style={{ marginTop: '12px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <p style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--coral)' }}>
                {localProfile?.height_cm || '—'} <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 400 }}>{localProfile?.height_cm ? 'cm' : ''}</span>
              </p>
              <p className="text-muted" style={{ fontSize: '0.75rem' }}>Altura</p>
            </div>
            <div>
              <p style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--coral)' }}>
                {localProfile?.age || '—'} <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 400 }}>{localProfile?.age ? 'años' : ''}</span>
              </p>
              <p className="text-muted" style={{ fontSize: '0.75rem' }}>Edad</p>
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <p style={{ fontSize: '0.9rem', fontWeight: 600 }}>{localProfile?.activity_level || '—'}</p>
              <p className="text-muted" style={{ fontSize: '0.75rem' }}>Nivel de actividad</p>
            </div>
            <div>
              <p style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--coral)' }}>
                {localProfile?.sleep_hours || '—'} <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 400 }}>{localProfile?.sleep_hours ? 'h' : ''}</span>
              </p>
              <p className="text-muted" style={{ fontSize: '0.75rem' }}>Sueño</p>
            </div>
            <div>
              <p style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--coral)' }}>{localProfile?.stress_level || '—'}</p>
              <p className="text-muted" style={{ fontSize: '0.75rem' }}>Estrés</p>
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <p style={{ fontSize: '0.9rem', fontWeight: 600 }}>{localProfile?.preferred_workout_time || '—'}</p>
              <p className="text-muted" style={{ fontSize: '0.75rem' }}>Horario de entreno</p>
            </div>
            {localProfile?.physical_limitations ? (
              <div style={{ gridColumn: '1 / -1', background: 'rgba(232,115,90,0.07)', borderRadius: 'var(--radius-sm)', padding: '8px 10px' }}>
                <p style={{ fontSize: '0.85rem' }}>⚠️ {localProfile.physical_limitations}</p>
                <p className="text-muted" style={{ fontSize: '0.72rem', marginTop: '2px' }}>Limitaciones físicas</p>
              </div>
            ) : (
              <div style={{ gridColumn: '1 / -1' }}>
                <p className="text-muted" style={{ fontSize: '0.82rem' }}>Sin limitaciones registradas</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Push Notifications */}
      {notifStatus !== 'unsupported' && (
        <div className="card card-sm">
          <div className="section-title"><Icon name="bell" />Notificaciones diarias</div>
          <p className="text-muted" style={{ fontSize: '0.82rem', marginTop: '8px', marginBottom: '14px' }}>
            Recibe un mensaje motivacional todos los días a las 10h de la mañana de Coach Fit 🌸
          </p>
          {notifStatus === 'granted' ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--success)', display: 'inline-block' }} />
                <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--success)' }}>Activadas</span>
              </div>
              <button className="btn btn-ghost btn-sm" onClick={disableNotifications} disabled={notifLoading}>
                {notifLoading ? <div className="spinner spinner-sm" /> : <><Icon name="bell-off" size={14} />Desactivar</>}
              </button>
            </div>
          ) : notifStatus === 'denied' ? (
            <div style={{ background: 'rgba(232,115,90,0.07)', borderRadius: 'var(--radius-sm)', padding: '10px 12px' }}>
              <p style={{ fontSize: '0.82rem', color: 'var(--coral)' }}>⚠️ Bloqueadas en el navegador. Para activarlas, ve a la configuración del sitio y permite notificaciones manualmente.</p>
            </div>
          ) : (
            <button className="btn btn-primary w-full" onClick={enableNotifications} disabled={notifLoading}>
              {notifLoading
                ? <><div className="spinner spinner-sm" />Activando...</>
                : <><Icon name="bell" size={16} />Activar notificaciones diarias</>
              }
            </button>
          )}
        </div>
      )}

    </div>
  )
}

// ============================================================
// BOTTOM NAV
// ============================================================
const BottomNav = ({ active, onNavigate }) => {
  const tabs = [
    { id: 'home', icon: 'home', label: 'Inicio' },
    { id: 'workout', icon: 'dumbbell', label: 'Entreno' },
    { id: 'nutrition', icon: 'salad', label: 'Comida' },
    { id: 'chat', icon: 'chat', label: 'Coach' },
    { id: 'profile', icon: 'user', label: 'Perfil' },
  ]
  return (
    <nav className="bottom-nav" role="navigation" aria-label="Navegación principal">
      {tabs.map(t => (
        <button
          key={t.id}
          className={`nav-item ${active === t.id ? 'active' : ''}`}
          onClick={() => onNavigate(t.id)}
          aria-label={t.label}
          id={`nav-${t.id}`}
        >
          <div className="nav-icon-wrap">
            <Icon name={t.icon} size={20} />
          </div>
          <span className="nav-label">{t.label}</span>
        </button>
      ))}
    </nav>
  )
}

// ============================================================
// HEADER TITLES
// ============================================================
const SCREEN_TITLES = {
  home: <><span>Fit</span>Fernanda</>,
  workout: <>Mi Entrenamiento</>,
  nutrition: <>Mi Alimentación</>,
  chat: <>Coach Fit 🌸</>,
  profile: <>Mi Perfil</>,
}

// ============================================================
// MAIN APP
// ============================================================
export default function App() {
  const [screen, setScreen] = useState('home')
  const [isConfigured, setIsConfigured] = useState(false)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [configError, setConfigError] = useState(null)
  const [toasts, setToasts] = useState([])
  const [supabase, setSupabase] = useState(null)
  const [claudeKey, setClaudeKey] = useState('')

  const addToast = useCallback((type, msg) => {
    const id = Date.now()
    setToasts(t => [...t, { id, type, msg }])
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 4000)
  }, [])

  useEffect(() => {
    checkConfiguration()
  }, [])

  const checkConfiguration = async () => {
    setConfigError(null)
    const url = (import.meta.env.VITE_SUPABASE_URL || '').trim()
    const key = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim()
    const claude = (import.meta.env.VITE_OPENROUTER_API_KEY || '').trim()

    if (!url || !key || !claude) {
      const missing = [!url && 'VITE_SUPABASE_URL', !key && 'VITE_SUPABASE_ANON_KEY', !claude && 'VITE_OPENROUTER_API_KEY'].filter(Boolean)
      setConfigError(`Variables de entorno faltantes: ${missing.join(', ')}`)
      setLoading(false)
      return
    }

    try {
      const sb = initSupabase(url, key)
      setSupabase(sb)
      setClaudeKey(claude)

      const { data: profiles, error } = await Promise.race([
        sb.from('profiles').select('*').limit(1),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout: Supabase tardó más de 10s en responder')), 10000))
      ])
      if (error) throw error

      if (!profiles || profiles.length === 0) {
        console.warn('No profiles found — showing onboarding. If this is unexpected, check Supabase RLS policies on the profiles table.')
        setLoading(false)
        return
      }
      setProfile(profiles[0])
      if (profiles[0].photo) {
        localStorage.setItem('ff_profile_photo', profiles[0].photo)
      }
      setIsConfigured(true)
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js').catch(() => {})
      }
    } catch (e) {
      console.error('Error al conectar:', e)
      setConfigError(e.message || 'Error desconocido al conectar con Supabase')
    }
    setLoading(false)
  }

  const handleOnboardingComplete = () => {
    window.location.reload()
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', gap: '20px', background: 'var(--bg)' }}>
        <div style={{ fontSize: '3rem' }}>🌸</div>
        <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.75rem', fontWeight: 700, color: 'var(--coral)' }}>FitFernanda</div>
        <div className="spinner" />
        <p className="text-muted" style={{ fontSize: '0.875rem' }}>Cargando tu app...</p>
      </div>
    )
  }

  if (configError) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', gap: '16px', background: 'var(--bg)', padding: '24px' }}>
        <div style={{ fontSize: '3rem' }}>🌸</div>
        <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.75rem', fontWeight: 700, color: 'var(--coral)' }}>FitFernanda</div>
        <div style={{ background: '#fff0ee', border: '1.5px solid var(--coral)', borderRadius: '12px', padding: '16px 20px', maxWidth: '360px', width: '100%', textAlign: 'center' }}>
          <p style={{ fontWeight: 700, color: 'var(--coral)', marginBottom: '8px' }}>Error de conexión</p>
          <p style={{ fontSize: '0.82rem', color: 'var(--text)', fontFamily: 'monospace', wordBreak: 'break-word' }}>{configError}</p>
        </div>
        <button
          onClick={() => { setLoading(true); checkConfiguration() }}
          style={{ background: 'var(--coral)', color: '#fff', border: 'none', borderRadius: '999px', padding: '12px 28px', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer' }}
        >
          Reintentar
        </button>
      </div>
    )
  }

  if (!isConfigured) {
    return <Onboarding onComplete={handleOnboardingComplete} />
  }

  const screenProps = { profile, claudeKey, supabase, addToast, onProfileUpdate: setProfile }

  return (
    <div className="app-container">
      {/* Background blobs */}
      <div className="blob-bg blob-1" />
      <div className="blob-bg blob-2" />

      {/* Toasts */}
      <Toast toasts={toasts} />

      {/* Header */}
      <header className="app-header">
        <h1 className="header-title" style={{ fontSize: '1.15rem' }}>{SCREEN_TITLES[screen]}</h1>
        <div className="header-actions">
          {screen !== 'chat' && (
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>
              {new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
            </div>
          )}
        </div>
      </header>

      {/* Screen content */}
      <main className="screen" role="main">
        {screen === 'home' && <HomeScreen {...screenProps} onNavigate={setScreen} />}
        {screen === 'workout' && <WorkoutScreen {...screenProps} />}
        {screen === 'nutrition' && <NutritionScreen {...screenProps} />}
        {screen === 'chat' && <ChatScreen {...screenProps} />}
        {screen === 'profile' && <ProfileScreen {...screenProps} onReset={() => { localStorage.clear(); window.location.reload() }} />}
      </main>

      {/* Bottom nav */}
      <BottomNav active={screen} onNavigate={setScreen} />
    </div>
  )
}
