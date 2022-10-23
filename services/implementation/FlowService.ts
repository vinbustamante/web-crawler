import { inject, injectable } from "inversify";
import * as async from "async";
import { IFlowService, ItemHandler } from "../IFlowService";
import { types as serviceTypes } from "../types";
import { IUtilService } from "../IUtilService";

@injectable()
export class FlowService implements IFlowService {
  @inject(serviceTypes.IUtilService)
  private _utilService: IUtilService;

  async each<TData>(
    items: TData[],
    handler: ItemHandler,
    parallelCount?: number
  ): Promise<any> {
    const threadCount = parallelCount || this._getDefaultParallelCount();
    return new Promise((resolve, reject) => {
      const results: any[] = [];
      async.eachOfLimit(
        items,
        threadCount!,
        (item: any, index: any, callback: any) => {
          handler(item)
            .then((response: any) => {
              results[index] = response;
              callback();
            })
            .catch((err: any) => {
              callback(err);
            });
        },
        (err: any) => {
          if (err) {
            reject(err);
          } else {
            resolve(results);
          }
        }
      );
    });
  }

  private _getDefaultParallelCount(): number {
    return this._utilService.osThreadCount();
  }
}
