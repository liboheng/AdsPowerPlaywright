const axios = require('axios');
const { chromium } = require('playwright');

axios.get('http://local.adspower.net:50325/api/v1/browser/start?serial_number=1').then(async (res) => {
    console.log(res.data);
    if (res.data.code === 0 && res.data.data.ws && res.data.data.ws.puppeteer) {
        try {
            const browser = await chromium.connectOverCDP(res.data.data.ws.puppeteer);
            const defaultContext = browser.contexts()[0];
            const page = await defaultContext.newPage();

            // 监听请求
            await page.route('https://discord.com/api/v9/users/@me/billing/country-code', (route) => {
                const request = route.request();
                const headers = request.headers();
                console.log('请求URL:', request.url());
                console.log('请求头:', headers);

                // 在这里可以获取请求头中的值进行处理

                route.continue();
            });

            // 等待一段时间，观察请求日志
            await page.waitForTimeout(5000);
            await page.goto('https://discord.com/channels/@me');
            // await browser.close();
        } catch (err) {
            console.log(err.message);
        }
    }
}).catch((err) => {
    console.log(err)
});