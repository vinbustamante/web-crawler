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

  async execute(request: CommandControllerParams) {
    const { queryValue: url } = request;
    await this._getDomainInfo(url);
    const page = await this._httpService.open(url);
    const self = this;
    // @ts-ignore
    return new Promise((resolve, reject) => {
      let lastPageLinkCount = 0;
      (async function loadMore() {
        const links = await self._webBrowserService.getLinks(page);
        if (links.length !== lastPageLinkCount) {
          lastPageLinkCount = links.length;
          console.log("******************************");
          console.log("ready save urls");
          console.log("******************************");
        }
      })();
    });

    // return Promise.resolve(url);
    // return new Promise((resolve, reject) => {
    //   (function loadMore() {
    //     //
    //   })();
    // });
  }

  private async _getDomainInfo(url: string) {
    const urlInfo = this._utilService.parseUrl(url);
    const domain = await this._domainService.save(urlInfo.host);
    return domain;
  }
}
