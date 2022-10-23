import { inject, injectable } from "inversify";
import { LinkDto } from "../dto/LinkDto";
import { ILinkService } from "../ILinkService";
import { BaseService } from "./BaseService";
import { types as repoTypes } from "../../repositories/types";
import { ILinkRepository } from "../../repositories/ILinkRepository";

@injectable()
export class LinkService extends BaseService implements ILinkService {
  @inject(repoTypes.ILinkRepository)
  private readonly _linkRepository: ILinkRepository;

  getDto() {
    return LinkDto;
  }

  async save(link: LinkDto): Promise<LinkDto> {
    const linkModel = await this._linkRepository.upsert({
      modelValue: link,
    });
    return this.toDto(linkModel);
  }
}
