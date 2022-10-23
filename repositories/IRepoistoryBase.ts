import { Model } from "sequelize-typescript";
import { UpsertParamModel } from "./models/UpsertParamModel";

export interface IRepositoryBase<TModel extends Model> {
  upsert(params: UpsertParamModel): Promise<TModel>;
}
