import { inject, injectable } from "inversify";
import { v4 as uuidv4 } from "uuid";
import { IQueueService } from "../IQueueService";
import { BaseService } from "./BaseService";
import { types as serviceTypes } from "../types";
import { ILinkService } from "../ILinkService";
import { QueueDto } from "../dto/QueueDto";

@injectable()
export class QueueService extends BaseService implements IQueueService {
  @inject(serviceTypes.ILinkService)
  private readonly _linkService: ILinkService;

  getDto() {
    return null;
  }

  async getItem(): Promise<QueueDto> {
    const queueItem = new QueueDto();
    const lockId = uuidv4();
    await this._linkService.lockFirstNonProcessedRecord(lockId);
    const linkDto = await this._linkService.getByLockId(lockId);
    if (linkDto) {
      queueItem.linkId = linkDto.linkId;
      queueItem.url = linkDto.url;
    }
    return queueItem;
  }
}
