import { LinkDto } from "./dto/LinkDto";

export interface ILinkService {
  save(link: LinkDto): Promise<LinkDto>;
}
