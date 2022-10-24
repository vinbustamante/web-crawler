import { injectable } from "inversify";
import { DatabaseEnum } from "../../enum/DatabaseEnum";
// import { DatabaseEnum } from "../../enum/DatabaseEnum";
import { ILinkRepository } from "../ILinkRepository";
import { LinkModel } from "../models/LinkModel";
import { RepositoryBase } from "../RepositoryBase";

@injectable()
export class LinkRepository
  extends RepositoryBase<LinkModel>
  implements ILinkRepository
{
  getModel(): any {
    return LinkModel;
  }

  async lockFirstNonProcessedRecord(lockId: string): Promise<void> {
    // todo: use parameterize query, to avoid sql injection, low risk since the input is not coming from the user
    return super.executeQuery(
      `update 
                  link 
      set 
              lock_id='${lockId}'
      where link_id in (
                          select link_id from link where lock_id is null limit 1
                      );
      `
    );
  }

  getByLockId(lockId: string): Promise<LinkModel> {
    const criteria = {
      where: {
        [DatabaseEnum.Tables.Link.Fields.LockId]: lockId,
      },
    };
    return super.findOne(criteria);
  }
}
