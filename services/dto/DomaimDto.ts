import { MapField } from "../../decorator/MapField";
import { DatabaseEnum } from "../../enum/DatabaseEnum";

@MapField({
  src: DatabaseEnum.Tables.Domain.Fields.DomainId,
  dest: "domainId",
})
export class DomainDto {
  domainId: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}
