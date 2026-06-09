import sharp from 'sharp'
import { writeFileSync } from 'fs'

const svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 180">
  <!-- Background -->
  <rect width="180" height="180" fill="#F9F0EB"/>
  <!-- 5 petals centered at 90,90 -->
  <g transform="translate(90,90)">
    <ellipse cx="0" cy="-34" rx="17" ry="30" fill="#E8735A" opacity="0.92" transform="rotate(0)"/>
    <ellipse cx="0" cy="-34" rx="17" ry="30" fill="#E8735A" opacity="0.92" transform="rotate(72)"/>
    <ellipse cx="0" cy="-34" rx="17" ry="30" fill="#E8735A" opacity="0.92" transform="rotate(144)"/>
    <ellipse cx="0" cy="-34" rx="17" ry="30" fill="#E8735A" opacity="0.92" transform="rotate(216)"/>
    <ellipse cx="0" cy="-34" rx="17" ry="30" fill="#E8735A" opacity="0.92" transform="rotate(288)"/>
    <!-- Petal highlights -->
    <ellipse cx="0" cy="-44" rx="6" ry="10" fill="#F2A897" opacity="0.6" transform="rotate(0)"/>
    <ellipse cx="0" cy="-44" rx="6" ry="10" fill="#F2A897" opacity="0.6" transform="rotate(72)"/>
    <ellipse cx="0" cy="-44" rx="6" ry="10" fill="#F2A897" opacity="0.6" transform="rotate(144)"/>
    <ellipse cx="0" cy="-44" rx="6" ry="10" fill="#F2A897" opacity="0.6" transform="rotate(216)"/>
    <ellipse cx="0" cy="-44" rx="6" ry="10" fill="#F2A897" opacity="0.6" transform="rotate(288)"/>
    <!-- Center -->
    <circle r="18" fill="#F9F0EB"/>
    <circle r="10" fill="#C4A882" opacity="0.6"/>
    <circle r="5" fill="#E8735A"/>
    <!-- Stamens -->
    <line x1="0" y1="-10" x2="0" y2="-20" stroke="#E8735A" stroke-width="1.5" stroke-linecap="round"/>
    <line x1="0" y1="-10" x2="0" y2="-20" stroke="#E8735A" stroke-width="1.5" stroke-linecap="round" transform="rotate(60)"/>
    <line x1="0" y1="-10" x2="0" y2="-20" stroke="#E8735A" stroke-width="1.5" stroke-linecap="round" transform="rotate(120)"/>
    <line x1="0" y1="-10" x2="0" y2="-20" stroke="#E8735A" stroke-width="1.5" stroke-linecap="round" transform="rotate(180)"/>
    <line x1="0" y1="-10" x2="0" y2="-20" stroke="#E8735A" stroke-width="1.5" stroke-linecap="round" transform="rotate(240)"/>
    <line x1="0" y1="-10" x2="0" y2="-20" stroke="#E8735A" stroke-width="1.5" stroke-linecap="round" transform="rotate(300)"/>
  </g>
</svg>`

const svgBuffer = Buffer.from(svgIcon)

// 180x180 for iPhone apple-touch-icon
await sharp(svgBuffer).resize(180, 180).png().toFile('public/apple-touch-icon.png')
console.log('✓ public/apple-touch-icon.png (180x180)')

// 192x192 and 512x512 for web manifest
await sharp(svgBuffer).resize(192, 192).png().toFile('public/icon-192.png')
console.log('✓ public/icon-192.png (192x192)')

await sharp(svgBuffer).resize(512, 512).png().toFile('public/icon-512.png')
console.log('✓ public/icon-512.png (512x512)')

// Also replace the favicon.svg with the cherry blossom
writeFileSync('public/favicon.svg', svgIcon)
console.log('✓ public/favicon.svg updated')

console.log('\nAll icons generated!')
