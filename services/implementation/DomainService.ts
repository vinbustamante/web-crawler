import { inject, injectable } from "inversify";
import { IDomainRepository } from "../../repositories/IDomainRepository";
import { DomainDto } from "../dto/DomaimDto";
import { IDomainService } from "../IDomainService";
import { BaseService } from "./BaseService";
import { types as repoTypes } from "../../repositories/types";

@injectable()
export class DomainService extends BaseService implements IDomainService {
  @inject(repoTypes.IDomainRepository)
  private readonly _domainRepository: IDomainRepository;

  getDto() {
    return DomainDto;
  }

  async getByName(name: string): Promise<DomainDto> {
    const domainModel = await this._domainRepository.getDomain(name);
    return super.toDto(domainModel);
  }

  async save(name: string): Promise<DomainDto> {
    const domainModel = await this._domainRepository.upsert({
      modelValue: {
        name,
      },
    });
    return this.toDto(domainModel);
  }
}
