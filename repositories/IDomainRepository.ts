import { IRepositoryBase } from "./IRepoistoryBase";
import { DomainModel } from "./models/DomainModel";

export interface IDomainRepository extends IRepositoryBase<DomainModel> {
  getDomain(domain: string): Promise<DomainModel>;
  getFirstRecord(): Promise<DomainModel>;
}
