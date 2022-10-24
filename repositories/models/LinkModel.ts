import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import { DbUpsertFieldOption } from "../../decorator/DbUpsertFieldOption";
import { DatabaseEnum } from "../../enum/DatabaseEnum";
import { DomainModel } from "./DomainModel";

@Table({
  tableName: DatabaseEnum.Tables.Link.name,
  indexes: [
    {
      unique: true,
      fields: [
        DatabaseEnum.Tables.Link.Fields.DomainId,
        DatabaseEnum.Tables.Link.Fields.Url,
      ],
    },
  ],
})
export class LinkModel extends Model {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    field: DatabaseEnum.Tables.Link.Fields.LinkId,
  })
  link_id: number;

  @Column({
    type: DataType.INTEGER,
    field: DatabaseEnum.Tables.Link.Fields.DomainId,
    allowNull: false,
  })
  @ForeignKey(() => DomainModel)
  @DbUpsertFieldOption(DatabaseEnum.Tables.Link.Fields.DomainId)
  domainId: number;

  @Column({
    type: DataType.STRING(3000),
    field: DatabaseEnum.Tables.Link.Fields.Url,
    allowNull: false,
  })
  @DbUpsertFieldOption(DatabaseEnum.Tables.Link.Fields.Url)
  url: string;

  @Column({
    type: DataType.BOOLEAN,
    field: DatabaseEnum.Tables.Link.Fields.IsProcessed,
    allowNull: false,
  })
  isProcessed: boolean;

  @Column({
    type: DataType.BOOLEAN,
    field: DatabaseEnum.Tables.Link.Fields.IsLocked,
    allowNull: false,
  })
  isLocked: boolean;

  @Column({
    type: DataType.DATE,
    field: DatabaseEnum.Tables.Link.Fields.LockedDate,
  })
  lockedDate: Date;

  @BelongsTo(() => DomainModel)
  domain: DomainModel;

  @Column({
    type: DataType.STRING(3000),
    field: DatabaseEnum.Tables.Link.Fields.LockId,
    allowNull: true,
  })
  lockId: string;
}
