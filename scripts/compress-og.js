/**
 * Comprime a og-image.png para JPG (menor tamanho, melhor pro WhatsApp).
 * Também cria uma versão PNG otimizada como fallback.
 */
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');

const PROJECT_ROOT = path.resolve(__dirname, '..');
const INPUT = path.join(PROJECT_ROOT, 'assets', 'og-image.png');
const OUTPUT_JPG = path.join(PROJECT_ROOT, 'assets', 'og-image.jpg');

async function main() {
  if (!fs.existsSync(INPUT)) {
    console.error('Imagem de entrada não encontrada:', INPUT);
    process.exit(1);
  }

  // Comprime pra JPG com qualidade 85 (bom equilíbrio)
  await sharp(INPUT)
    .jpeg({ quality: 85, progressive: true, mozjpeg: true })
    .toFile(OUTPUT_JPG);

  const originalSize = fs.statSync(INPUT).size;
  const jpgSize = fs.statSync(OUTPUT_JPG).size;

  console.log('✓ Imagem comprimida:');
  console.log(`  PNG original: ${(originalSize / 1024).toFixed(0)} KB`);
  console.log(`  JPG comprimido: ${(jpgSize / 1024).toFixed(0)} KB`);
  console.log(`  Redução: ${((1 - jpgSize / originalSize) * 100).toFixed(0)}%`);
  console.log(`  Saída: ${OUTPUT_JPG}`);
}

main().catch((err) => {
  console.error('Erro:', err);
  process.exit(1);
});