import { Container } from "inversify";
import * as path from "path";
import { Sequelize } from "sequelize-typescript";
import { IContactRepository } from "./IContactRepository";
import { IDomainRepository } from "./IDomainRepository";
import { ILinkRepository } from "./ILinkRepository";
import { ContactRepository } from "./implementation/ContactRepository";
import { DomainRepository } from "./implementation/DomainRepository";
import { LinkRepository } from "./implementation/LinkRepository";
import { ContactModel } from "./models/ContactModel";
import { DomainModel } from "./models/DomainModel";
import { LinkModel } from "./models/LinkModel";

import { types as repoTypes } from "./types";

export async function configureRepositories(
  container: Container
): Promise<Container> {
  // todo: make the db connection dynamic by accepting a params from terminal or get it from config
  const dbFile = path.join(process.cwd(), "./data/test.db");
  const database = new Sequelize({
    dialect: "sqlite",
    storage: dbFile,
    logging: false,
  });
  database.addModels([DomainModel, LinkModel, ContactModel]);
  // await database.sync({
  //   alter: true,
  // });
  container.bind<any>(repoTypes.Database).toConstantValue(database);

  container
    .bind<IDomainRepository>(repoTypes.IDomainRepository)
    .to(DomainRepository)
    .inSingletonScope();

  container
    .bind<ILinkRepository>(repoTypes.ILinkRepository)
    .to(LinkRepository)
    .inSingletonScope();

  container
    .bind<IContactRepository>(repoTypes.IContactRepository)
    .to(ContactRepository)
    .inSingletonScope();
  return container;
}
