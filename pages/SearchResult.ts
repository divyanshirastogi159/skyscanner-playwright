import { Page, Locator, expect } from "@playwright/test";

export class SkyscannerSearchResult {
  readonly page: Page;
  readonly resultText: Locator;
  readonly cheapestButton: Locator;
  readonly cheapestPriceLocator: Locator;
  readonly ticketWrapper: Locator;
  readonly firstDatePicker: Locator;
  readonly returnDatePicker: Locator;

  constructor(page: Page) {
    this.page = page;
    this.resultText = page.locator(
      "//div[contains(@class, 'ResultsSummary_summaryContainer')]//span"
    );
    this.cheapestButton = page.locator("//div[@role='radiogroup']//button[2]");
    this.cheapestPriceLocator = page.locator(
      "//div[@role='radiogroup']//button[2]//span"
    );
    this.ticketWrapper = page.locator(
      "//div[contains(@class, 'EcoTicketWrapper')]"
    );
    this.firstDatePicker = page.locator(
      "(//div[contains(@class, 'DatePicker_datePickerContainer')])[1]/following-sibling::button"
    );
    this.returnDatePicker = page.locator(
      "(//div[contains(@class, 'DatePicker_datePickerContainer')])[2]/following-sibling::button"
    );
  }

  async waitForResults() {
    await this.resultText.waitFor({ state: "visible", timeout: 20000 });
  }

  async clickCheapestButton() {
    await this.cheapestButton.waitFor({ state: "visible", timeout: 5000 });
    await this.cheapestButton.click();
  }

  async waitForTickets() {
    await this.ticketWrapper.first().waitFor({ state: "visible" });
  }
  async pressDatePicker() {
    await this.firstDatePicker.click();
    await this.returnDatePicker.click();
  }

  async showResult(): Promise<string> {
    await this.resultText.waitFor({ state: "visible", timeout: 20000 });
    const result = await this.resultText.innerText();
    return result;
  }

  async checkTickets() {
    await expect(this.ticketWrapper.first()).toBeVisible();
  }
  async clickCheapestPriceButton() {
    await this.cheapestButton.waitFor({ state: "visible", timeout: 5000 });
    await this.cheapestButton.click();
  }

  async getCheapestPrice(): Promise<number> {
    let cheapestPriceStr = await this.cheapestPriceLocator.innerText();

    const cleanedPriceStr = cheapestPriceStr.replace(/[^0-9.]/g, "");

    let cheapestPrice = parseFloat(cleanedPriceStr.replace(/[^\d.]/g, ""));
    return cheapestPrice;
  }
}
