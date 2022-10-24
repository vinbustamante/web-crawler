import { inject, injectable } from "inversify";
import { LinkDto } from "../dto/LinkDto";
import { ILinkService } from "../ILinkService";
import { BaseService } from "./BaseService";
import { types as repoTypes } from "../../repositories/types";
import { types as serviceTypes } from "../types";
import { ILinkRepository } from "../../repositories/ILinkRepository";
import { IFlowService } from "../IFlowService";

@injectable()
export class LinkService extends BaseService implements ILinkService {
  @inject(repoTypes.ILinkRepository)
  private readonly _linkRepository: ILinkRepository;

  @inject(serviceTypes.IFlowService)
  private readonly _flowService: IFlowService;

  getDto() {
    return LinkDto;
  }

  async save(link: LinkDto): Promise<LinkDto> {
    const linkModel = await this._linkRepository.upsert({
      modelValue: link,
    });
    return this.toDto(linkModel);
  }

  async bulkSave(domainId: number, urls: string[]): Promise<void> {
    await this._flowService.each(urls, async (url: string) => {
      const linkDto = new LinkDto();
      linkDto.domainId = domainId;
      linkDto.url = url;
      linkDto.isLocked = false;
      linkDto.isProcessed = false;
      return this.save(linkDto);
    });
  }

  async getByLockId(lockId: string): Promise<LinkDto> {
    const linkModel = await this._linkRepository.getByLockId(lockId);
    return super.toDto(linkModel);
  }

  lockFirstNonProcessedRecord(lockId: string): Promise<void> {
    return this._linkRepository.lockFirstNonProcessedRecord(lockId);
  }
}
