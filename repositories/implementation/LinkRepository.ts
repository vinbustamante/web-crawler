import { injectable } from "inversify";
import { ILinkRepository } from "../ILinkRepository";
import { LinkModel } from "../models/LinkModel";
import { RepositoryBase } from "../RepositoryBase";

@injectable()
export class LinkRepository extends RepositoryBase implements ILinkRepository {
  getModel(): any {
    return LinkModel;
  }
}
