import { IRepositoryBase } from "./IRepoistoryBase";
import { LinkModel } from "./models/LinkModel";

export interface ILinkRepository extends IRepositoryBase<LinkModel> {
  lockFirstNonProcessedRecord(lockId: string): Promise<void>;
  getByLockId(lockId: string): Promise<LinkModel>;
}
