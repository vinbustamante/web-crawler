import { ContactDto } from "./dto/ContactDto";

export interface IContactService {
  save(contact: ContactDto): Promise<ContactDto>;
}
