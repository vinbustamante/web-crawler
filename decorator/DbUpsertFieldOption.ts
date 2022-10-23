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
    // const actions =
    //   fields ||
    //   Reflect.getMetadata(AnnotationEnum.DbUpsertFieldOption, klass) ||
    //   [];
    const actions =
      Reflect.getMetadata(AnnotationEnum.DbUpsertFieldOption, klass) || [];
    if (!fields) {
      if (actions.indexOf(keyName) === -1) {
        actions.push(keyName);
      }
    }
    fields.forEach((field) => {
      if (actions.indexOf(field) === -1) {
        actions.push(field);
      }
    });

    Reflect.defineMetadata(AnnotationEnum.DbUpsertFieldOption, actions, klass);
  };
}
