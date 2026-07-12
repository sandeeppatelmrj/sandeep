const puppeteer = require("puppeteer");
(async () => {
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    await page.goto("file:///" + __dirname.replace(/\\/g, '/') + "/project-detail.html?id=hal-museum", { waitUntil: "networkidle2" });
    
    const iframes = await page.$$eval("iframe", els => {
        return els.map(e => {
            const rect = e.getBoundingClientRect();
            const style = window.getComputedStyle(e);
            return {
                src: e.src,
                width: rect.width,
                height: rect.height,
                display: style.display,
                visibility: style.visibility,
                opacity: style.opacity
            };
        });
    });
    console.log("IFRAMES DETAILS:", JSON.stringify(iframes, null, 2));

    await browser.close();
})();
