export interface IProcessService {
  getNodeId(): Promise<string>;
  collect(): Promise<void>;
}
