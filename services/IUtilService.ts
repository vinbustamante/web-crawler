import { UrlFieldType } from "types/UrlFieldType";

export interface IUtilService {
  getControllerByCommand(cmd: string): any;
  parseUrl(url: string): UrlFieldType;
  osThreadCount(): number;
}
