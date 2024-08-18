import { test, expect } from "@playwright/test";
import { chromium } from "playwright-extra";
import fs from "fs";
import path from "path";

import StealthPlugin from "puppeteer-extra-plugin-stealth";
import { SkyscannerHomepage } from "../pages/Homepage";
import { SkyscannerSearchResult } from "../pages/SearchResult";
import { parseDate } from "../utils/dateUtils";

const getTestData = () => {
  const filePath = path.join(__dirname, "../data/testData.json");
  const fileData = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(fileData);
};

const testData = getTestData();
test.describe("Flight Search Functionality", () => {
  let browser: any;
  let page: any;

  test.beforeEach(async () => {
    chromium.use(StealthPlugin());
    browser = await chromium.launch();
    page = await browser.newPage();
  });

  testData.flights.forEach(
    ({ fromPlace, toPlace, dateFrom, dateTo, numberOfGuests }) => {
      test(`Verify flight search from ${fromPlace} to ${toPlace}`, async () => {
        const homepage = new SkyscannerHomepage(page);
        const searchResult = new SkyscannerSearchResult(page);

        type PriceInfo = {
          day: number;
          price: number;
        };
        const cheapestPricesArray: PriceInfo[] = [];

        await page.goto("https://www.skyscanner.co.in/");
        await expect(page).toHaveTitle(/Skyscanner/);

        // Use methods from homepage POM
        await homepage.enterFromPlace(fromPlace);

        const startDate = parseDate(dateFrom); //parseDate function from Utility class
        const endDate = parseDate(dateTo);
        await homepage.setDates(startDate, endDate);
        await homepage.page.waitForTimeout(4000);
        await homepage.enterToPlace(toPlace);
        await homepage.page.waitForTimeout(4000);
        await homepage.setNumberOfAdults(numberOfGuests);
        await homepage.searchBtn.click();

        //Use functions from Searchresult POM
        await searchResult.waitForResults();
        await searchResult.clickCheapestButton();
        const price = await searchResult.getCheapestPrice();
        console.log(`Cheapest Price for today: Rs${price}`);

        //Iterate over next 5 days
        for (let i = 1; i <= 5; i++) {
          await searchResult.pressDatePicker();
          const result = await searchResult.showResult();
          console.log("Results Found:", result);

          await searchResult.checkTickets();
          console.log("Tickets are displayed!");

          await searchResult.clickCheapestPriceButton();
          await page.waitForTimeout(2000);
          const price = await searchResult.getCheapestPrice();

          console.log("Cheapest Price for " + i + " is " + price);

          cheapestPricesArray.push({ day: i, price });

          await page.waitForTimeout(5000);
        }

        const lowestPriceObject = cheapestPricesArray.reduce((prev, curr) =>
          curr.price < prev.price ? curr : prev
        );

        console.log(
          `The lowest price is $${lowestPriceObject.price} on day ${lowestPriceObject.day}`
        );
      });
    }
  );

  test.afterEach(async () => {
    await browser.close();
  });
});
