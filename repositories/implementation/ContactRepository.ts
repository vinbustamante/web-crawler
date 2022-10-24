import { injectable } from "inversify";
import { IContactRepository } from "../IContactRepository";
import { ContactModel } from "../models/ContactModel";
import { RepositoryBase } from "../RepositoryBase";

@injectable()
export class ContactRepository
  extends RepositoryBase<ContactModel>
  implements IContactRepository
{
  getModel() {
    return ContactModel;
  }
}
