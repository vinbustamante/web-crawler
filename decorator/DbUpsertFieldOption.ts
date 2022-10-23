import "reflect-metadata";

import { AnnotationEnum } from "./AnnotationEnum";

export function DbUpsertFieldOption(...fields: string[]) {
  return (target: any, property?: any) => {
    let klass: any;
    if (typeof target === "function") {
      klass = target;
    } else {
      klass = target.constructor;
    }
    const keyName = property;
    const actions =
      fields ||
      Reflect.getMetadata(AnnotationEnum.DbUpsertFieldOption, klass) ||
      [];
    if (!fields) {
      if (actions.indexOf(keyName) === -1) {
        actions.push(keyName);
      }
    }
    Reflect.defineMetadata(AnnotationEnum.DbUpsertFieldOption, actions, klass);
  };
}
