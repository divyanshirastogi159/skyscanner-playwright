import { Page, Locator } from "@playwright/test";
import { formatDateForPicker } from "../utils/dateUtils"; // Adjust path as needed

export class SkyscannerHomepage {
  readonly page: Page;
  readonly fromPlace: Locator;
  readonly toPlace: Locator;
  readonly ulOrigin: Locator;
  readonly liOrigin: Locator;
  readonly ulDest: Locator;
  readonly liDest: Locator;
  readonly startDate: Locator;
  readonly calendar: Locator;
  readonly todayDateLocator: Locator;
  readonly returnDateLocator: Locator;
  readonly applyDateButton: Locator;
  readonly travelBtn: Locator;
  readonly addAdultsButton: Locator;
  readonly adultInputBtn: Locator;
  readonly searchBtn: Locator;

  constructor(page: Page) {
    this.page = page;
    this.fromPlace = page.locator("#originInput-input");
    this.toPlace = page.locator("#destinationInput-input");
    this.ulOrigin = page.locator("#originInput-menu");
    this.liOrigin = this.ulOrigin.locator("li");
    this.ulDest = page.locator("#destinationInput-menu");
    this.liDest = this.ulDest.locator("li");
    this.startDate = page.locator(
      "//span[text()='Depart']/following-sibling::span"
    );
    this.calendar = page.locator("//div[@data-testid='calendar']");
    this.applyDateButton = page.locator(
      "//button[@data-testid='CalendarSearchButton']"
    );
    this.travelBtn = page.locator("button[data-testid='traveller-button']");
    this.addAdultsButton = page.locator(
      "//*[@id='app-root']/div[1]/div/div/main/div[1]/div/div[3]/div/div[4]/div[2]/div/div[2]/div[1]/div/div/button[2]"
    );
    this.adultInputBtn = page.locator("input#adult-nudger");
    this.searchBtn = page.locator("//button[normalize-space(text())='Search']");
  }

  async enterFromPlace(from: string) {
    for (const char of from) {
      await this.fromPlace.pressSequentially(char, {
        delay: 100 + Math.random() * 50,
      });
    }
    await this.ulOrigin.waitFor({ state: "visible" });
    await this.liOrigin.first().click();
  }

  async enterToPlace(to: string) {
    for (const char of to) {
      await this.toPlace.pressSequentially(char, {
        delay: 300 + Math.random() * 50,
      });
    }
    const option = this.page.getByRole("option", { name: `${to}` });
    await option.first().click();
  }
  async setDates(startDate: Date, endDate: Date) {
    const startDateLabel = formatDateForPicker(startDate);
    const endDateLabel = formatDateForPicker(endDate);

    await this.startDate.click();
    await this.calendar.waitFor({ state: "visible" });
    await this.page.locator(`button[aria-label*='${startDateLabel}']`).click();
    await this.page.locator(`button[aria-label*='${endDateLabel}']`).click();
    await this.applyDateButton.click();
  }

  async setNumberOfAdults(numOfAdults: number) {
    await this.travelBtn.click();
    for (let i = 1; i < numOfAdults; i++) {
      await this.addAdultsButton.click();
      await this.page.waitForTimeout(700 + Math.random() * 1000);
    }
  }
}
