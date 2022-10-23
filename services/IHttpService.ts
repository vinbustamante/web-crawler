import { Page } from "puppeteer";

export interface IHttpService {
  open(url: string): Promise<Page>;
}
