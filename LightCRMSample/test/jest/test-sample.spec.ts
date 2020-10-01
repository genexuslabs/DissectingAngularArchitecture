import * as puppeteer from "puppeteer";

describe("My App Test", () => {
  let browser;
  let page;
  const url = "http://localhost:3030/";

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: true
    });
    page = await browser.newPage();
    page.emulate({
      viewport: {
        width: 600,
        height: 2400
      },
      userAgent: ""
    });
  });

  afterAll(() => {
    browser.close();
  });

  beforeEach(async () => {
    await page.goto(url);
  });

  it("My Test Case 1", async () => {
    // await page.waitForSelector("gx-button");
    // let html = await page.$eval("body", e => e.innerHTML);
    // expect(html).toContain("Test Simple");    
    // await page.click('gx-button[name="ctrlChronometertest"] button');
    // await page.waitForSelector(".ApplicationBars");
    // html = await page.$eval("body", e => e.innerHTML);
    // expect(html).toContain("Chronometer Test");
  }, 1000);

  it("My Test Case 2", async () => {    
	// await page.waitForSelector("gx-button");
    // await page.click('gx-button[name="ctrlChronometertest"] button');
    // await page.waitForSelector("gx-chronometer");
    // let html = await page.$eval("gx-chronometer span", e => e.innerHTML);
    // expect(html).toContain("0");
    // await page.click('gx-button[name="ctrlStart"]');
    // await page.waitFor(1100);
    // html = await page.$eval("gx-chronometer span", e => e.innerHTML);
    // expect(html).toContain("1");
  }, 3000);

});
