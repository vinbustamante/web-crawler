import { injectable } from "inversify";
import { IHttpService } from "../IHttpService";
import * as puppeteer from "puppeteer";

@injectable()
export class HttpService implements IHttpService {
  async open(url: string): Promise<puppeteer.Page> {
    // const browser = await puppeteer.launch({ headless: true });
    // todo: mark as headless for prod
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    // todo: relocate to config
    await page.setViewport({
      width: 1200,
      height: 800,
    });
    await page.goto(url);
    return page;
  }
}
