import { injectable } from "inversify";

import { IDomainRepository } from "../IDomainRepository";
import { RepositoryBase } from "../RepositoryBase";
import { DomainModel } from "../models/DomainModel";
import { DatabaseEnum } from "../../enum/DatabaseEnum";

@injectable()
export class DomainRepository
  extends RepositoryBase<DomainModel>
  implements IDomainRepository
{
  getModel(): any {
    return DomainModel;
  }

  async getDomain(domain: string): Promise<DomainModel> {
    const data = await super.getByFieldValue(
      DatabaseEnum.Tables.Domain.Fields.Name,
      domain
    );
    return data as any;
  }

  async getFirstRecord(): Promise<DomainModel> {
    return super.findOne({});
  }
}
