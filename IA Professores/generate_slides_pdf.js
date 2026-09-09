const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
    console.log('Launching browser...');
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    const filePath = `file:///${path.join(__dirname, 'Apresentacao_Slides_IA_Educadores.html').replace(/\\/g, '/')}`;
    console.log(`Loading ${filePath}...`);
    
    // Wait for network idle to ensure Tailwind CDN is fully loaded
    await page.goto(filePath, { waitUntil: 'networkidle0' });
    
    console.log('Generating Slides PDF...');
    await page.pdf({
        path: 'Apresentacao_Slides_IA_Educadores.pdf',
        format: 'A4',
        landscape: true,
        printBackground: true,
        margin: {
            top: '0',
            bottom: '0',
            left: '0',
            right: '0'
        }
    });

    await browser.close();
    console.log('Slides PDF generated successfully!');
})();
