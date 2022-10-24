import { injectable } from "inversify";
import { LogErrorTypeEnum } from "../../enum/LogErrorTypeEnum";
import { ILogService } from "../ILogService";

@injectable()
export class LogService implements ILogService {
  async info(payload: any): Promise<void> {
    console.info(payload);
  }

  async error(payload: any): Promise<void> {
    console.error(payload);
  }

  async warning(payload: any): Promise<void> {
    console.warn(payload);
  }

  async log(payload: any, error: LogErrorTypeEnum = LogErrorTypeEnum.Info) {
    if (error === LogErrorTypeEnum.Info) {
      await this.info(payload);
    } else if (error === LogErrorTypeEnum.Warning) {
      await this.warning(payload);
    } else if (error === LogErrorTypeEnum.Error) {
      await this.error(payload);
    }
  }
}
