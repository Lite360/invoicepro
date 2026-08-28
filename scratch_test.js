const puppeteer = require('puppeteer');

(async () => {
  try {
    console.log('Launching browser...');
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    console.log('Browser launched successfully!');
    const page = await browser.newPage();
    await page.setContent('<h1>Test</h1>');
    const pdf = await page.pdf({ format: 'A4' });
    console.log('PDF generated successfully, bytes:', pdf.length);
    await browser.close();
    console.log('SUCCESS');
  } catch (err) {
    console.error('ERROR launching Puppeteer:', err);
  }
})();
