import { inject, injectable } from "inversify";
import { v4 as uuidv4 } from "uuid";
import { IProcessService } from "../IProcessService";
import { BaseService } from "./BaseService";
import { types as serviceTypes } from "../types";
import { IQueueService } from "../IQueueService";
import { IScraperService } from "../IScraperService";
import { IContactService } from "../IContactService";

@injectable()
export class ProcessService extends BaseService implements IProcessService {
  private _nodeId: string | undefined = undefined;

  @inject(serviceTypes.IQueueService)
  private _queueService: IQueueService;

  @inject(serviceTypes.IScraperService)
  private _scraperService: IScraperService;

  @inject(serviceTypes.IContactService)
  private _contactService: IContactService;

  getDto() {
    return null;
  }

  async getNodeId(): Promise<string> {
    if (this._nodeId === undefined) {
      this._nodeId = uuidv4();
    }
    return this._nodeId;
  }

  async collect(): Promise<void> {
    const queueItem = await this._queueService.getItem();
    if (queueItem && queueItem.linkId) {
      try {
        const contactInfo = await this._scraperService.getContactInfo(
          queueItem.url
        );
        if (contactInfo && contactInfo.contactNumber) {
          contactInfo.linkId = queueItem.linkId;
          await this._contactService.save(contactInfo);
        }
      } catch (err) {
        console.log(err);
      }
    }
    // invoke again
    setTimeout(() => {
      this.collect();
    }, 10);
  }
}
