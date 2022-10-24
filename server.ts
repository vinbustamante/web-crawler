import * as yargs from "yargs";

import { configureCommandControllers } from "./controller/ioc";
import { Container } from "inversify";
import { configureServices } from "./services/ioc";
import { IUtilService } from "./services/IUtilService";
import { types as serviceTypes } from "./services/types";
import { configureRepositories } from "./repositories/ioc";
import { IProcessService } from "./services/IProcessService";
import { CrawlController } from "./controller/CrawlController";

const argv: any = yargs
  .usage("Usage: $0 <command> [options]")
  .command("reset-db", "reset database")
  .command("crawl", "start web crawling")
  .command("add-worker", "add worker process for crawling")
  .demandCommand(1, "action command needed")
  .options({
    w: {
      alias: "website",
      default: "https://www.chotot.com",
      describe: "starting website to crawl",
    },
  })
  .help("h")
  .alias("h", "help")
  .epilog("copyright 2022").argv;

const [command, queryValue = "https://www.chotot.com"] = argv._;
const queryField = argv.field;

(async () => {
  // configure the IoC container
  const container = new Container();
  await configureRepositories(container);
  await configureServices(container);
  await configureCommandControllers(container);

  const utilService = container.get<IUtilService>(serviceTypes.IUtilService);
  // @ts-ignore
  const processService = container.get<IProcessService>(
    serviceTypes.IProcessService
  );
  const commandController = utilService.getControllerByCommand(command);
  if (commandController) {
    // todo: port to out process for scalability
    if (commandController instanceof CrawlController) {
      // add default slave child for processing the links
      processService.collect();
    }

    commandController
      .execute({
        cmd: command,
        queryField: queryField,
        queryValue: queryValue,
      })
      .then(() => {
        process.exit(0);
      })
      .catch((err) => {
        console.log(err);
        process.exit(1);
      });
  } else {
    console.error("unknown command");
    process.exit(1);
  }
})();
