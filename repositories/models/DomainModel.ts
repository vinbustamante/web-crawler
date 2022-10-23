import { Table, Column, Model, DataType, Index } from "sequelize-typescript";
import { DbUpsertFieldOption } from "../../decorator/DbUpsertFieldOption";
import { DatabaseEnum } from "../../enum/DatabaseEnum";

@Table({ tableName: DatabaseEnum.Tables.Domain.name })
export class DomainModel extends Model {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    field: DatabaseEnum.Tables.Domain.Fields.DomainId,
  })
  domain_id: number;

  @Column({
    type: DataType.STRING(500),
    field: DatabaseEnum.Tables.Domain.Fields.Name,
  })
  @Index({ unique: true })
  @DbUpsertFieldOption(DatabaseEnum.Tables.Domain.Fields.Name)
  name: string;
}
