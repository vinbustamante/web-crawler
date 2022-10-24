import { inject, injectable } from "inversify";
import { ContactDto } from "../dto/ContactDto";
import { IScraperService } from "../IScraperService";
import { BaseService } from "./BaseService";
import { types as serviceTypes } from "../types";
import { IHttpService } from "../IHttpService";
import { Page } from "puppeteer";
import { ILinkService } from "../ILinkService";
import { IWebBrowserService } from "../IWebBrowserService";
import { ILogService } from "../ILogService";
import { IDomainService } from "../IDomainService";

@injectable()
export class ScraperService extends BaseService implements IScraperService {
  @inject(serviceTypes.IHttpService)
  private readonly _httpService: IHttpService;

  @inject(serviceTypes.ILinkService)
  private _linkService: ILinkService;

  @inject(serviceTypes.IWebBrowserService)
  private readonly _webBrowserService: IWebBrowserService;

  @inject(serviceTypes.ILogService)
  private _logService: ILogService;

  @inject(serviceTypes.IDomainService)
  private _domainService: IDomainService;

  getDto() {
    return ContactDto;
  }

  // @ts-ignore
  async getContactInfo(url: string): Promise<ContactDto> {
    const contactDto = new ContactDto();
    let page: Page | null = null;
    try {
      await this._logService.info(`processing: ${url}`);
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
      await this._saveChildLinks(page, url);
      page?.close();
    }

    return contactDto;
  }

  // @ts-ignore
  private async _saveChildLinks(page: Page, url): Promise<void> {
    try {
      await this._logService.info(`collecting child links from ${url}`);
      const domainInfo = await this._domainService.getFirstRecord();
      if (domainInfo && domainInfo.domainId) {
        const urls = await this._webBrowserService.getLinks(page);
        if (urls && urls.length) {
          await this._logService.info(
            `saving child links found ${urls.length}`
          );
          await this._linkService.bulkSave(domainInfo.domainId, urls);
        }

        // todo: check if the page has a paging, it must be visited each page
        // check if there is a paging
        // console.log("************* next page button *****************");
        // console.log(await page.$('[class^="Paging_redirectPageBtn"]'));
        // console.log("******************************");
      }
    } catch (err) {
      await this._logService.error(err);
    }
  }
}
