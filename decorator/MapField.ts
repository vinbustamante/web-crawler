import "reflect-metadata";

import { MetaDataEnum } from "../enum/MetaDataEnum";
import { MappingFieldInfo } from "./metaData/MappingFieldInfo";

export function MapField(info: MappingFieldInfo) {
  return (target: any) => {
    // get the old values
    const fields = Reflect.getMetadata(MetaDataEnum.MapFields, target) || [];
    const oldRecord = fields.find(
      (field: MappingFieldInfo) =>
        field.src === info.src && field.dest === info.dest
    );
    if (!oldRecord) {
      fields.push(info);
      Reflect.defineMetadata(MetaDataEnum.MapFields, fields, target);
    }
  };
}
