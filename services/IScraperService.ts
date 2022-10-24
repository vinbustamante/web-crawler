import { ContactDto } from "./dto/ContactDto";

export interface IScraperService {
  getContactInfo(url: string): Promise<ContactDto>;
}
