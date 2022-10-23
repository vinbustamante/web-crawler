import { plainToClass } from "class-transformer";
import { injectable } from "inversify";
import { MappingFieldInfo } from "../../decorator/metaData/MappingFieldInfo";
import { MetaDataEnum } from "../../enum/MetaDataEnum";
import { IReflectionService } from "../IReflectionService";

@injectable()
export class ReflectionService implements IReflectionService {
  objectToConstructor(instance: any): any {
    if (typeof instance === "function") {
      return instance;
    } else {
      return instance.constructor;
    }
  }

  getMetaData(target: any, key: MetaDataEnum, property?: string | symbol): any {
    if (property) {
      return Reflect.getMetadata(key, target, property);
    } else {
      return Reflect.getMetadata(key, target);
    }
  }

  createObjectFrom(klass: any, objectSource: any): any {
    const fields = this._getMapFields(klass);
    if (Array.isArray(objectSource)) {
      return objectSource.map((record: any) => {
        const model = plainToClass(klass, record);
        this._mapFields(record, model, fields);
        return model;
      });
    } else {
      if (this.objectToConstructor(klass)) {
        const model = plainToClass(klass, objectSource);
        this._mapFields(objectSource, model, fields);
        return model;
      } else {
        return objectSource;
      }
    }
  }

  private _getMapFields(modelClass: any): MappingFieldInfo[] {
    const fields = this.getMetaData(modelClass, MetaDataEnum.MapFields);
    return fields || [];
  }

  private _mapFields(source: any, model: any, fields: MappingFieldInfo[]) {
    if (model && fields.length > 0) {
      fields.forEach((field: any) => {
        if (model[field.src] !== undefined) {
          field.dest = field.dest || field.src;
          model[field.dest] = source[field.src];
        }
        delete model[field.src];
      });
    }
    return model;
  }
}
