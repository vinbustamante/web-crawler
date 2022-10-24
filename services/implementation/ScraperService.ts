import { inject, injectable } from "inversify";
import { ContactDto } from "../dto/ContactDto";
import { IScraperService } from "../IScraperService";
import { BaseService } from "./BaseService";
import { types as serviceTypes } from "../types";
import { IHttpService } from "../IHttpService";
import { Page } from "puppeteer";

@injectable()
export class ScraperService extends BaseService implements IScraperService {
  @inject(serviceTypes.IHttpService)
  private readonly _httpService: IHttpService;

  getDto() {
    return ContactDto;
  }

  // @ts-ignore
  async getContactInfo(url: string): Promise<ContactDto> {
    const contactDto = new ContactDto();
    let page: Page | null = null;
    try {
      console.log("processing: ", url);
      page = await this._httpService.open(url);
      const allResultsSelector = "img[src$='white-phone.svg']";
      await page.waitForSelector(allResultsSelector);
      await page.click(allResultsSelector);
      const phoneNodeElement = await page.waitForSelector(
        "div[class^=LeadButton_showPhoneButton] > div > div > span"
      );
      if (phoneNodeElement) {
        const value = await phoneNodeElement.evaluate((el) => el.textContent);
        if (value) {
          contactDto.contactNumber = value;
        }
      }
    } finally {
      page?.close();
    }

    return contactDto;
  }
}
