import { MapField } from "../../decorator/MapField";
import { DatabaseEnum } from "../../enum/DatabaseEnum";

@MapField({
  src: DatabaseEnum.Tables.Link.Fields.DomainId,
  dest: "domainId",
})
@MapField({
  src: DatabaseEnum.Tables.Link.Fields.LinkId,
  dest: "linkId",
})
@MapField({
  src: DatabaseEnum.Tables.Link.Fields.IsProcessed,
  dest: "isProcessed",
})
@MapField({
  src: DatabaseEnum.Tables.Link.Fields.IsLocked,
  dest: "isLocked",
})
@MapField({
  src: DatabaseEnum.Tables.Link.Fields.LockedDate,
  dest: "lockedDate",
})
export class LinkDto {
  linkId: number;
  domainId: number;
  url: string;
  isProcessed: boolean;
  isLocked: boolean;
  lockedDate: Date;
}
