import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

const SUPPORTED_IMAGE_EXTS = new Set(['.png', '.jpg', '.jpeg', '.webp', '.gif', '.avif', '.svg'])
const HEIC_EXTS = new Set(['.heic', '.heif'])
const NATIVE_VIDEO_EXTS = new Set(['.mp4', '.webm', '.ogv'])
const CONVERT_VIDEO_EXTS = new Set(['.mov', '.avi', '.mkv'])

// ── HEIC → JPEG (Node.js, pure WASM) ──────────────────────────────────────────
function isJpegBuffer(buf) {
  return buf[0] === 0xFF && buf[1] === 0xD8 && buf[2] === 0xFF
}

async function convertHeicToJpeg(heicPath, jpegPath) {
  try {
    const input = fs.readFileSync(heicPath)
    if (isJpegBuffer(input)) {
      fs.copyFileSync(heicPath, jpegPath)
      return true
    }
    const heicConvert = (await import('heic-convert')).default
    const output = await heicConvert({ buffer: input, format: 'JPEG', quality: 0.88 })
    fs.writeFileSync(jpegPath, Buffer.from(output))
    return true
  } catch (err) {
    console.warn(`[gallery] HEIC→JPEG failed for ${path.basename(heicPath)}: ${err.message}`)
    return false
  }
}

// ── MOV/AVI/MKV → MP4 H.264 (via ffmpeg-static) ──────────────────────────────
let _ffmpegReady = null
async function getFFmpeg() {
  if (_ffmpegReady) return _ffmpegReady
  try {
    const [ffmpeg, ffmpegPath] = await Promise.all([
      import('fluent-ffmpeg').then((m) => m.default),
      import('ffmpeg-static').then((m) => m.default),
    ])
    ffmpeg.setFfmpegPath(ffmpegPath)
    _ffmpegReady = ffmpeg
    return ffmpeg
  } catch {
    return null
  }
}

function convertVideoToMp4(ffmpeg, inputPath, outputPath) {
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .videoCodec('libx264')
      .addOption('-crf', '26')
      .addOption('-preset', 'veryfast')
      .addOption('-vf', "scale=trunc(iw/2)*2:trunc(ih/2)*2")
      .audioCodec('aac')
      .addOption('-movflags', '+faststart')
      .output(outputPath)
      .on('end', resolve)
      .on('error', reject)
      .run()
  })
}

async function ensureVideoMp4(videoPath, mp4Path, ffmpeg) {
  if (fs.existsSync(mp4Path)) return true
  process.stdout.write(`[gallery] Converting ${path.basename(videoPath)} → MP4 ... `)
  try {
    await convertVideoToMp4(ffmpeg, videoPath, mp4Path)
    const kb = Math.round(fs.statSync(mp4Path).size / 1024)
    console.log(`done (${kb} KB)`)
    return true
  } catch (err) {
    console.log(`failed: ${err.message}`)
    return false
  }
}

async function ensurePoster(mp4Path, posterPath, ffmpeg) {
  if (fs.existsSync(posterPath)) return true
  process.stdout.write(`[gallery] Extracting poster from ${path.basename(mp4Path)} ... `)
  try {
    await new Promise((resolve, reject) => {
      ffmpeg(mp4Path)
        .addOption('-ss', '00:00:01')
        .addOption('-vframes', '1')
        .addOption('-q:v', '3')
        .output(posterPath)
        .on('end', resolve)
        .on('error', reject)
        .run()
    })
    console.log('done')
    return true
  } catch (err) {
    console.log(`failed: ${err.message}`)
    return false
  }
}

// ── Filename sanitizer (spaces/commas break Vite static serving) ──────────────
function isUrlSafe(name) {
  return /^[a-zA-Z0-9._-]+$/.test(name)
}
function sanitizeFilename(name) {
  const ext = path.extname(name)
  const base = path.basename(name, ext)
    .replace(/\s+/g, '-')
    .replace(/[^a-zA-Z0-9._-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
  return base + ext.toLowerCase()
}

// ── Manifest generator ─────────────────────────────────────────────────────────
async function generateManifest(projectRoot) {
  const galleryDir = path.join(projectRoot, 'public', 'gallery')
  const manifestPath = path.join(galleryDir, 'gallery-manifest.json')

  if (!fs.existsSync(galleryDir)) fs.mkdirSync(galleryDir, { recursive: true })

  const ffmpeg = await getFFmpeg()
  const manifest = {}

  try {
    const entries = fs.readdirSync(galleryDir, { withFileTypes: true })
    for (const entry of entries) {
      if (!entry.isDirectory()) continue
      const sectionPath = path.join(galleryDir, entry.name)
      const files = []
      const raw = fs.readdirSync(sectionPath, { withFileTypes: true }).filter((f) => f.isFile())

      for (const f of raw) {
        let filename = f.name

        // ── Auto-rename files with URL-unsafe chars (spaces, commas …) ──
        if (!isUrlSafe(filename)) {
          const safeName = sanitizeFilename(filename)
          const dstPath = path.join(sectionPath, safeName)
          if (!fs.existsSync(dstPath)) {
            fs.renameSync(path.join(sectionPath, filename), dstPath)
            console.log(`[gallery] Renamed "${filename}" → "${safeName}"`)
          }
          filename = safeName
        }

        const ext = path.extname(filename).toLowerCase()

        // Skip generated files (HEIC→JPEG, MOV→MP4, poster frames)
        const baseNoExt = path.basename(filename, ext)
        const innerExt = path.extname(baseNoExt).toLowerCase()
        if ((ext === '.jpg' && HEIC_EXTS.has(innerExt)) ||
            (ext === '.mp4' && CONVERT_VIDEO_EXTS.has(innerExt)) ||
            filename.endsWith('.poster.jpg')) continue

        // ── HEIC/HEIF image ──
        if (HEIC_EXTS.has(ext)) {
          const jpegName = filename + '.jpg'
          const jpegPath = path.join(sectionPath, jpegName)
          if (!fs.existsSync(jpegPath)) {
            process.stdout.write(`[gallery] Converting ${filename} → JPEG ... `)
            const ok = await convertHeicToJpeg(path.join(sectionPath, filename), jpegPath)
            console.log(ok ? 'done' : 'failed (will skip)')
          }
          if (fs.existsSync(jpegPath)) {
            files.push({ filename, path: `/gallery/${entry.name}/${jpegName}`, type: 'image', ext: 'jpg', original: filename })
          }
          continue
        }

        // ── Standard image ──
        if (SUPPORTED_IMAGE_EXTS.has(ext)) {
          files.push({ filename, path: `/gallery/${entry.name}/${filename}`, type: 'image', ext: ext.slice(1) })
          continue
        }

        // ── Native browser video (mp4, webm) ──
        if (NATIVE_VIDEO_EXTS.has(ext)) {
          const posterName = filename + '.poster.jpg'
          const posterPath = path.join(sectionPath, posterName)
          if (ffmpeg) await ensurePoster(path.join(sectionPath, filename), posterPath, ffmpeg)
          files.push({
            filename, path: `/gallery/${entry.name}/${filename}`, type: 'video', ext: ext.slice(1),
            poster: fs.existsSync(posterPath) ? `/gallery/${entry.name}/${posterName}` : null,
          })
          continue
        }

        // ── Video that needs conversion (mov, avi, mkv) ──
        if (CONVERT_VIDEO_EXTS.has(ext)) {
          const mp4Name = filename + '.mp4'
          const mp4Path = path.join(sectionPath, mp4Name)
          if (ffmpeg) await ensureVideoMp4(path.join(sectionPath, filename), mp4Path, ffmpeg)
          const useMp4 = fs.existsSync(mp4Path)
          const posterName = (useMp4 ? mp4Name : filename) + '.poster.jpg'
          const posterPath = path.join(sectionPath, posterName)
          if (ffmpeg && useMp4) await ensurePoster(mp4Path, posterPath, ffmpeg)
          files.push({
            filename,
            path: `/gallery/${entry.name}/${useMp4 ? mp4Name : filename}`,
            type: 'video',
            ext: useMp4 ? 'mp4' : ext.slice(1),
            original: filename,
            poster: fs.existsSync(posterPath) ? `/gallery/${entry.name}/${posterName}` : null,
          })
          continue
        }
      }

      if (files.length > 0) manifest[entry.name] = files
    }
  } catch (err) {
    console.warn('[gallery] manifest error:', err.message)
  }

  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2))
  const counts = Object.entries(manifest).map(([k, v]) => `${k}(${v.length})`).join(', ')
  console.log(`[gallery] manifest ready: ${counts || 'empty'}`)
}

// ── Vite plugin ────────────────────────────────────────────────────────────────
function galleryManifestPlugin() {
  let projectRoot = process.cwd()

  return {
    name: 'gallery-manifest',
    async configResolved(config) {
      projectRoot = config.root
      await generateManifest(projectRoot)
    },
    configureServer(server) {
      const galleryDir = path.join(projectRoot, 'public', 'gallery')
      server.watcher.add(galleryDir)
      server.watcher.on('add', async (filePath) => {
        if (filePath.includes(`${path.sep}gallery${path.sep}`)) await generateManifest(projectRoot)
      })
      server.watcher.on('unlink', async (filePath) => {
        if (filePath.includes(`${path.sep}gallery${path.sep}`)) await generateManifest(projectRoot)
      })
    },
    async buildStart() {
      await generateManifest(projectRoot)
    },
  }
}

export default defineConfig({
  base: '/SrivathsaSharmaPurohitha_V1/',
  plugins: [react(), galleryManifestPlugin()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          motion: ['framer-motion'],
        },
      },
    },
  },
})
