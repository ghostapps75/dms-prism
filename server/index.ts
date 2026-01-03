import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { uploadBufferToR2, generateR2Key } from './src/r2.js'

const PORT = Number(process.env.PORT || 8080)
const MESHY_API_KEY = (process.env.MESHY_API_KEY || '').trim()

const app = express()
app.use(express.json({ limit: '20mb' }))

// --- CORS ---
function parseAllowedOrigins(raw?: string) {
    return (raw || '')
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
}

// Example:
// ALLOWED_ORIGINS="http://localhost:5173,http://localhost:4173,https://your-site.netlify.app"
const ALLOWED_ORIGINS = parseAllowedOrigins(process.env.ALLOWED_ORIGINS)

function isAllowedOrigin(origin: string) {
    // Explicit allowlist first
    if (ALLOWED_ORIGINS.includes(origin)) return true

    // Helpful default for Netlify previews; remove if you want strict mode
    if (origin.endsWith('.netlify.app')) return true

    return false
}

app.use(
    cors({
        origin: (origin, callback) => {
            // Allow curl / server-to-server / mobile apps
            if (!origin) return callback(null, true)
            if (isAllowedOrigin(origin)) return callback(null, true)
            return callback(new Error(`Not allowed by CORS: ${origin}`), false)
        },
        credentials: true
    })
)

// --- Health ---
app.get('/health', (_req, res) => {
    const r2Ok =
        !!process.env.R2_ACCOUNT_ID &&
        !!process.env.R2_ACCESS_KEY_ID &&
        !!process.env.R2_SECRET_ACCESS_KEY &&
        !!(process.env.R2_BUCKET_NAME || process.env.R2_BUCKET) &&
        !!process.env.R2_PUBLIC_BASE_URL

    res.json({
        ok: true,
        port: PORT,
        meshyConfigured: !!MESHY_API_KEY,
        r2Configured: r2Ok
    })
})

// --- Utilities ---
async function fetchWithTimeout(url: string, init: RequestInit = {}, ms = 30_000) {
    const ac = new AbortController()
    const timer = setTimeout(() => ac.abort(), ms)
    try {
        return await fetch(url, { ...init, signal: ac.signal })
    } finally {
        clearTimeout(timer)
    }
}

function ensureMeshyConfigured(res: express.Response) {
    if (!MESHY_API_KEY) {
        res.status(500).json({ error: 'Meshy not configured (missing MESHY_API_KEY).' })
        return false
    }
    return true
}

// --- Meshy Routes ---

// Create Meshy text-to-3d task (PREVIEW)
app.post('/api/meshy/text-to-3d', async (req, res) => {
    try {
        if (!ensureMeshyConfigured(res)) return

        const resp = await fetchWithTimeout(
            'https://api.meshy.ai/openapi/v2/text-to-3d',
            {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${MESHY_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(req.body ?? {})
            },
            60_000
        )

        const text = await resp.text()
        const json = text ? JSON.parse(text) : {}

        if (!resp.ok) {
            return res.status(resp.status).json({
                error: json?.message ?? 'Meshy create task failed',
                details: json
            })
        }

        return res.json(json)
    } catch (err: any) {
        console.error('meshy create error:', err?.message || err)
        return res.status(502).json({ error: err?.message ?? 'Meshy upstream error' })
    }
})

// Create Meshy Refinement Task
app.post('/api/meshy/refine', async (req, res) => {
    try {
        if (!ensureMeshyConfigured(res)) return

        const { base_task_id } = req.body || {}
        if (!base_task_id) {
            return res.status(400).json({ error: 'Missing base_task_id' })
        }

        const resp = await fetchWithTimeout(
            'https://api.meshy.ai/openapi/v2/text-to-3d',
            {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${MESHY_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    mode: 'refine',
                    preview_task_id: base_task_id
                })
            },
            60_000
        )

        const text = await resp.text()
        const json = text ? JSON.parse(text) : {}

        if (!resp.ok) {
            return res.status(resp.status).json({
                error: json?.message ?? 'Meshy refine task failed',
                details: json
            })
        }

        return res.json(json)
    } catch (err: any) {
        console.error('meshy refine error:', err?.message || err)
        return res.status(502).json({ error: err?.message ?? 'Meshy upstream error' })
    }
})

// Get Meshy task status
app.get('/api/meshy/text-to-3d/:id', async (req, res) => {
    try {
        if (!ensureMeshyConfigured(res)) return

        const taskId = req.params.id

        const resp = await fetchWithTimeout(
            `https://api.meshy.ai/openapi/v2/text-to-3d/${encodeURIComponent(taskId)}`,
            {
                headers: {
                    Authorization: `Bearer ${MESHY_API_KEY}`
                }
            },
            30_000
        )

        const text = await resp.text()
        const json = text ? JSON.parse(text) : {}

        if (!resp.ok) {
            return res.status(resp.status).json({
                error: json?.message ?? 'Meshy retrieve task failed',
                details: json
            })
        }

        return res.json(json)
    } catch (err: any) {
        console.error('meshy status error:', err?.message || err)
        return res.status(502).json({ error: err?.message ?? 'Meshy upstream error' })
    }
})

// Cache a remote GLB to R2 and return a public URL
// Usage: GET /api/meshy/cache-glb?url=https%3A%2F%2F...
app.get('/api/meshy/cache-glb', async (req, res) => {
    try {
        const url = String(req.query.url || '')
        if (!url.startsWith('https://')) return res.status(400).json({ error: 'Bad url' })

        const upstream = await fetchWithTimeout(url, {}, 60_000)
        if (!upstream.ok) {
            return res.status(upstream.status).json({ error: 'Failed to fetch model from upstream' })
        }

        const ab = await upstream.arrayBuffer()
        const buf = Buffer.from(ab)

        if (buf.length < 1024) {
            return res.status(502).json({ error: 'Upstream returned unexpectedly small payload' })
        }

        const key = generateR2Key('generated/models', '.glb')
        const { url: publicUrl } = await uploadBufferToR2({
            key,
            buffer: buf,
            contentType: 'model/gltf-binary'
        })

        return res.json({ url: publicUrl, cached: true })
    } catch (err: any) {
        console.error('meshy cache-glb error:', err?.message || err)
        return res.status(502).json({ error: err?.message ?? 'Cache error' })
    }
})

// Cache a remote image to R2 and return a public URL
// Usage: GET /api/meshy/cache-image?url=https%3A%2F%2F...
app.get('/api/meshy/cache-image', async (req, res) => {
    try {
        const url = String(req.query.url || '')
        if (!url.startsWith('https://')) return res.status(400).json({ error: 'Bad url' })

        const upstream = await fetchWithTimeout(url, {}, 30_000)
        if (!upstream.ok) {
            return res.status(upstream.status).json({ error: 'Failed to fetch image from upstream' })
        }

        const contentType = upstream.headers.get('content-type') || 'image/png'
        let ext = '.png'
        if (contentType.includes('jpeg')) ext = '.jpg'
        else if (contentType.includes('webp')) ext = '.webp'

        const ab = await upstream.arrayBuffer()
        const buf = Buffer.from(ab)

        if (buf.length < 1024) {
            return res.status(502).json({ error: 'Image payload too small' })
        }

        const key = generateR2Key('generated/thumbs', ext)
        const { url: publicUrl } = await uploadBufferToR2({
            key,
            buffer: buf,
            contentType
        })

        return res.json({ url: publicUrl, cached: true })
    } catch (err: any) {
        console.error('meshy cache-image error:', err?.message || err)
        return res.status(502).json({ error: err?.message ?? 'Cache error' })
    }
})

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`)
})
