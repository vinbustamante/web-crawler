import { inject, injectable } from "inversify";
import { Model } from "sequelize-typescript";
import * as _ from "lodash";
import { UpsertParamModel } from "./models/UpsertParamModel";
import { RepositoryException } from "./exception/RepositoryException";
import { ErrorEnum } from "../enum/ErrorEnum";
import { IReflectionService } from "../services/IReflectionService";
import { types as serviceTypes } from "../services/types";
import { AnnotationEnum } from "../decorator/AnnotationEnum";
// import { LinkModel } from "./models/LinkModel";

@injectable()
export abstract class RepositoryBase {
  @inject(serviceTypes.IReflectionService)
  protected _reflectionService: IReflectionService;

  abstract getModel(): any;

  async upsert(params: UpsertParamModel) {
    const { modelValue, modelClass } = params;
    const klass = this._getModelClass(modelClass);

    const upsertOption = this._getUpsertOptions(klass);
    // if (klass === LinkModel) {
    //   console.log("*********** upsertOption *******************");
    //   console.log("upsertOption: ", upsertOption);
    //   console.log("modelValue: ", modelValue);
    //   console.log("upsert function: ", klass.upsert);
    //   console.log("******************************");
    // }
    const [instance] = await klass.upsert(modelValue, upsertOption);
    return this.toPlainObject(instance);
  }

  toPlainObject(source: any) {
    if (source) {
      if (Array.isArray(source)) {
        return source.map((data: any) => data.toJSON());
      } else {
        return source.toJSON();
      }
    } else {
      return null;
    }
  }

  private _getModelClass(modelClass: any, required = true) {
    const klass = modelClass || this.getModel();

    if (!klass && required) {
      throw new RepositoryException(ErrorEnum.InvalidModelForOperation);
    }

    return klass;
  }

  protected async getByFieldValue<
    TValue extends unknown,
    TResult extends unknown
  >(fieldName: string, value: TValue): Promise<TResult> {
    const ModelClass = this.getModel();
    const data = await ModelClass.findOne({
      where: {
        [fieldName]: value,
      },
    });
    return this._createModelData(data);
  }

  protected _createModelData<TModelClass extends Model>(
    model: TModelClass | null | undefined
  ): TModelClass {
    if (model) {
      return model.toJSON<TModelClass>();
    } else {
      return null;
    }
  }

  protected _getUpsertOptions(klass: any) {
    let options: any;
    const fields: string[] = this._reflectionService.getMetaData(
      klass,
      AnnotationEnum.DbUpsertFieldOption as any
    );
    const dbFields: string[] = [];
    if (fields && fields.length && typeof klass.getAttributes === "function") {
      const attributes = klass.getAttributes();
      fields.forEach((fieldName: string) => {
        if (attributes[fieldName] && attributes[fieldName].field) {
          dbFields.push(attributes[fieldName].field);
        } else {
          dbFields.push(fieldName);
        }
      });
    }

    if (dbFields && dbFields.length > 0) {
      options = {
        conflictFields: dbFields,
      };
    }
    options = options || {};
    return options;
  }
}
