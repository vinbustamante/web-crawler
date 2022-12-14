import { Container } from "inversify";
import { types as controllerTypes } from "./types";
import { CrawlController } from "./CrawlController";
import { WorkerController } from "./WorkerController";

export function configureCommandControllers(container: Container): Container {
  const controllers = [CrawlController, WorkerController];
  container.bind<any[]>(controllerTypes.Commands).toConstantValue(controllers);
  controllers.forEach((controller) => {
    container.bind<any>(controller).to(controller);
  });
  return container;
}
