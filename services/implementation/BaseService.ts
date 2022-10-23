import { inject, injectable } from "inversify";
import { IReflectionService } from "../IReflectionService";
import { types as serviceTypes } from "../types";

@injectable()
export abstract class BaseService {
  @inject(serviceTypes.IReflectionService)
  protected _reflectionService: IReflectionService;

  abstract getDto(): any;

  toDto(source: any): any {
    const ModelClass = this.getDto();
    if (Array.isArray(source)) {
      return source.map((item: any) => {
        return this._reflectionService.createObjectFrom(
          ModelClass || this.getDto(),
          item
        );
      });
    } else {
      return this._reflectionService.createObjectFrom(
        ModelClass || this.getDto(),
        source
      );
    }
  }
}
