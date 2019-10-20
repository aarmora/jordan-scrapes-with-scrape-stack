import axios from 'axios';
import puppteer, { Page, BrowserContext } from 'puppeteer';
import { config } from './config';
import cheerio from 'cheerio';

(async () => {
	const baseUrl = `http://api.scrapestack.com/scrape?access_key=${config.apiKey}`;
	const url = 'https://www.amazon.com/dp/B00170EB1Q';
	// const url = 'https://www.google.com/search?q=javascript+web+scraping+guy';
	const promises: any[] = [];

	const browser = await puppteer.launch({ headless: false });

	console.time('test');
	for (let i = 0; i < 10; i++) {
		const context = await browser.createIncognitoBrowserContext();
		// promises.push(withAxios(`${baseUrl}&url=${url}`));
		// promises.push(withAxios(url));
		// await withPuppeteer(`${baseUrl}&url=${url}`, context);
		await withPuppeteer(url, context);
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
		console.log('error');
	}
	console.log('status', axiosResponse.status);
	const $ = cheerio.load(axiosResponse.data);

	console.log('title', $('title').text());
	// Comment this in when hitting amazon to see the price
	// console.log('price', $('#priceblock_ourprice').text());

}

async function withPuppeteer(url: string, context: BrowserContext) {
	const page = await context.newPage();

	try {
		await page.goto(url);
	}
	catch (e) {
		console.log('error', e);
		await context.close();
		throw 'errored on page navigation';
	}

	console.log('title', await page.$eval('title', element => element.textContent));

	await context.close();
}