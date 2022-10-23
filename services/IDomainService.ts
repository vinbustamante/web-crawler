import { DomainDto } from "./dto/DomaimDto";

export interface IDomainService {
  getByName(name: string): Promise<DomainDto>;
  save(name: string): Promise<DomainDto>;
}
