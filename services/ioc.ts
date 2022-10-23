import { Container } from "inversify";
import { IDomainService } from "./IDomainService";
import { IFlowService } from "./IFlowService";
import { IHttpService } from "./IHttpService";
import { ILinkService } from "./ILinkService";
import { DomainService } from "./implementation/DomainService";
import { FlowService } from "./implementation/FlowService";
import { HttpService } from "./implementation/HttpService";
import { LinkService } from "./implementation/LinkService";
import { ReflectionService } from "./implementation/ReflectionService";
import { UtilService } from "./implementation/UtilService";
import { WebBrowserService } from "./implementation/WebBrowserService";
import { IReflectionService } from "./IReflectionService";
import { IUtilService } from "./IUtilService";
import { IWebBrowserService } from "./IWebBrowserService";

import { types as serviceTypes } from "./types";

export async function configureServices(
  container: Container
): Promise<Container> {
  container.bind<Container>(serviceTypes.Container).toConstantValue(container);
  container
    .bind<IFlowService>(serviceTypes.IFlowService)
    .to(FlowService)
    .inSingletonScope();
  container
    .bind<IHttpService>(serviceTypes.IHttpService)
    .to(HttpService)
    .inSingletonScope();
  container
    .bind<IUtilService>(serviceTypes.IUtilService)
    .to(UtilService)
    .inSingletonScope();
  container
    .bind<IReflectionService>(serviceTypes.IReflectionService)
    .to(ReflectionService)
    .inSingletonScope();
  container
    .bind<IWebBrowserService>(serviceTypes.IWebBrowserService)
    .to(WebBrowserService)
    .inSingletonScope();
  container
    .bind<IDomainService>(serviceTypes.IDomainService)
    .to(DomainService)
    .inSingletonScope();
  container
    .bind<ILinkService>(serviceTypes.ILinkService)
    .to(LinkService)
    .inSingletonScope();

  return container;
}
