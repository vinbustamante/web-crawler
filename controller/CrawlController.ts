import "reflect-metadata";
import { injectable, inject } from "inversify";
import { types as serviceTypes } from "../services/types";
import { mapCommand } from "../decorator/mapCommand";
import { IHttpService } from "services/IHttpService";
import { IUtilService } from "services/IUtilService";
import { CommandEnum } from "enum/CommandEnum";
import { CommandControllerParams } from "types/CommandControllerParams";
import { IDomainService } from "../services/IDomainService";
import { IWebBrowserService } from "../services/IWebBrowserService";
import { ILinkService } from "../services/ILinkService";
import { Page } from "puppeteer";
import { ILogService } from "../services/ILogService";

@mapCommand(CommandEnum.crawl)
@injectable()
export class CrawlController {
  @inject(serviceTypes.IHttpService)
  private _httpService: IHttpService;

  @inject(serviceTypes.IUtilService)
  private _utilService: IUtilService;

  @inject(serviceTypes.IWebBrowserService)
  private readonly _webBrowserService: IWebBrowserService;

  @inject(serviceTypes.IDomainService)
  private _domainService: IDomainService;

  @inject(serviceTypes.ILinkService)
  private _linkService: ILinkService;

  @inject(serviceTypes.ILogService)
  private _logService: ILogService;

  private _1hourInSeconds = 3600;

  async execute(request: CommandControllerParams) {
    const { queryValue: url } = request;
    const domain = await this._getDomainInfo(url);
    const page = await this._httpService.open(url);
    const self = this;
    return new Promise(() => {
      let lastPageLinkCount = 0;
      (async function loadMore() {
        // todo: need to optimise not to re-query the whole page
        const links = await self._webBrowserService.getLinks(page);
        console.log("lastPageLinkCount: ", lastPageLinkCount);
        if (links.length !== lastPageLinkCount) {
          lastPageLinkCount = links.length;
          // todo: optimize it by not removing the old link
          await self._linkService.bulkSave(domain.domainId, links);
          // todo: encapsulate as part of the service
          await self._clickLoadMoreButton(page);
          setTimeout(loadMore, 2000);
        } else {
          page.close();
          await self._logService.info(
            "done processing the page.. sleeping and try again in 1hr"
          );
          lastPageLinkCount = -1;
          // sleep 1hr
          setTimeout(
            self.execute.bind(self, request),
            self._1hourInSeconds * 1000
          );
        }
      })();
    });
  }

  private async _getDomainInfo(url: string) {
    const urlInfo = this._utilService.parseUrl(url);
    let domain = await this._domainService.save(urlInfo.host);
    if (domain.domainId === 0) {
      domain = await this._domainService.getByName(urlInfo.host);
    }
    return domain;
  }

  private async _clickLoadMoreButton(page: Page) {
    try {
      await page.click("div[class^=LoadMore__Wrapper] button");
    } catch (err) {
      this._logService.error(err);
    }
  }
}
