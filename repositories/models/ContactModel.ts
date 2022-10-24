import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from "sequelize-typescript";
import { DbUpsertFieldOption } from "../../decorator/DbUpsertFieldOption";
import { DatabaseEnum } from "../../enum/DatabaseEnum";
import { LinkModel } from "./LinkModel";

@Table({
  tableName: DatabaseEnum.Tables.Contact.name,
  indexes: [
    {
      unique: true,
      fields: [
        DatabaseEnum.Tables.Contact.Fields.LinkId,
        DatabaseEnum.Tables.Contact.Fields.ContactNumber,
      ],
    },
  ],
})
export class ContactModel extends Model {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    field: DatabaseEnum.Tables.Contact.Fields.ContactId,
  })
  contactId: number;

  @Column({
    type: DataType.INTEGER,
    field: DatabaseEnum.Tables.Contact.Fields.LinkId,
    allowNull: false,
  })
  @ForeignKey(() => LinkModel)
  @DbUpsertFieldOption(DatabaseEnum.Tables.Contact.Fields.LinkId)
  linkId: number;

  @BelongsTo(() => LinkModel)
  link: LinkModel;

  @Column({
    type: DataType.STRING(3000),
    field: DatabaseEnum.Tables.Contact.Fields.ContactNumber,
    allowNull: false,
  })
  @DbUpsertFieldOption(DatabaseEnum.Tables.Contact.Fields.ContactNumber)
  contactNumber: string;
}
