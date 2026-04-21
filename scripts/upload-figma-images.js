// ============================================================
// SKRIPTI: Ngarko imazhet nga Figma → Cloudinary
// ============================================================
// SI E EKZEKUTON:
//   1. Hap Cloudinary dashboard: console.cloudinary.com
//   2. Shko te Settings → Access Keys → kopjo API Secret
//   3. Ndrysho CLOUDINARY_API_SECRET poshtë ose shto në .env.local
//   4. Ekzekuto: node scripts/upload-figma-images.js
//
// ÇKA BËN:
//   - Lexon imazhet nga Figma (FIGMA_API_TOKEN i nevojshëm)
//   - Ngarkon 16 imazhe unike direkt te Cloudinary
//   - Pa humbje cilësie — origjinal PNG/JPEG
// ============================================================

require('dotenv').config({ path: '.env.local' })

const https = require('https')
const crypto = require('crypto')
const { Readable } = require('stream')

// ============================================================
// KONFIGURIMI
// ============================================================
const CLOUD_NAME    = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'dyimfvnv3'
const API_KEY       = process.env.CLOUDINARY_API_KEY  || '185288744666157'
const API_SECRET    = process.env.CLOUDINARY_API_SECRET  // DUHET nga .env.local
const FIGMA_TOKEN   = process.env.FIGMA_PERSONAL_TOKEN   // DUHET nga Figma Settings

if (!API_SECRET) {
  console.error('❌ CLOUDINARY_API_SECRET mungon në .env.local')
  console.error('   Shko te: console.cloudinary.com → Settings → Access Keys → kopjo API Secret')
  console.error('   Shto në .env.local: CLOUDINARY_API_SECRET=secret_ketu')
  process.exit(1)
}

// ============================================================
// HARTA: Figma Node ID → Cloudinary Public ID
// ============================================================
const IMAGES = [
  { nodeId: '88:1676', publicId: 'unify/hero/main',              name: 'Hero kryesor' },
  { nodeId: '88:1272', publicId: 'unify/campaigns/campaign-1',   name: 'Kampanja 1 (Ujë i Pastër)' },
  { nodeId: '88:1295', publicId: 'unify/campaigns/campaign-2',   name: 'Kampanja 2 (Libra)' },
  { nodeId: '88:1318', publicId: 'unify/campaigns/campaign-3',   name: 'Kampanja 3 (Spitali)' },
  { nodeId: '88:1484', publicId: 'unify/gallery/img-1',          name: 'Galeria 1' },
  { nodeId: '88:1486', publicId: 'unify/gallery/img-2',          name: 'Galeria 2' },
  { nodeId: '88:1489', publicId: 'unify/gallery/img-3',          name: 'Galeria 3' },
  { nodeId: '88:1491', publicId: 'unify/gallery/img-4',          name: 'Galeria 4' },
  { nodeId: '88:1492', publicId: 'unify/sections/feature-cta',   name: 'CTA seksioni' },
  { nodeId: '88:1353', publicId: 'unify/sections/rreth-nesh',    name: 'Rreth Nesh foto' },
  { nodeId: '88:1419', publicId: 'unify/sections/vullnetare',    name: 'Vullnetarë foto' },
  { nodeId: '88:1514', publicId: 'unify/team/albert-aliu',       name: 'Albert Aliu' },
  { nodeId: '88:1523', publicId: 'unify/team/rilind-krasniqi',   name: 'Rilind Krasniqi' },
  { nodeId: '88:1532', publicId: 'unify/team/dea-krasniqi',      name: 'Dea Krasniqi' },
  { nodeId: '88:1541', publicId: 'unify/team/besa-ajeti',        name: 'Besa Ajeti' },
  { nodeId: '88:1787', publicId: 'unify/sections/bamiresi-cta',  name: 'Bamirësi CTA' },
]

const FILE_KEY = '1OT7I2MkWFD2ClFkMGkQt7'
const PAGE_ID  = '284:2'  // feat/homepage

// ============================================================
// NDIHMËS: HTTP request
// ============================================================
function httpsGet(url, headers = {}) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers }, res => {
      const chunks = []
      res.on('data', c => chunks.push(c))
      res.on('end', () => resolve({ status: res.statusCode, body: Buffer.concat(chunks) }))
      res.on('error', reject)
    }).on('error', reject)
  })
}

function httpsPost(url, formData, boundary) {
  return new Promise((resolve, reject) => {
    const options = new URL(url)
    const req = https.request({
      hostname: options.hostname,
      path: options.pathname,
      method: 'POST',
      headers: {
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
        'Content-Length': formData.length,
      }
    }, res => {
      const chunks = []
      res.on('data', c => chunks.push(c))
      res.on('end', () => resolve({ status: res.statusCode, body: JSON.parse(Buffer.concat(chunks).toString()) }))
      res.on('error', reject)
    })
    req.on('error', reject)
    req.write(formData)
    req.end()
  })
}

// ============================================================
// NDIHMËS: Multipart form-data builder
// ============================================================
function buildFormData(fields, fileField, fileBuffer, filename, mimeType) {
  const boundary = `----FormBoundary${crypto.randomBytes(8).toString('hex')}`
  const parts = []

  for (const [key, value] of Object.entries(fields)) {
    parts.push(Buffer.from(
      `--${boundary}\r\nContent-Disposition: form-data; name="${key}"\r\n\r\n${value}\r\n`
    ))
  }

  parts.push(Buffer.from(
    `--${boundary}\r\nContent-Disposition: form-data; name="${fileField}"; filename="${filename}"\r\nContent-Type: ${mimeType}\r\n\r\n`
  ))
  parts.push(fileBuffer)
  parts.push(Buffer.from(`\r\n--${boundary}--\r\n`))

  return { buffer: Buffer.concat(parts), boundary }
}

// ============================================================
// PASO 1: Merr export URLs nga Figma
// ============================================================
async function getFigmaImageUrls(nodeIds) {
  if (!FIGMA_TOKEN) {
    console.log('⚠️  FIGMA_PERSONAL_TOKEN mungon — skalu Figma export')
    return null
  }

  const ids = nodeIds.join(',')
  const url = `https://api.figma.com/v1/images/${FILE_KEY}?ids=${ids}&format=png&scale=2`

  console.log('📥 Duke marrë export URLs nga Figma...')
  const res = await httpsGet(url, {
    'X-Figma-Token': FIGMA_TOKEN,
  })

  if (res.status !== 200) {
    console.error('❌ Figma API error:', res.body.toString())
    return null
  }

  const data = JSON.parse(res.body.toString())
  return data.images // { nodeId: downloadUrl }
}

// ============================================================
// PASO 2: Ngarko në Cloudinary
// ============================================================
async function uploadToCloudinary(imageBuffer, publicId, mimeType) {
  const timestamp = Math.floor(Date.now() / 1000).toString()
  const sigString = `public_id=${publicId}&timestamp=${timestamp}${API_SECRET}`
  const signature = crypto.createHash('sha1').update(sigString).digest('hex')

  const { buffer, boundary } = buildFormData(
    { public_id: publicId, api_key: API_KEY, timestamp, signature },
    'file', imageBuffer, 'image.png', mimeType
  )

  const res = await httpsPost(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
    buffer, boundary
  )

  return res.body
}

// ============================================================
// KRYESORJA
// ============================================================
async function main() {
  console.log(`\n🚀 Unify — Ngarkimi i imazheve nga Figma → Cloudinary (${CLOUD_NAME})\n`)

  const nodeIds = IMAGES.map(img => `${PAGE_ID}:${img.nodeId.split(':')[0]}:${img.nodeId.split(':')[1]}`)
    .map(id => id.replace(/^284:2:/, ''))

  // Merr export URLs nga Figma (kërkon FIGMA_PERSONAL_TOKEN)
  const figmaUrls = await getFigmaImageUrls(IMAGES.map(img => img.nodeId))

  const results = []

  for (const img of IMAGES) {
    process.stdout.write(`  📸 ${img.name.padEnd(30)} → `)

    try {
      let imageBuffer

      if (figmaUrls && figmaUrls[img.nodeId]) {
        // Shkarko nga Figma export URL
        const dlRes = await httpsGet(figmaUrls[img.nodeId])
        imageBuffer = dlRes.body
      } else {
        console.log('⏭ (kërkon FIGMA_PERSONAL_TOKEN)')
        results.push({ ...img, status: 'skipped' })
        continue
      }

      const mimeType = imageBuffer[0] === 0xFF && imageBuffer[1] === 0xD8 ? 'image/jpeg' : 'image/png'

      const result = await uploadToCloudinary(imageBuffer, img.publicId, mimeType)

      if (result.secure_url) {
        const sizeKB = Math.round(imageBuffer.length / 1024)
        console.log(`✅ ${result.secure_url} (${sizeKB}KB, ${result.width}×${result.height})`)
        results.push({ ...img, status: 'ok', url: result.secure_url })
      } else {
        console.log(`❌ ${result.error?.message || 'gabim i panjohur'}`)
        results.push({ ...img, status: 'error', error: result.error?.message })
      }

    } catch (e) {
      console.log(`❌ ${e.message}`)
      results.push({ ...img, status: 'error', error: e.message })
    }
  }

  // Raporto
  const ok = results.filter(r => r.status === 'ok').length
  const err = results.filter(r => r.status === 'error').length
  const skip = results.filter(r => r.status === 'skipped').length

  console.log(`\n✅ ${ok} ngarkuar  ❌ ${err} gabim  ⏭ ${skip} kaluar\n`)

  if (ok > 0) {
    console.log('🎉 Imazhet janë të gatshme në Cloudinary!')
    console.log(`   Shiko: https://console.cloudinary.com/pm/${CLOUD_NAME}/media-explorer`)
  }

  if (skip > 0) {
    console.log('\n📋 Për të ngarkuar nga Figma:')
    console.log('   1. Shko te: figma.com → Account Settings → Personal Access Tokens')
    console.log('   2. Krijo token të ri')
    console.log('   3. Shto në .env.local: FIGMA_PERSONAL_TOKEN=token_ketu')
    console.log('   4. Ekzekuto sërish: node scripts/upload-figma-images.js')
  }
}

main().catch(console.error)
