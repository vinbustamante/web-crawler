import * as _ from "underscore";
import * as urlParse from "url-parse";
import { injectable, inject, Container } from "inversify";
import * as os from "os";
import { types as serviceTypes } from "../types";
import { types as controllerTypes } from "../../controller/types";
import { IUtilService } from "../IUtilService";
import { UrlFieldType } from "types/UrlFieldType";

@injectable()
export class UtilService implements IUtilService {
  private _parallelCount: number;

  @inject(serviceTypes.Container)
  private readonly _container: Container;

  getControllerByCommand(cmd: string): any {
    let controller;
    const controllers = this._container.get<object[]>(controllerTypes.Commands);
    if (controllers) {
      const controllerClass: any = controllers.find((c: any) => {
        const supportedCommands = c.__command__ || [];
        return _.findWhere(supportedCommands, { cmd: cmd }) !== undefined;
      });
      if (controllerClass) {
        controller = this._container.get<any>(controllerClass);
      }
    }
    return controller;
  }

  parseUrl(url: string): UrlFieldType {
    return urlParse(url, true);
  }

  osThreadCount(): number {
    if (this._parallelCount === undefined) {
      this._parallelCount = os.cpus().length;
    }
    return this._parallelCount;
  }
}
