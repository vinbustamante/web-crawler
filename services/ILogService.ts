import { LogErrorTypeEnum } from "../enum/LogErrorTypeEnum";

export interface ILogService {
  info(payload: any): Promise<void>;
  error(payload: any): Promise<void>;
  warning(payload: any): Promise<void>;
  log(payload: any, error: LogErrorTypeEnum);
}
