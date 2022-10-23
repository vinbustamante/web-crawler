import { inject, injectable } from "inversify";
import * as _ from "lodash";
import { ElementHandle, Page } from "puppeteer";
import { IWebBrowserService } from "../IWebBrowserService";
import { BaseService } from "./BaseService";
import { types as serviceTypes } from "../types";
import { IFlowService } from "../IFlowService";

@injectable()
export class WebBrowserService
  extends BaseService
  implements IWebBrowserService
{
  @inject(serviceTypes.IFlowService)
  private readonly _flowService: IFlowService;

  getDto() {
    return;
  }

  getElements(page: Page, criteria: string): Promise<ElementHandle[]> {
    return page.$$(criteria);
  }

  async getLinks(page: Page): Promise<string[]> {
    const htmlNodes = await this.getElements(page, "a[href]");
    // const urls = await this._flowService.each(htmlNodes, async (htmlNode) => {
    //   const property = await htmlNode.getProperty("href");
    //   return property.jsonValue();
    // });
    const urls = await this._getNodeLinks(htmlNodes);

    // get the last item from the list of links
    // const loadMoreButton = await this._getLoadMoreButton(page);
    // const lastNode = await this._getLastLoadedElement(page);
    // const lastUrl = (await this._getUrlFromDataContainer([lastNode]))[0];
    // console.log("last url: ", await this._getUrlFromDataContainer([lastNode]));

    // simular load more data
    // await this._loadMoreData(page);

    // console.log("******************************");
    // console.log("lastNode: ", await this._getUrlFromDataContainer([lastNode]));
    // // console.log("lastNode: ", lastNode);
    // console.log("******************************");
    // await new Promise(async (resolve) => {
    //   setTimeout(async () => {
    //     const nextItem = await this._getNextSibling(page, lastNode);
    //     console.log("******************************");
    //     console.log("lastNode: ", lastNode);
    //     console.log("nextItem: ", nextItem);
    //     console.log("******************************");
    //     resolve(null);
    //   }, 3000);
    // });

    // const nextItem = await this._getNextSibling(newLastNode);
    // console.log("************ nextItem ******************");
    // console.log("newLastNode: ", newLastNode);
    // // console.log(await this._getUrlFromDataContainer([nextItem]));
    // console.log("******************************");

    // console.log("last url: ", await this._getUrlFromDataContainer([nextItem]));

    // const last2 = await this._getLastLoadedElement(page);

    // console.log("******************************");
    // console.log(last1);
    // console.log(last2);
    // console.log("is it the same: ", last1 === last2);
    // console.log("******************************");
    return urls;
  }

  // @ts-ignore
  private async _getLoadMoreButton(page: Page) {
    const elements = await this.getElements(
      page,
      "div[class^=LoadMore__Wrapper] button"
    );
    return elements[0];
  }

  private async _getLoadedElements(page: Page): Promise<ElementHandle[]> {
    const elements = await this.getElements(
      page,
      //   "div[class^=GridAds__Grid] > div > div > div > a"
      "div[class^=GridAds__Grid] > div"
    );
    return elements;
  }

  // @ts-ignore
  private async _getLastLoadedElement(page: Page): Promise<ElementHandle> {
    const elements = await this._getLoadedElements(page);
    return _.last(elements);
  }

  // @ts-ignore
  private async _loadMoreData(page: Page): Promise<void> {
    // const loadMoreButton = await this._getLoadMoreButton(page);
    await page.click("div[class^=LoadMore__Wrapper] button");
  }

  private async _getNodeLinks(htmlNodes: ElementHandle[]): Promise<string[]> {
    const urls = await this._flowService.each(htmlNodes, async (htmlNode) => {
      const property = await htmlNode.getProperty("href");
      return property.jsonValue();
    });
    return urls;
  }

  // @ts-ignore
  private async _getUrlFromDataContainer(nodes: ElementHandle[]) {
    const linkNodes = await this._flowService.each(nodes, async (node) => {
      const elements = await node.$$("a[class^=AdThumbnail]");
      return elements[0];
    });
    const urls = await this._getNodeLinks(linkNodes);
    return urls;
  }

  // @ts-ignore
  private async _getNextSibling(node: ElementHandle) {
    return node.evaluateHandle((el) => el.nextElementSibling);
  }

  // @ts-ignore
  private async _calculateLastNodeBaseOnUrl(page: Page, url: string) {
    let node: any = (await this.getElements(page, `a[href='${url}']`))[0];
    node = await node.getProperty("parentNode");
    node = await node.getProperty("parentNode");
    node = await node.getProperty("parentNode");
    return node;
  }
}
