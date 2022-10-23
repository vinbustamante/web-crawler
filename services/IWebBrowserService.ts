import { ElementHandle, Page } from "puppeteer";

export interface IWebBrowserService {
  getLinks(page: Page): Promise<string[]>;
  getElements(page: Page, criteria: string): Promise<ElementHandle[]>;
}
