import { inject, injectable } from "inversify";
import { ContactDto } from "../dto/ContactDto";
import { IContactService } from "../IContactService";
import { BaseService } from "./BaseService";
import { types as repoTypes } from "../../repositories/types";
import { IContactRepository } from "../../repositories/IContactRepository";

@injectable()
export class ContactService extends BaseService implements IContactService {
  @inject(repoTypes.IContactRepository)
  private readonly _contactRepository: IContactRepository;

  getDto() {
    return ContactDto;
  }

  async save(contact: ContactDto): Promise<ContactDto> {
    const model = await this._contactRepository.upsert({
      modelValue: {
        linkId: contact.linkId,
        contactNumber: contact.contactNumber,
      },
    });
    return super.toDto(model);
  }
}
