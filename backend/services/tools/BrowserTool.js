// import puppeteer from 'puppeteer';
const puppeteer = null; // Mocked for now


/**
 * Browser Tool Service (The "Hands")
 * capabilities: Search Google, Extract Page Content, Take Screenshot (mental snapshot)
 */
class BrowserTool {
    constructor() {
        this.browser = null;
    }

    /**
     * Launch the "Ghost Browser"
     */
    async init() {
        if (!puppeteer) {
            console.warn("BrowserTool: Puppeteer not available, using mock mode.");
            return;
        }
        if (!this.browser) {
            this.browser = await puppeteer.launch({
                headless: 'new', // Run in background (ghost mode)
                args: ['--no-sandbox', '--disable-setuid-sandbox'] // Required for some hosting envs like Railway
            });
        }
    }


    /**
     * Perform a Google Search and return top results
     */
    async searchGoogle(query) {
        let page = null;
        try {
            await this.init();
            if (!this.browser) {
                return [
                    { title: "Mock Result: Improving Communication", url: "https://example.com/tips" },
                    { title: "Mock Result: Effective Speaking", url: "https://example.com/guide" }
                ];
            }
            page = await this.browser.newPage();


            // Go to Google
            await page.goto(`https://www.google.com/search?q=${encodeURIComponent(query)}`, { waitUntil: 'domcontentloaded' });

            // Extract Search Results (Titles and Links)
            const results = await page.evaluate(() => {
                const anchors = Array.from(document.querySelectorAll('div.g h3'));
                return anchors.map(h3 => {
                    const anchor = h3.parentElement;
                    return {
                        title: h3.innerText,
                        url: anchor ? anchor.href : null
                    };
                }).slice(0, 3); // Top 3 results
            });

            return results.filter(r => r.url); // Remove any nulls
        } catch (error) {
            console.error("Browser Search Error:", error);
            return [];
        } finally {
            if (page) await page.close();
        }
    }

    /**
     * Read a webpage content
     */
    async readPage(url) {
        let page = null;
        try {
            await this.init();
            page = await this.browser.newPage();

            // Block images/fonts to speed up research
            await page.setRequestInterception(true);
            page.on('request', (req) => {
                if (['image', 'stylesheet', 'font'].includes(req.resourceType())) {
                    req.abort();
                } else {
                    req.continue();
                }
            });

            await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 }); // 15s timeout

            // Extract main text content
            const content = await page.evaluate(() => {
                // Remove scripts, styles, ads
                const scripts = document.querySelectorAll('script, style, noscript, iframe, nav, footer');
                scripts.forEach(s => s.remove());
                return document.body.innerText.substring(0, 5000); // First 5000 chars
            });

            return content.replace(/\s+/g, ' ').trim(); // Clean whitespace

        } catch (error) {
            console.error(`Error reading ${url}:`, error.message);
            return `Failed to read page: ${error.message}`;
        } finally {
            if (page) await page.close();
        }
    }

    /**
     * Close the browser instance (cleanup)
     */
    async close() {
        if (this.browser) {
            await this.browser.close();
            this.browser = null;
        }
    }
}

export default new BrowserTool();
