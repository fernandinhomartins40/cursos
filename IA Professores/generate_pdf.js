const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
    console.log('Launching browser...');
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    const filePath = `file:///${path.join(__dirname, 'Apostila_Completa_IA_Educadores.html').replace(/\\/g, '/')}`;
    console.log(`Loading ${filePath}...`);
    
    // Wait for network idle to ensure Tailwind CDN and images are loaded
    await page.goto(filePath, { waitUntil: 'networkidle0' });
    
    console.log('Generating PDF...');
    await page.pdf({
        path: 'Apostila_Completa_IA_Educadores_Shadcn.pdf',
        format: 'A4',
        printBackground: true,
        margin: {
            top: '20mm',
            bottom: '20mm',
            left: '20mm',
            right: '20mm'
        }
    });

    await browser.close();
    console.log('PDF generated successfully!');
})();
