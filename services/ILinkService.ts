import { LinkDto } from "./dto/LinkDto";

export interface ILinkService {
  save(link: LinkDto): Promise<LinkDto>;
  bulkSave(domainId: number, urls: string[]): Promise<void>;
}
