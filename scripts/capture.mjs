import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle', timeout: 15000 });
  await page.waitForTimeout(3000);
  await page.screenshot({ path: '/home/user/minuno/captures/test-capture-01.png', fullPage: false });
  console.log('Captura 01 tomada');
  await browser.close();
})();
