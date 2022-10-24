import { inject, injectable } from "inversify";
import { mapCommand } from "../decorator/mapCommand";
import { CommandEnum } from "../enum/CommandEnum";
import { types as serviceTypes } from "../services/types";
import { IProcessService } from "../services/IProcessService";

@mapCommand(CommandEnum.addWorker)
@injectable()
export class WorkerController {
  @inject(serviceTypes.IProcessService)
  private readonly _processService: IProcessService;

  execute() {
    // note: never ending loop
    return new Promise(() => {
      this._processService.collect();
    });
  }
}
