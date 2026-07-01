/**
 * Gerador da imagem Open Graph (1200x630) pro convite da Yasmin.
 *
 * Uso:
 *   node scripts/generate-og.js
 *
 * Saída:
 *   assets/og-image.png
 */

const path = require('path');
const fs = require('fs');
const puppeteer = require('puppeteer');

const PROJECT_ROOT = path.resolve(__dirname, '..');
const TEMPLATE = path.join(PROJECT_ROOT, 'scripts', 'og-template.html');
const PHOTO = path.join(PROJECT_ROOT, 'assets', 'foto-yasmin.jpg');
const OUTPUT = path.join(PROJECT_ROOT, 'assets', 'og-image.png');

async function main() {
  if (!fs.existsSync(TEMPLATE)) {
    console.error('Template não encontrado:', TEMPLATE);
    process.exit(1);
  }
  if (!fs.existsSync(PHOTO)) {
    console.error('Foto não encontrada:', PHOTO);
    process.exit(1);
  }

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 });

    // Carrega a foto e converte pra base64 data URL (assim carrega dentro do data: URL)
    const photoBase64 = fs.readFileSync(PHOTO).toString('base64');
    const photoDataUrl = `data:image/jpeg;base64,${photoBase64}`;

    // Carrega o template e injeta a foto como data URL
    const html = fs.readFileSync(TEMPLATE, 'utf8')
      .replace('{{PHOTO_PATH}}', photoDataUrl);
    const dataUrl = 'data:text/html;charset=utf-8,' + encodeURIComponent(html);

    await page.goto(dataUrl, { waitUntil: 'networkidle0' });
    await page.evaluate(() => document.fonts.ready);

    // Espera a foto carregar
    await page.waitForFunction(() => {
      const img = document.querySelector('.photo-frame img');
      return img && img.complete && img.naturalWidth > 0;
    }, { timeout: 5000 });

    await page.screenshot({
      path: OUTPUT,
      type: 'png',
      omitBackground: false,
      clip: { x: 0, y: 0, width: 1200, height: 630 },
    });

    console.log('✓ Imagem gerada:', OUTPUT);
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error('Erro ao gerar imagem:', err);
  process.exit(1);
});
