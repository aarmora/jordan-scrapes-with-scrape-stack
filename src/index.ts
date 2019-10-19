import axios from 'axios';
import puppteer, { Page, BrowserContext } from 'puppeteer';
import { config } from './config';
import cheerio from 'cheerio';

(async () => {
	const baseUrl = `http://api.scrapestack.com/scrape?access_key=${config.apiKey}`;
	// const url = 'https://www.amazon.com/dp/B00170EB1Q';
	const url = 'https://www.google.com/search?q=javascript+web+scraping+guy';
	const promises: any[] = [];

	const browser = await puppteer.launch({ headless: false });

	console.time('test');
	for (let i = 0; i < 10; i++) {
		const context = await browser.createIncognitoBrowserContext();
		// promises.push(withAxios(`${baseUrl}&url=${url}`));
		// promises.push(withAxios(url));
		promises.push(withPuppeteer(`${baseUrl}&url=${url}`, context));
		// promises.push(withPuppeteer(url, context));
	}

	await Promise.all(promises);
	console.timeEnd('test');

	await browser.close();

})();

async function withAxios(url: string) {

	let axiosResponse;
	try {
		axiosResponse = await axios.get(url);
	}
	catch (e) {
		console.log('error', e);
	}
	console.log('status', axiosResponse.status, axiosResponse.request.connection.remoteAddress);
	const $ = cheerio.load(axiosResponse.data);

	console.log('title', $('title').html());
	console.log('price', $('#priceblock_ourprice').html());
	console.log('some div', $('div').html());

}

async function withPuppeteer(url: string, context: BrowserContext) {
	const page = await context.newPage();

	await page.goto(url);

	console.log('title', await page.$eval('title', element => element.textContent));

	await context.close();
}