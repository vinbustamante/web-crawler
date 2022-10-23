import { Container } from "inversify";
import * as path from "path";
import { Sequelize } from "sequelize-typescript";
import { IDomainRepository } from "./IDomainRepository";
import { ILinkRepository } from "./ILinkRepository";
import { DomainRepository } from "./implementation/DomainRepository";
import { LinkRepository } from "./implementation/LinkRepository";
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
  database.addModels([DomainModel, LinkModel]);
  await database.sync({
    alter: true,
  });

  container
    .bind<IDomainRepository>(repoTypes.IDomainRepository)
    .to(DomainRepository)
    .inSingletonScope();
  container
    .bind<ILinkRepository>(repoTypes.ILinkRepository)
    .to(LinkRepository)
    .inSingletonScope();
  return container;
}
