import { MetaDataEnum } from "../enum/MetaDataEnum";

export interface IReflectionService {
  objectToConstructor(instance: any): any;
  getMetaData(target: any, key: MetaDataEnum, property?: string | symbol): any;
  createObjectFrom(klass: any, objectSource: any): any;
}
