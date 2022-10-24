import { QueueDto } from "./dto/QueueDto";

export interface IQueueService {
  getItem(): Promise<QueueDto>;
}
